export type InterfaceDensity = "comfortable" | "compact";
export type AiConfirmationMode = "always" | "high_impact" | "manual";

export interface AccountWorkspaceDto {
  id: string;
  name: string;
  roleName: string;
  jobTitle: string;
  academicYearName: string;
  termName: string;
  isActive: boolean;
}

export interface AccountPreferencesDto {
  emailNotifications: boolean;
  inAppNotifications: boolean;
  dueDateReminders: boolean;
  supportUpdates: boolean;
  weeklyDigest: boolean;
  density: InterfaceDensity;
  highContrast: boolean;
  language: string;
  timezone: string;
  aiConfirmationMode: AiConfirmationMode;
  aiSourceAccess: boolean;
  updatedAt: string;
}

export interface AccountSecurityDto {
  activeSessionCount: number;
  passwordUpdatedAt: string;
}

export interface AccountAiUsageDto {
  promptsUsed: number;
  promptLimit: number;
  usagePercent: number;
}

export interface AccountSettingsResponseDto {
  user: {
    id: string;
    displayName: string;
    shortName: string;
    email: string;
  };
  activeWorkspace: AccountWorkspaceDto;
  workspaces: AccountWorkspaceDto[];
  permissions: {
    canManageAccount: boolean;
    canSwitchWorkspace: boolean;
    canUseAi: boolean;
  };
  preferences: AccountPreferencesDto;
  security: AccountSecurityDto;
  aiUsage: AccountAiUsageDto;
}

export interface UpdateAccountSettingsDto {
  emailNotifications: boolean;
  inAppNotifications: boolean;
  dueDateReminders: boolean;
  supportUpdates: boolean;
  weeklyDigest: boolean;
  density: InterfaceDensity;
  highContrast: boolean;
  language: string;
  timezone: string;
  aiConfirmationMode: AiConfirmationMode;
  aiSourceAccess: boolean;
}

export interface AccountWorkspaceView extends AccountWorkspaceDto {
  statusLabel: string;
}

export interface AccountSettingsView {
  userName: string;
  userInitials: string;
  email: string;
  roleLabel: string;
  jobTitle: string;
  activeWorkspaceName: string;
  academicContextLabel: string;
  canManageAccount: boolean;
  canSwitchWorkspace: boolean;
  canUseAi: boolean;
  workspaces: AccountWorkspaceView[];
  preferences: AccountPreferencesDto;
  notificationCountLabel: string;
  securityStatusLabel: string;
  activeSessionLabel: string;
  passwordUpdatedLabel: string;
  aiUsageLabel: string;
  aiUsagePercent: number;
  updatedLabel: string;
}
