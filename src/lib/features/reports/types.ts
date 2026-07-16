import type { WorkspaceSummaryDto } from "@/lib/features/classes/types";

export type ReportReadinessStatus = "ready" | "needs_attention" | "blocked";
export type ReportCommentStatus = "draft" | "ready";

export interface ReportClassSummaryDto {
  id: string;
  classId: string;
  classDisplayName: string;
  subjectName: string;
  gradeName: string;
  room: string;
  learnerCount: number;
  readyLearnerCount: number;
  commentCount: number;
  missingCommentCount: number;
  missingScoreCount: number;
  averageScorePercent: number;
  averageAttendancePercent: number;
  readinessPercent: number;
  status: ReportReadinessStatus;
}

export interface TeacherReportsResponseDto {
  workspace: WorkspaceSummaryDto;
  permissions: {
    canPrepareReports: boolean;
    canReviewReports: boolean;
    canUseAi: boolean;
  };
  reports: ReportClassSummaryDto[];
}

export interface ReportLearnerProfileDto {
  learnerId: string;
  displayName: string;
  admissionNo: string;
  averageScorePercent: number;
  missingScoreCount: number;
  attendancePercent: number;
  comment: string;
  commentStatus: ReportCommentStatus;
  isReady: boolean;
}

export interface ClassReportDto extends ReportClassSummaryDto {
  workspace: WorkspaceSummaryDto;
  academicSessionLabel: string;
  currentUnit: string;
  learners: ReportLearnerProfileDto[];
}

export interface SaveReportCommentDto {
  learnerId: string;
  comment: string;
  status: ReportCommentStatus;
}

export interface SaveReportCommentsRequestDto {
  comments: SaveReportCommentDto[];
}

export interface ReportClassCardView {
  id: string;
  href: string;
  title: string;
  subjectLabel: string;
  room: string;
  learnerLabel: string;
  readyLabel: string;
  missingScoreLabel: string;
  commentLabel: string;
  readinessPercent: number;
  averageScoreLabel: string;
  attendanceLabel: string;
  statusLabel: string;
  statusTone: "approved" | "review" | "draft";
}

export interface ReportsPageView {
  workspaceName: string;
  totalClasses: number;
  totalLearners: number;
  totalReadyLearners: number;
  totalMissingScores: number;
  totalMissingComments: number;
  averageReadinessPercent: number;
  canPrepareReports: boolean;
  canReviewReports: boolean;
  canUseAi: boolean;
  reports: ReportClassCardView[];
}

export interface ClassReportView {
  id: string;
  classId: string;
  title: string;
  subjectLabel: string;
  workspaceName: string;
  academicSessionLabel: string;
  room: string;
  currentUnit: string;
  learnerCount: number;
  readyLearnerCount: number;
  missingScoreCount: number;
  missingCommentCount: number;
  averageScoreLabel: string;
  attendanceLabel: string;
  readinessPercent: number;
  statusLabel: string;
  statusTone: "approved" | "review" | "draft";
  canPrepareReports: boolean;
  learners: ReportLearnerProfileDto[];
}
