import Link from "next/link";
import { QuestionCard } from "@/components/question-bank/question-card";
import {
  EmptyState,
  ForbiddenState,
  UnauthorizedState,
} from "@/components/states/data-states";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { toQuestionBankPageView } from "@/lib/features/question-bank/adapters";
import { getPageAuthContext } from "@/lib/server/auth-context";
import { listTeacherQuestions } from "@/lib/server/question-bank-service";

export default async function QuestionBankPage() {
  const result = listTeacherQuestions(await getPageAuthContext());

  if (!result.ok) {
    if (result.status === 401) {
      return <UnauthorizedState />;
    }

    return <ForbiddenState message={result.message} />;
  }

  const view = toQuestionBankPageView(result.data);

  if (view.questions.length === 0) {
    return (
      <EmptyState
        title="No questions yet"
        message="Add reusable questions for assigned classes and connect them to assessments."
        action={{ label: "New question", href: "/question-bank/new", icon: "add" }}
      />
    );
  }

  return (
    <div className="mx-auto w-full max-w-(--container-max) space-y-6">
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div className="max-w-3xl">
          <p className="text-label-md font-bold uppercase tracking-wider text-muted">
            {view.workspaceName}
          </p>
          <h1 className="mt-2 font-display text-display-lg font-extrabold text-foreground">
            Question Bank
          </h1>
          <p className="mt-2 text-body-lg text-muted">
            Curate reusable questions, answer guidance, and review status for assessment drafts.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {view.canManageQuestions && (
            <Link
              href="/question-bank/new"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-body-md font-semibold text-on-primary transition-colors hover:bg-primary-hover"
            >
              <Icon name="add" className="text-[18px]" />
              New question
            </Link>
          )}
          <Link
            href="/assessments"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-surface-border bg-surface px-4 text-body-md font-semibold text-foreground transition-colors hover:bg-background"
          >
            <Icon name="assignment" className="text-[18px]" />
            Assessments
          </Link>
          {view.canUseAi && (
            <Link
              href="/ask-pal"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-ai px-4 text-body-md font-semibold text-on-ai transition-colors hover:bg-ai-hover"
            >
              <Icon name="smart_toy" className="text-[18px]" />
              Draft with Pal
            </Link>
          )}
        </div>
      </header>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <MetricCard icon="quiz" label="Questions" value={String(view.totalQuestions)} />
        <MetricCard icon="description" label="Drafts" value={String(view.draftCount)} />
        <MetricCard icon="verified_user" label="Approved" value={String(view.approvedCount)} />
        <MetricCard icon="grading" label="Marks" value={String(view.totalMarks)} />
      </section>

      <div className="grid grid-cols-12 gap-6">
        <section className="col-span-12 grid grid-cols-1 gap-4 xl:col-span-8 xl:grid-cols-2">
          {view.questions.map((question) => (
            <QuestionCard key={question.id} question={question} />
          ))}
        </section>

        <aside className="col-span-12 space-y-6 xl:col-span-4">
          <Card>
            <div className="flex items-center gap-2">
              <Icon name="database" className="text-primary" />
              <h2 className="font-display text-headline-sm text-foreground">Bank Scope</h2>
            </div>
            <p className="mt-3 text-body-md text-muted">
              Questions are scoped to the active workspace and filtered to assigned classes unless
              the membership can manage classes.
            </p>
          </Card>

          <Card>
            <div className="flex items-center gap-2">
              <Icon name="task_alt" className="text-primary" />
              <h2 className="font-display text-headline-sm text-foreground">Quality</h2>
            </div>
            <p className="mt-3 font-display text-[28px] font-extrabold leading-none text-foreground">
              {view.averageQuality}%
            </p>
            <p className="mt-2 text-body-md text-muted">
              Average quality score across visible reusable questions.
            </p>
          </Card>

          <Card>
            <div className="flex items-center gap-2">
              <Icon name="verified_user" className="text-primary" />
              <h2 className="font-display text-headline-sm text-foreground">Review Queue</h2>
            </div>
            <p className="mt-3 text-body-md text-muted">
              {view.reviewCount} {view.reviewCount === 1 ? "question is" : "questions are"} in
              review and {view.approvedCount} can be reused immediately.
            </p>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-label-md font-bold uppercase tracking-wider text-muted">{label}</p>
          <p className="mt-2 font-display text-[28px] font-extrabold leading-none text-foreground">
            {value}
          </p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
          <Icon name={icon} />
        </div>
      </div>
    </Card>
  );
}
