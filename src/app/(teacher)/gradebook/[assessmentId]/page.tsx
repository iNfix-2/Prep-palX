import { GradebookSheet } from "@/components/gradebook/gradebook-sheet";
import {
  ErrorState,
  ForbiddenState,
  UnauthorizedState,
} from "@/components/states/data-states";
import { toGradebookSheetView } from "@/lib/features/gradebook/adapters";
import { getPageAuthContext } from "@/lib/server/auth-context";
import { getGradebookSheet } from "@/lib/server/gradebook-service";
import { saveGradebookScoresAction } from "@/app/(teacher)/gradebook/[assessmentId]/actions";

export default async function GradebookSheetPage({
  params,
  searchParams,
}: {
  params: Promise<{ assessmentId: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const { assessmentId } = await params;
  const { saved, error } = await searchParams;
  const context = await getPageAuthContext();
  const result = getGradebookSheet(context, assessmentId);

  if (!result.ok) {
    if (result.status === 401) {
      return <UnauthorizedState />;
    }

    if (result.status === 403) {
      return <ForbiddenState message={result.message} />;
    }

    return (
      <ErrorState
        title="Gradebook sheet not found"
        message={result.message}
        action={{ label: "Back to gradebook", href: "/gradebook", icon: "grading" }}
      />
    );
  }

  const canMarkScores =
    context.status === "authenticated" &&
    context.activeMembership.permissions.includes("assessment.mark");
  const action = saveGradebookScoresAction.bind(null, assessmentId);

  return (
    <GradebookSheet
      view={toGradebookSheetView(result.data, canMarkScores)}
      action={action}
      saved={saved === "1"}
      error={error}
    />
  );
}
