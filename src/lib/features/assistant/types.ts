import type { WorkspaceSummaryDto } from "@/lib/features/classes/types";

export type AssistantConversationIcon =
  | "smart_toy"
  | "description"
  | "auto_stories"
  | "grade"
  | "calendar_today";
export type AssistantQuickActionTone = "ai" | "primary" | "neutral";
export type AssistantSourceTone = "ai" | "primary" | "warning";
export type AssistantMessageRole = "assistant" | "user";
export type AssistantActionKind =
  | "open_link"
  | "draft_lesson"
  | "draft_assessment"
  | "create_task";
export type AssistantActionImpact = "low" | "medium" | "high";
export type AssistantActionStatus = "needs_confirmation" | "queued" | "draft";

export interface AssistantUserDto {
  id: string;
  displayName: string;
  shortName: string;
  email: string;
}

export interface AssistantConversationDto {
  id: string;
  title: string;
  summary: string;
  updatedAt: string;
  icon: AssistantConversationIcon;
  active: boolean;
}

export interface AssistantMessageDto {
  id: string;
  role: AssistantMessageRole;
  body: string;
  createdAt: string;
  sourceIds: string[];
}

export interface AssistantQuickActionDto {
  id: string;
  title: string;
  description: string;
  icon: string;
  tone: AssistantQuickActionTone;
  prompt: string;
}

export interface AssistantContextCardDto {
  id: string;
  label: string;
  value: string;
  detail: string;
  icon: string;
  href?: string;
}

export interface AssistantSourceDto {
  id: string;
  title: string;
  type: string;
  detail: string;
  href: string;
  icon: string;
  tone: AssistantSourceTone;
  selected: boolean;
}

export interface AssistantUsageDto {
  used: number;
  limit: number;
  percent: number;
  resetLabel: string;
  confirmationMode: "always" | "high_impact" | "manual";
  sourceAccessEnabled: boolean;
}

export interface AssistantSuggestedActionDto {
  id: string;
  label: string;
  detail: string;
  href: string;
  icon: string;
  kind: AssistantActionKind;
  impact: AssistantActionImpact;
  status: AssistantActionStatus;
}

export interface AssistantAuditDto {
  id: string;
  provider: "demo-assistant";
  modelLabel: string;
  createdAt: string;
  confirmationMode: AssistantUsageDto["confirmationMode"];
  tenantScoped: boolean;
}

export interface AssistantProposalDto {
  id: string;
  conversationId: string;
  userMessage: AssistantMessageDto;
  assistantMessage: AssistantMessageDto;
  suggestedActions: AssistantSuggestedActionDto[];
  sourceIds: string[];
  requiresConfirmation: boolean;
  audit: AssistantAuditDto;
}

export interface AssistantWorkspaceDto {
  workspace: WorkspaceSummaryDto;
  user: AssistantUserDto;
  permissions: {
    canUseAi: boolean;
    canCreateLessonPlan: boolean;
    canCreateAssessment: boolean;
    canCreateTask: boolean;
  };
  conversations: AssistantConversationDto[];
  activeConversationId: string;
  messages: AssistantMessageDto[];
  quickActions: AssistantQuickActionDto[];
  context: AssistantContextCardDto[];
  activeTags: string[];
  sources: AssistantSourceDto[];
  usage: AssistantUsageDto;
  suggestedPrompt: string;
  disclaimer: string;
}

export interface CreateAssistantProposalDto {
  prompt: string;
  quickActionId?: string;
  sourceIds?: string[];
  contextTags?: string[];
}

export interface AssistantMessageView extends AssistantMessageDto {
  createdLabel: string;
}

export interface AssistantConversationView extends AssistantConversationDto {
  updatedLabel: string;
}

export interface AssistantProposalView extends Omit<AssistantProposalDto, "userMessage" | "assistantMessage"> {
  userMessage: AssistantMessageView;
  assistantMessage: AssistantMessageView;
  auditLabel: string;
}

export interface AssistantWorkspaceView
  extends Omit<AssistantWorkspaceDto, "conversations" | "messages"> {
  conversations: AssistantConversationView[];
  messages: AssistantMessageView[];
}
