import type { NextRequest } from "next/server";
import type { CreateSupportRequestDto } from "@/lib/features/help/types";
import { apiError, apiOk } from "@/lib/server/api-response";
import { getRequestAuthContext } from "@/lib/server/auth-context";
import { createSupportRequest } from "@/lib/server/help-service";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as CreateSupportRequestDto | null;

  if (!body) {
    return apiError("VALIDATION_ERROR", "Request body must be valid JSON.", 400);
  }

  const result = createSupportRequest(getRequestAuthContext(request), body);

  if (!result.ok) {
    return apiError(result.code, result.message, result.status, result.fields);
  }

  return apiOk(result.data, { status: 201 });
}
