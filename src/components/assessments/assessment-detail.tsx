import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import type { AssessmentDetailView } from "@/lib/features/assessments/types";

const statusClasses = {
  draft: "border-status-draft/20 bg-status-draft/10 text-status-draft",
  review: "border-status-review/20 bg-status-review/10 text-status-review",
  approved: "border-status-approved/20 bg-status-approved/10 text-status-approved",
} as const;

export function AssessmentDetail({
  view,
  saved,
}: {
  view: AssessmentDetailView;
  saved?: boolean;
}) {
  return (
    <div className="mx-auto w-full max-w-(--container-max) space-y-6">
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div className="max-w-3xl">
          <Link
            href="/assessments"
            className="mb-3 inline-flex items-center gap-1 text-body-md font-semibold text-primary hover:underline"
          >
            <Icon name="chevron_right" className="rotate-180 text-[16px]" />
            Assessments
          </Link>
          <p className="text-label-md font-bold uppercase tracking-wider text-muted">
            {view.workspaceName} / {view.classLabel}
          </p>
          <h1 className="mt-2 font-display text-display-lg font-extrabold text-foreground">
            {view.title}
          </h1>
          <p className="mt-2 text-body-lg text-muted">
            {view.typeLabel} for {view.subjectLabel}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/gradebook/${view.id}`}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-body-md font-semibold text-on-primary transition-colors hover:bg-primary-hover"
          >
            <Icon name="grading" className="text-[18px]" />
            Enter scores
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
          Assessment draft saved.
        </div>
      )}

      <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <SummaryCard icon="calendar_today" label="Assessment date" value={view.scheduledLabel} />
        <SummaryCard icon="calendar_month" label="Due date" value={view.dueLabel} />
        <SummaryCard icon="schedule" label="Duration" value={view.durationLabel} />
        <SummaryCard icon="grading" label="Marks" value={view.marksLabel} />
      </section>

      <div className="grid grid-cols-12 gap-6">
        <section className="col-span-12 space-y-6 lg:col-span-8">
          <Card>
            <h2 className="font-display text-headline-sm text-foreground">Instructions</h2>
            <p className="mt-3 text-body-md leading-relaxed text-muted">{view.instructions}</p>
          </Card>

          <Card className="p-0">
            <div className="border-b border-surface-border p-6">
              <h2 className="font-display text-headline-sm text-foreground">
                Assessment Items
              </h2>
              <p className="mt-1 text-body-md text-muted">
                {view.items.length} {view.items.length === 1 ? "item" : "items"} across{" "}
                {view.marksLabel}.
              </p>
            </div>
            <div className="divide-y divide-surface-border">
              {view.items.map((item, index) => (
                <div
                  key={item.id}
                  className="grid grid-cols-1 gap-3 p-5 md:grid-cols-[44px_1fr_120px] md:items-start"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-body-md font-bold text-primary">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-body-lg font-bold text-foreground">{item.prompt}</p>
                    <p className="mt-1 text-body-md text-muted">{item.skill}</p>
                  </div>
                  <span className="w-fit rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-label-sm font-bold text-primary">
                    {item.marks} marks
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <aside className="col-span-12 space-y-6 lg:col-span-4">
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

          <Card>
            <h2 className="font-display text-headline-sm text-foreground">Review Notes</h2>
            <p className="mt-3 text-body-md text-muted">{view.reviewNotes}</p>
          </Card>

          <Card className="border-ai/20 bg-ai text-on-ai">
            <div className="flex items-center gap-2">
              <Icon name="smart_toy" filled />
              <h2 className="text-body-lg font-bold">Pal Review</h2>
            </div>
            <p className="mt-3 text-body-md text-white/90">
              Use this assessment as context when asking Pal to spot missing skills or draft
              support questions.
            </p>
            <Link
              href="/ask-pal"
              className="mt-4 inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-body-md font-bold text-ai transition-opacity hover:opacity-90"
            >
              Refine with Pal
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
