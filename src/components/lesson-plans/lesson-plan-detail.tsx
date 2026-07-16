import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import type { LessonPlanDetailView } from "@/lib/features/lesson-plans/types";

const statusClasses = {
  draft: "border-status-draft/20 bg-status-draft/10 text-status-draft",
  review: "border-status-review/20 bg-status-review/10 text-status-review",
  approved: "border-status-approved/20 bg-status-approved/10 text-status-approved",
} as const;

export function LessonPlanDetail({
  view,
  saved,
}: {
  view: LessonPlanDetailView;
  saved?: boolean;
}) {
  return (
    <div className="mx-auto w-full max-w-(--container-max) space-y-6">
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div className="max-w-3xl">
          <Link
            href="/lesson-planner"
            className="mb-3 inline-flex items-center gap-1 text-body-md font-semibold text-primary hover:underline"
          >
            <Icon name="chevron_right" className="rotate-180 text-[16px]" />
            Lesson Planner
          </Link>
          <p className="text-label-md font-bold uppercase tracking-wider text-muted">
            {view.workspaceName} / {view.classLabel}
          </p>
          <h1 className="mt-2 font-display text-display-lg font-extrabold text-foreground">
            {view.title}
          </h1>
          <p className="mt-2 text-body-lg text-muted">{view.topic}</p>
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
          Lesson plan saved.
        </div>
      )}

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <SummaryCard icon="calendar_today" label="Teaching date" value={view.scheduledLabel} />
        <SummaryCard icon="schedule" label="Duration" value={view.durationLabel} />
        <SummaryCard icon="task_alt" label="Readiness" value={`${view.readinessPercent}%`} />
      </section>

      <div className="grid grid-cols-12 gap-6">
        <section className="col-span-12 space-y-6 lg:col-span-8">
          <Card>
            <h2 className="font-display text-headline-sm text-foreground">Learning Objectives</h2>
            <div className="mt-4 space-y-3">
              {view.objectives.map((objective, index) => (
                <NumberedItem key={objective} index={index + 1} text={objective} />
              ))}
            </div>
          </Card>

          <PlanSection title="Starter Activity" text={view.starterActivity} />
          <PlanSection title="Teaching Activity" text={view.teachingActivity} />
          <PlanSection title="Learner Practice" text={view.learnerPractice} />
          <PlanSection title="Assessment Check" text={view.assessmentCheck} />
        </section>

        <aside className="col-span-12 space-y-6 lg:col-span-4">
          <Card>
            <h2 className="font-display text-headline-sm text-foreground">Materials</h2>
            <div className="mt-4 space-y-3">
              {view.materials.map((material) => (
                <div key={material} className="flex items-start gap-3">
                  <Icon name="task_alt" className="mt-0.5 text-status-approved" />
                  <span className="text-body-md text-foreground">{material}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="font-display text-headline-sm text-foreground">Differentiation</h2>
            <p className="mt-3 text-body-md text-muted">{view.differentiation}</p>
          </Card>

          <Card className="border-ai/20 bg-ai text-on-ai">
            <div className="flex items-center gap-2">
              <Icon name="smart_toy" filled />
              <h2 className="text-body-lg font-bold">Pal Review</h2>
            </div>
            <p className="mt-3 text-body-md text-white/90">
              Use this plan as classroom context when asking Pal to refine activities or generate
              learner support materials.
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

function PlanSection({ title, text }: { title: string; text: string }) {
  return (
    <Card>
      <h2 className="font-display text-headline-sm text-foreground">{title}</h2>
      <p className="mt-3 text-body-md leading-relaxed text-muted">{text}</p>
    </Card>
  );
}

function NumberedItem({ index, text }: { index: number; text: string }) {
  return (
    <div className="flex gap-3 rounded-lg border border-surface-border bg-background p-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-body-md font-bold text-primary">
        {index}
      </span>
      <p className="text-body-md text-foreground">{text}</p>
    </div>
  );
}
