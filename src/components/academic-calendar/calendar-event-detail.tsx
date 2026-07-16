import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import type { AcademicCalendarEventDetailView } from "@/lib/features/academic-calendar/types";

const statusClasses = {
  draft: "border-status-draft/20 bg-status-draft/10 text-status-draft",
  review: "border-status-review/20 bg-status-review/10 text-status-review",
  approved: "border-status-approved/20 bg-status-approved/10 text-status-approved",
  changes: "border-error/20 bg-error/10 text-error",
} as const;

const priorityClasses = {
  neutral: "border-surface-border bg-background text-muted",
  review: "border-status-review/20 bg-status-review/10 text-status-review",
  changes: "border-error/20 bg-error/10 text-error",
} as const;

export function CalendarEventDetail({ view }: { view: AcademicCalendarEventDetailView }) {
  return (
    <div className="mx-auto w-full max-w-(--container-max) space-y-6">
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div className="max-w-3xl">
          <Link
            href="/academic-calendar"
            className="mb-3 inline-flex items-center gap-1 text-body-md font-semibold text-primary hover:underline"
          >
            <Icon name="chevron_right" className="rotate-180 text-[16px]" />
            Academic Calendar
          </Link>
          <p className="text-label-md font-bold uppercase tracking-wider text-muted">
            {view.workspaceName} / {view.scopeLabel}
          </p>
          <h1 className="mt-2 font-display text-display-lg font-extrabold text-foreground">
            {view.title}
          </h1>
          <p className="mt-2 text-body-lg text-muted">{view.dateRangeLabel}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {view.classHref && (
            <Link
              href={view.classHref}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-body-md font-semibold text-on-primary transition-colors hover:bg-primary-hover"
            >
              <Icon name="groups" className="text-[18px]" />
              Open class
            </Link>
          )}
          <span
            className={cn(
              "inline-flex h-10 w-fit items-center rounded-full border px-3 text-body-md font-bold",
              statusClasses[view.statusTone],
            )}
          >
            {view.statusLabel}
          </span>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <SummaryCard icon="calendar_today" label="Starts" value={view.startLabel} />
        <SummaryCard icon="calendar_month" label="Ends" value={view.endLabel} />
        <SummaryCard icon={view.typeIcon} label="Type" value={view.typeLabel} />
        <SummaryCard icon="priority_high" label="Priority" value={view.priorityLabel} />
      </section>

      <div className="grid grid-cols-12 gap-6">
        <section className="col-span-12 space-y-6 lg:col-span-8">
          <Card>
            <h2 className="font-display text-headline-sm text-foreground">Calendar Brief</h2>
            <p className="mt-3 text-body-md leading-relaxed text-muted">{view.description}</p>
          </Card>

          <Card>
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 className="font-display text-headline-sm text-foreground">Required Action</h2>
                <p className="mt-3 text-body-md leading-relaxed text-muted">
                  {view.requiredAction}
                </p>
              </div>
              <span
                className={cn(
                  "inline-flex w-fit rounded-full border px-2.5 py-1 text-label-sm font-bold",
                  priorityClasses[view.priorityTone],
                )}
              >
                {view.priorityLabel}
              </span>
            </div>
          </Card>

          <Card className="p-0">
            <div className="border-b border-surface-border p-6">
              <h2 className="font-display text-headline-sm text-foreground">Linked Work</h2>
              <p className="mt-1 text-body-md text-muted">
                Open the planning surface connected to this calendar milestone.
              </p>
            </div>
            <div className="divide-y divide-surface-border">
              {view.timetableHref && (
                <LinkedRow
                  href={view.timetableHref}
                  icon="calendar_view_day"
                  title="Timetable event"
                  detail="Review the scheduled block connected to this milestone."
                />
              )}
              {view.assessmentHref && (
                <LinkedRow
                  href={view.assessmentHref}
                  icon="assignment"
                  title="Assessment"
                  detail="Open the assessment tied to this calendar window."
                />
              )}
              {view.reportHref && (
                <LinkedRow
                  href={view.reportHref}
                  icon="analytics"
                  title="Class report"
                  detail="Move into the report workspace for this deadline."
                />
              )}
              {view.classHref && (
                <LinkedRow
                  href={view.classHref}
                  icon="groups"
                  title="Class overview"
                  detail="Review class context and learner activity."
                />
              )}
              {!view.timetableHref && !view.assessmentHref && !view.reportHref && !view.classHref && (
                <div className="p-5 text-body-md text-muted">
                  No class, timetable, assessment, or report is linked to this event yet.
                </div>
              )}
            </div>
          </Card>
        </section>

        <aside className="col-span-12 space-y-6 lg:col-span-4">
          <Card>
            <h2 className="font-display text-headline-sm text-foreground">Scope</h2>
            <div className="mt-4 space-y-3">
              <Tag icon="verified_user" label={view.ownerName} />
              <Tag icon="school" label={view.subjectLabel} />
              <Tag icon="location_on" label={view.locationLabel} />
              <Tag icon="calendar_month" label={view.termLabel} />
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-2">
              <Icon name="schedule" className="text-primary" />
              <h2 className="font-display text-headline-sm text-foreground">Term Position</h2>
            </div>
            <p className="mt-3 font-display text-[28px] font-extrabold leading-none text-foreground">
              {view.termWeekLabel}
            </p>
            <p className="mt-2 text-body-md text-muted">
              This event is measured against the active academic year and term.
            </p>
          </Card>

          <Card className="border-ai/20 bg-ai text-on-ai">
            <div className="flex items-center gap-2">
              <Icon name="smart_toy" filled />
              <h2 className="text-body-lg font-bold">Pal Planning</h2>
            </div>
            <p className="mt-3 text-body-md text-white/90">
              Ask Pal to rebalance lesson pacing around this date and its linked work.
            </p>
            <Link
              href="/ask-pal"
              className="mt-4 inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-body-md font-bold text-ai transition-opacity hover:opacity-90"
            >
              Ask Pal
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

function LinkedRow({
  href,
  icon,
  title,
  detail,
}: {
  href: string;
  icon: string;
  title: string;
  detail: string;
}) {
  return (
    <Link href={href} className="grid grid-cols-[44px_1fr_24px] gap-3 p-5 hover:bg-background">
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon name={icon} />
      </span>
      <span>
        <span className="block text-body-lg font-bold text-foreground">{title}</span>
        <span className="block text-body-md text-muted">{detail}</span>
      </span>
      <Icon name="chevron_right" className="self-center text-[18px] text-muted" />
    </Link>
  );
}

function Tag({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <Icon name={icon} className="text-primary" />
      <span className="truncate text-body-md text-foreground">{label}</span>
    </div>
  );
}
