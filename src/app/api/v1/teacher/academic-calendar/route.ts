import type { NextRequest } from "next/server";
import { apiError, apiOk } from "@/lib/server/api-response";
import { getRequestAuthContext } from "@/lib/server/auth-context";
import { listTeacherAcademicCalendar } from "@/lib/server/academic-calendar-service";

export async function GET(request: NextRequest) {
  const result = listTeacherAcademicCalendar(
    getRequestAuthContext(request),
    request.nextUrl.searchParams.get("from") ?? undefined,
  );

  if (!result.ok) {
    return apiError(result.code, result.message, result.status, result.fields);
  }

  return apiOk(result.data);
}
