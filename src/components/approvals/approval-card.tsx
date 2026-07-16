import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import type { ApprovalCardView } from "@/lib/features/approvals/types";

const toneClasses = {
  approved: "border-status-approved/20 bg-status-approved/10 text-status-approved",
  review: "border-status-review/20 bg-status-review/10 text-status-review",
  draft: "border-status-draft/20 bg-status-draft/10 text-status-draft",
} as const;

export function ApprovalCard({ approval }: { approval: ApprovalCardView }) {
  return (
    <Link href={approval.href} className="block h-full">
      <Card className="flex h-full flex-col gap-5 p-5 transition-colors hover:border-primary">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-label-md font-bold uppercase tracking-wider text-muted">
              {approval.resourceLabel}
            </p>
            <h2 className="mt-1 font-display text-headline-sm text-foreground">
              {approval.title}
            </h2>
            <p className="mt-1 text-body-md text-muted">{approval.classLabel}</p>
          </div>
          <span
            className={cn(
              "shrink-0 rounded-full border px-2.5 py-1 text-label-sm font-bold",
              toneClasses[approval.statusTone],
            )}
          >
            {approval.statusLabel}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-body-md">
          <Meta icon="calendar_today" label={approval.dueLabel} />
          <Meta icon="priority_high" label={approval.priorityLabel} />
          <Meta icon="person_check" label={approval.submittedByLabel} />
          <Meta icon="description" label={approval.noteLabel} />
        </div>

        <div className="rounded-lg border border-surface-border bg-background p-3">
          <p className="text-body-md font-semibold text-foreground">{approval.reviewerLabel}</p>
        </div>

        <div className="mt-auto inline-flex items-center gap-2 text-body-md font-bold text-primary">
          Open review
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
