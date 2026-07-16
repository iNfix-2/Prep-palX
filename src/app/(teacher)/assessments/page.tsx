import Link from "next/link";
import { AssessmentCard } from "@/components/assessments/assessment-card";
import {
  EmptyState,
  ForbiddenState,
  UnauthorizedState,
} from "@/components/states/data-states";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { toAssessmentsPageView } from "@/lib/features/assessments/adapters";
import { getPageAuthContext } from "@/lib/server/auth-context";
import { listTeacherAssessments } from "@/lib/server/assessments-service";

export default async function AssessmentsPage() {
  const result = listTeacherAssessments(await getPageAuthContext());

  if (!result.ok) {
    if (result.status === 401) {
      return <UnauthorizedState />;
    }

    return <ForbiddenState message={result.message} />;
  }

  const view = toAssessmentsPageView(result.data);

  if (view.assessments.length === 0) {
    return (
      <EmptyState
        title="No assessments yet"
        message="Create the first draft for one of your assigned classes."
        action={{ label: "New assessment", href: "/assessments/new", icon: "add" }}
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
            Assessments
          </h1>
          <p className="mt-2 text-body-lg text-muted">
            Build, review, and publish classroom assessments for assigned classes.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {view.canCreateAssessment && (
            <Link
              href="/assessments/new"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-body-md font-semibold text-on-primary transition-colors hover:bg-primary-hover"
            >
              <Icon name="add" className="text-[18px]" />
              New assessment
            </Link>
          )}
          <Link
            href="/question-bank"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-surface-border bg-surface px-4 text-body-md font-semibold text-foreground transition-colors hover:bg-background"
          >
            <Icon name="quiz" className="text-[18px]" />
            Question bank
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
        <MetricCard icon="assignment" label="Assessments" value={String(view.totalAssessments)} />
        <MetricCard icon="description" label="Drafts" value={String(view.draftCount)} />
        <MetricCard icon="verified_user" label="In review" value={String(view.reviewCount)} />
        <MetricCard icon="grading" label="Marks" value={String(view.totalMarks)} />
      </section>

      <div className="grid grid-cols-12 gap-6">
        <section className="col-span-12 grid grid-cols-1 gap-4 xl:col-span-8 xl:grid-cols-2">
          {view.assessments.map((assessment) => (
            <AssessmentCard key={assessment.id} assessment={assessment} />
          ))}
        </section>

        <aside className="col-span-12 space-y-6 xl:col-span-4">
          <Card>
            <div className="flex items-center gap-2">
              <Icon name="verified_user" className="text-primary" />
              <h2 className="font-display text-headline-sm text-foreground">
                Assessment Scope
              </h2>
            </div>
            <p className="mt-3 text-body-md text-muted">
              Assessments are scoped to the active workspace and filtered to assigned classes
              unless the membership can manage classes.
            </p>
          </Card>

          <Card>
            <div className="flex items-center gap-2">
              <Icon name="task_alt" className="text-primary" />
              <h2 className="font-display text-headline-sm text-foreground">Readiness</h2>
            </div>
            <p className="mt-3 font-display text-[28px] font-extrabold leading-none text-foreground">
              {view.averageReadiness}%
            </p>
            <p className="mt-2 text-body-md text-muted">
              Average draft completeness across visible assessment work.
            </p>
          </Card>

          <Card className="border-ai/20 bg-ai text-on-ai">
            <div className="flex items-center gap-2">
              <Icon name="smart_toy" filled />
              <h2 className="text-body-lg font-bold">Pal Suggestion</h2>
            </div>
            <p className="mt-3 text-body-md text-white/90">
              Pair recent lesson evidence with draft items before review.
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
