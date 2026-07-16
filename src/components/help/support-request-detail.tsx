import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { supportStatusOptions } from "@/lib/features/help/adapters";
import type { SupportRequestDetailView } from "@/lib/features/help/types";

const toneClass = {
  approved: "border-status-approved/20 bg-status-approved/10 text-status-approved",
  review: "border-status-review/20 bg-status-review/10 text-status-review",
  draft: "border-status-draft/20 bg-status-draft/10 text-status-draft",
  changes: "border-error/20 bg-error/10 text-error",
} as const;

export function SupportRequestDetail({
  view,
  messageAction,
}: {
  view: SupportRequestDetailView;
  messageAction: (formData: FormData) => Promise<void>;
}) {
  return (
    <div className="mx-auto w-full max-w-(--container-max) space-y-6">
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div className="max-w-3xl">
          <Link
            href="/help"
            className="mb-3 inline-flex items-center gap-1 text-body-md font-semibold text-primary hover:underline"
          >
            <Icon name="chevron_right" className="rotate-180 text-[16px]" />
            Help Centre
          </Link>
          <p className="text-label-md font-bold uppercase tracking-wider text-muted">
            {view.workspaceName} / {view.categoryLabel}
          </p>
          <h1 className="mt-2 font-display text-display-lg font-extrabold text-foreground">
            {view.title}
          </h1>
          <p className="mt-2 text-body-lg text-muted">{view.summary}</p>
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
        <SummaryCard icon={view.categoryIcon} label="Category" value={view.categoryLabel} />
        <SummaryCard icon="help" label="Status" value={view.statusLabel} />
        <SummaryCard icon="priority_high" label="Priority" value={view.priorityLabel} />
        <SummaryCard icon="chat_spark" label="Messages" value={view.messageLabel} />
      </section>

      <div className="grid grid-cols-12 gap-6">
        <section className="col-span-12 space-y-6 lg:col-span-8">
          <Card>
            <div className="flex flex-wrap gap-2">
              <Badge label={view.statusLabel} tone={view.statusTone} />
              <Badge label={view.priorityLabel} tone={view.priorityTone} />
            </div>
            <h2 className="mt-5 font-display text-headline-sm text-foreground">
              Request Summary
            </h2>
            <p className="mt-3 text-body-md leading-relaxed text-muted">{view.summary}</p>
          </Card>

          <Card className="p-0">
            <div className="border-b border-surface-border p-6">
              <h2 className="font-display text-headline-sm text-foreground">
                Request Conversation
              </h2>
            </div>
            <div className="divide-y divide-surface-border">
              {view.messages.map((message) => (
                <div key={message.id} className="p-5">
                  <div className="flex flex-col justify-between gap-2 md:flex-row">
                    <p className="text-body-md font-bold text-foreground">
                      {message.authorName}
                    </p>
                    <p className="text-label-sm text-muted">
                      {formatDateTime(message.createdAt)}
                    </p>
                  </div>
                  <p className="mt-1 text-label-sm text-muted">{message.authorRole}</p>
                  <p className="mt-3 text-body-md text-muted">{message.body}</p>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <aside className="col-span-12 space-y-6 lg:col-span-4">
          {view.canAddMessage && (
            <Card>
              <h2 className="font-display text-headline-sm text-foreground">Add Update</h2>
              <form action={messageAction} className="mt-4 space-y-4">
                <label className="block">
                  <span className="text-label-md font-bold uppercase tracking-wider text-muted">
                    Message
                  </span>
                  <textarea
                    name="body"
                    rows={5}
                    maxLength={800}
                    required
                    className="mt-2 w-full rounded-md border border-surface-border bg-background px-3 py-2 text-body-md text-foreground"
                    placeholder="Add a short update"
                  />
                </label>
                {view.canManageSupport && (
                  <label className="block">
                    <span className="text-label-md font-bold uppercase tracking-wider text-muted">
                      Status
                    </span>
                    <select
                      name="status"
                      className="mt-2 h-11 w-full rounded-md border border-surface-border bg-background px-3 text-body-md text-foreground"
                    >
                      {supportStatusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
                <button
                  type="submit"
                  className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-body-md font-semibold text-on-primary transition-colors hover:bg-primary-hover"
                >
                  <Icon name="send" className="text-[18px]" />
                  Send update
                </button>
              </form>
            </Card>
          )}

          <Card>
            <h2 className="font-display text-headline-sm text-foreground">Request Context</h2>
            <div className="mt-4 space-y-3">
              <Fact icon="person_check" label={view.createdByLabel} />
              <Fact icon="help" label={view.assignedSupportLabel} />
              <Fact icon="history" label={view.createdLabel} />
              {view.resolvedLabel && <Fact icon="task_alt" label={view.resolvedLabel} />}
              {view.sourceLabel && <Fact icon="link" label={view.sourceLabel} />}
            </div>
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
