import type {
  AssessmentCardView,
  AssessmentDetailDto,
  AssessmentDetailView,
  AssessmentListItemDto,
  AssessmentsPageView,
  TeacherAssessmentsResponseDto,
} from "@/lib/features/assessments/types";

const statusView = {
  draft: { label: "Draft", tone: "draft" },
  in_review: { label: "In review", tone: "review" },
  published: { label: "Published", tone: "approved" },
} as const;

const typeLabel = {
  classwork: "Classwork",
  quiz: "Quiz",
  continuous_assessment: "Continuous Assessment",
  exam: "Exam",
} as const;

export function toAssessmentsPageView(
  dto: TeacherAssessmentsResponseDto,
): AssessmentsPageView {
  return {
    workspaceName: dto.workspace.name,
    totalAssessments: dto.assessments.length,
    draftCount: dto.assessments.filter((assessment) => assessment.status === "draft").length,
    reviewCount: dto.assessments.filter((assessment) => assessment.status === "in_review").length,
    publishedCount: dto.assessments.filter((assessment) => assessment.status === "published")
      .length,
    totalMarks: dto.assessments.reduce((sum, assessment) => sum + assessment.totalMarks, 0),
    averageReadiness:
      dto.assessments.length > 0
        ? Math.round(
            dto.assessments.reduce(
              (sum, assessment) => sum + assessment.readinessPercent,
              0,
            ) / dto.assessments.length,
          )
        : 0,
    canCreateAssessment: dto.permissions.canCreateAssessment,
    canUseAi: dto.permissions.canUseAi,
    assessments: dto.assessments.map(toAssessmentCardView),
  };
}

export function toAssessmentCardView(dto: AssessmentListItemDto): AssessmentCardView {
  const status = statusView[dto.status];

  return {
    id: dto.id,
    href: `/assessments/${dto.id}`,
    title: dto.title,
    classLabel: dto.classDisplayName,
    subjectLabel: `${dto.subjectName} / ${dto.gradeName}`,
    typeLabel: typeLabel[dto.type],
    statusLabel: status.label,
    statusTone: status.tone,
    scheduledLabel: formatDateLabel(dto.scheduledFor),
    dueLabel: formatDateLabel(dto.dueDate),
    marksLabel: `${dto.totalMarks} marks`,
    itemLabel: `${dto.itemCount} ${dto.itemCount === 1 ? "item" : "items"}`,
    readinessPercent: dto.readinessPercent,
  };
}

export function toAssessmentDetailView(dto: AssessmentDetailDto): AssessmentDetailView {
  const status = statusView[dto.status];

  return {
    id: dto.id,
    title: dto.title,
    classLabel: dto.classDisplayName,
    subjectLabel: `${dto.subjectName} / ${dto.gradeName}`,
    workspaceName: dto.workspace.name,
    typeLabel: typeLabel[dto.type],
    statusLabel: status.label,
    statusTone: status.tone,
    scheduledLabel: formatDateLabel(dto.scheduledFor),
    dueLabel: formatDateLabel(dto.dueDate),
    durationLabel: `${dto.durationMinutes} minutes`,
    marksLabel: `${dto.totalMarks} marks`,
    readinessPercent: dto.readinessPercent,
    topics: dto.topics,
    instructions: dto.instructions,
    items: dto.items,
    reviewNotes: dto.reviewNotes,
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
