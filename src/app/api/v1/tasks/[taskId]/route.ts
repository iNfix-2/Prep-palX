import type { NextRequest } from "next/server";
import type { UpdateTaskStatusRequestDto } from "@/lib/features/tasks/types";
import { apiError, apiOk } from "@/lib/server/api-response";
import { getRequestAuthContext } from "@/lib/server/auth-context";
import { getTaskDetail, updateTaskStatus } from "@/lib/server/tasks-service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> },
) {
  const { taskId } = await params;
  const result = getTaskDetail(getRequestAuthContext(request), taskId);

  if (!result.ok) {
    return apiError(result.code, result.message, result.status, result.fields);
  }

  return apiOk(result.data);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> },
) {
  const { taskId } = await params;
  const body = (await request.json().catch(() => null)) as UpdateTaskStatusRequestDto | null;

  if (!body) {
    return apiError("VALIDATION_ERROR", "Request body must be valid JSON.", 400);
  }

  const result = updateTaskStatus(getRequestAuthContext(request), taskId, body);

  if (!result.ok) {
    return apiError(result.code, result.message, result.status, result.fields);
  }

  return apiOk(result.data);
}
