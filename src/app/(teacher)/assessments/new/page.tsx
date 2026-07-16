import { AssessmentForm } from "@/components/assessments/assessment-form";
import {
  EmptyState,
  ForbiddenState,
  UnauthorizedState,
} from "@/components/states/data-states";
import { getPageAuthContext } from "@/lib/server/auth-context";
import { getAssessmentCreateOptions } from "@/lib/server/assessments-service";
import { createAssessmentAction } from "@/app/(teacher)/assessments/new/actions";

export default async function NewAssessmentPage({
  searchParams,
}: {
  searchParams: Promise<{ classId?: string; error?: string }>;
}) {
  const { classId, error } = await searchParams;
  const result = getAssessmentCreateOptions(await getPageAuthContext());

  if (!result.ok) {
    if (result.status === 401) {
      return <UnauthorizedState />;
    }

    return <ForbiddenState message={result.message} />;
  }

  if (result.data.classes.length === 0) {
    return (
      <EmptyState
        title="No classes available"
        message="Assessment drafts can be created once a class is assigned in this workspace."
        action={{ label: "Open classes", href: "/classes", icon: "groups" }}
      />
    );
  }

  return (
    <AssessmentForm
      options={result.data}
      action={createAssessmentAction}
      defaultClassId={classId}
      error={error}
    />
  );
}
