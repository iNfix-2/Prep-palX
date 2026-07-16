import type { NextRequest } from "next/server";
import { apiError, apiOk } from "@/lib/server/api-response";
import { getRequestAuthContext } from "@/lib/server/auth-context";
import { listTeacherAttendance } from "@/lib/server/attendance-service";

export async function GET(request: NextRequest) {
  const result = listTeacherAttendance(getRequestAuthContext(request));

  if (!result.ok) {
    return apiError(result.code, result.message, result.status, result.fields);
  }

  return apiOk(result.data);
}
