import type {
  AccountSettingsResponseDto,
  AccountWorkspaceDto,
  AiConfirmationMode,
  InterfaceDensity,
  UpdateAccountSettingsDto,
} from "@/lib/features/settings/types";
import { hasPermission } from "@/lib/security/permissions";
import type { RequestAuthContext } from "@/lib/server/auth-context";
import {
  getDemoAccountSettings,
  getWorkspace,
  updateDemoAccountSettings,
  type DemoMembership,
} from "@/lib/server/demo-store";

export type SettingsServiceErrorStatus = 400 | 401 | 403 | 404;

export type SettingsServiceResult<T> =
  | { ok: true; data: T }
  | {
      ok: false;
      status: SettingsServiceErrorStatus;
      code: "AUTH_REQUIRED" | "FORBIDDEN" | "NOT_FOUND" | "VALIDATION_ERROR";
      message: string;
      fields?: Record<string, string[]>;
    };

type AuthenticatedContext = Extract<RequestAuthContext, { status: "authenticated" }>;

const densities: InterfaceDensity[] = ["comfortable", "compact"];
const aiConfirmationModes: AiConfirmationMode[] = ["always", "high_impact", "manual"];
const languages = ["en", "fr"];
const timezones = ["Africa/Lagos", "UTC", "Europe/London"];

export function getAccountSettings(
  context: RequestAuthContext,
): SettingsServiceResult<AccountSettingsResponseDto> {
  const access = getSettingsAccess(context);

  if (!access.ok) {
    return access;
  }

  return {
    ok: true,
    data: toAccountSettingsResponse(access.data.context),
  };
}

export function updateAccountSettings(
  context: RequestAuthContext,
  input: UpdateAccountSettingsDto,
): SettingsServiceResult<AccountSettingsResponseDto> {
  const access = getSettingsAccess(context);

  if (!access.ok) {
    return access;
  }

  const validation = validateAccountSettings(input, canUseAi(access.data.context));

  if (!validation.ok) {
    return validation;
  }

  updateDemoAccountSettings(access.data.context.activeMembership.id, validation.data);

  return {
    ok: true,
    data: toAccountSettingsResponse(access.data.context),
  };
}

export function selectAccountWorkspace(
  context: RequestAuthContext,
  workspaceId: string,
): SettingsServiceResult<{ workspaceId: string }> {
  const access = getSettingsAccess(context);

  if (!access.ok) {
    return access;
  }

  if (!hasPermission(access.data.context.activeMembership, "workspace.select")) {
    return forbidden("You do not have permission to switch workspaces.");
  }

  const requestedWorkspaceId = workspaceId.trim();

  if (!requestedWorkspaceId) {
    return validationError("Workspace could not be selected.", {
      workspaceId: ["Workspace is required."],
    });
  }

  const membership = access.data.context.memberships.find(
    (candidate) => candidate.workspaceId === requestedWorkspaceId,
  );
  const workspace = getWorkspace(requestedWorkspaceId);

  if (!membership || !workspace) {
    return forbidden("You are not a member of this workspace.");
  }

  return { ok: true, data: { workspaceId: workspace.id } };
}

function getSettingsAccess(
  context: RequestAuthContext,
): SettingsServiceResult<{ context: AuthenticatedContext }> {
  if (context.status === "unauthenticated") {
    return authRequired();
  }

  if (!hasPermission(context.activeMembership, "account.manage_self")) {
    return forbidden("You do not have permission to manage account settings.");
  }

  return { ok: true, data: { context } };
}

