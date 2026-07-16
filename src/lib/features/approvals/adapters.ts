import type {
  ApprovalCardView,
  ApprovalDetailView,
  ApprovalPriority,
  ApprovalRequestDetailDto,
  ApprovalRequestDto,
  ApprovalStatus,
  ApprovalResourceType,
  ApprovalsPageView,
  TeacherApprovalsResponseDto,
} from "@/lib/features/approvals/types";

const statusView: Record<
  ApprovalStatus,
  { label: string; tone: "approved" | "review" | "draft" }
> = {
  pending: { label: "Pending review", tone: "review" },
  changes_requested: { label: "Changes requested", tone: "draft" },
  approved: { label: "Approved", tone: "approved" },
};

const priorityView: Record<
  ApprovalPriority,
  { label: string; tone: "approved" | "review" | "draft" }
> = {
  low: { label: "Low priority", tone: "approved" },
  medium: { label: "Medium priority", tone: "review" },
  high: { label: "High priority", tone: "draft" },
};

const resourceLabels: Record<ApprovalResourceType, string> = {
  lesson_plan: "Lesson plan",
  assessment: "Assessment",
  report: "Report",
};

export function toApprovalsPageView(dto: TeacherApprovalsResponseDto): ApprovalsPageView {
  return {
    workspaceName: dto.workspace.name,
    totalApprovals: dto.approvals.length,
    pendingCount: dto.approvals.filter((approval) => approval.status === "pending").length,
    changesRequestedCount: dto.approvals.filter(
      (approval) => approval.status === "changes_requested",
    ).length,
    approvedCount: dto.approvals.filter((approval) => approval.status === "approved").length,
    highPriorityCount: dto.approvals.filter((approval) => approval.priority === "high").length,
    canReviewApprovals: dto.permissions.canReviewApprovals,
    canUseAi: dto.permissions.canUseAi,
    approvals: dto.approvals.map(toApprovalCardView),
  };
}

export function toApprovalCardView(dto: ApprovalRequestDto): ApprovalCardView {
  const status = statusView[dto.status];
  const priority = priorityView[dto.priority];

  return {
    id: dto.id,
    href: `/approvals/${dto.id}`,
    resourceHref: dto.resourceHref,
    title: dto.title,
    classLabel: `${dto.classDisplayName} / ${dto.subjectName}`,
    resourceLabel: resourceLabels[dto.resourceType],
    statusLabel: status.label,
    statusTone: status.tone,
    priorityLabel: priority.label,
    priorityTone: priority.tone,
    submittedByLabel: `Submitted by ${dto.submittedByName}`,
    reviewerLabel: dto.reviewerName ? `Reviewer: ${dto.reviewerName}` : "Reviewer unassigned",
    dueLabel: formatDate(dto.dueDate),
    noteLabel: `${dto.noteCount} ${dto.noteCount === 1 ? "note" : "notes"}`,
  };
}

export function toApprovalDetailView(
  dto: ApprovalRequestDetailDto,
  canReviewApprovals: boolean,
): ApprovalDetailView {
  const status = statusView[dto.status];
  const priority = priorityView[dto.priority];

  return {
    id: dto.id,
    title: dto.title,
    summary: dto.summary,
    classLabel: `${dto.classDisplayName} / ${dto.subjectName}`,
    resourceLabel: resourceLabels[dto.resourceType],
    resourceHref: dto.resourceHref,
    workspaceName: dto.workspace.name,
    statusLabel: status.label,
    statusTone: status.tone,
    priorityLabel: priority.label,
    priorityTone: priority.tone,
    submittedByLabel: dto.submittedByName,
    reviewerLabel: dto.reviewerName || "Unassigned",
    submittedLabel: formatDate(dto.submittedAt),
    dueLabel: formatDate(dto.dueDate),
    updatedLabel: formatDate(dto.updatedAt),
    canReviewApprovals,
    notes: dto.notes,
  };
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}
