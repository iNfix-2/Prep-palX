import type { WorkspaceSummaryDto } from "@/lib/features/classes/types";
import type {
  CreateLessonPlanDto,
  LessonPlanCreateOptionsDto,
  LessonPlanDetailDto,
  LessonPlanListItemDto,
  TeacherLessonPlansResponseDto,
} from "@/lib/features/lesson-plans/types";
import { hasAnyPermission, hasPermission } from "@/lib/security/permissions";
import type { RequestAuthContext } from "@/lib/server/auth-context";
import {
  createDemoLessonPlan,
  demoClasses,
  demoLessonPlans,
  type DemoClass,
  type DemoLessonPlan,
} from "@/lib/server/demo-store";

export type LessonPlanServiceErrorStatus = 400 | 401 | 403 | 404;

export type LessonPlanServiceResult<T> =
  | { ok: true; data: T }
  | {
      ok: false;
      status: LessonPlanServiceErrorStatus;
      code: "AUTH_REQUIRED" | "FORBIDDEN" | "NOT_FOUND" | "VALIDATION_ERROR";
      message: string;
      fields?: Record<string, string[]>;
    };

type AuthenticatedContext = Extract<RequestAuthContext, { status: "authenticated" }>;

export function listTeacherLessonPlans(
  context: RequestAuthContext,
): LessonPlanServiceResult<TeacherLessonPlansResponseDto> {
  const access = getLessonWorkspaceAccess(context, "view");

  if (!access.ok) {
    return access;
  }

  const { context: authenticatedContext, accessibleClasses } = access.data;
  const accessibleClassIds = new Set(accessibleClasses.map((classRecord) => classRecord.id));
  const lessonPlans = demoLessonPlans
    .filter((plan) => plan.workspaceId === authenticatedContext.activeWorkspace.id)
    .filter((plan) => accessibleClassIds.has(plan.classId))
    .sort((a, b) => a.scheduledFor.localeCompare(b.scheduledFor));

  return {
    ok: true,
    data: {
      workspace: toWorkspaceSummary(authenticatedContext),
      permissions: {
        canCreateLessonPlan: hasPermission(authenticatedContext.activeMembership, "lesson.create"),
        canUseAi: hasPermission(authenticatedContext.activeMembership, "ai.use"),
      },
      lessonPlans: lessonPlans.map(toLessonPlanListItemDto),
    },
  };
}

export function getLessonPlanCreateOptions(
  context: RequestAuthContext,
): LessonPlanServiceResult<LessonPlanCreateOptionsDto> {
  const access = getLessonWorkspaceAccess(context, "create");

  if (!access.ok) {
    return access;
  }

  return {
    ok: true,
    data: {
      workspace: toWorkspaceSummary(access.data.context),
      classes: access.data.accessibleClasses.map((classRecord) => ({
        id: classRecord.id,
        displayName: classRecord.displayName,
        subjectName: classRecord.subjectName,
        gradeName: classRecord.gradeName,
        room: classRecord.room,
      })),
    },
  };
}

export function getLessonPlan(
  context: RequestAuthContext,
  lessonPlanId: string,
): LessonPlanServiceResult<LessonPlanDetailDto> {
  if (context.status === "unauthenticated") {
    return authRequired();
  }

  if (!hasAnyPermission(context.activeMembership, ["lesson.view", "lesson.create"])) {
    return forbidden("You do not have permission to view lesson plans.");
  }

  const lessonPlan = demoLessonPlans.find((plan) => plan.id === lessonPlanId);

  if (!lessonPlan || lessonPlan.workspaceId !== context.activeWorkspace.id) {
    return notFound();
  }

  const classAccess = getAccessibleClass(context, lessonPlan.classId);

  if (!classAccess.ok) {
    return classAccess.status === 404 ? notFound() : classAccess;
  }

  return {
    ok: true,
    data: {
      ...toLessonPlanListItemDto(lessonPlan),
      workspace: toWorkspaceSummary(context),
      objectives: lessonPlan.objectives,
      materials: lessonPlan.materials,
      starterActivity: lessonPlan.starterActivity,
      teachingActivity: lessonPlan.teachingActivity,
      learnerPractice: lessonPlan.learnerPractice,
      assessmentCheck: lessonPlan.assessmentCheck,
      differentiation: lessonPlan.differentiation,
    },
  };
}

export function createLessonPlan(
  context: RequestAuthContext,
  input: CreateLessonPlanDto,
): LessonPlanServiceResult<LessonPlanDetailDto> {
  if (context.status === "unauthenticated") {
    return authRequired();
  }

  if (!hasPermission(context.activeMembership, "lesson.create")) {
    return forbidden("You do not have permission to create lesson plans.");
  }

  const validation = validateCreateLessonPlan(input);

  if (!validation.ok) {
    return validation;
  }

  const classAccess = getAccessibleClass(context, input.classId);

  if (!classAccess.ok) {
    return classAccess;
  }

  const lessonPlan = createDemoLessonPlan({
    workspaceId: context.activeWorkspace.id,
    classId: classAccess.data.classRecord.id,
    title: input.title.trim(),
    topic: input.topic.trim(),
    scheduledFor: input.scheduledFor,
    durationMinutes: input.durationMinutes,
    objectives: input.objectives,
    materials: input.materials,
    starterActivity: input.starterActivity.trim(),
    teachingActivity: input.teachingActivity.trim(),
    learnerPractice: input.learnerPractice.trim(),
    assessmentCheck: input.assessmentCheck.trim(),
    differentiation: input.differentiation.trim(),
    createdByMembershipId: context.activeMembership.id,
  });

  return getLessonPlan(context, lessonPlan.id);
}

