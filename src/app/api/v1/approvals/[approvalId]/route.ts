import type { NextRequest } from "next/server";
import type { SubmitApprovalDecisionRequestDto } from "@/lib/features/approvals/types";
import { apiError, apiOk } from "@/lib/server/api-response";
import { getRequestAuthContext } from "@/lib/server/auth-context";
import { getApprovalDetail, submitApprovalDecision } from "@/lib/server/approvals-service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ approvalId: string }> },
) {
  const { approvalId } = await params;
  const result = getApprovalDetail(getRequestAuthContext(request), approvalId);

  if (!result.ok) {
    return apiError(result.code, result.message, result.status, result.fields);
  }

  return apiOk(result.data);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ approvalId: string }> },
) {
  const { approvalId } = await params;
  const body = (await request.json().catch(() => null)) as SubmitApprovalDecisionRequestDto | null;

  if (!body) {
    return apiError("VALIDATION_ERROR", "Request body must be valid JSON.", 400);
  }

  const result = submitApprovalDecision(getRequestAuthContext(request), approvalId, body);

  if (!result.ok) {
    return apiError(result.code, result.message, result.status, result.fields);
  }

  return apiOk(result.data);
}
