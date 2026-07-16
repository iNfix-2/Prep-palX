import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import type { ResourceCardView } from "@/lib/features/resources/types";

const statusClasses = {
  draft: "border-status-draft/20 bg-status-draft/10 text-status-draft",
  review: "border-status-review/20 bg-status-review/10 text-status-review",
  approved: "border-status-approved/20 bg-status-approved/10 text-status-approved",
  changes: "border-error/20 bg-error/10 text-error",
} as const;

const originClasses = {
  primary: "border-primary/20 bg-primary/10 text-primary",
  approved: "border-status-approved/20 bg-status-approved/10 text-status-approved",
  ai: "border-ai/20 bg-ai/10 text-ai",
} as const;

const typeClasses = {
  primary: "border-primary/20 bg-primary/10 text-primary",
  review: "border-status-review/20 bg-status-review/10 text-status-review",
  approved: "border-status-approved/20 bg-status-approved/10 text-status-approved",
  neutral: "border-surface-border bg-background text-muted",
  ai: "border-ai/20 bg-ai/10 text-ai",
} as const;

export function ResourceCard({ resource }: { resource: ResourceCardView }) {
  return (
    <Link href={resource.href} className="block">
      <Card className="grid grid-cols-1 gap-5 p-5 transition-colors hover:border-primary md:grid-cols-[96px_1fr]">
        <div
          className={cn(
            "flex h-24 w-full items-center justify-center rounded-lg border md:h-full",
            typeClasses[resource.typeTone],
          )}
        >
          <Icon name={resource.typeIcon} className="text-[30px]" />
        </div>

        <div className="min-w-0 space-y-4">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
            <div className="min-w-0">
              <p className="text-label-md font-bold uppercase tracking-wider text-muted">
                {resource.scopeLabel}
              </p>
              <h2 className="mt-1 font-display text-headline-sm text-foreground">
                {resource.title}
              </h2>
              <p className="mt-1 text-body-md text-muted">{resource.subjectLabel}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span
                className={cn(
                  "rounded-full border px-2.5 py-1 text-label-sm font-bold",
                  statusClasses[resource.statusTone],
                )}
              >
                {resource.statusLabel}
              </span>
              <span
                className={cn(
                  "rounded-full border px-2.5 py-1 text-label-sm font-bold",
                  originClasses[resource.originTone],
                )}
              >
                {resource.originLabel}
              </span>
            </div>
          </div>

          <p className="text-body-md leading-relaxed text-muted">{resource.description}</p>

          <div className="flex flex-wrap gap-2">
            {resource.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-surface-border bg-background px-2.5 py-1 text-label-sm font-semibold text-muted"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-3 text-body-md md:grid-cols-3">
            <Meta icon={resource.fileIcon} label={`${resource.fileLabel} / ${resource.sizeLabel}`} />
            <Meta icon="history" label={resource.lastUsedLabel} />
            <Meta icon="analytics" label={resource.usageLabel} />
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
