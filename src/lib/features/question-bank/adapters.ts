import type {
  QuestionBankItemDto,
  QuestionBankPageView,
  QuestionCardView,
  QuestionDetailDto,
  QuestionDetailView,
  TeacherQuestionsResponseDto,
} from "@/lib/features/question-bank/types";

const statusView = {
  draft: { label: "Draft", tone: "draft" },
  in_review: { label: "In review", tone: "review" },
  approved: { label: "Approved", tone: "approved" },
} as const;

const difficultyLabel = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
} as const;

const typeLabel = {
  multiple_choice: "Multiple Choice",
  short_answer: "Short Answer",
  structured_response: "Structured Response",
} as const;

export function toQuestionBankPageView(
  dto: TeacherQuestionsResponseDto,
): QuestionBankPageView {
  return {
    workspaceName: dto.workspace.name,
    totalQuestions: dto.questions.length,
    draftCount: dto.questions.filter((question) => question.status === "draft").length,
    reviewCount: dto.questions.filter((question) => question.status === "in_review").length,
    approvedCount: dto.questions.filter((question) => question.status === "approved").length,
    totalMarks: dto.questions.reduce((sum, question) => sum + question.marks, 0),
    averageQuality:
      dto.questions.length > 0
        ? Math.round(
            dto.questions.reduce((sum, question) => sum + question.qualityPercent, 0) /
              dto.questions.length,
          )
        : 0,
    canManageQuestions: dto.permissions.canManageQuestions,
    canUseAi: dto.permissions.canUseAi,
    questions: dto.questions.map(toQuestionCardView),
  };
}

export function toQuestionCardView(dto: QuestionBankItemDto): QuestionCardView {
  const status = statusView[dto.status];

  return {
    id: dto.id,
    href: `/question-bank/${dto.id}`,
    prompt: dto.prompt,
    classLabel: dto.classDisplayName,
    subjectLabel: `${dto.subjectName} / ${dto.gradeName}`,
    typeLabel: typeLabel[dto.type],
    difficultyLabel: difficultyLabel[dto.difficulty],
    difficultyTone: dto.difficulty,
    statusLabel: status.label,
    statusTone: status.tone,
    marksLabel: `${dto.marks} ${dto.marks === 1 ? "mark" : "marks"}`,
    topicLabel: dto.topic,
    skillLabel: dto.skill,
    usageLabel: `${dto.usageCount} ${dto.usageCount === 1 ? "use" : "uses"}`,
    updatedLabel: formatDateTimeLabel(dto.updatedAt),
    qualityPercent: dto.qualityPercent,
  };
}

export function toQuestionDetailView(dto: QuestionDetailDto): QuestionDetailView {
  const status = statusView[dto.status];

  return {
    id: dto.id,
    classId: dto.classId,
    prompt: dto.prompt,
    classLabel: dto.classDisplayName,
    subjectLabel: `${dto.subjectName} / ${dto.gradeName}`,
    workspaceName: dto.workspace.name,
    typeLabel: typeLabel[dto.type],
    difficultyLabel: difficultyLabel[dto.difficulty],
    difficultyTone: dto.difficulty,
    statusLabel: status.label,
    statusTone: status.tone,
    marksLabel: `${dto.marks} ${dto.marks === 1 ? "mark" : "marks"}`,
    topic: dto.topic,
    skill: dto.skill,
    usageLabel: `${dto.usageCount} ${dto.usageCount === 1 ? "use" : "uses"}`,
    updatedLabel: formatDateTimeLabel(dto.updatedAt),
    qualityPercent: dto.qualityPercent,
    options: dto.options,
    answer: dto.answer,
    explanation: dto.explanation,
    createdByName: dto.createdByName,
  };
}

function formatDateTimeLabel(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(new Date(value));
}
