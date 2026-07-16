import type {
  DashboardClassProgressDto,
  DashboardRecentWorkDto,
  TeacherDashboardDto,
  TeacherDashboardView,
} from "@/lib/features/dashboard/types";

export function toTeacherDashboardView(dto: TeacherDashboardDto): TeacherDashboardView {
  return {
    teacherName: dto.user.displayName,
    workspaceName: dto.workspace.name,
    sessionLabel: `${dto.workspace.academicYearName} / ${dto.workspace.termName}`,
    todayLabel: formatDate(dto.today),
    metrics: dto.metrics,
    actions: dto.actions,
    nextEvent: dto.nextEvent,
    schedule: dto.schedule,
    urgentTasks: dto.urgentTasks,
    classProgress: dto.classProgress.map(toClassProgressView),
    recentWork: dto.recentWork.map(toRecentWorkView),
    insight: dto.insight,
    canUseAi: dto.permissions.canUseAi,
  };
}

function toClassProgressView(dto: DashboardClassProgressDto) {
  return {
    ...dto,
    learnerLabel: `${dto.learnerCount} learners`,
    attentionLabel:
      dto.attentionCount === 0 ? "No support flags" : `${dto.attentionCount} support flags`,
  };
}

function toRecentWorkView(dto: DashboardRecentWorkDto) {
  return {
    ...dto,
    updatedLabel: `Updated ${formatDateTime(dto.updatedAt)}`,
  };
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    weekday: "long",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00.000Z`));
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
