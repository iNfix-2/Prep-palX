import type { WorkspaceSummaryDto } from "@/lib/features/classes/types";

export type TaskStatus = "open" | "in_progress" | "blocked" | "done";
export type TaskPriority = "low" | "medium" | "high" | "urgent";
export type TaskCategory =
  | "lesson"
  | "assessment"
  | "grading"
  | "attendance"
  | "report"
  | "approval"
  | "resource"
  | "guardian_follow_up"
  | "admin";

export interface TaskActivityDto {
  id: string;
  authorName: string;
  authorRole: string;
  body: string;
  createdAt: string;
}

export interface TeacherTaskDto {
  id: string;
  workspaceId: string;
  classId?: string;
  classDisplayName?: string;
  subjectName?: string;
  gradeName?: string;
  ownerName: string;
  assignedName: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: TaskCategory;
  dueAt: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  blockedReason?: string;
  sourceHref?: string;
  sourceLabel?: string;
  aiSuggested: boolean;
}

export interface TaskDetailDto extends TeacherTaskDto {
  workspace: WorkspaceSummaryDto;
  permissions: {
    canManageTasks: boolean;
    canUseAi: boolean;
  };
  classHref?: string;
  activities: TaskActivityDto[];
}

export interface TeacherTasksResponseDto {
  workspace: WorkspaceSummaryDto;
  permissions: {
    canManageTasks: boolean;
    canUseAi: boolean;
  };
  tasks: TeacherTaskDto[];
}

export interface UpdateTaskStatusRequestDto {
  status: TaskStatus;
  note?: string;
}

export interface TaskCardView {
  id: string;
  href: string;
  title: string;
  description: string;
  status: TaskStatus;
  classLabel: string;
  ownerLabel: string;
  assignedLabel: string;
  categoryLabel: string;
  categoryIcon: string;
  statusLabel: string;
  statusTone: "approved" | "review" | "draft" | "changes";
  priorityLabel: string;
  priorityTone: "approved" | "review" | "draft" | "changes";
  dueLabel: string;
  sourceLabel?: string;
  sourceHref?: string;
  aiSuggested: boolean;
}

export interface TasksPageView {
  workspaceName: string;
  totalTasks: number;
  openCount: number;
  dueTodayCount: number;
  blockedCount: number;
  completedCount: number;
  canManageTasks: boolean;
  canUseAi: boolean;
  tasks: TaskCardView[];
}

export interface TaskDetailView extends TaskCardView {
  workspaceName: string;
  createdLabel: string;
  updatedLabel: string;
  completedLabel?: string;
  blockedReason?: string;
  canManageTasks: boolean;
  canUseAi: boolean;
  classHref?: string;
  activities: TaskActivityDto[];
}
