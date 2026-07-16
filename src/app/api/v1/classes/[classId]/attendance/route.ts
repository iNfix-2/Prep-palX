import type { NextRequest } from "next/server";
import type { MarkAttendanceRequestDto } from "@/lib/features/attendance/types";
import { apiError, apiOk } from "@/lib/server/api-response";
import { getRequestAuthContext } from "@/lib/server/auth-context";
import {
  getAttendanceRegister,
  markAttendance,
} from "@/lib/server/attendance-service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ classId: string }> },
) {
  const { classId } = await params;
  const result = getAttendanceRegister(getRequestAuthContext(request), classId);

  if (!result.ok) {
    return apiError(result.code, result.message, result.status, result.fields);
  }

  return apiOk(result.data);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ classId: string }> },
) {
  const { classId } = await params;
  const body = (await request.json().catch(() => null)) as MarkAttendanceRequestDto | null;

  if (!body) {
    return apiError("VALIDATION_ERROR", "Request body must be valid JSON.", 400);
  }

  const result = markAttendance(getRequestAuthContext(request), classId, body);

  if (!result.ok) {
    return apiError(result.code, result.message, result.status, result.fields);
  }

  return apiOk(result.data);
}
