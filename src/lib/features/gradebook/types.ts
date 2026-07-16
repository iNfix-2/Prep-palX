import type { WorkspaceSummaryDto } from "@/lib/features/classes/types";
import type { AssessmentType } from "@/lib/features/assessments/types";

export type GradebookSheetStatus = "complete" | "partial" | "not_started";
export type GradebookScoreStatus = "scored" | "missing" | "excused";

export interface GradebookSheetSummaryDto {
  id: string;
  assessmentId: string;
  classId: string;
  assessmentTitle: string;
  assessmentType: AssessmentType;
  classDisplayName: string;
  subjectName: string;
  gradeName: string;
  scheduledFor: string;
  dueDate: string;
  totalMarks: number;
  learnerCount: number;
  scoredCount: number;
  missingCount: number;
  excusedCount: number;
  averageScorePercent: number;
  status: GradebookSheetStatus;
}

export interface TeacherGradebooksResponseDto {
  workspace: WorkspaceSummaryDto;
  permissions: {
    canMarkScores: boolean;
    canUseAi: boolean;
  };
  gradebooks: GradebookSheetSummaryDto[];
}

export interface GradebookLearnerScoreDto {
  learnerId: string;
  displayName: string;
  admissionNo: string;
  score: number | null;
  maxScore: number;
  status: GradebookScoreStatus;
  feedback: string;
  isScored: boolean;
  lastScore: number;
  attendancePercent: number;
}

export interface GradebookSheetDto extends GradebookSheetSummaryDto {
  workspace: WorkspaceSummaryDto;
  topics: string[];
  instructions: string;
  learners: GradebookLearnerScoreDto[];
}

export interface SaveGradebookScoreDto {
  learnerId: string;
  score: number | null;
  status: GradebookScoreStatus;
  feedback?: string;
}

export interface SaveGradebookScoresRequestDto {
  scores: SaveGradebookScoreDto[];
}

export interface GradebookCardView {
  id: string;
  href: string;
  title: string;
  classLabel: string;
  subjectLabel: string;
  statusLabel: string;
  statusTone: "approved" | "review" | "draft";
  dueLabel: string;
  marksLabel: string;
  learnerLabel: string;
  scoredLabel: string;
  missingLabel: string;
  averageLabel: string;
}

export interface GradebookPageView {
  workspaceName: string;
  totalSheets: number;
  completeCount: number;
  partialCount: number;
  notStartedCount: number;
  missingScoreCount: number;
  averageScorePercent: number;
  canMarkScores: boolean;
  canUseAi: boolean;
  gradebooks: GradebookCardView[];
}

export interface GradebookSheetView {
  id: string;
  assessmentId: string;
  title: string;
  classLabel: string;
  subjectLabel: string;
  workspaceName: string;
  statusLabel: string;
  statusTone: "approved" | "review" | "draft";
  scheduledLabel: string;
  dueLabel: string;
  marksLabel: string;
  learnerCount: number;
  scoredCount: number;
  missingCount: number;
  averageLabel: string;
  totalMarks: number;
  topics: string[];
  instructions: string;
  canMarkScores: boolean;
  learners: GradebookLearnerScoreDto[];
}
