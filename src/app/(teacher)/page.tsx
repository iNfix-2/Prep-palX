import { TeacherDashboard } from "@/components/dashboard/teacher-dashboard";
import {
  ErrorState,
  ForbiddenState,
  UnauthorizedState,
} from "@/components/states/data-states";
import { toTeacherDashboardView } from "@/lib/features/dashboard/adapters";
import { getPageAuthContext } from "@/lib/server/auth-context";
import { getTeacherDashboard } from "@/lib/server/dashboard-service";

export default async function TeacherHomePage() {
  const result = getTeacherDashboard(await getPageAuthContext());

  if (!result.ok) {
    if (result.status === 401) {
      return <UnauthorizedState />;
    }

    if (result.status === 403) {
      return <ForbiddenState message={result.message} />;
    }

    return (
      <ErrorState
        title="Dashboard unavailable"
        message={result.message}
        action={{ label: "Open classes", href: "/classes", icon: "groups" }}
      />
    );
  }

  return <TeacherDashboard view={toTeacherDashboardView(result.data)} />;
}
