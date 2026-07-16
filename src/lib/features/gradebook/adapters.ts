import type {
  GradebookCardView,
  GradebookPageView,
  GradebookSheetDto,
  GradebookSheetSummaryDto,
  GradebookSheetView,
  TeacherGradebooksResponseDto,
} from "@/lib/features/gradebook/types";

const statusView = {
  complete: { label: "Complete", tone: "approved" },
  partial: { label: "Partial", tone: "review" },
  not_started: { label: "Not started", tone: "draft" },
} as const;

export function toGradebookPageView(dto: TeacherGradebooksResponseDto): GradebookPageView {
  return {
    workspaceName: dto.workspace.name,
    totalSheets: dto.gradebooks.length,
    completeCount: dto.gradebooks.filter((gradebook) => gradebook.status === "complete").length,
    partialCount: dto.gradebooks.filter((gradebook) => gradebook.status === "partial").length,
    notStartedCount: dto.gradebooks.filter((gradebook) => gradebook.status === "not_started")
      .length,
    missingScoreCount: dto.gradebooks.reduce(
      (sum, gradebook) => sum + gradebook.missingCount,
      0,
    ),
    averageScorePercent:
      dto.gradebooks.length > 0
        ? Math.round(
            dto.gradebooks.reduce(
              (sum, gradebook) => sum + gradebook.averageScorePercent,
              0,
            ) / dto.gradebooks.length,
          )
        : 0,
    canMarkScores: dto.permissions.canMarkScores,
    canUseAi: dto.permissions.canUseAi,
    gradebooks: dto.gradebooks.map(toGradebookCardView),
  };
}

export function toGradebookCardView(dto: GradebookSheetSummaryDto): GradebookCardView {
  const status = statusView[dto.status];

  return {
    id: dto.id,
    href: `/gradebook/${dto.assessmentId}`,
    title: dto.assessmentTitle,
    classLabel: dto.classDisplayName,
    subjectLabel: `${dto.subjectName} / ${dto.gradeName}`,
    statusLabel: status.label,
    statusTone: status.tone,
    dueLabel: formatDateLabel(dto.dueDate),
    marksLabel: `${dto.totalMarks} marks`,
    learnerLabel: `${dto.learnerCount} ${dto.learnerCount === 1 ? "learner" : "learners"}`,
    scoredLabel: `${dto.scoredCount}/${dto.learnerCount} scored`,
    missingLabel: `${dto.missingCount} missing`,
    averageLabel:
      dto.scoredCount > 0 ? `${dto.averageScorePercent}% average` : "No scores yet",
  };
}

export function toGradebookSheetView(
  dto: GradebookSheetDto,
  canMarkScores: boolean,
): GradebookSheetView {
  const status = statusView[dto.status];

  return {
    id: dto.id,
    assessmentId: dto.assessmentId,
    title: dto.assessmentTitle,
    classLabel: dto.classDisplayName,
    subjectLabel: `${dto.subjectName} / ${dto.gradeName}`,
    workspaceName: dto.workspace.name,
    statusLabel: status.label,
    statusTone: status.tone,
    scheduledLabel: formatDateLabel(dto.scheduledFor),
    dueLabel: formatDateLabel(dto.dueDate),
    marksLabel: `${dto.totalMarks} marks`,
    learnerCount: dto.learnerCount,
    scoredCount: dto.scoredCount,
    missingCount: dto.missingCount,
    averageLabel:
      dto.scoredCount > 0 ? `${dto.averageScorePercent}% average` : "No scores yet",
    totalMarks: dto.totalMarks,
    topics: dto.topics,
    instructions: dto.instructions,
    canMarkScores,
    learners: dto.learners,
  };
}

function formatDateLabel(date: string) {
  return new Intl.DateTimeFormat("en", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00.000Z`));
}
