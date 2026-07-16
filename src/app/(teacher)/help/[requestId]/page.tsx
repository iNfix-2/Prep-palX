import { SupportRequestDetail } from "@/components/help/support-request-detail";
import {
  ErrorState,
  ForbiddenState,
  UnauthorizedState,
} from "@/components/states/data-states";
import { toSupportRequestDetailView } from "@/lib/features/help/adapters";
import { getPageAuthContext } from "@/lib/server/auth-context";
import { getSupportRequestDetail } from "@/lib/server/help-service";
import { addSupportMessageAction } from "./actions";

export default async function SupportRequestPage({
  params,
}: {
  params: Promise<{ requestId: string }>;
}) {
  const { requestId } = await params;
  const result = getSupportRequestDetail(await getPageAuthContext(), requestId);

  if (!result.ok) {
    if (result.status === 401) {
      return <UnauthorizedState />;
    }

    if (result.status === 403) {
      return <ForbiddenState message={result.message} />;
    }

    return (
      <ErrorState
        title="Support request not found"
        message={result.message}
        action={{ label: "Back to help", href: "/help", icon: "help" }}
      />
    );
  }

  return (
    <SupportRequestDetail
      view={toSupportRequestDetailView(result.data)}
      messageAction={addSupportMessageAction.bind(null, requestId)}
    />
  );
}
