import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import type { ClassReportView, ReportCommentStatus } from "@/lib/features/reports/types";

const commentStatusOptions: Array<{ value: ReportCommentStatus; label: string }> = [
  { value: "draft", label: "Draft" },
  { value: "ready", label: "Ready" },
];

const statusClasses = {
  approved: "border-status-approved/20 bg-status-approved/10 text-status-approved",
  review: "border-status-review/20 bg-status-review/10 text-status-review",
  draft: "border-status-draft/20 bg-status-draft/10 text-status-draft",
} as const;

export function ClassReportWorkbench({
  view,
  action,
  saved,
  error,
}: {
  view: ClassReportView;
  action: (formData: FormData) => void | Promise<void>;
  saved?: boolean;
  error?: string;
}) {
  return (
    <div className="mx-auto w-full max-w-(--container-max) space-y-6">
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div className="max-w-3xl">
          <Link
            href="/reports"
            className="mb-3 inline-flex items-center gap-1 text-body-md font-semibold text-primary hover:underline"
          >
            <Icon name="chevron_right" className="rotate-180 text-[16px]" />
            Reports
          </Link>
          <p className="text-label-md font-bold uppercase tracking-wider text-muted">
            {view.workspaceName} / {view.academicSessionLabel}
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
          Report comments saved.
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-error/20 bg-error/10 p-4 text-body-md font-semibold text-error">
          Report comments could not be saved. Check learner rows and try again.
        </div>
      )}

      <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <SummaryCard icon="groups" label="Learners" value={String(view.learnerCount)} />
        <SummaryCard icon="task_alt" label="Ready" value={String(view.readyLearnerCount)} />
        <SummaryCard icon="priority_high" label="Missing Scores" value={String(view.missingScoreCount)} />
        <SummaryCard icon="description" label="Missing Comments" value={String(view.missingCommentCount)} />
      </section>

      <div className="grid grid-cols-12 gap-6">
        <form action={action} className="col-span-12 space-y-4 xl:col-span-8">
          <Card className="p-0">
            <div className="border-b border-surface-border p-6">
              <h2 className="font-display text-headline-sm text-foreground">Learner Comments</h2>
              <p className="mt-1 text-body-md text-muted">
                Draft or mark report comments ready for each learner in this class.
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
                        {learner.admissionNo} / {learner.averageScorePercent}% average /{" "}
                        {learner.attendancePercent}% attendance
                      </p>
                    </div>
                    <span
                      className={cn(
                        "w-fit rounded-full border px-2.5 py-1 text-label-sm font-bold",
                        learner.isReady
                          ? "border-status-approved/20 bg-status-approved/10 text-status-approved"
                          : "border-status-draft/20 bg-status-draft/10 text-status-draft",
                      )}
                    >
                      {learner.isReady ? "Ready" : "Draft"}
                    </span>
                  </div>

                  <label className="block space-y-2">
                    <span className="text-label-sm font-bold uppercase tracking-wider text-muted">
                      Comment
                    </span>
                    <textarea
                      name={`comment:${learner.learnerId}`}
                      defaultValue={learner.comment}
                      maxLength={500}
                      rows={4}
                      placeholder="Write a concise learner report comment"
                      className="min-h-28 w-full rounded-md border border-surface-border bg-background px-3 py-2 text-body-md outline-none focus:ring-2 focus:ring-primary"
                      disabled={!view.canPrepareReports}
                    />
                  </label>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_220px]">
                    <div className="grid grid-cols-2 gap-2">
                      {commentStatusOptions.map((option) => (
                        <label
                          key={option.value}
                          className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-surface-border bg-background px-3 py-2 text-body-md font-semibold text-foreground transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary has-[:checked]:text-on-primary"
                        >
                          <input
                            type="radio"
                            name={`status:${learner.learnerId}`}
                            value={option.value}
                            defaultChecked={learner.commentStatus === option.value}
                            className="sr-only"
                            disabled={!view.canPrepareReports}
                          />
                          {option.label}
                        </label>
                      ))}
                    </div>
                    <div className="flex items-center justify-end gap-2 rounded-lg bg-background px-3 py-2 text-body-md text-muted">
                      <Icon
                        name={learner.missingScoreCount > 0 ? "priority_high" : "task_alt"}
                        className={cn(
                          "text-[18px]",
                          learner.missingScoreCount > 0
                            ? "text-status-review"
                            : "text-status-approved",
                        )}
                      />
                      <span>{learner.missingScoreCount} missing scores</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className="flex flex-wrap justify-end gap-2">
            <Link
              href="/reports"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-surface-border bg-surface px-4 text-body-md font-semibold text-foreground transition-colors hover:bg-background"
            >
              Cancel
            </Link>
            {view.canPrepareReports && (
              <button
                type="submit"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-body-md font-semibold text-on-primary transition-colors hover:bg-primary-hover"
              >
                <Icon name="task_alt" className="text-[18px]" />
                Save comments
              </button>
            )}
          </div>
        </form>

        <aside className="col-span-12 space-y-6 xl:col-span-4">
          <Card>
            <h2 className="font-display text-headline-sm text-foreground">Report Context</h2>
            <div className="mt-4 space-y-3">
              <Fact icon="location_on" label="Room" value={view.room} />
              <Fact icon="topic" label="Current unit" value={view.currentUnit} />
              <Fact icon="analytics" label="Readiness" value={`${view.readinessPercent}%`} />
            </div>
          </Card>

          <Card>
            <h2 className="font-display text-headline-sm text-foreground">Evidence</h2>
            <div className="mt-4 space-y-3">
              <Fact icon="grading" label="Scores" value={view.averageScoreLabel} />
              <Fact icon="how_to_reg" label="Attendance" value={view.attendanceLabel} />
            </div>
          </Card>

          <Card className="border-ai/20 bg-ai text-on-ai">
            <div className="flex items-center gap-2">
              <Icon name="smart_toy" filled />
              <h2 className="text-body-lg font-bold">Pal Drafting</h2>
            </div>
            <p className="mt-3 text-body-md text-white/90">
              Use assessment averages, attendance, and missing scores as source evidence before
              approving final comments.
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
