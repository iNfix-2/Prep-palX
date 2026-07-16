import type { NextRequest } from "next/server";
import { apiError, apiOk } from "@/lib/server/api-response";
import { getRequestAuthContext } from "@/lib/server/auth-context";
import { listTeacherClasses } from "@/lib/server/classes-service";

export async function GET(request: NextRequest) {
  const result = listTeacherClasses(getRequestAuthContext(request));

  if (!result.ok) {
    return apiError(result.code, result.message, result.status);
  }

  return apiOk(result.data);
}
