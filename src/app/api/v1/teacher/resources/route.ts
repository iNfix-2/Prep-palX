import type { NextRequest } from "next/server";
import { apiError, apiOk } from "@/lib/server/api-response";
import { getRequestAuthContext } from "@/lib/server/auth-context";
import { listTeacherResources } from "@/lib/server/resources-service";

export async function GET(request: NextRequest) {
  const result = listTeacherResources(getRequestAuthContext(request));

  if (!result.ok) {
    return apiError(result.code, result.message, result.status);
  }

  return apiOk(result.data);
}
