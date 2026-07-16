import { QuestionDetail } from "@/components/question-bank/question-detail";
import {
  ErrorState,
  ForbiddenState,
  UnauthorizedState,
} from "@/components/states/data-states";
import { toQuestionDetailView } from "@/lib/features/question-bank/adapters";
import { getPageAuthContext } from "@/lib/server/auth-context";
import { getQuestion } from "@/lib/server/question-bank-service";

export default async function QuestionDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ questionId: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const { questionId } = await params;
  const { saved } = await searchParams;
  const result = getQuestion(await getPageAuthContext(), questionId);

  if (!result.ok) {
    if (result.status === 401) {
      return <UnauthorizedState />;
    }

    if (result.status === 403) {
      return <ForbiddenState message={result.message} />;
    }

    return (
      <ErrorState
        title="Question not found"
        message={result.message}
        action={{ label: "Back to question bank", href: "/question-bank", icon: "quiz" }}
      />
    );
  }

  return <QuestionDetail view={toQuestionDetailView(result.data)} saved={saved === "1"} />;
}
