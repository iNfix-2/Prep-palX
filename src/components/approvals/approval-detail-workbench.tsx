import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import type { ApprovalDetailView } from "@/lib/features/approvals/types";

const toneClasses = {
  approved: "border-status-approved/20 bg-status-approved/10 text-status-approved",
  review: "border-status-review/20 bg-status-review/10 text-status-review",
  draft: "border-status-draft/20 bg-status-draft/10 text-status-draft",
} as const;

export function ApprovalDetailWorkbench({
  view,
  action,
  saved,
  error,
}: {
  view: ApprovalDetailView;
  action: (formData: FormData) => void | Promise<void>;
  saved?: boolean;
  error?: string;
}) {
  return (
    <div className="mx-auto w-full max-w-(--container-max) space-y-6">
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div className="max-w-3xl">
          <Link
            href="/approvals"
            className="mb-3 inline-flex items-center gap-1 text-body-md font-semibold text-primary hover:underline"
          >
            <Icon name="chevron_right" className="rotate-180 text-[16px]" />
            Approvals
          </Link>
          <p className="text-label-md font-bold uppercase tracking-wider text-muted">
            {view.workspaceName} / {view.classLabel}
          </p>
          <h1 className="mt-2 font-display text-display-lg font-extrabold text-foreground">
            {view.title}
          </h1>
          <p className="mt-2 text-body-lg text-muted">{view.summary}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={view.resourceHref}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-surface-border bg-surface px-4 text-body-md font-semibold text-foreground transition-colors hover:bg-background"
          >
            <Icon name="launch" className="text-[18px]" />
            Source
          </Link>
          <span
            className={cn(
              "inline-flex h-10 w-fit items-center rounded-full border px-3 text-body-md font-bold",
              toneClasses[view.statusTone],
            )}
          >
            {view.statusLabel}
          </span>
        </div>
      </header>

      {saved && (
        <div className="rounded-lg border border-status-approved/20 bg-status-approved/10 p-4 text-body-md font-semibold text-status-approved">
          Approval decision saved.
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-error/20 bg-error/10 p-4 text-body-md font-semibold text-error">
          Approval decision could not be saved. Check the review note and try again.
        </div>
      )}

      <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <SummaryCard icon="assignment" label="Type" value={view.resourceLabel} />
        <SummaryCard icon="priority_high" label="Priority" value={view.priorityLabel} />
        <SummaryCard icon="calendar_today" label="Due" value={view.dueLabel} />
        <SummaryCard icon="history" label="Updated" value={view.updatedLabel} />
      </section>

      <div className="grid grid-cols-12 gap-6">
        <section className="col-span-12 space-y-6 xl:col-span-8">
          <Card>
            <h2 className="font-display text-headline-sm text-foreground">Review Thread</h2>
            <div className="mt-4 space-y-3">
              {view.notes.length > 0 ? (
                view.notes.map((note) => (
                  <div
                    key={note.id}
                    className="rounded-lg border border-surface-border bg-background p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-body-md font-bold text-foreground">{note.authorName}</p>
                      <p className="text-label-sm text-muted">
                        {note.authorRole} / {formatDate(note.createdAt)}
                      </p>
                    </div>
                    <p className="mt-2 text-body-md text-muted">{note.body}</p>
                  </div>
                ))
              ) : (
                <p className="text-body-md text-muted">No review notes yet.</p>
              )}
            </div>
          </Card>

          {view.canReviewApprovals && (
            <form action={action} className="space-y-4">
              <Card>
                <h2 className="font-display text-headline-sm text-foreground">
                  Reviewer Decision
                </h2>
                <label className="mt-4 block space-y-2">
                  <span className="text-label-sm font-bold uppercase tracking-wider text-muted">
                    Review note
                  </span>
                  <textarea
                    name="note"
                    maxLength={500}
                    rows={5}
                    placeholder="Add a concise review note"
                    className="min-h-32 w-full rounded-md border border-surface-border bg-background px-3 py-2 text-body-md outline-none focus:ring-2 focus:ring-primary"
                  />
                </label>
              </Card>

              <div className="flex flex-wrap justify-end gap-2">
                <button
                  type="submit"
                  name="action"
                  value="request_changes"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-surface-border bg-surface px-4 text-body-md font-semibold text-foreground transition-colors hover:bg-background"
                >
                  <Icon name="priority_high" className="text-[18px]" />
                  Request changes
                </button>
                <button
                  type="submit"
                  name="action"
                  value="approve"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-body-md font-semibold text-on-primary transition-colors hover:bg-primary-hover"
                >
                  <Icon name="task_alt" className="text-[18px]" />
                  Approve
                </button>
              </div>
            </form>
          )}
        </section>

        <aside className="col-span-12 space-y-6 xl:col-span-4">
          <Card>
            <h2 className="font-display text-headline-sm text-foreground">Submission</h2>
            <div className="mt-4 space-y-3">
              <Fact icon="person_check" label="Submitted by" value={view.submittedByLabel} />
              <Fact icon="verified_user" label="Reviewer" value={view.reviewerLabel} />
              <Fact icon="calendar_month" label="Submitted" value={view.submittedLabel} />
            </div>
          </Card>

          <Card>
            <h2 className="font-display text-headline-sm text-foreground">Source Item</h2>
            <p className="mt-3 text-body-md text-muted">
              Open the linked source before approving assessment, report, or lesson-plan changes.
            </p>
            <Link
              href={view.resourceHref}
              className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-body-md font-semibold text-on-primary transition-colors hover:bg-primary-hover"
            >
              Open source
              <Icon name="chevron_right" className="text-[16px]" />
            </Link>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function SummaryCard({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-label-md font-bold uppercase tracking-wider text-muted">{label}</p>
          <p className="mt-2 font-display text-headline-sm text-foreground">{value}</p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
          <Icon name={icon} />
        </div>
      </div>
    </Card>
  );
}

function Fact({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-surface-border bg-background p-3">
      <div className="mb-1 flex items-center gap-2 text-muted">
        <Icon name={icon} className="text-[16px]" />
        <p className="text-label-sm font-bold uppercase">{label}</p>
      </div>
      <p className="text-body-md font-semibold text-foreground">{value}</p>
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}
