import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import type {
  DashboardActionView,
  DashboardClassProgressView,
  DashboardMetricView,
  DashboardRecentWorkView,
  DashboardScheduleItemView,
  DashboardTaskView,
  DashboardTone,
  TeacherDashboardView,
} from "@/lib/features/dashboard/types";

const toneClasses: Record<DashboardTone, string> = {
  ai: "border-ai/20 bg-ai/10 text-ai",
  approved: "border-status-approved/20 bg-status-approved/10 text-status-approved",
  changes: "border-status-changes/20 bg-status-changes/10 text-status-changes",
  neutral: "border-surface-border bg-background text-muted",
  primary: "border-primary/20 bg-primary/10 text-primary",
  review: "border-status-review/20 bg-status-review/10 text-status-review",
};

const scheduleVariantClasses = {
  default: "border-surface-border bg-background",
  current: "border-primary bg-primary/5",
  break: "border-muted border-dashed bg-background",
} as const;

export function TeacherDashboard({ view }: { view: TeacherDashboardView }) {
  return (
    <div className="mx-auto w-full max-w-(--container-max) space-y-6">
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div className="max-w-3xl">
          <p className="text-label-md font-bold uppercase tracking-wider text-muted">
            {view.workspaceName}
          </p>
          <h1 className="mt-2 font-display text-display-lg font-extrabold text-foreground">
            Good morning, {view.teacherName}
          </h1>
          <p className="mt-2 text-body-lg text-muted">
            {view.sessionLabel} / {view.todayLabel}
          </p>
        </div>
        <Link
          href="/settings"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-surface-border bg-surface px-4 text-body-md font-semibold text-foreground transition-colors hover:bg-background"
        >
          <Icon name="settings" className="text-[18px]" />
          Settings
        </Link>
      </header>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {view.metrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {view.actions.map((action) => (
          <ActionCard key={action.id} action={action} />
        ))}
      </section>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-8">
          {view.nextEvent ? (
            <section className="relative overflow-hidden rounded-xl bg-primary p-6 text-on-primary elevation-2">
              <Icon
                name="calendar_view_day"
                className="absolute right-2 top-2 text-[112px] opacity-10"
              />
              <div className="relative z-10 space-y-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-white/20 px-3 py-1 text-label-sm font-bold uppercase tracking-wider">
                    Next block
                  </span>
                  <span className="text-body-md text-white/85">{view.nextEvent.timeLabel}</span>
                </div>
                <div>
                  <h2 className="text-[28px] font-extrabold leading-tight">
                    {view.nextEvent.title}
                  </h2>
                  <p className="mt-2 max-w-2xl text-body-md text-white/85">
                    {view.nextEvent.detail}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-body-md text-white/90">
                  <span className="inline-flex items-center gap-2">
                    <Icon name="location_on" />
                    {view.nextEvent.location}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={view.nextEvent.href ?? "/timetable"}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-white px-4 text-body-md font-bold text-primary transition-opacity hover:opacity-90"
                  >
                    <Icon name="launch" className="text-[18px]" />
                    Open block
                  </Link>
                  {view.canUseAi && (
                    <Link
                      href="/ask-pal"
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-white/30 bg-primary-hover px-4 text-body-md font-bold text-white transition-colors hover:bg-white/10"
                    >
                      <Icon name="bolt" className="text-[18px]" />
                      Prepare with Pal
                    </Link>
                  )}
                </div>
              </div>
            </section>
          ) : (
            <Card>
              <h2 className="font-display text-headline-sm text-foreground">No timetable blocks</h2>
              <p className="mt-2 text-body-md text-muted">
                Your visible timetable is clear for today.
              </p>
            </Card>
          )}

          <Card>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h2 className="flex items-center gap-2 font-display text-headline-sm text-foreground">
                <Icon name="schedule" className="text-primary" />
                Today&apos;s Schedule
              </h2>
              <Link
                href="/timetable"
                className="text-body-md font-bold text-primary hover:underline"
              >
                View timetable
              </Link>
            </div>
            <div className="space-y-3">
              {view.schedule.map((item) => (
                <ScheduleRow key={item.id} item={item} />
              ))}
            </div>
          </Card>

          <Card>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-headline-sm text-foreground">Class Progress</h2>
              <Link href="/classes" className="text-body-md font-bold text-primary hover:underline">
                View classes
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {view.classProgress.map((classItem) => (
                <ClassProgressCard key={classItem.id} classItem={classItem} />
              ))}
            </div>
          </Card>
        </div>

        <aside className="col-span-12 space-y-6 xl:col-span-4">
          <Card className="border-ai/20 bg-ai text-on-ai">
            <div className="flex items-center gap-2">
              <Icon name="smart_toy" filled />
              <h2 className="text-body-lg font-bold">Pal Insight</h2>
            </div>
            <p className="mt-3 text-body-md leading-relaxed text-white/90">
              {view.insight.message}
            </p>
            <Link
              href={view.insight.href}
              className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-white px-4 text-body-md font-bold text-ai transition-opacity hover:opacity-90"
            >
              <Icon name="auto_fix_high" className="text-[18px]" />
              {view.insight.actionLabel}
            </Link>
          </Card>

          <Card>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-headline-sm text-foreground">Urgent Tasks</h2>
              <Link
                href="/my-tasks"
                className="text-body-md font-bold text-primary hover:underline"
              >
                Queue
              </Link>
            </div>
            <div className="space-y-4">
              {view.urgentTasks.map((task) => (
                <TaskRow key={task.id} task={task} />
              ))}
              {view.urgentTasks.length === 0 && (
                <p className="text-body-md text-muted">No urgent tasks in your visible queue.</p>
              )}
            </div>
          </Card>

          <Card>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-headline-sm text-foreground">Recent Work</h2>
              <Link
                href="/resources"
                className="text-body-md font-bold text-primary hover:underline"
              >
                Library
              </Link>
            </div>
            <div className="space-y-3">
              {view.recentWork.map((item) => (
                <RecentWorkRow key={`${item.href}-${item.id}`} item={item} />
              ))}
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function MetricCard({ metric }: { metric: DashboardMetricView }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-label-md font-bold uppercase tracking-wider text-muted">
            {metric.label}
          </p>
          <p className="mt-2 font-display text-headline-sm text-foreground">{metric.value}</p>
        </div>
        <span
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-lg border",
            toneClasses[metric.tone],
          )}
        >
          <Icon name={metric.icon} />
        </span>
      </div>
      <p className="mt-3 text-body-md text-muted">{metric.detail}</p>
    </Card>
  );
}

