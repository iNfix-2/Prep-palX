import type {
  ApprovalDecisionAction,
  ApprovalRequestDetailDto,
  ApprovalRequestDto,
  SubmitApprovalDecisionRequestDto,
  TeacherApprovalsResponseDto,
} from "@/lib/features/approvals/types";
import type { WorkspaceSummaryDto } from "@/lib/features/classes/types";
import { hasAnyPermission, hasPermission } from "@/lib/security/permissions";
import type { RequestAuthContext } from "@/lib/server/auth-context";
import {
  demoApprovalRequests,
  demoClasses,
  demoMemberships,
  demoUsers,
  getApprovalRequest,
  updateDemoApprovalRequest,
  type DemoApprovalRequest,
  type DemoClass,
} from "@/lib/server/demo-store";

export type ApprovalsServiceErrorStatus = 400 | 401 | 403 | 404;

export type ApprovalsServiceResult<T> =
  | { ok: true; data: T }
  | {
      ok: false;
      status: ApprovalsServiceErrorStatus;
      code: "AUTH_REQUIRED" | "FORBIDDEN" | "NOT_FOUND" | "VALIDATION_ERROR";
      message: string;
      fields?: Record<string, string[]>;
    };

type AuthenticatedContext = Extract<RequestAuthContext, { status: "authenticated" }>;

const decisionActions: ApprovalDecisionAction[] = ["approve", "request_changes"];

export function listTeacherApprovals(
  context: RequestAuthContext,
): ApprovalsServiceResult<TeacherApprovalsResponseDto> {
  const access = getApprovalsWorkspaceAccess(context);

  if (!access.ok) {
    return access;
  }

  const { context: authenticatedContext } = access.data;
  const approvals = getVisibleApprovals(authenticatedContext);

  return {
    ok: true,
    data: {
      workspace: toWorkspaceSummary(authenticatedContext),
      permissions: {
        canReviewApprovals: canReviewApprovals(authenticatedContext),
        canUseAi: hasPermission(authenticatedContext.activeMembership, "ai.use"),
      },
      approvals: approvals.map(toApprovalRequestDto),
    },
  };
}

export function getApprovalDetail(
  context: RequestAuthContext,
  approvalId: string,
): ApprovalsServiceResult<ApprovalRequestDetailDto> {
  const access = getAccessibleApproval(context, approvalId, "view");

  if (!access.ok) {
    return access;
  }

  return {
    ok: true,
    data: toApprovalDetailDto(access.data.approval, access.data.context),
  };
}

export function submitApprovalDecision(
  context: RequestAuthContext,
  approvalId: string,
  input: SubmitApprovalDecisionRequestDto,
): ApprovalsServiceResult<ApprovalRequestDetailDto> {
  const access = getAccessibleApproval(context, approvalId, "review");

  if (!access.ok) {
    return access;
  }

  const validation = validateApprovalDecision(input);

  if (!validation.ok) {
    return validation;
  }

  const updated = updateDemoApprovalRequest(approvalId, {
    status: validation.data.action === "approve" ? "approved" : "changes_requested",
    reviewerMembershipId: access.data.context.activeMembership.id,
    note: validation.data.note,
  });

  if (!updated) {
    return notFound();
  }

  return {
    ok: true,
    data: toApprovalDetailDto(updated, access.data.context),
  };
}

function getApprovalsWorkspaceAccess(
  context: RequestAuthContext,
): ApprovalsServiceResult<{ context: AuthenticatedContext }> {
  if (context.status === "unauthenticated") {
    return authRequired();
  }

  if (
    !hasAnyPermission(context.activeMembership, ["approval.view", "approval.review", "report.review"])
  ) {
    return forbidden("You do not have permission to view approvals.");
  }

  return { ok: true, data: { context } };
}

function getAccessibleApproval(
  context: RequestAuthContext,
  approvalId: string,
  mode: "view" | "review",
): ApprovalsServiceResult<{ context: AuthenticatedContext; approval: DemoApprovalRequest }> {
  const access = getApprovalsWorkspaceAccess(context);

  if (!access.ok) {
    return access;
  }

  const authenticatedContext = access.data.context;
  const approval = getApprovalRequest(approvalId);

  if (!approval || approval.workspaceId !== authenticatedContext.activeWorkspace.id) {
    return notFound();
  }

  if (!canAccessApproval(authenticatedContext, approval)) {
    return forbidden("This approval is outside your teaching scope.");
  }

  if (mode === "review" && !canReviewApprovals(authenticatedContext)) {
    return forbidden("You do not have permission to review approvals.");
  }

  return { ok: true, data: { context: authenticatedContext, approval } };
}

function getVisibleApprovals(context: AuthenticatedContext) {
  return demoApprovalRequests
    .filter((approval) => approval.workspaceId === context.activeWorkspace.id)
    .filter((approval) => canAccessApproval(context, approval))
    .sort((a, b) => {
      const statusOrder = statusRank(a.status) - statusRank(b.status);
      return statusOrder === 0 ? a.dueDate.localeCompare(b.dueDate) : statusOrder;
    });
}

