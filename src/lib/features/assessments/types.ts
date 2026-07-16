import type { WorkspaceSummaryDto } from "@/lib/features/classes/types";

export type AssessmentStatus = "draft" | "in_review" | "published";
export type AssessmentType = "classwork" | "quiz" | "continuous_assessment" | "exam";

export interface AssessmentClassOptionDto {
  id: string;
  displayName: string;
  subjectName: string;
  gradeName: string;
  room: string;
}

export interface AssessmentItemDto {
  id: string;
  prompt: string;
  marks: number;
  skill: string;
}

export interface AssessmentListItemDto {
  id: string;
  classId: string;
  classDisplayName: string;
  subjectName: string;
  gradeName: string;
  title: string;
  type: AssessmentType;
  status: AssessmentStatus;
  scheduledFor: string;
  dueDate: string;
  durationMinutes: number;
  totalMarks: number;
  itemCount: number;
  readinessPercent: number;
  updatedAt: string;
}

export interface TeacherAssessmentsResponseDto {
  workspace: WorkspaceSummaryDto;
  permissions: {
    canCreateAssessment: boolean;
    canUseAi: boolean;
  };
  assessments: AssessmentListItemDto[];
}

export interface AssessmentDetailDto extends AssessmentListItemDto {
  workspace: WorkspaceSummaryDto;
  topics: string[];
  instructions: string;
  items: AssessmentItemDto[];
  reviewNotes: string;
}

export interface AssessmentCreateOptionsDto {
  workspace: WorkspaceSummaryDto;
  classes: AssessmentClassOptionDto[];
}

export interface CreateAssessmentItemDto {
  prompt: string;
  marks: number;
  skill: string;
}

export interface CreateAssessmentDto {
  classId: string;
  title: string;
  type: AssessmentType;
  scheduledFor: string;
  dueDate: string;
  durationMinutes: number;
  totalMarks: number;
  topics: string[];
  instructions: string;
  items: CreateAssessmentItemDto[];
  reviewNotes: string;
}

export interface AssessmentCardView {
  id: string;
  href: string;
  title: string;
  classLabel: string;
  subjectLabel: string;
  typeLabel: string;
  statusLabel: string;
  statusTone: "draft" | "review" | "approved";
  scheduledLabel: string;
  dueLabel: string;
  marksLabel: string;
  itemLabel: string;
  readinessPercent: number;
}

export interface AssessmentsPageView {
  workspaceName: string;
  totalAssessments: number;
  draftCount: number;
  reviewCount: number;
  publishedCount: number;
  totalMarks: number;
  averageReadiness: number;
  canCreateAssessment: boolean;
  canUseAi: boolean;
  assessments: AssessmentCardView[];
}

export interface AssessmentDetailView {
  id: string;
  title: string;
  classLabel: string;
  subjectLabel: string;
  workspaceName: string;
  typeLabel: string;
  statusLabel: string;
  statusTone: "draft" | "review" | "approved";
  scheduledLabel: string;
  dueLabel: string;
  durationLabel: string;
  marksLabel: string;
  readinessPercent: number;
  topics: string[];
  instructions: string;
  items: AssessmentItemDto[];
  reviewNotes: string;
}
