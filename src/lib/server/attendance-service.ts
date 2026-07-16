import type {
  AttendanceClassSummaryDto,
  AttendanceCountsDto,
  AttendanceRegisterDto,
  AttendanceStatus,
  MarkAttendanceEntryDto,
  MarkAttendanceRequestDto,
  TeacherAttendanceResponseDto,
} from "@/lib/features/attendance/types";
import type { WorkspaceSummaryDto } from "@/lib/features/classes/types";
import { hasAnyPermission, hasPermission } from "@/lib/security/permissions";
import type { RequestAuthContext } from "@/lib/server/auth-context";
import {
  DEMO_TODAY,
  demoClasses,
  demoLearners,
  getAttendanceRecordsForClass,
  upsertDemoAttendanceRecords,
  type DemoAttendanceRecord,
  type DemoClass,
  type DemoLearner,
} from "@/lib/server/demo-store";

export type AttendanceServiceErrorStatus = 400 | 401 | 403 | 404;

export type AttendanceServiceResult<T> =
  | { ok: true; data: T }
  | {
      ok: false;
      status: AttendanceServiceErrorStatus;
      code: "AUTH_REQUIRED" | "FORBIDDEN" | "NOT_FOUND" | "VALIDATION_ERROR";
      message: string;
      fields?: Record<string, string[]>;
    };

type AuthenticatedContext = Extract<RequestAuthContext, { status: "authenticated" }>;

const attendanceStatuses: AttendanceStatus[] = ["present", "absent", "late", "excused"];

export function listTeacherAttendance(
  context: RequestAuthContext,
  date = DEMO_TODAY,
): AttendanceServiceResult<TeacherAttendanceResponseDto> {
  if (context.status === "unauthenticated") {
    return authRequired();
  }

  if (
    !hasAnyPermission(context.activeMembership, [
      "attendance.record",
      "attendance.view_reports",
    ])
  ) {
    return forbidden("You do not have permission to view attendance.");
  }

  const canManageClasses = hasPermission(context.activeMembership, "class.manage");
  const classes = demoClasses
    .filter((classRecord) => classRecord.workspaceId === context.activeWorkspace.id)
    .filter(
      (classRecord) =>
        canManageClasses || classRecord.assignedMembershipIds.includes(context.activeMembership.id),
    )
    .sort((a, b) => a.displayName.localeCompare(b.displayName));

  return {
    ok: true,
    data: {
      workspace: toWorkspaceSummary(context),
      date,
      permissions: {
        canRecordAttendance: hasPermission(context.activeMembership, "attendance.record"),
        canViewReports: hasPermission(context.activeMembership, "attendance.view_reports"),
      },
      classes: classes.map((classRecord) => toAttendanceClassSummaryDto(classRecord, date)),
    },
  };
}

export function getAttendanceRegister(
  context: RequestAuthContext,
  classId: string,
  date = DEMO_TODAY,
): AttendanceServiceResult<AttendanceRegisterDto> {
  const access = getAccessibleClass(context, classId, "view");

  if (!access.ok) {
    return access;
  }

  const { classRecord, context: authenticatedContext } = access.data;

  return {
    ok: true,
    data: {
      ...toAttendanceClassSummaryDto(classRecord, date),
      workspace: toWorkspaceSummary(authenticatedContext),
      currentUnit: classRecord.currentUnit,
      learners: classRecord.learnerIds
        .map((learnerId) => demoLearners.find((learner) => learner.id === learnerId))
        .filter(isDefined)
        .map((learner) => toAttendanceLearnerRecord(learner, classRecord.id, date)),
    },
  };
}

export function markAttendance(
  context: RequestAuthContext,
  classId: string,
  request: MarkAttendanceRequestDto,
): AttendanceServiceResult<AttendanceRegisterDto> {
  const access = getAccessibleClass(context, classId, "record");

  if (!access.ok) {
    return access;
  }

  const { classRecord, context: authenticatedContext } = access.data;
  const date = request.date ?? DEMO_TODAY;
  const validation = validateAttendanceEntries(classRecord, request.records);

  if (!validation.ok) {
    return validation;
  }

  upsertDemoAttendanceRecords(
    request.records.map((record) => ({
      workspaceId: classRecord.workspaceId,
      classId: classRecord.id,
      learnerId: record.learnerId,
      date,
      status: record.status,
      note: normalizeNote(record.note),
      markedByMembershipId: authenticatedContext.activeMembership.id,
    })),
  );

  return getAttendanceRegister(context, classId, date);
}

