import type { NextRequest } from "next/server";
import { apiError, apiOk } from "@/lib/server/api-response";
import { getAssistantWorkspace } from "@/lib/server/assistant-service";
import { getRequestAuthContext } from "@/lib/server/auth-context";

export async function GET(request: NextRequest) {
  const result = getAssistantWorkspace(getRequestAuthContext(request));

  if (!result.ok) {
    return apiError(result.code, result.message, result.status, result.fields);
  }

  return apiOk(result.data);
}
