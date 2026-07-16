import type {
  LessonPlanCardView,
  LessonPlanDetailDto,
  LessonPlanDetailView,
  LessonPlanListItemDto,
  LessonPlannerPageView,
  TeacherLessonPlansResponseDto,
} from "@/lib/features/lesson-plans/types";

const statusView = {
  draft: { label: "Draft", tone: "draft" },
  in_review: { label: "In review", tone: "review" },
  approved: { label: "Approved", tone: "approved" },
} as const;

export function toLessonPlannerPageView(
  dto: TeacherLessonPlansResponseDto,
): LessonPlannerPageView {
  return {
    workspaceName: dto.workspace.name,
    totalPlans: dto.lessonPlans.length,
    draftCount: dto.lessonPlans.filter((plan) => plan.status === "draft").length,
    reviewCount: dto.lessonPlans.filter((plan) => plan.status === "in_review").length,
    approvedCount: dto.lessonPlans.filter((plan) => plan.status === "approved").length,
    averageReadiness:
      dto.lessonPlans.length > 0
        ? Math.round(
            dto.lessonPlans.reduce((sum, plan) => sum + plan.readinessPercent, 0) /
              dto.lessonPlans.length,
          )
        : 0,
    canCreateLessonPlan: dto.permissions.canCreateLessonPlan,
    canUseAi: dto.permissions.canUseAi,
    lessonPlans: dto.lessonPlans.map(toLessonPlanCardView),
  };
}

export function toLessonPlanCardView(dto: LessonPlanListItemDto): LessonPlanCardView {
  const status = statusView[dto.status];

  return {
    id: dto.id,
    href: `/lesson-planner/${dto.id}`,
    title: dto.title,
    classLabel: dto.classDisplayName,
    topic: dto.topic,
    statusLabel: status.label,
    statusTone: status.tone,
    scheduledLabel: formatDateLabel(dto.scheduledFor),
    durationLabel: `${dto.durationMinutes} min`,
    readinessPercent: dto.readinessPercent,
  };
}

export function toLessonPlanDetailView(dto: LessonPlanDetailDto): LessonPlanDetailView {
  const status = statusView[dto.status];

  return {
    id: dto.id,
    title: dto.title,
    classLabel: dto.classDisplayName,
    topic: dto.topic,
    workspaceName: dto.workspace.name,
    statusLabel: status.label,
    statusTone: status.tone,
    scheduledLabel: formatDateLabel(dto.scheduledFor),
    durationLabel: `${dto.durationMinutes} minutes`,
    readinessPercent: dto.readinessPercent,
    objectives: dto.objectives,
    materials: dto.materials,
    starterActivity: dto.starterActivity,
    teachingActivity: dto.teachingActivity,
    learnerPractice: dto.learnerPractice,
    assessmentCheck: dto.assessmentCheck,
    differentiation: dto.differentiation,
  };
}

export function formatDateLabel(date: string) {
  return new Intl.DateTimeFormat("en", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00.000Z`));
}
