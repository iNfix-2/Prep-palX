import type { WorkspaceSummaryDto } from "@/lib/features/classes/types";

export type AttendanceStatus = "present" | "absent" | "late" | "excused";
export type AttendanceRegisterStatus = "complete" | "partial" | "pending";

export interface AttendanceCountsDto {
  present: number;
  absent: number;
  late: number;
  excused: number;
  pending: number;
}

export interface AttendanceClassSummaryDto {
  id: string;
  displayName: string;
  gradeName: string;
  subjectName: string;
  room: string;
  scheduleLabel: string;
  date: string;
  learnerCount: number;
  markedCount: number;
  status: AttendanceRegisterStatus;
  counts: AttendanceCountsDto;
}

export interface TeacherAttendanceResponseDto {
  workspace: WorkspaceSummaryDto;
  date: string;
  permissions: {
    canRecordAttendance: boolean;
    canViewReports: boolean;
  };
  classes: AttendanceClassSummaryDto[];
}

export interface AttendanceLearnerRecordDto {
  learnerId: string;
  displayName: string;
  admissionNo: string;
  status: AttendanceStatus;
  note: string;
  isMarked: boolean;
  lastScore: number;
  attendancePercent: number;
}

export interface AttendanceRegisterDto extends AttendanceClassSummaryDto {
  workspace: WorkspaceSummaryDto;
  currentUnit: string;
  learners: AttendanceLearnerRecordDto[];
}

export interface MarkAttendanceEntryDto {
  learnerId: string;
  status: AttendanceStatus;
  note?: string;
}

export interface MarkAttendanceRequestDto {
  date?: string;
  records: MarkAttendanceEntryDto[];
}

export interface AttendanceClassCardView {
  id: string;
  href: string;
  title: string;
  meta: string;
  room: string;
  learnerLabel: string;
  markedLabel: string;
  statusLabel: string;
  statusTone: "approved" | "review" | "draft";
  counts: AttendanceCountsDto;
}

export interface AttendancePageView {
  workspaceName: string;
  dateLabel: string;
  totalClasses: number;
  totalLearners: number;
  totalPresent: number;
  totalAbsent: number;
  totalLate: number;
  totalPending: number;
  canRecordAttendance: boolean;
  canViewReports: boolean;
  classes: AttendanceClassCardView[];
}

export interface AttendanceRegisterView {
  id: string;
  title: string;
  workspaceName: string;
  dateLabel: string;
  room: string;
  scheduleLabel: string;
  learnerCount: number;
  markedCount: number;
  currentUnit: string;
  statusLabel: string;
  statusTone: "approved" | "review" | "draft";
  counts: AttendanceCountsDto;
  learners: AttendanceLearnerRecordDto[];
}
