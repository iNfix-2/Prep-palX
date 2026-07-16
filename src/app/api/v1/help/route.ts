import type { NextRequest } from "next/server";
import { apiError, apiOk } from "@/lib/server/api-response";
import { getRequestAuthContext } from "@/lib/server/auth-context";
import { getHelpCentre } from "@/lib/server/help-service";

export async function GET(request: NextRequest) {
  const result = getHelpCentre(getRequestAuthContext(request));

  if (!result.ok) {
    return apiError(result.code, result.message, result.status, result.fields);
  }

  return apiOk(result.data);
}
