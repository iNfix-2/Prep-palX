import type { WorkspaceSummaryDto } from "@/lib/features/classes/types";

export type SupportGuideCategory =
  | "getting_started"
  | "assessment"
  | "reports"
  | "ai"
  | "account"
  | "troubleshooting";
export type SupportRequestStatus = "open" | "waiting_support" | "waiting_teacher" | "resolved";
export type SupportRequestPriority = "low" | "medium" | "high";

export interface SupportGuideDto {
  id: string;
  title: string;
  summary: string;
  category: SupportGuideCategory;
  readMinutes: number;
  updatedAt: string;
  tags: string[];
  href?: string;
}

export interface SupportRequestDto {
  id: string;
  workspaceId: string;
  title: string;
  summary: string;
  category: SupportGuideCategory;
  status: SupportRequestStatus;
  priority: SupportRequestPriority;
  createdByName: string;
  assignedSupportName?: string;
  sourceHref?: string;
  sourceLabel?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  messageCount: number;
}

export interface SupportMessageDto {
  id: string;
  authorName: string;
  authorRole: string;
  body: string;
  createdAt: string;
}

export interface HelpCentreResponseDto {
  workspace: WorkspaceSummaryDto;
  permissions: {
    canCreateSupportRequest: boolean;
    canManageSupport: boolean;
    canUseAi: boolean;
  };
  guides: SupportGuideDto[];
  requests: SupportRequestDto[];
}

export interface SupportRequestDetailDto extends SupportRequestDto {
  workspace: WorkspaceSummaryDto;
  permissions: {
    canAddMessage: boolean;
    canManageSupport: boolean;
    canUseAi: boolean;
  };
  messages: SupportMessageDto[];
}

export interface CreateSupportRequestDto {
  title: string;
  summary: string;
  category: SupportGuideCategory;
  priority: SupportRequestPriority;
  sourceHref?: string;
  sourceLabel?: string;
}

export interface AddSupportMessageDto {
  body: string;
  status?: SupportRequestStatus;
}

export interface SupportGuideView {
  id: string;
  title: string;
  summary: string;
  categoryLabel: string;
  categoryIcon: string;
  readLabel: string;
  updatedLabel: string;
  tags: string[];
  href?: string;
}

export interface SupportRequestCardView {
  id: string;
  href: string;
  title: string;
  summary: string;
  categoryLabel: string;
  categoryIcon: string;
  statusLabel: string;
  statusTone: "approved" | "review" | "draft" | "changes";
  priorityLabel: string;
  priorityTone: "approved" | "review" | "draft" | "changes";
  createdByLabel: string;
  assignedSupportLabel: string;
  updatedLabel: string;
  messageLabel: string;
  sourceHref?: string;
  sourceLabel?: string;
}

export interface HelpCentrePageView {
  workspaceName: string;
  guideCount: number;
  openRequestCount: number;
  resolvedRequestCount: number;
  canCreateSupportRequest: boolean;
  canManageSupport: boolean;
  canUseAi: boolean;
  guides: SupportGuideView[];
  requests: SupportRequestCardView[];
}

export interface SupportRequestDetailView extends SupportRequestCardView {
  workspaceName: string;
  createdLabel: string;
  resolvedLabel?: string;
  canAddMessage: boolean;
  canManageSupport: boolean;
  canUseAi: boolean;
  messages: SupportMessageDto[];
}