function getAccessibleClass(
  context: RequestAuthContext,
  classId: string,
  mode: "view" | "record",
): AttendanceServiceResult<{ classRecord: DemoClass; context: AuthenticatedContext }> {
  if (context.status === "unauthenticated") {
    return authRequired();
  }

  const requiredPermission =
    mode === "record"
      ? "attendance.record"
      : hasAnyPermission(context.activeMembership, [
          "attendance.record",
          "attendance.view_reports",
        ]);

  if (requiredPermission === "attendance.record") {
    if (!hasPermission(context.activeMembership, "attendance.record")) {
      return forbidden("You do not have permission to record attendance.");
    }
  } else if (!requiredPermission) {
    return forbidden("You do not have permission to view attendance.");
  }

  const classRecord = demoClasses.find((candidate) => candidate.id === classId);

  if (!classRecord || classRecord.workspaceId !== context.activeWorkspace.id) {
    return notFound();
  }

  const canManageClasses = hasPermission(context.activeMembership, "class.manage");

  if (
    !canManageClasses &&
    !classRecord.assignedMembershipIds.includes(context.activeMembership.id)
  ) {
    return forbidden("This class is outside your assigned teaching scope.");
  }

  return { ok: true, data: { classRecord, context } };
}

function toAttendanceClassSummaryDto(
  classRecord: DemoClass,
  date: string,
): AttendanceClassSummaryDto {
  const records = getAttendanceRecordsForClass(classRecord.id, date);
  const counts = getAttendanceCounts(classRecord, records);
  const markedCount = records.filter((record) =>
    classRecord.learnerIds.includes(record.learnerId),
  ).length;
  const status =
    markedCount === 0 ? "pending" : counts.pending > 0 ? "partial" : "complete";

  return {
    id: classRecord.id,
    displayName: classRecord.displayName,
    gradeName: classRecord.gradeName,
    subjectName: classRecord.subjectName,
    room: classRecord.room,
    scheduleLabel: classRecord.scheduleLabel,
    date,
    learnerCount: classRecord.learnerIds.length,
    markedCount,
    status,
    counts,
  };
}

function toAttendanceLearnerRecord(
  learner: DemoLearner,
  classId: string,
  date: string,
) {
  const record = getAttendanceRecordsForClass(classId, date).find(
    (candidate) => candidate.learnerId === learner.id,
  );

  return {
    learnerId: learner.id,
    displayName: learner.displayName,
    admissionNo: learner.admissionNo,
    status: record?.status ?? "present",
    note: record?.note ?? "",
    isMarked: Boolean(record),
    lastScore: learner.lastScore,
    attendancePercent: learner.attendancePercent,
  };
}

function getAttendanceCounts(
  classRecord: DemoClass,
  records: DemoAttendanceRecord[],
): AttendanceCountsDto {
  const inClassRecords = records.filter((record) =>
    classRecord.learnerIds.includes(record.learnerId),
  );

  return {
    present: inClassRecords.filter((record) => record.status === "present").length,
    absent: inClassRecords.filter((record) => record.status === "absent").length,
    late: inClassRecords.filter((record) => record.status === "late").length,
    excused: inClassRecords.filter((record) => record.status === "excused").length,
    pending: classRecord.learnerIds.length - inClassRecords.length,
  };
}

function validateAttendanceEntries(
  classRecord: DemoClass,
  records: MarkAttendanceEntryDto[],
): AttendanceServiceResult<{ valid: true }> {
  const fields: Record<string, string[]> = {};

  if (!Array.isArray(records) || records.length === 0) {
    fields.records = ["At least one attendance record is required."];
  }

  records.forEach((record, index) => {
    if (!classRecord.learnerIds.includes(record.learnerId)) {
      fields[`records.${index}.learnerId`] = ["Learner is not enrolled in this class."];
    }

    if (!attendanceStatuses.includes(record.status)) {
      fields[`records.${index}.status`] = ["Attendance status is not supported."];
    }
  });

  if (Object.keys(fields).length > 0) {
    return {
      ok: false,
      status: 400,
      code: "VALIDATION_ERROR",
      message: "Attendance records could not be saved.",
      fields,
    };
  }

  return { ok: true, data: { valid: true } };
}

function toWorkspaceSummary(context: AuthenticatedContext) {
  return {
    id: context.activeWorkspace.id,
    name: context.activeWorkspace.name,
    academicYearName: context.activeWorkspace.currentAcademicYearName,
    termName: context.activeWorkspace.currentTermName,
  } satisfies WorkspaceSummaryDto;
}

function authRequired(): AttendanceServiceResult<never> {
  return {
    ok: false,
    status: 401,
    code: "AUTH_REQUIRED",
    message: "Sign in to continue.",
  };
}

function forbidden(message: string): AttendanceServiceResult<never> {
  return {
    ok: false,
    status: 403,
    code: "FORBIDDEN",
    message,
  };
}

function notFound(): AttendanceServiceResult<never> {
  return {
    ok: false,
    status: 404,
    code: "NOT_FOUND",
    message: "Class was not found in the active workspace.",
  };
}

function normalizeNote(note: string | undefined) {
  const normalized = note?.trim();
  return normalized ? normalized : undefined;
}

function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}
