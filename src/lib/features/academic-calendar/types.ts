import type { WorkspaceSummaryDto } from "@/lib/features/classes/types";

export type AcademicCalendarEventType =
  | "term"
  | "assessment_window"
  | "reporting"
  | "school_event"
  | "holiday"
  | "planning";
export type AcademicCalendarEventStatus = "upcoming" | "active" | "completed" | "at_risk";
export type AcademicCalendarVisibility = "workspace" | "class" | "teacher";
export type AcademicCalendarPriority = "normal" | "important" | "urgent";

export interface AcademicCalendarTermDto {
  academicYearName: string;
  termName: string;
  weekNumber: number;
  weekCount: number;
  startDate: string;
  endDate: string;
}

export interface AcademicCalendarEventDto {
  id: string;
  classId?: string;
  classDisplayName?: string;
  subjectName?: string;
  gradeName?: string;
  title: string;
  type: AcademicCalendarEventType;
  status: AcademicCalendarEventStatus;
  visibility: AcademicCalendarVisibility;
  priority: AcademicCalendarPriority;
  startDate: string;
  endDate: string;
  location?: string;
  description: string;
  requiredAction: string;
  linkedTimetableEventId?: string;
  linkedAssessmentId?: string;
  linkedReportClassId?: string;
}

export interface TeacherAcademicCalendarResponseDto {
  workspace: WorkspaceSummaryDto;
  selectedDate: string;
  term: AcademicCalendarTermDto;
  permissions: {
    canUseAi: boolean;
  };
  events: AcademicCalendarEventDto[];
}

export interface AcademicCalendarEventDetailDto extends AcademicCalendarEventDto {
  workspace: WorkspaceSummaryDto;
  term: AcademicCalendarTermDto;
  ownerName?: string;
  classHref?: string;
  timetableHref?: string;
  assessmentHref?: string;
  reportHref?: string;
}

export interface AcademicCalendarEventCardView {
  id: string;
  href: string;
  title: string;
  scopeLabel: string;
  subjectLabel: string;
  typeLabel: string;
  typeIcon: string;
  typeTone: "primary" | "review" | "approved" | "neutral";
  statusLabel: string;
  statusTone: "draft" | "review" | "approved" | "changes";
  priorityLabel: string;
  priorityTone: "neutral" | "review" | "changes";
  dateRangeLabel: string;
  shortDateLabel: string;
  relativeLabel: string;
  locationLabel: string;
  description: string;
  requiredAction: string;
}

export interface AcademicCalendarPageView {
  workspaceName: string;
  termLabel: string;
  selectedDateLabel: string;
  termRangeLabel: string;
  termWeekLabel: string;
  totalEvents: number;
  upcomingCount: number;
  assessmentWindowCount: number;
  atRiskCount: number;
  canUseAi: boolean;
  events: AcademicCalendarEventCardView[];
}

export interface AcademicCalendarEventDetailView extends AcademicCalendarEventCardView {
  workspaceName: string;
  ownerName: string;
  startLabel: string;
  endLabel: string;
  termLabel: string;
  termWeekLabel: string;
  classHref?: string;
  timetableHref?: string;
  assessmentHref?: string;
  reportHref?: string;
}
