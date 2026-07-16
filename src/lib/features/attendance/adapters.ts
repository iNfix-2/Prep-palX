import type {
  AttendanceClassCardView,
  AttendanceClassSummaryDto,
  AttendancePageView,
  AttendanceRegisterDto,
  AttendanceRegisterView,
  TeacherAttendanceResponseDto,
} from "@/lib/features/attendance/types";

export function toAttendancePageView(
  dto: TeacherAttendanceResponseDto,
): AttendancePageView {
  return {
    workspaceName: dto.workspace.name,
    dateLabel: formatDateLabel(dto.date),
    totalClasses: dto.classes.length,
    totalLearners: dto.classes.reduce((sum, item) => sum + item.learnerCount, 0),
    totalPresent: dto.classes.reduce((sum, item) => sum + item.counts.present, 0),
    totalAbsent: dto.classes.reduce((sum, item) => sum + item.counts.absent, 0),
    totalLate: dto.classes.reduce((sum, item) => sum + item.counts.late, 0),
    totalPending: dto.classes.reduce((sum, item) => sum + item.counts.pending, 0),
    canRecordAttendance: dto.permissions.canRecordAttendance,
    canViewReports: dto.permissions.canViewReports,
    classes: dto.classes.map(toAttendanceClassCardView),
  };
}

export function toAttendanceClassCardView(
  dto: AttendanceClassSummaryDto,
): AttendanceClassCardView {
  const toneByStatus = {
    complete: "approved",
    partial: "review",
    pending: "draft",
  } as const;
  const labelByStatus = {
    complete: "Marked",
    partial: "In progress",
    pending: "Pending",
  } as const;

  return {
    id: dto.id,
    href: `/attendance/${dto.id}`,
    title: dto.displayName,
    meta: dto.scheduleLabel,
    room: dto.room,
    learnerLabel: `${dto.learnerCount} learner${dto.learnerCount === 1 ? "" : "s"}`,
    markedLabel: `${dto.markedCount}/${dto.learnerCount} marked`,
    statusLabel: labelByStatus[dto.status],
    statusTone: toneByStatus[dto.status],
    counts: dto.counts,
  };
}

export function toAttendanceRegisterView(
  dto: AttendanceRegisterDto,
): AttendanceRegisterView {
  const toneByStatus = {
    complete: "approved",
    partial: "review",
    pending: "draft",
  } as const;
  const labelByStatus = {
    complete: "Register marked",
    partial: "Register in progress",
    pending: "Register pending",
  } as const;

  return {
    id: dto.id,
    title: dto.displayName,
    workspaceName: dto.workspace.name,
    dateLabel: formatDateLabel(dto.date),
    room: dto.room,
    scheduleLabel: dto.scheduleLabel,
    learnerCount: dto.learnerCount,
    markedCount: dto.markedCount,
    currentUnit: dto.currentUnit,
    statusLabel: labelByStatus[dto.status],
    statusTone: toneByStatus[dto.status],
    counts: dto.counts,
    learners: dto.learners,
  };
}

function formatDateLabel(date: string) {
  return new Intl.DateTimeFormat("en", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00.000Z`));
}
