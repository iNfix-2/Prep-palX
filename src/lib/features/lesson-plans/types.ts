import type { WorkspaceSummaryDto } from "@/lib/features/classes/types";

export type LessonPlanStatus = "draft" | "in_review" | "approved";

export interface LessonPlanClassOptionDto {
  id: string;
  displayName: string;
  subjectName: string;
  gradeName: string;
  room: string;
}

export interface LessonPlanListItemDto {
  id: string;
  classId: string;
  classDisplayName: string;
  subjectName: string;
  gradeName: string;
  title: string;
  topic: string;
  status: LessonPlanStatus;
  scheduledFor: string;
  durationMinutes: number;
  readinessPercent: number;
  updatedAt: string;
}

export interface TeacherLessonPlansResponseDto {
  workspace: WorkspaceSummaryDto;
  permissions: {
    canCreateLessonPlan: boolean;
    canUseAi: boolean;
  };
  lessonPlans: LessonPlanListItemDto[];
}

export interface LessonPlanDetailDto extends LessonPlanListItemDto {
  workspace: WorkspaceSummaryDto;
  objectives: string[];
  materials: string[];
  starterActivity: string;
  teachingActivity: string;
  learnerPractice: string;
  assessmentCheck: string;
  differentiation: string;
}

export interface LessonPlanCreateOptionsDto {
  workspace: WorkspaceSummaryDto;
  classes: LessonPlanClassOptionDto[];
}

export interface CreateLessonPlanDto {
  classId: string;
  title: string;
  topic: string;
  scheduledFor: string;
  durationMinutes: number;
  objectives: string[];
  materials: string[];
  starterActivity: string;
  teachingActivity: string;
  learnerPractice: string;
  assessmentCheck: string;
  differentiation: string;
}

export interface LessonPlanCardView {
  id: string;
  href: string;
  title: string;
  classLabel: string;
  topic: string;
  statusLabel: string;
  statusTone: "draft" | "review" | "approved";
  scheduledLabel: string;
  durationLabel: string;
  readinessPercent: number;
}

export interface LessonPlannerPageView {
  workspaceName: string;
  totalPlans: number;
  draftCount: number;
  reviewCount: number;
  approvedCount: number;
  averageReadiness: number;
  canCreateLessonPlan: boolean;
  canUseAi: boolean;
  lessonPlans: LessonPlanCardView[];
}

export interface LessonPlanDetailView {
  id: string;
  title: string;
  classLabel: string;
  topic: string;
  workspaceName: string;
  statusLabel: string;
  statusTone: "draft" | "review" | "approved";
  scheduledLabel: string;
  durationLabel: string;
  readinessPercent: number;
  objectives: string[];
  materials: string[];
  starterActivity: string;
  teachingActivity: string;
  learnerPractice: string;
  assessmentCheck: string;
  differentiation: string;
}
