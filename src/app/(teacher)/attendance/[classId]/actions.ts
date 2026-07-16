"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type {
  AttendanceStatus,
  MarkAttendanceEntryDto,
} from "@/lib/features/attendance/types";
import { getPageAuthContext } from "@/lib/server/auth-context";
import { markAttendance } from "@/lib/server/attendance-service";

const supportedStatuses: AttendanceStatus[] = ["present", "absent", "late", "excused"];

export async function saveAttendanceAction(classId: string, formData: FormData) {
  const records = collectAttendanceRecords(formData);
  const result = markAttendance(await getPageAuthContext(), classId, { records });

  if (!result.ok) {
    redirect(`/attendance/${classId}?error=${result.code}`);
  }

  revalidatePath("/attendance");
  revalidatePath(`/attendance/${classId}`);
  redirect(`/attendance/${classId}?saved=1`);
}

function collectAttendanceRecords(formData: FormData): MarkAttendanceEntryDto[] {
  const records: MarkAttendanceEntryDto[] = [];

  for (const [key, value] of formData.entries()) {
    if (!key.startsWith("status:")) {
      continue;
    }

    const learnerId = key.replace("status:", "");
    const status = String(value);

    if (!isAttendanceStatus(status)) {
      continue;
    }

    const note = String(formData.get(`note:${learnerId}`) ?? "").trim();

    records.push({
      learnerId,
      status,
      ...(note ? { note } : {}),
    });
  }

  return records;
}

function isAttendanceStatus(value: string): value is AttendanceStatus {
  return supportedStatuses.includes(value as AttendanceStatus);
}
