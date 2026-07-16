import type { NextRequest } from "next/server";
import type { CreateAssistantProposalDto } from "@/lib/features/assistant/types";
import { apiError, apiOk } from "@/lib/server/api-response";
import { createAssistantProposal } from "@/lib/server/assistant-service";
import { getRequestAuthContext } from "@/lib/server/auth-context";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as CreateAssistantProposalDto | null;

  if (!body) {
    return apiError("VALIDATION_ERROR", "Request body must be valid JSON.", 400);
  }

  const result = createAssistantProposal(getRequestAuthContext(request), body);

  if (!result.ok) {
    return apiError(result.code, result.message, result.status, result.fields);
  }

  return apiOk(result.data, { status: 201 });
}
