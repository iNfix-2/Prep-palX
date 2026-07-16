import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import type { AssessmentCardView } from "@/lib/features/assessments/types";

const statusClasses = {
  draft: "border-status-draft/20 bg-status-draft/10 text-status-draft",
  review: "border-status-review/20 bg-status-review/10 text-status-review",
  approved: "border-status-approved/20 bg-status-approved/10 text-status-approved",
} as const;

export function AssessmentCard({ assessment }: { assessment: AssessmentCardView }) {
  return (
    <Link href={assessment.href} className="block h-full">
      <Card className="flex h-full flex-col gap-5 p-5 transition-colors hover:border-primary">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-label-md font-bold uppercase tracking-wider text-muted">
              {assessment.classLabel}
            </p>
            <h2 className="mt-1 font-display text-headline-sm text-foreground">
              {assessment.title}
            </h2>
            <p className="mt-1 text-body-md text-muted">{assessment.subjectLabel}</p>
          </div>
          <span
            className={cn(
              "shrink-0 rounded-full border px-2.5 py-1 text-label-sm font-bold",
              statusClasses[assessment.statusTone],
            )}
          >
            {assessment.statusLabel}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-body-md">
          <Meta icon="assignment" label={assessment.typeLabel} />
          <Meta icon="grading" label={assessment.marksLabel} />
          <Meta icon="calendar_today" label={assessment.scheduledLabel} />
          <Meta icon="checklist" label={assessment.itemLabel} />
        </div>

        <div>
          <div className="mb-1 flex justify-between gap-3 text-label-sm">
            <span className="font-bold text-foreground">Readiness</span>
            <span className="text-muted">{assessment.readinessPercent}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-background">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${assessment.readinessPercent}%` }}
            />
          </div>
        </div>

        <div className="mt-auto inline-flex items-center gap-2 text-body-md font-bold text-primary">
          Open assessment
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
