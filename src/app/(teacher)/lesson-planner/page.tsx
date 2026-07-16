import Link from "next/link";
import { LessonPlanCard } from "@/components/lesson-plans/lesson-plan-card";
import {
  EmptyState,
  ForbiddenState,
  UnauthorizedState,
} from "@/components/states/data-states";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { toLessonPlannerPageView } from "@/lib/features/lesson-plans/adapters";
import { getPageAuthContext } from "@/lib/server/auth-context";
import { listTeacherLessonPlans } from "@/lib/server/lesson-plans-service";

export default async function LessonPlannerPage() {
  const result = listTeacherLessonPlans(await getPageAuthContext());

  if (!result.ok) {
    if (result.status === 401) {
      return <UnauthorizedState />;
    }

    return <ForbiddenState message={result.message} />;
  }

  const view = toLessonPlannerPageView(result.data);

  if (view.lessonPlans.length === 0) {
    return (
      <EmptyState
        title="No lesson plans yet"
        message="Create the first draft for one of your assigned classes."
        action={{ label: "New lesson plan", href: "/lesson-planner/new", icon: "add" }}
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
            Lesson Planner
          </h1>
          <p className="mt-2 text-body-lg text-muted">
            Plan, review, and reuse classroom-ready lessons for assigned classes.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {view.canCreateLessonPlan && (
            <Link
              href="/lesson-planner/new"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-body-md font-semibold text-on-primary transition-colors hover:bg-primary-hover"
            >
              <Icon name="add" className="text-[18px]" />
              New lesson plan
            </Link>
          )}
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
        <MetricCard icon="auto_stories" label="Plans" value={String(view.totalPlans)} />
        <MetricCard icon="description" label="Drafts" value={String(view.draftCount)} />
        <MetricCard icon="verified_user" label="In review" value={String(view.reviewCount)} />
        <MetricCard icon="task_alt" label="Readiness" value={`${view.averageReadiness}%`} />
      </section>

      <div className="grid grid-cols-12 gap-6">
        <section className="col-span-12 grid grid-cols-1 gap-4 xl:col-span-8 xl:grid-cols-2">
          {view.lessonPlans.map((lessonPlan) => (
            <LessonPlanCard key={lessonPlan.id} lessonPlan={lessonPlan} />
          ))}
        </section>

        <aside className="col-span-12 space-y-6 xl:col-span-4">
          <Card>
            <div className="flex items-center gap-2">
              <Icon name="verified_user" className="text-primary" />
              <h2 className="font-display text-headline-sm text-foreground">
                Planning Scope
              </h2>
            </div>
            <p className="mt-3 text-body-md text-muted">
              Lesson plans are scoped to the active workspace and filtered to assigned classes
              unless the membership can manage classes.
            </p>
          </Card>

          <Card className="border-ai/20 bg-ai text-on-ai">
            <div className="flex items-center gap-2">
              <Icon name="smart_toy" filled />
              <h2 className="text-body-lg font-bold">Pal Suggestion</h2>
            </div>
            <p className="mt-3 text-body-md text-white/90">
              Start from recent class evidence, then ask Pal to refine the starter or exit ticket.
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
