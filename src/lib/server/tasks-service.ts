import type { WorkspaceSummaryDto } from "@/lib/features/classes/types";
import type {
  TaskActivityDto,
  TaskDetailDto,
  TaskStatus,
  TeacherTaskDto,
  TeacherTasksResponseDto,
  UpdateTaskStatusRequestDto,
} from "@/lib/features/tasks/types";
import { hasAnyPermission, hasPermission } from "@/lib/security/permissions";
import type { RequestAuthContext } from "@/lib/server/auth-context";
import {
  demoClasses,
  demoMemberships,
  demoTeacherTasks,
  demoUsers,
  getTeacherTask,
  updateDemoTeacherTaskStatus,
  type DemoClass,
  type DemoTeacherTask,
} from "@/lib/server/demo-store";

export type TasksServiceErrorStatus = 400 | 401 | 403 | 404;

export type TasksServiceResult<T> =
  | { ok: true; data: T }
  | {
      ok: false;
      status: TasksServiceErrorStatus;
      code: "AUTH_REQUIRED" | "FORBIDDEN" | "NOT_FOUND" | "VALIDATION_ERROR";
      message: string;
      fields?: Record<string, string[]>;
    };

type AuthenticatedContext = Extract<RequestAuthContext, { status: "authenticated" }>;

const taskStatuses: TaskStatus[] = ["open", "in_progress", "blocked", "done"];

export function listTeacherTasks(
  context: RequestAuthContext,
): TasksServiceResult<TeacherTasksResponseDto> {
  const access = getTasksWorkspaceAccess(context);

  if (!access.ok) {
    return access;
  }

  const authenticatedContext = access.data.context;
  const tasks = demoTeacherTasks
    .filter((task) => task.workspaceId === authenticatedContext.activeWorkspace.id)
    .filter((task) => canAccessTask(authenticatedContext, task))
    .sort(compareTasks);

  return {
    ok: true,
    data: {
      workspace: toWorkspaceSummary(authenticatedContext),
      permissions: {
        canManageTasks: canManageTasks(authenticatedContext),
        canUseAi: hasPermission(authenticatedContext.activeMembership, "ai.use"),
      },
      tasks: tasks.map(toTeacherTaskDto),
    },
  };
}

export function getTaskDetail(
  context: RequestAuthContext,
  taskId: string,
): TasksServiceResult<TaskDetailDto> {
  const access = getAccessibleTask(context, taskId);

  if (!access.ok) {
    return access;
  }

  const { context: authenticatedContext, task } = access.data;

  return {
    ok: true,
    data: {
      ...toTeacherTaskDto(task),
      workspace: toWorkspaceSummary(authenticatedContext),
      permissions: {
        canManageTasks: canManageTasks(authenticatedContext),
        canUseAi: hasPermission(authenticatedContext.activeMembership, "ai.use"),
      },
      classHref: task.classId ? `/classes/${task.classId}` : undefined,
      activities: task.activities.map(toTaskActivityDto),
    },
  };
}

export function updateTaskStatus(
  context: RequestAuthContext,
  taskId: string,
  input: UpdateTaskStatusRequestDto,
): TasksServiceResult<TaskDetailDto> {
  const access = getAccessibleTask(context, taskId);

  if (!access.ok) {
    return access;
  }

  if (!canManageTasks(access.data.context)) {
    return forbidden("You do not have permission to update tasks.");
  }

  const validation = validateTaskStatusUpdate(input);

  if (!validation.ok) {
    return validation;
  }

  const updated = updateDemoTeacherTaskStatus(taskId, {
    status: validation.data.status,
    updatedByMembershipId: access.data.context.activeMembership.id,
    note: validation.data.note,
  });

  if (!updated) {
    return notFound();
  }

  return getTaskDetail(context, updated.id);
}

function getTasksWorkspaceAccess(
  context: RequestAuthContext,
): TasksServiceResult<{ context: AuthenticatedContext }> {
  if (context.status === "unauthenticated") {
    return authRequired();
  }

  if (!hasAnyPermission(context.activeMembership, ["task.view", "task.manage"])) {
    return forbidden("You do not have permission to view tasks.");
  }

  return { ok: true, data: { context } };
}

function getAccessibleTask(
  context: RequestAuthContext,
  taskId: string,
): TasksServiceResult<{ context: AuthenticatedContext; task: DemoTeacherTask }> {
  const access = getTasksWorkspaceAccess(context);

  if (!access.ok) {
    return access;
  }

  const authenticatedContext = access.data.context;
  const task = getTeacherTask(taskId);

  if (!task || task.workspaceId !== authenticatedContext.activeWorkspace.id) {
    return notFound();
  }

  if (!canAccessTask(authenticatedContext, task)) {
    return forbidden("This task is outside your teaching scope.");
  }

  return { ok: true, data: { context: authenticatedContext, task } };
}