function ActionCard({ action }: { action: DashboardActionView }) {
  return (
    <Link
      href={action.href}
      className={cn(
        "group flex items-center gap-4 rounded-xl border border-surface-border bg-surface p-5 elevation-1 transition-colors hover:border-primary",
        action.variant === "ai" && "border-ai/30 hover:border-ai",
      )}
    >
      <span
        className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border transition-colors",
          action.variant === "ai"
            ? "border-ai/20 bg-ai text-on-ai"
            : "border-primary/20 bg-primary/10 text-primary group-hover:bg-primary group-hover:text-on-primary",
        )}
      >
        <Icon name={action.icon} />
      </span>
      <span className="min-w-0">
        <span className="block text-body-lg font-bold text-foreground">{action.label}</span>
        <span className="block text-body-md text-muted">{action.detail}</span>
      </span>
    </Link>
  );
}

function ScheduleRow({ item }: { item: DashboardScheduleItemView }) {
  const content = (
    <>
      <span className="w-24 shrink-0 text-label-md font-semibold text-muted">
        {item.timeLabel}
      </span>
      <span
        className={cn(
          "flex min-w-0 flex-1 gap-3 rounded-lg border-l-4 p-4",
          scheduleVariantClasses[item.variant],
        )}
      >
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
          <Icon name={item.icon} className="text-[18px]" />
        </span>
        <span className="min-w-0">
          <span className="block text-body-md font-bold text-foreground">{item.title}</span>
          <span className="block text-body-sm text-muted">{item.detail}</span>
          <span className="mt-1 block text-label-sm text-muted">{item.location}</span>
        </span>
      </span>
    </>
  );

  if (item.href) {
    return (
      <Link href={item.href} className="flex flex-col gap-2 md:flex-row">
        {content}
      </Link>
    );
  }

  return <div className="flex flex-col gap-2 md:flex-row">{content}</div>;
}

function ClassProgressCard({ classItem }: { classItem: DashboardClassProgressView }) {
  return (
    <Link
      href={classItem.href}
      className="rounded-lg border border-surface-border bg-background p-4 transition-colors hover:border-primary"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-body-md font-bold text-foreground">{classItem.title}</p>
          <p className="text-label-sm text-muted">
            {classItem.subject} / {classItem.learnerLabel}
          </p>
        </div>
        <span
          className={cn(
            "rounded-full border px-2.5 py-1 text-label-sm font-bold",
            classItem.attentionCount > 0
              ? "border-status-review/20 bg-status-review/10 text-status-review"
              : "border-status-approved/20 bg-status-approved/10 text-status-approved",
          )}
        >
          {classItem.attentionLabel}
        </span>
      </div>
      <ProgressBar label="Readiness" value={classItem.readinessPercent} />
      <ProgressBar label="Curriculum" value={classItem.curriculumProgressPercent} />
    </Link>
  );
}

function ProgressBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="mt-4">
      <div className="mb-1 flex justify-between text-label-sm">
        <span className="font-bold text-foreground">{label}</span>
        <span className="text-muted">{value}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-surface-border">
        <div className="h-full rounded-full bg-primary" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function TaskRow({ task }: { task: DashboardTaskView }) {
  return (
    <Link href={task.href} className="flex gap-3 rounded-lg p-2 transition-colors hover:bg-background">
      <span
        className={cn(
          "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border",
          toneClasses[task.tone],
        )}
      >
        <Icon name={task.tone === "changes" ? "error" : "priority_high"} className="text-[18px]" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-body-md font-bold leading-snug text-foreground">
          {task.title}
        </span>
        <span className="block text-label-sm text-muted">{task.detail}</span>
        {task.sourceLabel && (
          <span className="mt-1 block truncate text-label-sm text-primary">{task.sourceLabel}</span>
        )}
      </span>
    </Link>
  );
}

function RecentWorkRow({ item }: { item: DashboardRecentWorkView }) {
  return (
    <Link
      href={item.href}
      className="flex items-center gap-3 rounded-lg border border-surface-border bg-background p-3 transition-colors hover:border-primary"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
        <Icon name={item.icon} />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-body-md font-bold text-foreground">{item.title}</span>
        <span className="block truncate text-label-sm text-muted">{item.detail}</span>
        <span className="block text-label-sm text-muted">{item.updatedLabel}</span>
      </span>
    </Link>
  );
}