function toAccountSettingsResponse(context: AuthenticatedContext): AccountSettingsResponseDto {
  const settings = getDemoAccountSettings(context.activeMembership.id);
  const aiUsagePercent =
    settings.monthlyAiLimit > 0
      ? Math.round((settings.monthlyAiUsed / settings.monthlyAiLimit) * 100)
      : 0;

  return {
    user: {
      id: context.user.id,
      displayName: context.user.displayName,
      shortName: context.user.shortName,
      email: context.user.email,
    },
    activeWorkspace: toAccountWorkspaceDto(context.activeMembership, context.activeWorkspace.id),
    workspaces: context.memberships.map((membership) =>
      toAccountWorkspaceDto(membership, context.activeWorkspace.id),
    ),
    permissions: {
      canManageAccount: true,
      canSwitchWorkspace: hasPermission(context.activeMembership, "workspace.select"),
      canUseAi: canUseAi(context),
    },
    preferences: {
      emailNotifications: settings.emailNotifications,
      inAppNotifications: settings.inAppNotifications,
      dueDateReminders: settings.dueDateReminders,
      supportUpdates: settings.supportUpdates,
      weeklyDigest: settings.weeklyDigest,
      density: settings.density,
      highContrast: settings.highContrast,
      language: settings.language,
      timezone: settings.timezone,
      aiConfirmationMode: settings.aiConfirmationMode,
      aiSourceAccess: settings.aiSourceAccess,
      updatedAt: settings.updatedAt,
    },
    security: {
      activeSessionCount: settings.activeSessionCount,
      passwordUpdatedAt: settings.passwordUpdatedAt,
    },
    aiUsage: {
      promptsUsed: settings.monthlyAiUsed,
      promptLimit: settings.monthlyAiLimit,
      usagePercent: Math.min(100, Math.max(0, aiUsagePercent)),
    },
  };
}

function toAccountWorkspaceDto(
  membership: DemoMembership,
  activeWorkspaceId: string,
): AccountWorkspaceDto {
  const workspace = getWorkspace(membership.workspaceId);

  return {
    id: membership.workspaceId,
    name: workspace?.name ?? membership.workspaceId,
    roleName: membership.roleName,
    jobTitle: membership.jobTitle,
    academicYearName: workspace?.currentAcademicYearName ?? "Current year",
    termName: workspace?.currentTermName ?? "Current term",
    isActive: membership.workspaceId === activeWorkspaceId,
  };
}

function validateAccountSettings(
  input: UpdateAccountSettingsDto,
  allowAiSettings: boolean,
): SettingsServiceResult<UpdateAccountSettingsDto> {
  const fields: Record<string, string[]> = {};
  const density = String(input?.density ?? "");
  const language = String(input?.language ?? "");
  const timezone = String(input?.timezone ?? "");
  const aiConfirmationMode = String(input?.aiConfirmationMode ?? "");
  const aiSourceAccess = input?.aiSourceAccess === true;

  if (!densities.includes(density as InterfaceDensity)) {
    fields.density = ["Display density is not supported."];
  }

  if (!languages.includes(language)) {
    fields.language = ["Language is not supported."];
  }

  if (!timezones.includes(timezone)) {
    fields.timezone = ["Timezone is not supported."];
  }

  if (!aiConfirmationModes.includes(aiConfirmationMode as AiConfirmationMode)) {
    fields.aiConfirmationMode = ["AI confirmation mode is not supported."];
  }

  if (aiSourceAccess && !allowAiSettings) {
    fields.aiSourceAccess = ["AI source access requires AI permission."];
  }

  if (Object.keys(fields).length > 0) {
    return validationError("Account settings could not be saved.", fields);
  }

  return {
    ok: true,
    data: {
      emailNotifications: input?.emailNotifications === true,
      inAppNotifications: input?.inAppNotifications === true,
      dueDateReminders: input?.dueDateReminders === true,
      supportUpdates: input?.supportUpdates === true,
      weeklyDigest: input?.weeklyDigest === true,
      density: density as InterfaceDensity,
      highContrast: input?.highContrast === true,
      language,
      timezone,
      aiConfirmationMode: aiConfirmationMode as AiConfirmationMode,
      aiSourceAccess: allowAiSettings ? aiSourceAccess : false,
    },
  };
}

function canUseAi(context: AuthenticatedContext) {
  return hasPermission(context.activeMembership, "ai.use");
}

function authRequired(): SettingsServiceResult<never> {
  return {
    ok: false,
    status: 401,
    code: "AUTH_REQUIRED",
    message: "Sign in to continue.",
  };
}

function forbidden(message: string): SettingsServiceResult<never> {
  return {
    ok: false,
    status: 403,
    code: "FORBIDDEN",
    message,
  };
}

function validationError(
  message: string,
  fields: Record<string, string[]>,
): SettingsServiceResult<never> {
  return {
    ok: false,
    status: 400,
    code: "VALIDATION_ERROR",
    message,
    fields,
  };
}
