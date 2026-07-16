import { AskPalWorkbench } from "@/components/assistant/ask-pal-workbench";
import {
  ErrorState,
  ForbiddenState,
  UnauthorizedState,
} from "@/components/states/data-states";
import { toAssistantWorkspaceView } from "@/lib/features/assistant/adapters";
import { getPageAuthContext } from "@/lib/server/auth-context";
import { getAssistantWorkspace } from "@/lib/server/assistant-service";

export default async function AskPalPage() {
  const result = getAssistantWorkspace(await getPageAuthContext());

  if (!result.ok) {
    const state = (() => {
      if (result.status === 401) {
        return <UnauthorizedState />;
      }

      if (result.status === 403) {
        return <ForbiddenState message={result.message} />;
      }

      return (
        <ErrorState
          title="Ask Pal unavailable"
          message={result.message}
          action={{ label: "Open help", href: "/help", icon: "help" }}
        />
      );
    })();

    return <div className="min-h-screen bg-background p-4 md:p-8">{state}</div>;
  }

  return <AskPalWorkbench view={toAssistantWorkspaceView(result.data)} />;
}
