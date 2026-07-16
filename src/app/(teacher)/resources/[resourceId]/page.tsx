import { ResourceDetail } from "@/components/resources/resource-detail";
import {
  ErrorState,
  ForbiddenState,
  UnauthorizedState,
} from "@/components/states/data-states";
import { toResourceDetailView } from "@/lib/features/resources/adapters";
import { getPageAuthContext } from "@/lib/server/auth-context";
import { getResource } from "@/lib/server/resources-service";

export default async function ResourcePage({
  params,
}: {
  params: Promise<{ resourceId: string }>;
}) {
  const { resourceId } = await params;
  const result = getResource(await getPageAuthContext(), resourceId);

  if (!result.ok) {
    if (result.status === 401) {
      return <UnauthorizedState />;
    }

    if (result.status === 403) {
      return <ForbiddenState message={result.message} />;
    }

    return (
      <ErrorState
        title="Resource not found"
        message={result.message}
        action={{ label: "Back to resources", href: "/resources", icon: "folder_open" }}
      />
    );
  }

  return <ResourceDetail view={toResourceDetailView(result.data)} />;
}
