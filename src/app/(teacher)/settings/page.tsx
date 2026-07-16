import {
  saveAccountSettingsAction,
  switchWorkspaceAction,
} from "@/app/(teacher)/settings/actions";
import { AccountSettingsPanel } from "@/components/settings/account-settings-panel";
import {
  ErrorState,
  ForbiddenState,
  UnauthorizedState,
} from "@/components/states/data-states";
import { toAccountSettingsView } from "@/lib/features/settings/adapters";
import { getPageAuthContext } from "@/lib/server/auth-context";
import { getAccountSettings } from "@/lib/server/settings-service";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; workspace?: string; error?: string }>;
}) {
  const { saved, workspace, error } = await searchParams;
  const result = getAccountSettings(await getPageAuthContext());

  if (!result.ok) {
    if (result.status === 401) {
      return <UnauthorizedState />;
    }

    if (result.status === 403) {
      return <ForbiddenState message={result.message} />;
    }

    return (
      <ErrorState
        title="Settings unavailable"
        message={result.message}
        action={{ label: "Back home", href: "/", icon: "home" }}
      />
    );
  }

  return (
    <AccountSettingsPanel
      view={toAccountSettingsView(result.data)}
      settingsAction={saveAccountSettingsAction}
      workspaceAction={switchWorkspaceAction}
      saved={saved === "1"}
      workspaceSaved={workspace === "1"}
      error={error}
    />
  );
}