function canAccessTask(context: AuthenticatedContext, task: DemoTeacherTask) {
  if (hasPermission(context.activeMembership, "class.manage")) {
    return true;
  }

  if (
    task.ownerMembershipId === context.activeMembership.id ||
    task.assignedMembershipId === context.activeMembership.id
  ) {
    return true;
  }

  if (!task.classId) {
    return true;
  }

  const classRecord = getClassRecord(task.classId);
  return Boolean(classRecord?.assignedMembershipIds.includes(context.activeMembership.id));
}

function canManageTasks(context: AuthenticatedContext) {
  return hasPermission(context.activeMembership, "task.manage");
}

function toTeacherTaskDto(task: DemoTeacherTask): TeacherTaskDto {
  const classRecord = task.classId ? getClassRecord(task.classId) : null;
  const owner = getMembershipLabel(task.ownerMembershipId);
  const assigned = task.assignedMembershipId ? getMembershipLabel(task.assignedMembershipId) : null;

  return {
    id: task.id,
    workspaceId: task.workspaceId,
    classId: task.classId,
    classDisplayName: classRecord?.displayName,
    subjectName: classRecord?.subjectName,
    gradeName: classRecord?.gradeName,
    ownerName: owner.name,
    assignedName: assigned?.name ?? owner.name,
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    category: task.category,
    dueAt: task.dueAt,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
    completedAt: task.completedAt,
    blockedReason: task.blockedReason,
    sourceHref: task.sourceHref,
    sourceLabel: task.sourceLabel,
    aiSuggested: Boolean(task.aiSuggested),
  };
}

function toTaskActivityDto(activity: DemoTeacherTask["activities"][number]): TaskActivityDto {
  const author = getMembershipLabel(activity.authorMembershipId);

  return {
    id: activity.id,
    authorName: author.name,
    authorRole: author.role,
    body: activity.body,
    createdAt: activity.createdAt,
  };
}

function validateTaskStatusUpdate(
  input: UpdateTaskStatusRequestDto,
): TasksServiceResult<{ status: TaskStatus; note: string }> {
  const fields: Record<string, string[]> = {};
  const status = input?.status;
  const note = String(input?.note ?? "").trim();

  if (!taskStatuses.includes(status)) {
    fields.status = ["Task status is not supported."];
  }

  if (note.length > 500) {
    fields.note = ["Task note must be 500 characters or fewer."];
  }

  if (Object.keys(fields).length > 0) {
    return {
      ok: false,
      status: 400,
      code: "VALIDATION_ERROR",
      message: "Task status could not be saved.",
      fields,
    };
  }

  return { ok: true, data: { status, note } };
}

function compareTasks(a: DemoTeacherTask, b: DemoTeacherTask) {
  const statusDifference = statusRank(a.status) - statusRank(b.status);

  if (statusDifference !== 0) {
    return statusDifference;
  }

  const priorityDifference = priorityRank(a.priority) - priorityRank(b.priority);
  return priorityDifference === 0 ? a.dueAt.localeCompare(b.dueAt) : priorityDifference;
}

function statusRank(status: DemoTeacherTask["status"]) {
  if (status === "blocked") {
    return 0;
  }

  if (status === "open") {
    return 1;
  }

  if (status === "in_progress") {
    return 2;
  }

  return 3;
}

function priorityRank(priority: DemoTeacherTask["priority"]) {
  if (priority === "urgent") {
    return 0;
  }

  if (priority === "high") {
    return 1;
  }

  if (priority === "medium") {
    return 2;
  }

  return 3;
}

function getClassRecord(classId: string): DemoClass | null {
  return demoClasses.find((candidate) => candidate.id === classId) ?? null;
}

function getMembershipLabel(membershipId: string): { name: string; role: string } {
  const membership = demoMemberships.find((candidate) => candidate.id === membershipId);
  const user = membership ? demoUsers.find((candidate) => candidate.id === membership.userId) : null;

  return {
    name: user?.displayName ?? "Unknown teacher",
    role: membership?.roleName ?? "Teacher",
  };
}

function toWorkspaceSummary(context: AuthenticatedContext) {
  return {
    id: context.activeWorkspace.id,
    name: context.activeWorkspace.name,
    academicYearName: context.activeWorkspace.currentAcademicYearName,
    termName: context.activeWorkspace.currentTermName,
  } satisfies WorkspaceSummaryDto;
}

function authRequired(): TasksServiceResult<never> {
  return {
    ok: false,
    status: 401,
    code: "AUTH_REQUIRED",
    message: "Sign in to continue.",
  };
}

function forbidden(message: string): TasksServiceResult<never> {
  return {
    ok: false,
    status: 403,
    code: "FORBIDDEN",
    message,
  };
}

function notFound(): TasksServiceResult<never> {
  return {
    ok: false,
    status: 404,
    code: "NOT_FOUND",
    message: "Task could not be found in the active workspace.",
  };
}
