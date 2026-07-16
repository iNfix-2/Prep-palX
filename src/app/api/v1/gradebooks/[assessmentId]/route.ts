import type { NextRequest } from "next/server";
import type { SaveGradebookScoresRequestDto } from "@/lib/features/gradebook/types";
import { apiError, apiOk } from "@/lib/server/api-response";
import { getRequestAuthContext } from "@/lib/server/auth-context";
import { getGradebookSheet, saveGradebookScores } from "@/lib/server/gradebook-service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ assessmentId: string }> },
) {
  const { assessmentId } = await params;
  const result = getGradebookSheet(getRequestAuthContext(request), assessmentId);

  if (!result.ok) {
    return apiError(result.code, result.message, result.status, result.fields);
  }

  return apiOk(result.data);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ assessmentId: string }> },
) {
  const { assessmentId } = await params;
  const body = (await request.json().catch(() => null)) as SaveGradebookScoresRequestDto | null;

  if (!body) {
    return apiError("VALIDATION_ERROR", "Request body must be valid JSON.", 400);
  }

  const result = saveGradebookScores(getRequestAuthContext(request), assessmentId, body);

  if (!result.ok) {
    return apiError(result.code, result.message, result.status, result.fields);
  }

  return apiOk(result.data);
}
