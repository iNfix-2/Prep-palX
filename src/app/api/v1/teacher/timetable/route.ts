import type { NextRequest } from "next/server";
import { apiError, apiOk } from "@/lib/server/api-response";
import { getRequestAuthContext } from "@/lib/server/auth-context";
import { listTeacherTimetable } from "@/lib/server/timetable-service";

export async function GET(request: NextRequest) {
  const result = listTeacherTimetable(
    getRequestAuthContext(request),
    request.nextUrl.searchParams.get("date") ?? undefined,
  );

  if (!result.ok) {
    return apiError(result.code, result.message, result.status, result.fields);
  }

  return apiOk(result.data);
}
