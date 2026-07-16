"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ApprovalDecisionAction } from "@/lib/features/approvals/types";
import { getPageAuthContext } from "@/lib/server/auth-context";
import { submitApprovalDecision } from "@/lib/server/approvals-service";

const supportedActions: ApprovalDecisionAction[] = ["approve", "request_changes"];

export async function submitApprovalDecisionAction(approvalId: string, formData: FormData) {
  const rawAction = String(formData.get("action") ?? "");
  const result = submitApprovalDecision(await getPageAuthContext(), approvalId, {
    action: isApprovalAction(rawAction) ? rawAction : (rawAction as ApprovalDecisionAction),
    note: String(formData.get("note") ?? ""),
  });

  if (!result.ok) {
    redirect(`/approvals/${approvalId}?error=${result.code}`);
  }

  revalidatePath("/approvals");
  revalidatePath(`/approvals/${approvalId}`);
  revalidatePath(result.data.resourceHref);
  redirect(`/approvals/${approvalId}?saved=1`);
}

function isApprovalAction(value: string): value is ApprovalDecisionAction {
  return supportedActions.includes(value as ApprovalDecisionAction);
}
