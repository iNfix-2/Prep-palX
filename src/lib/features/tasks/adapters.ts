import type {
  TaskCardView,
  TaskDetailDto,
  TaskDetailView,
  TaskStatus,
  TasksPageView,
  TeacherTaskDto,
  TeacherTasksResponseDto,
} from "@/lib/features/tasks/types";

const today = "2026-07-16";

const statusView = {
  open: { label: "Open", tone: "review" },
  in_progress: { label: "In progress", tone: "draft" },
  blocked: { label: "Blocked", tone: "changes" },
  done: { label: "Done", tone: "approved" },
} as const;

const priorityView = {
  low: { label: "Low", tone: "approved" },
  medium: { label: "Medium", tone: "draft" },
  high: { label: "High", tone: "review" },
  urgent: { label: "Urgent", tone: "changes" },
} as const;

const categoryView = {
  lesson: { label: "Lesson", icon: "auto_stories" },
  assessment: { label: "Assessment", icon: "assignment" },
  grading: { label: "Grading", icon: "grading" },
  attendance: { label: "Attendance", icon: "how_to_reg" },
  report: { label: "Report", icon: "description" },
  approval: { label: "Approval", icon: "verified_user" },
  resource: { label: "Resource", icon: "folder_open" },
  guardian_follow_up: { label: "Guardian follow-up", icon: "person_check" },
  admin: { label: "Admin", icon: "settings" },
} as const;

export const taskStatusOptions: Array<{ value: TaskStatus; label: string }> = [
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In progress" },
  { value: "blocked", label: "Blocked" },
  { value: "done", label: "Done" },
];

export function toTasksPageView(dto: TeacherTasksResponseDto): TasksPageView {
  return {
    workspaceName: dto.workspace.name,
    totalTasks: dto.tasks.length,
    openCount: dto.tasks.filter((task) => task.status !== "done").length,
    dueTodayCount: dto.tasks.filter((task) => task.dueAt.startsWith(today)).length,
    blockedCount: dto.tasks.filter((task) => task.status === "blocked").length,
    completedCount: dto.tasks.filter((task) => task.status === "done").length,
    canManageTasks: dto.permissions.canManageTasks,
    canUseAi: dto.permissions.canUseAi,
    tasks: dto.tasks.map(toTaskCardView),
  };
}

export function toTaskCardView(dto: TeacherTaskDto): TaskCardView {
  const status = statusView[dto.status];
  const priority = priorityView[dto.priority];
  const category = categoryView[dto.category];

  return {
    id: dto.id,
    href: `/my-tasks/${dto.id}`,
    title: dto.title,
    description: dto.description,
    status: dto.status,
    classLabel: dto.classDisplayName ?? "Workspace task",
    ownerLabel: `Created by ${dto.ownerName}`,
    assignedLabel: `Assigned to ${dto.assignedName}`,
    categoryLabel: category.label,
    categoryIcon: category.icon,
    statusLabel: status.label,
    statusTone: status.tone,
    priorityLabel: priority.label,
    priorityTone: priority.tone,
    dueLabel: formatDueDate(dto.dueAt),
    sourceLabel: dto.sourceLabel,
    sourceHref: dto.sourceHref,
    aiSuggested: dto.aiSuggested,
  };
}

export function toTaskDetailView(dto: TaskDetailDto): TaskDetailView {
  return {
    ...toTaskCardView(dto),
    workspaceName: dto.workspace.name,
    createdLabel: `Created ${formatDateTime(dto.createdAt)}`,
    updatedLabel: `Updated ${formatDateTime(dto.updatedAt)}`,
    completedLabel: dto.completedAt ? `Completed ${formatDateTime(dto.completedAt)}` : undefined,
    blockedReason: dto.blockedReason,
    canManageTasks: dto.permissions.canManageTasks,
    canUseAi: dto.permissions.canUseAi,
    classHref: dto.classHref,
    activities: dto.activities,
  };
}

function formatDueDate(value: string) {
  const date = new Date(value);
  const day = value.slice(0, 10);
  const time = new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(date);

  if (day === today) {
    return `Due today, ${time}`;
  }

  return `Due ${new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(date)}`;
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(new Date(value));
}
