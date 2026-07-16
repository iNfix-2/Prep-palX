import Link from "next/link";
import { taskStatusOptions } from "@/lib/features/tasks/adapters";
import type { TaskDetailView } from "@/lib/features/tasks/types";
import { cn } from "@/lib/cn";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";

const toneClass = {
  approved: "border-status-approved/20 bg-status-approved/10 text-status-approved",
  review: "border-status-review/20 bg-status-review/10 text-status-review",
  draft: "border-status-draft/20 bg-status-draft/10 text-status-draft",
  changes: "border-error/20 bg-error/10 text-error",
} as const;

export function TaskDetail({
  view,
  statusAction,
}: {
  view: TaskDetailView;
  statusAction: (formData: FormData) => Promise<void>;
}) {
  return (
    <div className="mx-auto w-full max-w-(--container-max) space-y-6">
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div className="max-w-3xl">
          <Link
            href="/my-tasks"
            className="mb-3 inline-flex items-center gap-1 text-body-md font-semibold text-primary hover:underline"
          >
            <Icon name="chevron_right" className="rotate-180 text-[16px]" />
            My Tasks
          </Link>
          <p className="text-label-md font-bold uppercase tracking-wider text-muted">
            {view.workspaceName} / {view.classLabel}
          </p>
          <h1 className="mt-2 font-display text-display-lg font-extrabold text-foreground">
            {view.title}
          </h1>
          <p className="mt-2 text-body-lg text-muted">{view.description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {view.sourceHref && (
            <Link
              href={view.sourceHref}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-body-md font-semibold text-on-primary transition-colors hover:bg-primary-hover"
            >
              <Icon name="launch" className="text-[18px]" />
              Open source
            </Link>
          )}
          {view.classHref && (
            <Link
              href={view.classHref}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-surface-border bg-surface px-4 text-body-md font-semibold text-foreground transition-colors hover:bg-background"
            >
              <Icon name="groups" className="text-[18px]" />
              Open class
            </Link>
          )}
        </div>
      </header>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <SummaryCard icon={view.categoryIcon} label="Category" value={view.categoryLabel} />
        <SummaryCard icon="schedule" label="Due" value={view.dueLabel} />
        <SummaryCard icon="person_check" label="Assigned" value={view.assignedLabel} />
        <SummaryCard icon="history" label="Updated" value={view.updatedLabel} />
      </section>

      <div className="grid grid-cols-12 gap-6">
        <section className="col-span-12 space-y-6 lg:col-span-8">
          <Card>
            <div className="flex flex-wrap gap-2">
              <Badge label={view.statusLabel} tone={view.statusTone} />
              <Badge label={view.priorityLabel} tone={view.priorityTone} />
              {view.aiSuggested && (
                <span className="rounded-full border border-ai/20 bg-ai/10 px-2.5 py-1 text-label-sm font-bold text-ai">
                  Pal suggested
                </span>
              )}
            </div>
            <h2 className="mt-5 font-display text-headline-sm text-foreground">Task Brief</h2>
            <p className="mt-3 text-body-md leading-relaxed text-muted">{view.description}</p>
            {view.blockedReason && (
              <div className="mt-4 rounded-lg border border-error/20 bg-error/10 p-4 text-body-md text-error">
                {view.blockedReason}
              </div>
            )}
          </Card>

          <Card className="p-0">
            <div className="border-b border-surface-border p-6">
              <h2 className="font-display text-headline-sm text-foreground">Activity</h2>
            </div>
            <div className="divide-y divide-surface-border">
              {view.activities.length === 0 ? (
                <p className="p-6 text-body-md text-muted">No activity has been added yet.</p>
              ) : (
                view.activities.map((activity) => (
                  <div key={activity.id} className="p-5">
                    <div className="flex flex-col justify-between gap-2 md:flex-row">
                      <p className="text-body-md font-bold text-foreground">
                        {activity.authorName}
                      </p>
                      <p className="text-label-sm text-muted">
                        {formatDateTime(activity.createdAt)}
                      </p>
                    </div>
                    <p className="mt-1 text-label-sm text-muted">{activity.authorRole}</p>
                    <p className="mt-3 text-body-md text-muted">{activity.body}</p>
                  </div>
                ))
              )}
            </div>
          </Card>
        </section>

        <aside className="col-span-12 space-y-6 lg:col-span-4">
          {view.canManageTasks && (
            <Card>
              <h2 className="font-display text-headline-sm text-foreground">Update Status</h2>
              <form action={statusAction} className="mt-4 space-y-4">
                <label className="block">
                  <span className="text-label-md font-bold uppercase tracking-wider text-muted">
                    Status
                  </span>
                  <select
                    name="status"
                    defaultValue={view.status}
                    className="mt-2 h-11 w-full rounded-md border border-surface-border bg-background px-3 text-body-md text-foreground"
                  >
                    {taskStatusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="text-label-md font-bold uppercase tracking-wider text-muted">
                    Note
                  </span>
                  <textarea
                    name="note"
                    rows={4}
                    maxLength={500}
                    className="mt-2 w-full rounded-md border border-surface-border bg-background px-3 py-2 text-body-md text-foreground"
                    placeholder="Add a short update"
                  />
                </label>
                <button
                  type="submit"
                  className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-body-md font-semibold text-on-primary transition-colors hover:bg-primary-hover"
                >
                  <Icon name="task_alt" className="text-[18px]" />
                  Save status
                </button>
              </form>
            </Card>
          )}

          <Card>
            <h2 className="font-display text-headline-sm text-foreground">Context</h2>
            <div className="mt-4 space-y-3">
              <Fact icon="person_check" label={view.ownerLabel} />
              <Fact icon="schedule" label={view.createdLabel} />
              {view.completedLabel && <Fact icon="task_alt" label={view.completedLabel} />}
              {view.sourceLabel && <Fact icon="link" label={view.sourceLabel} />}
            </div>
          </Card>

          {view.canUseAi && (
            <Card className="border-ai/20 bg-ai text-on-ai">
              <div className="flex items-center gap-2">
                <Icon name="smart_toy" filled />
                <h2 className="text-body-lg font-bold">Pal Task Help</h2>
              </div>
              <p className="mt-3 text-body-md text-white/90">
                Ask Pal to break this task into a shorter checklist or draft a follow-up note.
              </p>
              <Link
                href="/ask-pal"
                className="mt-4 inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-body-md font-bold text-ai transition-opacity hover:opacity-90"
              >
                Ask Pal
                <Icon name="chevron_right" className="text-[16px]" />
              </Link>
            </Card>
          )}
        </aside>
      </div>
    </div>
  );
}

function SummaryCard({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-label-md font-bold uppercase tracking-wider text-muted">{label}</p>
          <p className="mt-2 truncate font-display text-headline-sm text-foreground">{value}</p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
          <Icon name={icon} />
        </div>
      </div>
    </Card>
  );
}

function Badge({
  label,
  tone,
}: {
  label: string;
  tone: keyof typeof toneClass;
}) {
  return (
    <span className={cn("rounded-full border px-2.5 py-1 font-bold", toneClass[tone])}>
      {label}
    </span>
  );
}

function Fact({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <Icon name={icon} className="text-primary" />
      <span className="truncate text-body-md text-foreground">{label}</span>
    </div>
  );
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(new Date(value));
}
