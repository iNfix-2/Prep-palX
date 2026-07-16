import type { NextRequest } from "next/server";
import { apiError, apiOk } from "@/lib/server/api-response";
import { getRequestAuthContext } from "@/lib/server/auth-context";
import { getTeacherDashboard } from "@/lib/server/dashboard-service";

export async function GET(request: NextRequest) {
  const result = getTeacherDashboard(getRequestAuthContext(request));

  if (!result.ok) {
    return apiError(result.code, result.message, result.status);
  }

  return apiOk(result.data);
}
