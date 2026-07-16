import Link from "next/link";
import { ApprovalCard } from "@/components/approvals/approval-card";
import {
  EmptyState,
  ForbiddenState,
  UnauthorizedState,
} from "@/components/states/data-states";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { toApprovalsPageView } from "@/lib/features/approvals/adapters";
import { getPageAuthContext } from "@/lib/server/auth-context";
import { listTeacherApprovals } from "@/lib/server/approvals-service";

export default async function ApprovalsPage() {
  const result = listTeacherApprovals(await getPageAuthContext());

  if (!result.ok) {
    if (result.status === 401) {
      return <UnauthorizedState />;
    }

    return <ForbiddenState message={result.message} />;
  }

  const view = toApprovalsPageView(result.data);

  if (view.approvals.length === 0) {
    return (
      <EmptyState
        title="No approvals yet"
        message="Lesson plans, assessments, and reports submitted for review will appear here."
        action={{ label: "Open assessments", href: "/assessments", icon: "assignment" }}
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
            Approvals
          </h1>
          <p className="mt-2 text-body-lg text-muted">
            Track submitted lesson plans, assessments, and reports through review decisions.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
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
              Review with Pal
            </Link>
          )}
        </div>
      </header>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <MetricCard icon="verified_user" label="Requests" value={String(view.totalApprovals)} />
        <MetricCard icon="schedule" label="Pending" value={String(view.pendingCount)} />
        <MetricCard
          icon="priority_high"
          label="Changes"
          value={String(view.changesRequestedCount)}
        />
        <MetricCard icon="task_alt" label="Approved" value={String(view.approvedCount)} />
      </section>

      <div className="grid grid-cols-12 gap-6">
        <section className="col-span-12 grid grid-cols-1 gap-4 xl:col-span-8 xl:grid-cols-2">
          {view.approvals.map((approval) => (
            <ApprovalCard key={approval.id} approval={approval} />
          ))}
        </section>

        <aside className="col-span-12 space-y-6 xl:col-span-4">
          <Card>
            <div className="flex items-center gap-2">
              <Icon name="verified_user" className="text-primary" />
              <h2 className="font-display text-headline-sm text-foreground">Review Scope</h2>
            </div>
            <p className="mt-3 text-body-md text-muted">
              Teachers see submitted work in their scope. Reviewers can act on all active
              workspace approval requests.
            </p>
          </Card>

          <Card>
            <div className="flex items-center gap-2">
              <Icon name="monitoring" className="text-primary" />
              <h2 className="font-display text-headline-sm text-foreground">Queue Health</h2>
            </div>
            <div className="mt-4 space-y-3">
              <ProgressFact label="High priority" value={String(view.highPriorityCount)} />
              <ProgressFact
                label="Can review"
                value={view.canReviewApprovals ? "Enabled" : "Read-only"}
              />
            </div>
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
