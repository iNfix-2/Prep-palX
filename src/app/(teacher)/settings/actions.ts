"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type {
  AiConfirmationMode,
  InterfaceDensity,
  UpdateAccountSettingsDto,
} from "@/lib/features/settings/types";
import {
  ACTIVE_WORKSPACE_COOKIE_NAME,
  demoCookieOptions,
  getPageAuthContext,
} from "@/lib/server/auth-context";
import { selectAccountWorkspace, updateAccountSettings } from "@/lib/server/settings-service";

export async function saveAccountSettingsAction(formData: FormData) {
  const result = updateAccountSettings(await getPageAuthContext(), collectSettings(formData));

  if (!result.ok) {
    redirect(`/settings?error=${result.code}`);
  }

  revalidatePath("/settings");
  redirect("/settings?saved=1");
}

export async function switchWorkspaceAction(formData: FormData) {
  const result = selectAccountWorkspace(
    await getPageAuthContext(),
    String(formData.get("workspaceId") ?? ""),
  );

  if (!result.ok) {
    redirect(`/settings?error=${result.code}`);
  }

  const cookieStore = await cookies();
  cookieStore.set(ACTIVE_WORKSPACE_COOKIE_NAME, result.data.workspaceId, demoCookieOptions);

  revalidatePath("/");
  revalidatePath("/settings");
  redirect("/settings?workspace=1");
}

function collectSettings(formData: FormData): UpdateAccountSettingsDto {
  return {
    emailNotifications: isChecked(formData, "emailNotifications"),
    inAppNotifications: isChecked(formData, "inAppNotifications"),
    dueDateReminders: isChecked(formData, "dueDateReminders"),
    supportUpdates: isChecked(formData, "supportUpdates"),
    weeklyDigest: isChecked(formData, "weeklyDigest"),
    density: String(formData.get("density") ?? "") as InterfaceDensity,
    highContrast: isChecked(formData, "highContrast"),
    language: String(formData.get("language") ?? ""),
    timezone: String(formData.get("timezone") ?? ""),
    aiConfirmationMode: String(formData.get("aiConfirmationMode") ?? "") as AiConfirmationMode,
    aiSourceAccess: isChecked(formData, "aiSourceAccess"),
  };
}

function isChecked(formData: FormData, name: string) {
  return formData.get(name) === "on";
}
