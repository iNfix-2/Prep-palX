import type { WorkspaceSummaryDto } from "@/lib/features/classes/types";

export type TimetableEventType = "lesson" | "assessment" | "duty" | "meeting";
export type TimetableEventStatus = "scheduled" | "in_progress" | "completed" | "conflict";
export type TimetablePreparationStatus = "ready" | "needs_preparation" | "blocked";

export interface TimetableEventDto {
  id: string;
  classId?: string;
  classDisplayName?: string;
  subjectName?: string;
  gradeName?: string;
  title: string;
  type: TimetableEventType;
  status: TimetableEventStatus;
  preparationStatus: TimetablePreparationStatus;
  startAt: string;
  endAt: string;
  location: string;
  notes: string;
  linkedLessonPlanId?: string;
  linkedAssessmentId?: string;
}

export interface TeacherTimetableResponseDto {
  workspace: WorkspaceSummaryDto;
  selectedDate: string;
  permissions: {
    canUseAi: boolean;
  };
  events: TimetableEventDto[];
}

export interface TimetableEventDetailDto extends TimetableEventDto {
  workspace: WorkspaceSummaryDto;
  teacherName: string;
  classHref?: string;
  lessonPlanHref?: string;
  assessmentHref?: string;
}

export interface TimetableEventCardView {
  id: string;
  href: string;
  title: string;
  classLabel: string;
  subjectLabel: string;
  typeLabel: string;
  typeTone: "primary" | "review" | "approved" | "neutral";
  statusLabel: string;
  statusTone: "draft" | "review" | "approved" | "changes";
  preparationLabel: string;
  preparationTone: "approved" | "review" | "changes";
  timeRangeLabel: string;
  locationLabel: string;
  notes: string;
}

export interface TimetablePageView {
  workspaceName: string;
  selectedDateLabel: string;
  totalEvents: number;
  teachingBlockCount: number;
  preparationIssueCount: number;
  locationCount: number;
  canUseAi: boolean;
  events: TimetableEventCardView[];
}

export interface TimetableEventDetailView extends TimetableEventCardView {
  workspaceName: string;
  teacherName: string;
  dateLabel: string;
  startLabel: string;
  endLabel: string;
  classHref?: string;
  lessonPlanHref?: string;
  assessmentHref?: string;
}