function canAccessApproval(context: AuthenticatedContext, approval: DemoApprovalRequest) {
  if (canReviewApprovals(context)) {
    return true;
  }

  const classRecord = demoClasses.find((candidate) => candidate.id === approval.classId);

  return (
    approval.submittedByMembershipId === context.activeMembership.id ||
    Boolean(classRecord?.assignedMembershipIds.includes(context.activeMembership.id))
  );
}

function canReviewApprovals(context: AuthenticatedContext) {
  return hasAnyPermission(context.activeMembership, ["approval.review", "report.review"]);
}

function toApprovalDetailDto(
  approval: DemoApprovalRequest,
  context: AuthenticatedContext,
): ApprovalRequestDetailDto {
  return {
    ...toApprovalRequestDto(approval),
    workspace: toWorkspaceSummary(context),
    notes: approval.notes.map((note) => {
      const author = getMembershipLabel(note.authorMembershipId);

      return {
        id: note.id,
        authorName: author.name,
        authorRole: author.role,
        body: note.body,
        createdAt: note.createdAt,
      };
    }),
  };
}

function toApprovalRequestDto(approval: DemoApprovalRequest): ApprovalRequestDto {
  const classRecord = getClassRecord(approval.classId);
  const submitter = getMembershipLabel(approval.submittedByMembershipId);
  const reviewer = approval.reviewerMembershipId
    ? getMembershipLabel(approval.reviewerMembershipId)
    : null;

  return {
    id: approval.id,
    workspaceId: approval.workspaceId,
    classId: approval.classId,
    classDisplayName: classRecord?.displayName ?? "Unknown class",
    subjectName: classRecord?.subjectName ?? "Unknown subject",
    gradeName: classRecord?.gradeName ?? "Unknown grade",
    resourceType: approval.resourceType,
    resourceId: approval.resourceId,
    resourceHref: getResourceHref(approval),
    title: approval.title,
    summary: approval.summary,
    status: approval.status,
    priority: approval.priority,
    submittedByName: submitter.name,
    reviewerName: reviewer?.name ?? "",
    submittedAt: approval.submittedAt,
    dueDate: approval.dueDate,
    updatedAt: approval.updatedAt,
    noteCount: approval.notes.length,
  };
}

function validateApprovalDecision(
  input: SubmitApprovalDecisionRequestDto,
): ApprovalsServiceResult<{ action: ApprovalDecisionAction; note: string }> {
  const fields: Record<string, string[]> = {};
  const action = input?.action;
  const note = String(input?.note ?? "").trim();

  if (!decisionActions.includes(action)) {
    fields.action = ["Approval action is not supported."];
  }

  if (action === "request_changes" && !note) {
    fields.note = ["A review note is required when requesting changes."];
  }

  if (note.length > 500) {
    fields.note = ["Review note must be 500 characters or fewer."];
  }

  if (Object.keys(fields).length > 0) {
    return {
      ok: false,
      status: 400,
      code: "VALIDATION_ERROR",
      message: "Approval decision could not be saved.",
      fields,
    };
  }

  return { ok: true, data: { action, note } };
}

function getMembershipLabel(membershipId: string): { name: string; role: string } {
  const membership = demoMemberships.find((candidate) => candidate.id === membershipId);
  const user = membership ? demoUsers.find((candidate) => candidate.id === membership.userId) : null;

  return {
    name: user?.displayName ?? "Unknown reviewer",
    role: membership?.roleName ?? "Reviewer",
  };
}

function getClassRecord(classId: string): DemoClass | null {
  return demoClasses.find((candidate) => candidate.id === classId) ?? null;
}

function getResourceHref(approval: DemoApprovalRequest) {
  if (approval.resourceType === "lesson_plan") {
    return `/lesson-planner/${approval.resourceId}`;
  }

  if (approval.resourceType === "assessment") {
    return `/assessments/${approval.resourceId}`;
  }

  return `/reports/${approval.classId}`;
}

function statusRank(status: DemoApprovalRequest["status"]) {
  if (status === "pending") {
    return 0;
  }

  if (status === "changes_requested") {
    return 1;
  }

  return 2;
}

function toWorkspaceSummary(context: AuthenticatedContext) {
  return {
    id: context.activeWorkspace.id,
    name: context.activeWorkspace.name,
    academicYearName: context.activeWorkspace.currentAcademicYearName,
    termName: context.activeWorkspace.currentTermName,
  } satisfies WorkspaceSummaryDto;
}

function authRequired(): ApprovalsServiceResult<never> {
  return {
    ok: false,
    status: 401,
    code: "AUTH_REQUIRED",
    message: "Sign in to continue.",
  };
}

function forbidden(message: string): ApprovalsServiceResult<never> {
  return {
    ok: false,
    status: 403,
    code: "FORBIDDEN",
    message,
  };
}

function notFound(): ApprovalsServiceResult<never> {
  return {
    ok: false,
    status: 404,
    code: "NOT_FOUND",
    message: "Approval request was not found in the active workspace.",
  };
}
