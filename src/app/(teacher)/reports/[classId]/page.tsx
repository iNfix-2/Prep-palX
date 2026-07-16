import { saveReportCommentsAction } from "@/app/(teacher)/reports/[classId]/actions";
import { ClassReportWorkbench } from "@/components/reports/class-report-workbench";
import {
  ErrorState,
  ForbiddenState,
  UnauthorizedState,
} from "@/components/states/data-states";
import { toClassReportView } from "@/lib/features/reports/adapters";
import { getPageAuthContext } from "@/lib/server/auth-context";
import { getClassReport } from "@/lib/server/reports-service";

export default async function ClassReportPage({
  params,
  searchParams,
}: {
  params: Promise<{ classId: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const { classId } = await params;
  const { saved, error } = await searchParams;
  const context = await getPageAuthContext();
  const result = getClassReport(context, classId);

  if (!result.ok) {
    if (result.status === 401) {
      return <UnauthorizedState />;
    }

    if (result.status === 403) {
      return <ForbiddenState message={result.message} />;
    }

    return (
      <ErrorState
        title="Report not found"
        message={result.message}
        action={{ label: "Back to reports", href: "/reports", icon: "analytics" }}
      />
    );
  }

  const canPrepareReports =
    context.status === "authenticated" &&
    context.activeMembership.permissions.includes("report.prepare");
  const action = saveReportCommentsAction.bind(null, classId);

  return (
    <ClassReportWorkbench
      view={toClassReportView(result.data, canPrepareReports)}
      action={action}
      saved={saved === "1"}
      error={error}
    />
  );
}
