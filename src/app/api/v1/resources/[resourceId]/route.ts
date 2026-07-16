import type { NextRequest } from "next/server";
import { apiError, apiOk } from "@/lib/server/api-response";
import { getRequestAuthContext } from "@/lib/server/auth-context";
import { getResource } from "@/lib/server/resources-service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ resourceId: string }> },
) {
  const { resourceId } = await params;
  const result = getResource(getRequestAuthContext(request), resourceId);

  if (!result.ok) {
    return apiError(result.code, result.message, result.status);
  }

  return apiOk(result.data);
}
