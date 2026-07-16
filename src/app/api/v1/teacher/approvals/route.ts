import type { NextRequest } from "next/server";
import { apiError, apiOk } from "@/lib/server/api-response";
import { getRequestAuthContext } from "@/lib/server/auth-context";
import { listTeacherApprovals } from "@/lib/server/approvals-service";

export async function GET(request: NextRequest) {
  const result = listTeacherApprovals(getRequestAuthContext(request));

  if (!result.ok) {
    return apiError(result.code, result.message, result.status, result.fields);
  }

  return apiOk(result.data);
}
