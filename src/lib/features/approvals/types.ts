import type { WorkspaceSummaryDto } from "@/lib/features/classes/types";

export type ApprovalResourceType = "lesson_plan" | "assessment" | "report";
export type ApprovalStatus = "pending" | "changes_requested" | "approved";
export type ApprovalPriority = "low" | "medium" | "high";
export type ApprovalDecisionAction = "approve" | "request_changes";

export interface ApprovalNoteDto {
  id: string;
  authorName: string;
  authorRole: string;
  body: string;
  createdAt: string;
}

export interface ApprovalRequestDto {
  id: string;
  workspaceId: string;
  classId: string;
  classDisplayName: string;
  subjectName: string;
  gradeName: string;
  resourceType: ApprovalResourceType;
  resourceId: string;
  resourceHref: string;
  title: string;
  summary: string;
  status: ApprovalStatus;
  priority: ApprovalPriority;
  submittedByName: string;
  reviewerName: string;
  submittedAt: string;
  dueDate: string;
  updatedAt: string;
  noteCount: number;
}

export interface ApprovalRequestDetailDto extends ApprovalRequestDto {
  workspace: WorkspaceSummaryDto;
  notes: ApprovalNoteDto[];
}

export interface TeacherApprovalsResponseDto {
  workspace: WorkspaceSummaryDto;
  permissions: {
    canReviewApprovals: boolean;
    canUseAi: boolean;
  };
  approvals: ApprovalRequestDto[];
}

export interface SubmitApprovalDecisionRequestDto {
  action: ApprovalDecisionAction;
  note?: string;
}

export interface ApprovalCardView {
  id: string;
  href: string;
  resourceHref: string;
  title: string;
  classLabel: string;
  resourceLabel: string;
  statusLabel: string;
  statusTone: "approved" | "review" | "draft";
  priorityLabel: string;
  priorityTone: "approved" | "review" | "draft";
  submittedByLabel: string;
  reviewerLabel: string;
  dueLabel: string;
  noteLabel: string;
}

export interface ApprovalsPageView {
  workspaceName: string;
  totalApprovals: number;
  pendingCount: number;
  changesRequestedCount: number;
  approvedCount: number;
  highPriorityCount: number;
  canReviewApprovals: boolean;
  canUseAi: boolean;
  approvals: ApprovalCardView[];
}

export interface ApprovalDetailView {
  id: string;
  title: string;
  summary: string;
  classLabel: string;
  resourceLabel: string;
  resourceHref: string;
  workspaceName: string;
  statusLabel: string;
  statusTone: "approved" | "review" | "draft";
  priorityLabel: string;
  priorityTone: "approved" | "review" | "draft";
  submittedByLabel: string;
  reviewerLabel: string;
  submittedLabel: string;
  dueLabel: string;
  updatedLabel: string;
  canReviewApprovals: boolean;
  notes: ApprovalNoteDto[];
}
