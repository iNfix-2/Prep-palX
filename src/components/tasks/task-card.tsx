import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import type { TaskCardView } from "@/lib/features/tasks/types";

const toneClass = {
  approved: "border-status-approved/20 bg-status-approved/10 text-status-approved",
  review: "border-status-review/20 bg-status-review/10 text-status-review",
  draft: "border-status-draft/20 bg-status-draft/10 text-status-draft",
  changes: "border-error/20 bg-error/10 text-error",
} as const;

export function TaskCard({ task }: { task: TaskCardView }) {
  return (
    <Link href={task.href} className="block">
      <Card className="grid grid-cols-1 gap-5 p-5 transition-colors hover:border-primary md:grid-cols-[64px_1fr]">
        <div className="flex h-16 w-full items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary md:h-full">
          <Icon name={task.categoryIcon} className="text-[28px]" />
        </div>
        <div className="min-w-0 space-y-4">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
            <div className="min-w-0">
              <p className="text-label-md font-bold uppercase tracking-wider text-muted">
                {task.classLabel}
              </p>
              <h2 className="mt-1 font-display text-headline-sm text-foreground">
                {task.title}
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge label={task.statusLabel} tone={task.statusTone} />
              <Badge label={task.priorityLabel} tone={task.priorityTone} />
            </div>
          </div>

          <p className="text-body-md leading-relaxed text-muted">{task.description}</p>

          <div className="grid grid-cols-1 gap-3 text-body-md md:grid-cols-3">
            <Meta icon="schedule" label={task.dueLabel} />
            <Meta icon={task.categoryIcon} label={task.categoryLabel} />
            <Meta icon="person_check" label={task.assignedLabel} />
          </div>

          {(task.sourceLabel || task.aiSuggested) && (
            <div className="flex flex-wrap gap-2">
              {task.sourceLabel && (
                <span className="rounded-full border border-surface-border bg-background px-2.5 py-1 text-label-sm font-semibold text-muted">
                  {task.sourceLabel}
                </span>
              )}
              {task.aiSuggested && (
                <span className="rounded-full border border-ai/20 bg-ai/10 px-2.5 py-1 text-label-sm font-semibold text-ai">
                  Pal suggested
                </span>
              )}
            </div>
          )}
        </div>
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
