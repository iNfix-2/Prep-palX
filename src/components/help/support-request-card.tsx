import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import type { SupportRequestCardView } from "@/lib/features/help/types";

const toneClass = {
  approved: "border-status-approved/20 bg-status-approved/10 text-status-approved",
  review: "border-status-review/20 bg-status-review/10 text-status-review",
  draft: "border-status-draft/20 bg-status-draft/10 text-status-draft",
  changes: "border-error/20 bg-error/10 text-error",
} as const;

export function SupportRequestCard({ request }: { request: SupportRequestCardView }) {
  return (
    <Link href={request.href} className="block">
      <Card className="space-y-4 p-5 transition-colors hover:border-primary">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
          <div className="min-w-0">
            <p className="text-label-md font-bold uppercase tracking-wider text-muted">
              {request.categoryLabel}
            </p>
            <h2 className="mt-1 font-display text-headline-sm text-foreground">
              {request.title}
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge label={request.statusLabel} tone={request.statusTone} />
            <Badge label={request.priorityLabel} tone={request.priorityTone} />
          </div>
        </div>
        <p className="text-body-md leading-relaxed text-muted">{request.summary}</p>
        <div className="grid grid-cols-1 gap-3 text-body-md md:grid-cols-2">
          <Meta icon="person_check" label={request.createdByLabel} />
          <Meta icon="help" label={request.assignedSupportLabel} />
          <Meta icon="history" label={request.updatedLabel} />
          <Meta icon="chat_spark" label={request.messageLabel} />
        </div>
        {request.sourceLabel && (
          <span className="inline-flex rounded-full border border-surface-border bg-background px-2.5 py-1 text-label-sm font-semibold text-muted">
            {request.sourceLabel}
          </span>
        )}
      </Card>
    </Link>
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

function Meta({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex min-w-0 items-center gap-2 rounded-lg bg-background px-3 py-2 text-muted">
      <Icon name={icon} className="text-[18px]" />
      <span className="truncate">{label}</span>
    </div>
  );
}
