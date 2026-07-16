import Link from "next/link";
import { TaskCard } from "@/components/tasks/task-card";
import {
  EmptyState,
  ForbiddenState,
  UnauthorizedState,
} from "@/components/states/data-states";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { toTasksPageView } from "@/lib/features/tasks/adapters";
import { getPageAuthContext } from "@/lib/server/auth-context";
import { listTeacherTasks } from "@/lib/server/tasks-service";

export default async function MyTasksPage() {
  const result = listTeacherTasks(await getPageAuthContext());

  if (!result.ok) {
    if (result.status === 401) {
      return <UnauthorizedState />;
    }

    return <ForbiddenState message={result.message} />;
  }

  const view = toTasksPageView(result.data);

  if (view.tasks.length === 0) {
    return (
      <EmptyState
        title="No tasks"
        message="Assigned class work, reviews, and follow-ups will appear here when they need action."
        action={{ label: "Open classes", href: "/classes", icon: "groups" }}
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
            My Tasks
          </h1>
          <p className="mt-2 text-body-lg text-muted">
            Teaching, grading, review, and follow-up work that needs your attention.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/classes"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-surface-border bg-surface px-4 text-body-md font-semibold text-foreground transition-colors hover:bg-background"
          >
            <Icon name="groups" className="text-[18px]" />
            Classes
          </Link>
          {view.canUseAi && (
            <Link
              href="/ask-pal"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-ai px-4 text-body-md font-semibold text-on-ai transition-colors hover:bg-ai-hover"
            >
              <Icon name="smart_toy" className="text-[18px]" />
              Prioritize with Pal
            </Link>
          )}
        </div>
      </header>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <MetricCard icon="task_alt" label="Tasks" value={String(view.totalTasks)} />
        <MetricCard icon="priority_high" label="Open" value={String(view.openCount)} />
        <MetricCard icon="schedule" label="Due today" value={String(view.dueTodayCount)} />
        <MetricCard icon="error" label="Blocked" value={String(view.blockedCount)} />
      </section>

      <div className="grid grid-cols-12 gap-6">
        <section className="col-span-12 space-y-4 xl:col-span-8">
          {view.tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </section>

        <aside className="col-span-12 space-y-6 xl:col-span-4">
          <Card>
            <div className="flex items-center gap-2">
              <Icon name="task_alt" className="text-primary" />
              <h2 className="font-display text-headline-sm text-foreground">Queue Scope</h2>
            </div>
            <p className="mt-3 text-body-md text-muted">
              Tasks are limited to your assigned classes, tasks assigned directly to you, and
              workspace tasks. Admins can see the full school queue.
            </p>
          </Card>

          <Card>
            <div className="flex items-center gap-2">
              <Icon name="monitoring" className="text-primary" />
              <h2 className="font-display text-headline-sm text-foreground">Queue Health</h2>
            </div>
            <div className="mt-4 space-y-3">
              <ProgressFact label="Completed" value={String(view.completedCount)} />
              <ProgressFact label="Can update" value={view.canManageTasks ? "Enabled" : "Read-only"} />
            </div>
          </Card>

          {view.canUseAi && (
            <Card className="border-ai/20 bg-ai text-on-ai">
              <div className="flex items-center gap-2">
                <Icon name="smart_toy" filled />
                <h2 className="text-body-lg font-bold">Pal Suggestion</h2>
              </div>
              <p className="mt-3 text-body-md text-white/90">
                Start with urgent score entry, then clear the blocked report evidence task.
              </p>
            </Card>
          )}
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

function ProgressFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-surface-border bg-background p-3">
      <span className="text-body-md text-muted">{label}</span>
      <span className="text-body-md font-bold text-foreground">{value}</span>
    </div>
  );
}
