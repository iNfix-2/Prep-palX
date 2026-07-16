import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import type { AcademicCalendarEventCardView } from "@/lib/features/academic-calendar/types";

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

const typeClasses = {
  primary: "border-primary/20 bg-primary/10 text-primary",
  review: "border-status-review/20 bg-status-review/10 text-status-review",
  approved: "border-status-approved/20 bg-status-approved/10 text-status-approved",
  neutral: "border-surface-border bg-background text-muted",
} as const;

export function CalendarEventCard({ event }: { event: AcademicCalendarEventCardView }) {
  return (
    <Link href={event.href} className="block">
      <Card className="grid grid-cols-1 gap-5 p-5 transition-colors hover:border-primary md:grid-cols-[120px_1fr]">
        <div className="rounded-lg border border-primary/20 bg-primary/10 p-3 text-primary">
          <p className="font-display text-headline-sm leading-tight">{event.shortDateLabel}</p>
          <p className="mt-2 text-label-md font-bold uppercase tracking-wider">
            {event.relativeLabel}
          </p>
        </div>

        <div className="min-w-0 space-y-4">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
            <div className="min-w-0">
              <p className="text-label-md font-bold uppercase tracking-wider text-muted">
                {event.scopeLabel}
              </p>
              <h2 className="mt-1 font-display text-headline-sm text-foreground">
                {event.title}
              </h2>
              <p className="mt-1 text-body-md text-muted">{event.subjectLabel}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span
                className={cn(
                  "rounded-full border px-2.5 py-1 text-label-sm font-bold",
                  statusClasses[event.statusTone],
                )}
              >
                {event.statusLabel}
              </span>
              <span
                className={cn(
                  "rounded-full border px-2.5 py-1 text-label-sm font-bold",
                  priorityClasses[event.priorityTone],
                )}
              >
                {event.priorityLabel}
              </span>
            </div>
          </div>

          <p className="text-body-md leading-relaxed text-muted">{event.description}</p>

          <div className="grid grid-cols-1 gap-3 text-body-md md:grid-cols-3">
            <Meta
              icon={event.typeIcon}
              label={event.typeLabel}
              className={typeClasses[event.typeTone]}
            />
            <Meta icon="calendar_today" label={event.dateRangeLabel} />
            <Meta icon="location_on" label={event.locationLabel} />
          </div>
        </div>
      </Card>
    </Link>
  );
}

function Meta({
  icon,
  label,
  className,
}: {
  icon: string;
  label: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-w-0 items-center gap-2 rounded-lg border border-transparent bg-background px-3 py-2 text-muted",
        className,
      )}
    >
      <Icon name={icon} className="text-[18px]" />
      <span className="truncate">{label}</span>
    </div>
  );
}
