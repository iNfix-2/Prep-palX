import type { WorkspaceSummaryDto } from "@/lib/features/classes/types";

export type QuestionStatus = "draft" | "in_review" | "approved";
export type QuestionDifficulty = "easy" | "medium" | "hard";
export type QuestionType = "multiple_choice" | "short_answer" | "structured_response";

export interface QuestionClassOptionDto {
  id: string;
  displayName: string;
  subjectName: string;
  gradeName: string;
  room: string;
}

export interface QuestionBankItemDto {
  id: string;
  classId: string;
  classDisplayName: string;
  subjectName: string;
  gradeName: string;
  prompt: string;
  type: QuestionType;
  difficulty: QuestionDifficulty;
  status: QuestionStatus;
  marks: number;
  topic: string;
  skill: string;
  usageCount: number;
  qualityPercent: number;
  updatedAt: string;
}

export interface TeacherQuestionsResponseDto {
  workspace: WorkspaceSummaryDto;
  permissions: {
    canManageQuestions: boolean;
    canUseAi: boolean;
  };
  questions: QuestionBankItemDto[];
}

export interface QuestionDetailDto extends QuestionBankItemDto {
  workspace: WorkspaceSummaryDto;
  options: string[];
  answer: string;
  explanation: string;
  createdByName: string;
}

export interface QuestionCreateOptionsDto {
  workspace: WorkspaceSummaryDto;
  classes: QuestionClassOptionDto[];
}

export interface CreateQuestionDto {
  classId: string;
  prompt: string;
  type: QuestionType;
  difficulty: QuestionDifficulty;
  status: QuestionStatus;
  marks: number;
  topic: string;
  skill: string;
  options: string[];
  answer: string;
  explanation: string;
}

export interface QuestionCardView {
  id: string;
  href: string;
  prompt: string;
  classLabel: string;
  subjectLabel: string;
  typeLabel: string;
  difficultyLabel: string;
  difficultyTone: QuestionDifficulty;
  statusLabel: string;
  statusTone: "draft" | "review" | "approved";
  marksLabel: string;
  topicLabel: string;
  skillLabel: string;
  usageLabel: string;
  updatedLabel: string;
  qualityPercent: number;
}

export interface QuestionBankPageView {
  workspaceName: string;
  totalQuestions: number;
  draftCount: number;
  reviewCount: number;
  approvedCount: number;
  totalMarks: number;
  averageQuality: number;
  canManageQuestions: boolean;
  canUseAi: boolean;
  questions: QuestionCardView[];
}

export interface QuestionDetailView {
  id: string;
  classId: string;
  prompt: string;
  classLabel: string;
  subjectLabel: string;
  workspaceName: string;
  typeLabel: string;
  difficultyLabel: string;
  difficultyTone: QuestionDifficulty;
  statusLabel: string;
  statusTone: "draft" | "review" | "approved";
  marksLabel: string;
  topic: string;
  skill: string;
  usageLabel: string;
  updatedLabel: string;
  qualityPercent: number;
  options: string[];
  answer: string;
  explanation: string;
  createdByName: string;
}
