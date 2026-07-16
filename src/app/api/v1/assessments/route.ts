import type { NextRequest } from "next/server";
import type { CreateAssessmentDto } from "@/lib/features/assessments/types";
import { apiError, apiOk } from "@/lib/server/api-response";
import { getRequestAuthContext } from "@/lib/server/auth-context";
import { createAssessment } from "@/lib/server/assessments-service";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as CreateAssessmentDto | null;

  if (!body) {
    return apiError("VALIDATION_ERROR", "Request body must be valid JSON.", 400);
  }

  const result = createAssessment(getRequestAuthContext(request), body);

  if (!result.ok) {
    return apiError(result.code, result.message, result.status, result.fields);
  }

  return apiOk(result.data, { status: 201 });
}
