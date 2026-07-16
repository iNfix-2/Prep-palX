import type { WorkspaceSummaryDto } from "@/lib/features/classes/types";

export type DashboardTone = "primary" | "review" | "approved" | "changes" | "neutral" | "ai";
export type DashboardActionVariant = "primary" | "ai" | "secondary";
export type DashboardScheduleVariant = "default" | "current" | "break";

export interface DashboardUserDto {
  id: string;
  displayName: string;
  shortName: string;
  email: string;
}

export interface DashboardMetricDto {
  id: string;
  label: string;
  value: string;
  detail: string;
  icon: string;
  tone: DashboardTone;
}

export interface DashboardActionDto {
  id: string;
  label: string;
  detail: string;
  href: string;
  icon: string;
  variant: DashboardActionVariant;
}

export interface DashboardScheduleItemDto {
  id: string;
  title: string;
  detail: string;
  timeLabel: string;
  location: string;
  href?: string;
  icon: string;
  variant: DashboardScheduleVariant;
}

export interface DashboardTaskDto {
  id: string;
  title: string;
  detail: string;
  href: string;
  priorityLabel: string;
  tone: DashboardTone;
  sourceLabel?: string;
}

export interface DashboardClassProgressDto {
  id: string;
  title: string;
  href: string;
  subject: string;
  learnerCount: number;
  readinessPercent: number;
  curriculumProgressPercent: number;
  attentionCount: number;
}

export interface DashboardRecentWorkDto {
  id: string;
  title: string;
  detail: string;
  href: string;
  icon: string;
  updatedAt: string;
}

export interface DashboardInsightDto {
  message: string;
  actionLabel: string;
  href: string;
}

export interface TeacherDashboardDto {
  workspace: WorkspaceSummaryDto;
  user: DashboardUserDto;
  today: string;
  generatedAt: string;
  permissions: {
    canUseAi: boolean;
    canCreateAssessment: boolean;
    canCreateLessonPlan: boolean;
    canViewTasks: boolean;
    canViewSupport: boolean;
  };
  metrics: DashboardMetricDto[];
  actions: DashboardActionDto[];
  nextEvent?: DashboardScheduleItemDto;
  schedule: DashboardScheduleItemDto[];
  urgentTasks: DashboardTaskDto[];
  classProgress: DashboardClassProgressDto[];
  recentWork: DashboardRecentWorkDto[];
  insight: DashboardInsightDto;
}

export type DashboardMetricView = DashboardMetricDto;

export type DashboardActionView = DashboardActionDto;

export type DashboardScheduleItemView = DashboardScheduleItemDto;

export type DashboardTaskView = DashboardTaskDto;

export interface DashboardClassProgressView extends DashboardClassProgressDto {
  learnerLabel: string;
  attentionLabel: string;
}

export interface DashboardRecentWorkView extends DashboardRecentWorkDto {
  updatedLabel: string;
}

export interface TeacherDashboardView {
  teacherName: string;
  workspaceName: string;
  sessionLabel: string;
  todayLabel: string;
  metrics: DashboardMetricView[];
  actions: DashboardActionView[];
  nextEvent?: DashboardScheduleItemView;
  schedule: DashboardScheduleItemView[];
  urgentTasks: DashboardTaskView[];
  classProgress: DashboardClassProgressView[];
  recentWork: DashboardRecentWorkView[];
  insight: DashboardInsightDto;
  canUseAi: boolean;
}
