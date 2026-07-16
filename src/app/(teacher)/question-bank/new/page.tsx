import { QuestionForm } from "@/components/question-bank/question-form";
import {
  EmptyState,
  ForbiddenState,
  UnauthorizedState,
} from "@/components/states/data-states";
import { getPageAuthContext } from "@/lib/server/auth-context";
import { getQuestionCreateOptions } from "@/lib/server/question-bank-service";
import { createQuestionAction } from "@/app/(teacher)/question-bank/new/actions";

export default async function NewQuestionPage({
  searchParams,
}: {
  searchParams: Promise<{ classId?: string; error?: string }>;
}) {
  const { classId, error } = await searchParams;
  const result = getQuestionCreateOptions(await getPageAuthContext());

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
        message="Question bank items can be created once a class is assigned in this workspace."
        action={{ label: "Open classes", href: "/classes", icon: "groups" }}
      />
    );
  }

  return (
    <QuestionForm
      options={result.data}
      action={createQuestionAction}
      defaultClassId={classId}
      error={error}
    />
  );
}
