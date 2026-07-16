import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import type {
  GradebookScoreStatus,
  GradebookSheetView,
} from "@/lib/features/gradebook/types";

const scoreStatusOptions: Array<{ value: GradebookScoreStatus; label: string }> = [
  { value: "scored", label: "Scored" },
  { value: "missing", label: "Missing" },
  { value: "excused", label: "Excused" },
];

const statusClasses = {
  approved: "border-status-approved/20 bg-status-approved/10 text-status-approved",
  review: "border-status-review/20 bg-status-review/10 text-status-review",
  draft: "border-status-draft/20 bg-status-draft/10 text-status-draft",
} as const;

export function GradebookSheet({
  view,
  action,
  saved,
  error,
}: {
  view: GradebookSheetView;
  action: (formData: FormData) => void | Promise<void>;
  saved?: boolean;
  error?: string;
}) {
  return (
    <div className="mx-auto w-full max-w-(--container-max) space-y-6">
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div className="max-w-3xl">
          <Link
            href="/gradebook"
            className="mb-3 inline-flex items-center gap-1 text-body-md font-semibold text-primary hover:underline"
          >
            <Icon name="chevron_right" className="rotate-180 text-[16px]" />
            Gradebook
          </Link>
          <p className="text-label-md font-bold uppercase tracking-wider text-muted">
            {view.workspaceName} / {view.classLabel}
          </p>
          <h1 className="mt-2 font-display text-display-lg font-extrabold text-foreground">
            {view.title}
          </h1>
          <p className="mt-2 text-body-lg text-muted">{view.subjectLabel}</p>
        </div>
        <span
          className={cn(
            "w-fit rounded-full border px-3 py-1.5 text-body-md font-bold",
            statusClasses[view.statusTone],
          )}
        >
          {view.statusLabel}
        </span>
      </header>

      {saved && (
        <div className="rounded-lg border border-status-approved/20 bg-status-approved/10 p-4 text-body-md font-semibold text-status-approved">
          Gradebook scores saved.
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-error/20 bg-error/10 p-4 text-body-md font-semibold text-error">
          Scores could not be saved. Check learner rows and try again.
        </div>
      )}

      <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <SummaryCard icon="groups" label="Learners" value={String(view.learnerCount)} />
        <SummaryCard icon="task_alt" label="Scored" value={String(view.scoredCount)} />
        <SummaryCard icon="priority_high" label="Missing" value={String(view.missingCount)} />
        <SummaryCard icon="analytics" label="Average" value={view.averageLabel} />
      </section>

      <div className="grid grid-cols-12 gap-6">
        <form action={action} className="col-span-12 space-y-4 xl:col-span-8">
          <Card className="p-0">
            <div className="border-b border-surface-border p-6">
              <h2 className="font-display text-headline-sm text-foreground">Score Entry</h2>
              <p className="mt-1 text-body-md text-muted">
                Enter scores out of {view.totalMarks}, mark missing or excused rows, then save.
              </p>
            </div>
            <div className="divide-y divide-surface-border">
              {view.learners.map((learner) => (
                <div key={learner.learnerId} className="space-y-4 p-5">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-body-lg font-bold text-foreground">
                        {learner.displayName}
                      </p>
                      <p className="text-label-sm text-muted">
                        {learner.admissionNo} / prior score {learner.lastScore}% /{" "}
                        {learner.attendancePercent}% attendance
                      </p>
                    </div>
                    <span
                      className={cn(
                        "w-fit rounded-full border px-2.5 py-1 text-label-sm font-bold",
                        learner.isScored
                          ? "border-primary/20 bg-primary/10 text-primary"
                          : "border-status-draft/20 bg-status-draft/10 text-status-draft",
                      )}
                    >
                      {learner.isScored ? "Scored" : "Pending"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-[160px_1fr]">
                    <label className="space-y-2">
                      <span className="text-label-sm font-bold uppercase tracking-wider text-muted">
                        Score
                      </span>
                      <input
                        name={`score:${learner.learnerId}`}
                        type="number"
                        min="0"
                        max={view.totalMarks}
                        step="0.5"
                        defaultValue={learner.score ?? ""}
                        placeholder={`0-${view.totalMarks}`}
                        className="h-10 w-full rounded-md border border-surface-border bg-background px-3 text-body-md outline-none focus:ring-2 focus:ring-primary"
                        disabled={!view.canMarkScores}
                      />
                    </label>
                    <label className="space-y-2">
                      <span className="text-label-sm font-bold uppercase tracking-wider text-muted">
                        Feedback
                      </span>
                      <input
                        name={`feedback:${learner.learnerId}`}
                        defaultValue={learner.feedback}
                        placeholder="Optional learner feedback"
                        className="h-10 w-full rounded-md border border-surface-border bg-background px-3 text-body-md outline-none focus:ring-2 focus:ring-primary"
                        disabled={!view.canMarkScores}
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {scoreStatusOptions.map((option) => (
                      <label
                        key={option.value}
                        className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-surface-border bg-background px-3 py-2 text-body-md font-semibold text-foreground transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary has-[:checked]:text-on-primary"
                      >
                        <input
                          type="radio"
                          name={`status:${learner.learnerId}`}
                          value={option.value}
                          defaultChecked={learner.status === option.value}
                          className="sr-only"
                          disabled={!view.canMarkScores}
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className="flex flex-wrap justify-end gap-2">
            <Link
              href="/gradebook"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-surface-border bg-surface px-4 text-body-md font-semibold text-foreground transition-colors hover:bg-background"
            >
              Cancel
            </Link>
            {view.canMarkScores && (
              <button
                type="submit"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-body-md font-semibold text-on-primary transition-colors hover:bg-primary-hover"
              >
                <Icon name="task_alt" className="text-[18px]" />
                Save scores
              </button>
            )}
          </div>
        </form>

        <aside className="col-span-12 space-y-6 xl:col-span-4">
          <Card>
            <h2 className="font-display text-headline-sm text-foreground">Assessment Context</h2>
            <div className="mt-4 space-y-3">
              <Fact icon="calendar_today" label="Assessment date" value={view.scheduledLabel} />
              <Fact icon="calendar_month" label="Due date" value={view.dueLabel} />
              <Fact icon="grading" label="Marks" value={view.marksLabel} />
            </div>
          </Card>

          <Card>
            <h2 className="font-display text-headline-sm text-foreground">Topics</h2>
            <div className="mt-4 space-y-3">
              {view.topics.map((topic) => (
                <div key={topic} className="flex items-start gap-3">
                  <Icon name="task_alt" className="mt-0.5 text-status-approved" />
                  <span className="text-body-md text-foreground">{topic}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="border-ai/20 bg-ai text-on-ai">
            <div className="flex items-center gap-2">
              <Icon name="smart_toy" filled />
              <h2 className="text-body-lg font-bold">Gap Analysis</h2>
            </div>
            <p className="mt-3 text-body-md text-white/90">
              Once scores are complete, Pal can use this sheet to draft learner support notes and
              class-level gap summaries.
            </p>
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

function Fact({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-surface-border bg-background p-3">
      <div className="mb-1 flex items-center gap-2 text-muted">
        <Icon name={icon} className="text-[16px]" />
        <p className="text-label-sm font-bold uppercase">{label}</p>
      </div>
      <p className="text-body-md font-semibold text-foreground">{value}</p>
    </div>
  );
}
