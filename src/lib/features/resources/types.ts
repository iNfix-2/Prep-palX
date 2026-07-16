import type { WorkspaceSummaryDto } from "@/lib/features/classes/types";

export type ResourceType = "worksheet" | "slide_deck" | "rubric" | "guide" | "link" | "video";
export type ResourceStatus = "ready" | "draft" | "needs_tags" | "archived";
export type ResourceVisibility = "workspace" | "class" | "teacher";
export type ResourceOrigin = "uploaded" | "ai_generated" | "shared";
export type ResourceFileKind = "pdf" | "doc" | "slides" | "link" | "video" | "image";

export interface ResourceDto {
  id: string;
  classId?: string;
  classDisplayName?: string;
  subjectName?: string;
  gradeName?: string;
  title: string;
  type: ResourceType;
  status: ResourceStatus;
  visibility: ResourceVisibility;
  origin: ResourceOrigin;
  fileKind: ResourceFileKind;
  description: string;
  tags: string[];
  sizeLabel: string;
  usageCount: number;
  updatedAt: string;
  lastUsedAt?: string;
  url?: string;
  linkedLessonPlanId?: string;
  linkedAssessmentId?: string;
  linkedQuestionId?: string;
}

export interface TeacherResourcesResponseDto {
  workspace: WorkspaceSummaryDto;
  permissions: {
    canManageResources: boolean;
    canUseAi: boolean;
  };
  resources: ResourceDto[];
}

export interface ResourceDetailDto extends ResourceDto {
  workspace: WorkspaceSummaryDto;
  ownerName?: string;
  classHref?: string;
  lessonPlanHref?: string;
  assessmentHref?: string;
  questionHref?: string;
}

export interface ResourceCardView {
  id: string;
  href: string;
  title: string;
  scopeLabel: string;
  subjectLabel: string;
  typeLabel: string;
  typeIcon: string;
  typeTone: "primary" | "review" | "approved" | "neutral" | "ai";
  statusLabel: string;
  statusTone: "draft" | "review" | "approved" | "changes";
  originLabel: string;
  originTone: "primary" | "approved" | "ai";
  fileLabel: string;
  fileIcon: string;
  updatedLabel: string;
  lastUsedLabel: string;
  description: string;
  tags: string[];
  usageLabel: string;
  sizeLabel: string;
}

export interface ResourcesPageView {
  workspaceName: string;
  totalResources: number;
  recentlyUsedCount: number;
  sharedCount: number;
  aiGeneratedCount: number;
  needsTagsCount: number;
  canManageResources: boolean;
  canUseAi: boolean;
  resources: ResourceCardView[];
}

export interface ResourceDetailView extends ResourceCardView {
  workspaceName: string;
  ownerName: string;
  classHref?: string;
  lessonPlanHref?: string;
  assessmentHref?: string;
  questionHref?: string;
  externalUrl?: string;
}
