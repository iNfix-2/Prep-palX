import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import type { ReportClassCardView } from "@/lib/features/reports/types";

const statusClasses = {
  approved: "border-status-approved/20 bg-status-approved/10 text-status-approved",
  review: "border-status-review/20 bg-status-review/10 text-status-review",
  draft: "border-status-draft/20 bg-status-draft/10 text-status-draft",
} as const;

export function ReportClassCard({ report }: { report: ReportClassCardView }) {
  return (
    <Link href={report.href} className="block h-full">
      <Card className="flex h-full flex-col gap-5 p-5 transition-colors hover:border-primary">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-label-md font-bold uppercase tracking-wider text-muted">
              {report.subjectLabel}
            </p>
            <h2 className="mt-1 font-display text-headline-sm text-foreground">
              {report.title}
            </h2>
            <p className="mt-1 text-body-md text-muted">{report.room}</p>
          </div>
          <span
            className={cn(
              "shrink-0 rounded-full border px-2.5 py-1 text-label-sm font-bold",
              statusClasses[report.statusTone],
            )}
          >
            {report.statusLabel}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-body-md">
          <Meta icon="groups" label={report.learnerLabel} />
          <Meta icon="task_alt" label={report.readyLabel} />
          <Meta icon="description" label={report.commentLabel} />
          <Meta icon="priority_high" label={report.missingScoreLabel} />
        </div>

        <div className="rounded-lg border border-surface-border bg-background p-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-body-md font-bold text-foreground">
              {report.readinessPercent}% ready
            </p>
            <p className="text-body-md text-muted">{report.averageScoreLabel}</p>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-border">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${report.readinessPercent}%` }}
            />
          </div>
          <p className="mt-2 text-label-sm text-muted">{report.attendanceLabel}</p>
        </div>

        <div className="mt-auto inline-flex items-center gap-2 text-body-md font-bold text-primary">
          Open report
          <Icon name="chevron_right" className="text-[16px]" />
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
