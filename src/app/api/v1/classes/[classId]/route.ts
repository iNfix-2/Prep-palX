import type { NextRequest } from "next/server";
import { apiError, apiOk } from "@/lib/server/api-response";
import { getRequestAuthContext } from "@/lib/server/auth-context";
import { getClassOverview } from "@/lib/server/classes-service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ classId: string }> },
) {
  const { classId } = await params;
  const result = getClassOverview(getRequestAuthContext(request), classId);

  if (!result.ok) {
    return apiError(result.code, result.message, result.status);
  }

  return apiOk(result.data);
}
