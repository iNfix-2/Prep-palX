import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import type { TimetableEventCardView } from "@/lib/features/timetable/types";

const statusClasses = {
  draft: "border-status-draft/20 bg-status-draft/10 text-status-draft",
  review: "border-status-review/20 bg-status-review/10 text-status-review",
  approved: "border-status-approved/20 bg-status-approved/10 text-status-approved",
  changes: "border-error/20 bg-error/10 text-error",
} as const;

const preparationClasses = {
  approved: "border-status-approved/20 bg-status-approved/10 text-status-approved",
  review: "border-status-review/20 bg-status-review/10 text-status-review",
  changes: "border-error/20 bg-error/10 text-error",
} as const;

const typeIcon = {
  primary: "auto_stories",
  review: "assignment",
  approved: "groups",
  neutral: "calendar_today",
} as const;

export function TimetableEventCard({ event }: { event: TimetableEventCardView }) {
  return (
    <Link href={event.href} className="block">
      <Card className="grid grid-cols-1 gap-5 p-5 transition-colors hover:border-primary md:grid-cols-[96px_1fr]">
        <div className="rounded-lg border border-primary/20 bg-primary/10 p-3 text-primary">
          <p className="font-display text-headline-sm leading-none">{event.timeRangeLabel}</p>
        </div>

        <div className="min-w-0 space-y-4">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
            <div className="min-w-0">
              <p className="text-label-md font-bold uppercase tracking-wider text-muted">
                {event.classLabel}
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
                  preparationClasses[event.preparationTone],
                )}
              >
                {event.preparationLabel}
              </span>
            </div>
          </div>

          <p className="text-body-md leading-relaxed text-muted">{event.notes}</p>

          <div className="grid grid-cols-1 gap-3 text-body-md md:grid-cols-3">
            <Meta icon={typeIcon[event.typeTone]} label={event.typeLabel} />
            <Meta icon="location_on" label={event.locationLabel} />
            <Meta icon="schedule" label="Open event" />
          </div>
        </div>
      </Card>
    </Link>
  );
}

function Meta({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex min-w-0 items-center gap-2 rounded-lg bg-background px-3 py-2 text-muted">
      <Icon name={icon} className="text-[18px]" />
      <span className="truncate">{label}</span>
    </div>
  );
}
