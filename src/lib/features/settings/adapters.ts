import type {
  AccountSettingsResponseDto,
  AccountSettingsView,
  AiConfirmationMode,
  InterfaceDensity,
} from "@/lib/features/settings/types";

export const densityOptions: Array<{ value: InterfaceDensity; label: string }> = [
  { value: "comfortable", label: "Comfortable" },
  { value: "compact", label: "Compact" },
];

export const aiConfirmationOptions: Array<{ value: AiConfirmationMode; label: string }> = [
  { value: "always", label: "Always confirm" },
  { value: "high_impact", label: "High-impact actions" },
  { value: "manual", label: "Manual only" },
];

export const languageOptions = [
  { value: "en", label: "English" },
  { value: "fr", label: "French" },
] as const;

export const timezoneOptions = [
  { value: "Africa/Lagos", label: "Africa/Lagos" },
  { value: "UTC", label: "UTC" },
  { value: "Europe/London", label: "Europe/London" },
] as const;

export function toAccountSettingsView(dto: AccountSettingsResponseDto): AccountSettingsView {
  const enabledNotifications = [
    dto.preferences.emailNotifications,
    dto.preferences.inAppNotifications,
    dto.preferences.dueDateReminders,
    dto.preferences.supportUpdates,
    dto.preferences.weeklyDigest,
  ].filter(Boolean).length;

  return {
    userName: dto.user.displayName,
    userInitials: dto.user.shortName,
    email: dto.user.email,
    roleLabel: dto.activeWorkspace.roleName,
    jobTitle: dto.activeWorkspace.jobTitle,
    activeWorkspaceName: dto.activeWorkspace.name,
    academicContextLabel: `${dto.activeWorkspace.academicYearName} / ${dto.activeWorkspace.termName}`,
    canManageAccount: dto.permissions.canManageAccount,
    canSwitchWorkspace: dto.permissions.canSwitchWorkspace,
    canUseAi: dto.permissions.canUseAi,
    workspaces: dto.workspaces.map((workspace) => ({
      ...workspace,
      statusLabel: workspace.isActive ? "Active" : "Available",
    })),
    preferences: dto.preferences,
    notificationCountLabel: `${enabledNotifications} enabled`,
    securityStatusLabel: "Good",
    activeSessionLabel: `${dto.security.activeSessionCount} active sessions`,
    passwordUpdatedLabel: `Password updated ${formatDate(dto.security.passwordUpdatedAt)}`,
    aiUsageLabel: `${dto.aiUsage.promptsUsed}/${dto.aiUsage.promptLimit} prompts`,
    aiUsagePercent: dto.aiUsage.usagePercent,
    updatedLabel: `Updated ${formatDateTime(dto.preferences.updatedAt)}`,
  };
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
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
