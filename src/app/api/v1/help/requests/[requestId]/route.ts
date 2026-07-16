import type { NextRequest } from "next/server";
import type { AddSupportMessageDto } from "@/lib/features/help/types";
import { apiError, apiOk } from "@/lib/server/api-response";
import { getRequestAuthContext } from "@/lib/server/auth-context";
import { addSupportMessage, getSupportRequestDetail } from "@/lib/server/help-service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ requestId: string }> },
) {
  const { requestId } = await params;
  const result = getSupportRequestDetail(getRequestAuthContext(request), requestId);

  if (!result.ok) {
    return apiError(result.code, result.message, result.status, result.fields);
  }

  return apiOk(result.data);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ requestId: string }> },
) {
  const { requestId } = await params;
  const body = (await request.json().catch(() => null)) as AddSupportMessageDto | null;

  if (!body) {
    return apiError("VALIDATION_ERROR", "Request body must be valid JSON.", 400);
  }

  const result = addSupportMessage(getRequestAuthContext(request), requestId, body);

  if (!result.ok) {
    return apiError(result.code, result.message, result.status, result.fields);
  }

  return apiOk(result.data);
}
