import { submitApprovalDecisionAction } from "@/app/(teacher)/approvals/[approvalId]/actions";
import { ApprovalDetailWorkbench } from "@/components/approvals/approval-detail-workbench";
import {
  ErrorState,
  ForbiddenState,
  UnauthorizedState,
} from "@/components/states/data-states";
import { toApprovalDetailView } from "@/lib/features/approvals/adapters";
import { getPageAuthContext } from "@/lib/server/auth-context";
import { getApprovalDetail } from "@/lib/server/approvals-service";

export default async function ApprovalDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ approvalId: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const { approvalId } = await params;
  const { saved, error } = await searchParams;
  const context = await getPageAuthContext();
  const result = getApprovalDetail(context, approvalId);

  if (!result.ok) {
    if (result.status === 401) {
      return <UnauthorizedState />;
    }

    if (result.status === 403) {
      return <ForbiddenState message={result.message} />;
    }

    return (
      <ErrorState
        title="Approval not found"
        message={result.message}
        action={{ label: "Back to approvals", href: "/approvals", icon: "verified_user" }}
      />
    );
  }

  const canReviewApprovals =
    context.status === "authenticated" &&
    (context.activeMembership.permissions.includes("approval.review") ||
      context.activeMembership.permissions.includes("report.review"));
  const action = submitApprovalDecisionAction.bind(null, approvalId);

  return (
    <ApprovalDetailWorkbench
      view={toApprovalDetailView(result.data, canReviewApprovals)}
      action={action}
      saved={saved === "1"}
      error={error}
    />
  );
}
