import type {
  HelpCentrePageView,
  HelpCentreResponseDto,
  SupportGuideDto,
  SupportGuideView,
  SupportRequestCardView,
  SupportRequestDetailDto,
  SupportRequestDetailView,
} from "@/lib/features/help/types";

const categoryView = {
  getting_started: { label: "Getting started", icon: "school" },
  assessment: { label: "Assessment", icon: "assignment" },
  reports: { label: "Reports", icon: "analytics" },
  ai: { label: "AI help", icon: "smart_toy" },
  account: { label: "Account", icon: "person_check" },
  troubleshooting: { label: "Troubleshooting", icon: "help" },
} as const;

const statusView = {
  open: { label: "Open", tone: "review" },
  waiting_support: { label: "Waiting support", tone: "draft" },
  waiting_teacher: { label: "Waiting teacher", tone: "changes" },
  resolved: { label: "Resolved", tone: "approved" },
} as const;

const priorityView = {
  low: { label: "Low", tone: "approved" },
  medium: { label: "Medium", tone: "draft" },
  high: { label: "High", tone: "changes" },
} as const;

export const supportCategoryOptions = [
  { value: "troubleshooting", label: "Troubleshooting" },
  { value: "assessment", label: "Assessment" },
  { value: "reports", label: "Reports" },
  { value: "ai", label: "AI help" },
  { value: "account", label: "Account" },
  { value: "getting_started", label: "Getting started" },
] as const;

export const supportPriorityOptions = [
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
  { value: "high", label: "High" },
] as const;

export const supportStatusOptions = [
  { value: "open", label: "Open" },
  { value: "waiting_support", label: "Waiting support" },
  { value: "waiting_teacher", label: "Waiting teacher" },
  { value: "resolved", label: "Resolved" },
] as const;

export function toHelpCentrePageView(dto: HelpCentreResponseDto): HelpCentrePageView {
  return {
    workspaceName: dto.workspace.name,
    guideCount: dto.guides.length,
    openRequestCount: dto.requests.filter((request) => request.status !== "resolved").length,
    resolvedRequestCount: dto.requests.filter((request) => request.status === "resolved").length,
    canCreateSupportRequest: dto.permissions.canCreateSupportRequest,
    canManageSupport: dto.permissions.canManageSupport,
    canUseAi: dto.permissions.canUseAi,
    guides: dto.guides.map(toSupportGuideView),
    requests: dto.requests.map(toSupportRequestCardView),
  };
}

export function toSupportGuideView(dto: SupportGuideDto): SupportGuideView {
  const category = categoryView[dto.category];

  return {
    id: dto.id,
    title: dto.title,
    summary: dto.summary,
    categoryLabel: category.label,
    categoryIcon: category.icon,
    readLabel: `${dto.readMinutes} min read`,
    updatedLabel: `Updated ${formatDateTime(dto.updatedAt)}`,
    tags: dto.tags,
    href: dto.href,
  };
}

export function toSupportRequestCardView(dto: SupportRequestDetailDto | HelpCentreResponseDto["requests"][number]): SupportRequestCardView {
  const category = categoryView[dto.category];
  const status = statusView[dto.status];
  const priority = priorityView[dto.priority];

  return {
    id: dto.id,
    href: `/help/${dto.id}`,
    title: dto.title,
    summary: dto.summary,
    categoryLabel: category.label,
    categoryIcon: category.icon,
    statusLabel: status.label,
    statusTone: status.tone,
    priorityLabel: priority.label,
    priorityTone: priority.tone,
    createdByLabel: `Opened by ${dto.createdByName}`,
    assignedSupportLabel: dto.assignedSupportName
      ? `Assigned to ${dto.assignedSupportName}`
      : "Unassigned",
    updatedLabel: `Updated ${formatDateTime(dto.updatedAt)}`,
    messageLabel: `${dto.messageCount} messages`,
    sourceHref: dto.sourceHref,
    sourceLabel: dto.sourceLabel,
  };
}

export function toSupportRequestDetailView(
  dto: SupportRequestDetailDto,
): SupportRequestDetailView {
  return {
    ...toSupportRequestCardView(dto),
    workspaceName: dto.workspace.name,
    createdLabel: `Created ${formatDateTime(dto.createdAt)}`,
    resolvedLabel: dto.resolvedAt ? `Resolved ${formatDateTime(dto.resolvedAt)}` : undefined,
    canAddMessage: dto.permissions.canAddMessage,
    canManageSupport: dto.permissions.canManageSupport,
    canUseAi: dto.permissions.canUseAi,
    messages: dto.messages,
  };
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(new Date(value));
}
