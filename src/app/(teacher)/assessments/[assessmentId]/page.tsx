import { AssessmentDetail } from "@/components/assessments/assessment-detail";
import {
  ErrorState,
  ForbiddenState,
  UnauthorizedState,
} from "@/components/states/data-states";
import { toAssessmentDetailView } from "@/lib/features/assessments/adapters";
import { getPageAuthContext } from "@/lib/server/auth-context";
import { getAssessment } from "@/lib/server/assessments-service";

export default async function AssessmentDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ assessmentId: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const { assessmentId } = await params;
  const { saved } = await searchParams;
  const result = getAssessment(await getPageAuthContext(), assessmentId);

  if (!result.ok) {
    if (result.status === 401) {
      return <UnauthorizedState />;
    }

    if (result.status === 403) {
      return <ForbiddenState message={result.message} />;
    }

    return (
      <ErrorState
        title="Assessment not found"
        message={result.message}
        action={{ label: "Back to assessments", href: "/assessments", icon: "assignment" }}
      />
    );
  }

  return <AssessmentDetail view={toAssessmentDetailView(result.data)} saved={saved === "1"} />;
}
