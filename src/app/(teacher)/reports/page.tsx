import Link from "next/link";
import { ReportClassCard } from "@/components/reports/report-class-card";
import {
  EmptyState,
  ForbiddenState,
  UnauthorizedState,
} from "@/components/states/data-states";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { toReportsPageView } from "@/lib/features/reports/adapters";
import { getPageAuthContext } from "@/lib/server/auth-context";
import { listTeacherReports } from "@/lib/server/reports-service";

export default async function ReportsPage() {
  const result = listTeacherReports(await getPageAuthContext());

  if (!result.ok) {
    if (result.status === 401) {
      return <UnauthorizedState />;
    }

    return <ForbiddenState message={result.message} />;
  }

  const view = toReportsPageView(result.data);

  if (view.reports.length === 0) {
    return (
      <EmptyState
        title="No report classes yet"
        message="Assigned classes will appear here once assessment evidence is available."
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
            Reports
          </h1>
          <p className="mt-2 text-body-lg text-muted">
            Prepare class report comments from gradebook scores and attendance evidence.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/gradebook"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-surface-border bg-surface px-4 text-body-md font-semibold text-foreground transition-colors hover:bg-background"
          >
            <Icon name="grading" className="text-[18px]" />
            Gradebook
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
        <MetricCard icon="analytics" label="Classes" value={String(view.totalClasses)} />
        <MetricCard icon="groups" label="Learners" value={String(view.totalLearners)} />
        <MetricCard icon="task_alt" label="Ready" value={String(view.totalReadyLearners)} />
        <MetricCard
          icon="priority_high"
          label="Needs Work"
          value={String(view.totalMissingScores + view.totalMissingComments)}
        />
      </section>

      <div className="grid grid-cols-12 gap-6">
        <section className="col-span-12 grid grid-cols-1 gap-4 xl:col-span-8 xl:grid-cols-2">
          {view.reports.map((report) => (
            <ReportClassCard key={report.id} report={report} />
          ))}
        </section>

        <aside className="col-span-12 space-y-6 xl:col-span-4">
          <Card>
            <div className="flex items-center gap-2">
              <Icon name="verified_user" className="text-primary" />
              <h2 className="font-display text-headline-sm text-foreground">Report Scope</h2>
            </div>
            <p className="mt-3 text-body-md text-muted">
              Reports are scoped to assigned classes unless the membership can manage classes.
            </p>
          </Card>

          <Card>
            <div className="flex items-center gap-2">
              <Icon name="description" className="text-primary" />
              <h2 className="font-display text-headline-sm text-foreground">Readiness</h2>
            </div>
            <div className="mt-4 space-y-3">
              <ProgressFact label="Average readiness" value={`${view.averageReadinessPercent}%`} />
              <ProgressFact label="Missing scores" value={String(view.totalMissingScores)} />
              <ProgressFact label="Missing comments" value={String(view.totalMissingComments)} />
            </div>
          </Card>

          <Card className="border-ai/20 bg-ai text-on-ai">
            <div className="flex items-center gap-2">
              <Icon name="smart_toy" filled />
              <h2 className="text-body-lg font-bold">Pal Suggestion</h2>
            </div>
            <p className="mt-3 text-body-md text-white/90">
              Resolve missing scores first, then draft learner comments with evidence from
              gradebook and attendance.
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

function ProgressFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-surface-border bg-background p-3">
      <span className="text-body-md text-muted">{label}</span>
      <span className="text-body-md font-bold text-foreground">{value}</span>
    </div>
  );
}
