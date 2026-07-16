import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import type { ClassOverviewView } from "@/lib/features/classes/types";

const learnerStatusLabel = {
  excelling: "Excelling",
  on_track: "On track",
  needs_attention: "Needs attention",
} as const;

const learnerStatusClasses = {
  excelling: "border-status-approved/20 bg-status-approved/10 text-status-approved",
  on_track: "border-primary/20 bg-primary/10 text-primary",
  needs_attention: "border-status-review/20 bg-status-review/10 text-status-review",
} as const;

const taskStatusLabel = {
  open: "Open",
  review: "Review",
  done: "Done",
} as const;

export function ClassOverview({ view }: { view: ClassOverviewView }) {
  return (
    <div className="mx-auto w-full max-w-(--container-max) space-y-6">
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div className="max-w-3xl">
          <Link
            href="/classes"
            className="mb-3 inline-flex items-center gap-1 text-body-md font-semibold text-primary hover:underline"
          >
            <Icon name="chevron_right" className="rotate-180 text-[16px]" />
            My Classes
          </Link>
          <p className="text-label-md font-bold uppercase tracking-wider text-muted">
            {view.workspaceName} / {view.academicSessionLabel}
          </p>
          <h1 className="mt-2 font-display text-display-lg font-extrabold text-foreground">
            {view.title}
          </h1>
          <p className="mt-2 text-body-lg text-muted">{view.description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/lesson-planner/new?classId=${view.id}`}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-body-md font-semibold text-on-primary transition-colors hover:bg-primary-hover"
          >
            <Icon name="auto_stories" className="text-[18px]" />
            Prepare lesson
          </Link>
          <Link
            href={`/assessments/new?classId=${view.id}`}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-surface-border bg-surface px-4 text-body-md font-semibold text-foreground transition-colors hover:bg-background"
          >
            <Icon name="assignment_add" className="text-[18px]" />
            New assessment
          </Link>
          <Link
            href="/ask-pal"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-ai px-4 text-body-md font-semibold text-on-ai transition-colors hover:bg-ai-hover"
          >
            <Icon name="smart_toy" className="text-[18px]" />
            Ask Pal
          </Link>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <SummaryCard icon="groups" label="Learners" value={String(view.learnerCount)} />
        <SummaryCard icon="task_alt" label="Readiness" value={`${view.readinessPercent}%`} />
        <SummaryCard
          icon="analytics"
          label="Curriculum"
          value={`${view.curriculumProgressPercent}%`}
        />
        <SummaryCard icon="priority_high" label="Support flags" value={String(view.attentionCount)} />
      </section>

      <div className="grid grid-cols-12 gap-6">
        <section className="col-span-12 space-y-6 lg:col-span-8">
          <Card>
            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-label-md font-bold uppercase tracking-wider text-muted">
                  Next lesson
                </p>
                <h2 className="mt-2 font-display text-headline-md text-foreground">
                  {view.nextLessonTitle}
                </h2>
                <p className="mt-2 text-body-md text-muted">{view.nextLessonTopic}</p>
              </div>
              <div className="rounded-lg border border-primary/20 bg-primary/10 px-4 py-3 text-primary">
                <p className="text-label-sm font-bold uppercase">Scheduled</p>
                <p className="text-body-md font-semibold">{view.nextLessonMeta}</p>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
              <Fact icon="topic" label="Unit" value={view.currentUnit} />
              <Fact icon="location_on" label="Room" value={view.room} />
              <Fact icon="schedule" label="Timetable" value={view.scheduleLabel} />
            </div>
          </Card>

          <Card className="p-0">
            <div className="border-b border-surface-border p-6">
              <h2 className="font-display text-headline-sm text-foreground">Learners</h2>
              <p className="mt-1 text-body-md text-muted">
                Current roster with lightweight progress signals.
              </p>
            </div>
            <div className="divide-y divide-surface-border">
              {view.learners.map((learner) => (
                <div
                  key={learner.id}
                  className="grid grid-cols-1 gap-3 p-5 md:grid-cols-[1fr_120px_120px_auto] md:items-center"
                >
                  <div>
                    <p className="text-body-lg font-bold text-foreground">{learner.displayName}</p>
                    <p className="text-label-sm text-muted">{learner.admissionNo}</p>
                  </div>
                  <p className="text-body-md text-muted">Score {learner.lastScore}%</p>
                  <p className="text-body-md text-muted">{learner.attendancePercent}% attendance</p>
                  <span
                    className={cn(
                      "w-fit rounded-full border px-2.5 py-1 text-label-sm font-bold",
                      learnerStatusClasses[learner.status],
                    )}
                  >
                    {learnerStatusLabel[learner.status]}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <aside className="col-span-12 space-y-6 lg:col-span-4">
          <Card>
            <h2 className="font-display text-headline-sm text-foreground">Assigned Teachers</h2>
            <div className="mt-4 space-y-3">
              {view.assignedTeachers.map((teacher) => (
                <div key={teacher} className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-body-md font-bold text-primary">
                    {teacher
                      .split(" ")
                      .map((part) => part[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                  <p className="text-body-md font-semibold text-foreground">{teacher}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="font-display text-headline-sm text-foreground">Open Work</h2>
            <div className="mt-4 space-y-3">
              {view.tasks.length === 0 ? (
                <p className="text-body-md text-muted">No active tasks for this class.</p>
              ) : (
                view.tasks.map((task) => (
                  <div key={task.id} className="rounded-lg border border-surface-border p-3">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-body-md font-semibold text-foreground">{task.title}</p>
                      <span className="rounded bg-background px-2 py-0.5 text-label-sm font-bold text-muted">
                        {taskStatusLabel[task.status]}
                      </span>
                    </div>
                    <p className="mt-1 text-label-sm text-muted">{task.dueLabel}</p>
                  </div>
                ))
              )}
            </div>
          </Card>

          <Card className="border-ai/20 bg-ai text-on-ai">
            <div className="flex items-center gap-2">
              <Icon name="smart_toy" filled />
              <h2 className="text-body-lg font-bold">Pal Context</h2>
            </div>
            <ul className="mt-4 space-y-3">
              {view.recentActivity.map((item) => (
                <li key={item} className="text-body-md text-white/90">
                  {item}
                </li>
              ))}
            </ul>
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
          <p className="mt-2 font-display text-[28px] font-extrabold leading-none text-foreground">
            {value}
          </p>
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
