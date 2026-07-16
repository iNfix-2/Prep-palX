import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import type { AttendanceClassCardView } from "@/lib/features/attendance/types";

const statusClasses = {
  approved: "border-status-approved/20 bg-status-approved/10 text-status-approved",
  review: "border-status-review/20 bg-status-review/10 text-status-review",
  draft: "border-status-draft/20 bg-status-draft/10 text-status-draft",
} as const;

export function AttendanceClassCard({ classItem }: { classItem: AttendanceClassCardView }) {
  return (
    <Link href={classItem.href} className="block h-full">
      <Card className="flex h-full flex-col gap-5 p-5 transition-colors hover:border-primary">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-label-md font-bold uppercase tracking-wider text-muted">
              {classItem.meta}
            </p>
            <h2 className="mt-1 font-display text-headline-sm text-foreground">
              {classItem.title}
            </h2>
            <p className="mt-1 text-body-md text-muted">{classItem.room}</p>
          </div>
          <span
            className={cn(
              "shrink-0 rounded-full border px-2.5 py-1 text-label-sm font-bold",
              statusClasses[classItem.statusTone],
            )}
          >
            {classItem.statusLabel}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-body-md">
          <ClassMeta icon="groups" label={classItem.learnerLabel} />
          <ClassMeta icon="how_to_reg" label={classItem.markedLabel} />
        </div>

        <div className="grid grid-cols-4 gap-2 text-center">
          <CountTile label="Present" value={classItem.counts.present} />
          <CountTile label="Absent" value={classItem.counts.absent} />
          <CountTile label="Late" value={classItem.counts.late} />
          <CountTile label="Pending" value={classItem.counts.pending} />
        </div>

        <div className="mt-auto inline-flex items-center gap-2 text-body-md font-bold text-primary">
          Open register
          <Icon name="chevron_right" className="text-[16px]" />
        </div>
      </Card>
    </Link>
  );
}

function ClassMeta({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex min-w-0 items-center gap-2 rounded-lg bg-background px-3 py-2 text-muted">
      <Icon name={icon} className="text-[18px]" />
      <span className="truncate">{label}</span>
    </div>
  );
}

function CountTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-surface-border bg-background px-2 py-3">
      <p className="font-display text-headline-sm text-foreground">{value}</p>
      <p className="mt-1 text-label-sm text-muted">{label}</p>
    </div>
  );
}
