import type {
  AssistantConversationDto,
  AssistantConversationView,
  AssistantMessageDto,
  AssistantMessageView,
  AssistantProposalDto,
  AssistantProposalView,
  AssistantWorkspaceDto,
  AssistantWorkspaceView,
} from "@/lib/features/assistant/types";

export function toAssistantWorkspaceView(dto: AssistantWorkspaceDto): AssistantWorkspaceView {
  return {
    ...dto,
    conversations: dto.conversations.map(toAssistantConversationView),
    messages: dto.messages.map(toAssistantMessageView),
  };
}

export function toAssistantProposalView(dto: AssistantProposalDto): AssistantProposalView {
  return {
    ...dto,
    userMessage: toAssistantMessageView(dto.userMessage),
    assistantMessage: toAssistantMessageView(dto.assistantMessage),
    auditLabel: `Demo AI / ${formatTime(dto.audit.createdAt)}`,
  };
}

function toAssistantConversationView(dto: AssistantConversationDto): AssistantConversationView {
  return {
    ...dto,
    updatedLabel: formatTime(dto.updatedAt),
  };
}

function toAssistantMessageView(dto: AssistantMessageDto): AssistantMessageView {
  return {
    ...dto,
    createdLabel: formatTime(dto.createdAt),
  };
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(new Date(value));
}