function getLessonWorkspaceAccess(
  context: RequestAuthContext,
  mode: "view" | "create",
): LessonPlanServiceResult<{
  context: AuthenticatedContext;
  accessibleClasses: DemoClass[];
}> {
  if (context.status === "unauthenticated") {
    return authRequired();
  }

  if (mode === "create" && !hasPermission(context.activeMembership, "lesson.create")) {
    return forbidden("You do not have permission to create lesson plans.");
  }

  if (
    mode === "view" &&
    !hasAnyPermission(context.activeMembership, ["lesson.view", "lesson.create"])
  ) {
    return forbidden("You do not have permission to view lesson plans.");
  }

  const accessibleClasses = getAccessibleClasses(context);

  return { ok: true, data: { context, accessibleClasses } };
}

function getAccessibleClass(
  context: AuthenticatedContext,
  classId: string,
): LessonPlanServiceResult<{ classRecord: DemoClass }> {
  const classRecord = demoClasses.find((candidate) => candidate.id === classId);

  if (!classRecord || classRecord.workspaceId !== context.activeWorkspace.id) {
    return notFound();
  }

  const canManageClasses = hasPermission(context.activeMembership, "class.manage");

  if (
    !canManageClasses &&
    !classRecord.assignedMembershipIds.includes(context.activeMembership.id)
  ) {
    return forbidden("This class is outside your assigned teaching scope.");
  }

  return { ok: true, data: { classRecord } };
}

function getAccessibleClasses(context: AuthenticatedContext) {
  const canManageClasses = hasPermission(context.activeMembership, "class.manage");

  return demoClasses
    .filter((classRecord) => classRecord.workspaceId === context.activeWorkspace.id)
    .filter(
      (classRecord) =>
        canManageClasses || classRecord.assignedMembershipIds.includes(context.activeMembership.id),
    )
    .sort((a, b) => a.displayName.localeCompare(b.displayName));
}

function toLessonPlanListItemDto(lessonPlan: DemoLessonPlan) {
  const classRecord = demoClasses.find((candidate) => candidate.id === lessonPlan.classId);

  return {
    id: lessonPlan.id,
    classId: lessonPlan.classId,
    classDisplayName: classRecord?.displayName ?? "Unknown class",
    subjectName: classRecord?.subjectName ?? "Unknown subject",
    gradeName: classRecord?.gradeName ?? "Unknown grade",
    title: lessonPlan.title,
    topic: lessonPlan.topic,
    status: lessonPlan.status,
    scheduledFor: lessonPlan.scheduledFor,
    durationMinutes: lessonPlan.durationMinutes,
    readinessPercent: lessonPlan.readinessPercent,
    updatedAt: lessonPlan.updatedAt,
  } satisfies LessonPlanListItemDto;
}

function validateCreateLessonPlan(
  input: CreateLessonPlanDto,
): LessonPlanServiceResult<{ valid: true }> {
  const fields: Record<string, string[]> = {};

  if (!input.classId) {
    fields.classId = ["Class is required."];
  }

  if (!input.title?.trim()) {
    fields.title = ["Title is required."];
  }

  if (!input.topic?.trim()) {
    fields.topic = ["Topic is required."];
  }

  if (!input.scheduledFor) {
    fields.scheduledFor = ["Teaching date is required."];
  }

  if (!Number.isFinite(input.durationMinutes) || input.durationMinutes < 10) {
    fields.durationMinutes = ["Duration must be at least 10 minutes."];
  }

  if (input.objectives.length === 0) {
    fields.objectives = ["At least one objective is required."];
  }

  if (!input.teachingActivity?.trim()) {
    fields.teachingActivity = ["Teaching activity is required."];
  }

  if (!input.learnerPractice?.trim()) {
    fields.learnerPractice = ["Learner practice is required."];
  }

  if (!input.assessmentCheck?.trim()) {
    fields.assessmentCheck = ["Assessment check is required."];
  }

  if (Object.keys(fields).length > 0) {
    return {
      ok: false,
      status: 400,
      code: "VALIDATION_ERROR",
      message: "Lesson plan could not be saved.",
      fields,
    };
  }

  return { ok: true, data: { valid: true } };
}

function toWorkspaceSummary(context: AuthenticatedContext) {
  return {
    id: context.activeWorkspace.id,
    name: context.activeWorkspace.name,
    academicYearName: context.activeWorkspace.currentAcademicYearName,
    termName: context.activeWorkspace.currentTermName,
  } satisfies WorkspaceSummaryDto;
}

function authRequired(): LessonPlanServiceResult<never> {
  return {
    ok: false,
    status: 401,
    code: "AUTH_REQUIRED",
    message: "Sign in to continue.",
  };
}

function forbidden(message: string): LessonPlanServiceResult<never> {
  return {
    ok: false,
    status: 403,
    code: "FORBIDDEN",
    message,
  };
}

function notFound(): LessonPlanServiceResult<never> {
  return {
    ok: false,
    status: 404,
    code: "NOT_FOUND",
    message: "Lesson plan was not found in the active workspace.",
  };
}
