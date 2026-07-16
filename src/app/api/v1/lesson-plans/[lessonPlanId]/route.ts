import type { NextRequest } from "next/server";
import { apiError, apiOk } from "@/lib/server/api-response";
import { getRequestAuthContext } from "@/lib/server/auth-context";
import { getLessonPlan } from "@/lib/server/lesson-plans-service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ lessonPlanId: string }> },
) {
  const { lessonPlanId } = await params;
  const result = getLessonPlan(getRequestAuthContext(request), lessonPlanId);

  if (!result.ok) {
    return apiError(result.code, result.message, result.status, result.fields);
  }

  return apiOk(result.data);
}
