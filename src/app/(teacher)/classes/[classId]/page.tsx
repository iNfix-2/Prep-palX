import { ClassOverview } from "@/components/classes/class-overview";
import {
  ErrorState,
  ForbiddenState,
  UnauthorizedState,
} from "@/components/states/data-states";
import { toClassOverviewView } from "@/lib/features/classes/adapters";
import { getPageAuthContext } from "@/lib/server/auth-context";
import { getClassOverview } from "@/lib/server/classes-service";

export default async function ClassOverviewPage({
  params,
}: {
  params: Promise<{ classId: string }>;
}) {
  const { classId } = await params;
  const result = getClassOverview(await getPageAuthContext(), classId);

  if (!result.ok) {
    if (result.status === 401) {
      return <UnauthorizedState />;
    }

    if (result.status === 403) {
      return <ForbiddenState message={result.message} />;
    }

    return (
      <ErrorState
        title="Class not found"
        message={result.message}
        action={{ label: "Back to classes", href: "/classes", icon: "groups" }}
      />
    );
  }

  return <ClassOverview view={toClassOverviewView(result.data)} />;
}
