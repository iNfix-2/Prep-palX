import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import type { QuestionDetailView, QuestionDifficulty } from "@/lib/features/question-bank/types";

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

export function QuestionDetail({
  view,
  saved,
}: {
  view: QuestionDetailView;
  saved?: boolean;
}) {
  return (
    <div className="mx-auto w-full max-w-(--container-max) space-y-6">
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div className="max-w-3xl">
          <Link
            href="/question-bank"
            className="mb-3 inline-flex items-center gap-1 text-body-md font-semibold text-primary hover:underline"
          >
            <Icon name="chevron_right" className="rotate-180 text-[16px]" />
            Question Bank
          </Link>
          <p className="text-label-md font-bold uppercase tracking-wider text-muted">
            {view.workspaceName} / {view.classLabel}
          </p>
          <h1 className="mt-2 font-display text-display-lg font-extrabold text-foreground">
            Question Detail
          </h1>
          <p className="mt-2 text-body-lg text-muted">{view.prompt}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/assessments/new?classId=${encodeURIComponent(view.classId)}`}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-body-md font-semibold text-on-primary transition-colors hover:bg-primary-hover"
          >
            <Icon name="assignment_add" className="text-[18px]" />
            Use in assessment
          </Link>
          <span
            className={cn(
              "inline-flex h-10 w-fit items-center rounded-full border px-3 text-body-md font-bold",
              statusClasses[view.statusTone],
            )}
          >
            {view.statusLabel}
          </span>
        </div>
      </header>

      {saved && (
        <div className="rounded-lg border border-status-approved/20 bg-status-approved/10 p-4 text-body-md font-semibold text-status-approved">
          Question saved to the bank.
        </div>
      )}

      <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <SummaryCard icon="quiz" label="Type" value={view.typeLabel} />
        <SummaryCard icon="priority_high" label="Difficulty" value={view.difficultyLabel} />
        <SummaryCard icon="grading" label="Marks" value={view.marksLabel} />
        <SummaryCard icon="history" label="Usage" value={view.usageLabel} />
      </section>

      <div className="grid grid-cols-12 gap-6">
        <section className="col-span-12 space-y-6 lg:col-span-8">
          <Card>
            <h2 className="font-display text-headline-sm text-foreground">Prompt</h2>
            <p className="mt-3 text-body-lg leading-relaxed text-foreground">{view.prompt}</p>
          </Card>

          {view.options.length > 0 && (
            <Card className="p-0">
              <div className="border-b border-surface-border p-6">
                <h2 className="font-display text-headline-sm text-foreground">
                  Answer Options
                </h2>
              </div>
              <div className="divide-y divide-surface-border">
                {view.options.map((option, index) => (
                  <div
                    key={`${option}-${index}`}
                    className="grid grid-cols-[40px_1fr] gap-3 p-5"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-body-md font-bold text-primary">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <p className="text-body-lg font-semibold text-foreground">{option}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <Card>
            <h2 className="font-display text-headline-sm text-foreground">Answer</h2>
            <p className="mt-3 text-body-md leading-relaxed text-muted">{view.answer}</p>
          </Card>

          <Card>
            <h2 className="font-display text-headline-sm text-foreground">Explanation</h2>
            <p className="mt-3 text-body-md leading-relaxed text-muted">{view.explanation}</p>
          </Card>
        </section>

        <aside className="col-span-12 space-y-6 lg:col-span-4">
          <Card>
            <h2 className="font-display text-headline-sm text-foreground">Question Tags</h2>
            <div className="mt-4 space-y-3">
              <Tag icon="topic" label={view.topic} />
              <Tag icon="task_alt" label={view.skill} />
              <Tag icon="school" label={view.subjectLabel} />
              <Tag icon="person_check" label={view.createdByName} />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-headline-sm text-foreground">Quality</h2>
              <span
                className={cn(
                  "rounded-full border px-2.5 py-1 text-label-sm font-bold",
                  difficultyClasses[view.difficultyTone],
                )}
              >
                {view.difficultyLabel}
              </span>
            </div>
            <p className="mt-3 font-display text-[28px] font-extrabold leading-none text-foreground">
              {view.qualityPercent}%
            </p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-background">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${view.qualityPercent}%` }}
              />
            </div>
            <p className="mt-3 text-body-md text-muted">Updated {view.updatedLabel}</p>
          </Card>

          <Card className="border-ai/20 bg-ai text-on-ai">
            <div className="flex items-center gap-2">
              <Icon name="smart_toy" filled />
              <h2 className="text-body-lg font-bold">Pal Remix</h2>
            </div>
            <p className="mt-3 text-body-md text-white/90">
              Use this question as context to create variants, support items, or extension
              prompts.
            </p>
            <Link
              href="/ask-pal"
              className="mt-4 inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-body-md font-bold text-ai transition-opacity hover:opacity-90"
            >
              Ask Pal
              <Icon name="chevron_right" className="text-[16px]" />
            </Link>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function SummaryCard({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-label-md font-bold uppercase tracking-wider text-muted">{label}</p>
          <p className="mt-2 font-display text-headline-sm text-foreground">{value}</p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
          <Icon name={icon} />
        </div>
      </div>
    </Card>
  );
}

function Tag({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <Icon name={icon} className="text-primary" />
      <span className="truncate text-body-md text-foreground">{label}</span>
    </div>
  );
}
