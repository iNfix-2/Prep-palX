import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import type { QuestionCardView, QuestionDifficulty } from "@/lib/features/question-bank/types";

const statusClasses = {
  draft: "border-status-draft/20 bg-status-draft/10 text-status-draft",
  review: "border-status-review/20 bg-status-review/10 text-status-review",
  approved: "border-status-approved/20 bg-status-approved/10 text-status-approved",
} as const;

const difficultyClasses: Record<QuestionDifficulty, string> = {
  easy: "border-status-approved/20 bg-status-approved/10 text-status-approved",
  medium: "border-primary/20 bg-primary/10 text-primary",
  hard: "border-error/20 bg-error/10 text-error",
};

export function QuestionCard({ question }: { question: QuestionCardView }) {
  return (
    <Link href={question.href} className="block h-full">
      <Card className="flex h-full flex-col gap-5 p-5 transition-colors hover:border-primary">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-label-md font-bold uppercase tracking-wider text-muted">
              {question.classLabel}
            </p>
            <h2 className="mt-1 font-display text-headline-sm leading-tight text-foreground">
              {question.prompt}
            </h2>
            <p className="mt-2 text-body-md text-muted">{question.subjectLabel}</p>
          </div>
          <span
            className={cn(
              "shrink-0 rounded-full border px-2.5 py-1 text-label-sm font-bold",
              statusClasses[question.statusTone],
            )}
          >
            {question.statusLabel}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          <Pill icon="quiz" label={question.typeLabel} />
          <span
            className={cn(
              "inline-flex min-h-8 items-center gap-2 rounded-lg border px-3 py-1 text-label-md font-bold",
              difficultyClasses[question.difficultyTone],
            )}
          >
            <Icon name="priority_high" className="text-[16px]" />
            {question.difficultyLabel}
          </span>
          <Pill icon="grading" label={question.marksLabel} />
          <Pill icon="history" label={question.usageLabel} />
        </div>

        <div className="grid grid-cols-1 gap-3 text-body-md md:grid-cols-2">
          <Meta icon="topic" label={question.topicLabel} />
          <Meta icon="task_alt" label={question.skillLabel} />
        </div>

        <div>
          <div className="mb-1 flex justify-between gap-3 text-label-sm">
            <span className="font-bold text-foreground">Quality</span>
            <span className="text-muted">{question.qualityPercent}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-background">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${question.qualityPercent}%` }}
            />
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 text-body-md">
          <span className="text-muted">{question.updatedLabel}</span>
          <span className="inline-flex items-center gap-2 font-bold text-primary">
            Open question
            <Icon name="chevron_right" className="text-[16px]" />
          </span>
        </div>
      </Card>
    </Link>
  );
}

function Pill({ icon, label }: { icon: string; label: string }) {
  return (
    <span className="inline-flex min-h-8 items-center gap-2 rounded-lg border border-surface-border bg-background px-3 py-1 text-label-md font-bold text-muted">
      <Icon name={icon} className="text-[16px]" />
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
