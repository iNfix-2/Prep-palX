import Link from "next/link";
import { ClassCard } from "@/components/classes/class-card";
import {
  EmptyState,
  ForbiddenState,
  UnauthorizedState,
} from "@/components/states/data-states";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { toClassesPageView } from "@/lib/features/classes/adapters";
import { getPageAuthContext } from "@/lib/server/auth-context";
import { listTeacherClasses } from "@/lib/server/classes-service";

export default async function ClassesPage() {
  const result = listTeacherClasses(await getPageAuthContext());

  if (!result.ok) {
    if (result.status === 401) {
      return <UnauthorizedState />;
    }

    return <ForbiddenState message={result.message} />;
  }

  const view = toClassesPageView(result.data);

  if (view.classes.length === 0) {
    return (
      <EmptyState
        title="No assigned classes yet"
        message="Once an administrator assigns classes in this workspace, they will appear here."
        action={{ label: "Open dashboard", href: "/", icon: "home" }}
      />
    );
  }

  return (
    <div className="mx-auto w-full max-w-(--container-max) space-y-6">
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div className="max-w-3xl">
          <p className="text-label-md font-bold uppercase tracking-wider text-muted">
            {view.workspaceName} / {view.academicSessionLabel}
          </p>
          <h1 className="mt-2 font-display text-display-lg font-extrabold text-foreground">
            My Classes
          </h1>
          <p className="mt-2 text-body-lg text-muted">
            Your active teaching groups, readiness signals, and next classroom actions.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {view.canCreateLessonPlan && (
            <Link
              href="/lesson-planner/new"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-body-md font-semibold text-on-primary transition-colors hover:bg-primary-hover"
            >
              <Icon name="auto_stories" className="text-[18px]" />
              Prepare lesson
            </Link>
          )}
          {view.canUseAi && (
            <Link
              href="/ask-pal"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-ai px-4 text-body-md font-semibold text-on-ai transition-colors hover:bg-ai-hover"
            >
              <Icon name="smart_toy" className="text-[18px]" />
              Ask Pal
            </Link>
          )}
        </div>
      </header>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <MetricCard icon="groups" label="Active classes" value={String(view.totalClasses)} />
        <MetricCard icon="person_check" label="Learners" value={String(view.totalLearners)} />
        <MetricCard icon="priority_high" label="Support flags" value={String(view.totalAttention)} />
        <MetricCard icon="task_alt" label="Open tasks" value={String(view.totalOpenTasks)} />
      </section>

      <div className="grid grid-cols-12 gap-6">
        <section className="col-span-12 grid grid-cols-1 gap-4 xl:col-span-8 xl:grid-cols-2">
          {view.classes.map((classItem) => (
            <ClassCard key={classItem.id} classItem={classItem} />
          ))}
        </section>

        <aside className="col-span-12 space-y-6 xl:col-span-4">
          <Card>
            <div className="flex items-center gap-2">
              <Icon name="verified_user" className="text-primary" />
              <h2 className="font-display text-headline-sm text-foreground">
                Workspace Scope
              </h2>
            </div>
            <p className="mt-3 text-body-md text-muted">
              This list is tenant-scoped to the active workspace and filtered by membership
              permissions. Assigned teachers only see their own classes.
            </p>
          </Card>

          <Card className="border-ai/20 bg-ai text-on-ai">
            <div className="flex items-center gap-2">
              <Icon name="smart_toy" filled />
              <h2 className="text-body-lg font-bold">Pal Suggestion</h2>
            </div>
            <p className="mt-3 text-body-md text-white/90">
              Start with the class that has the lowest lesson readiness score, then generate
              differentiated support for flagged learners.
            </p>
            <Link
              href="/ask-pal"
              className="mt-4 inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-body-md font-bold text-ai transition-opacity hover:opacity-90"
            >
              Open Ask Pal
              <Icon name="chevron_right" className="text-[16px]" />
            </Link>
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
