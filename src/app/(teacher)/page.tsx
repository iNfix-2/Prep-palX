import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { Card } from "@/components/ui/card";
import { teacherDashboardMock } from "@/lib/dashboard-data";

const scheduleVariantClasses = {
  default: "bg-background border-surface-border",
  current: "bg-primary/5 border-primary",
  break: "bg-surface-hover border-muted border-dashed",
} as const;

const scheduleTitleClasses = {
  default: "text-foreground",
  current: "text-primary",
  break: "text-muted",
} as const;

export default function TeacherHomePage() {
  const {
    teacherName,
    today,
    session,
    nextClass,
    schedule,
    palInsight,
    urgentTasks,
    curriculumProgress,
    recentDocuments,
  } = teacherDashboardMock;

  return (
    <div className="mx-auto w-full max-w-(--container-max) space-y-6">
      {/* Page header */}
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h2 className="font-display text-display-lg font-extrabold text-foreground">
            Good morning, {teacherName}
          </h2>
          <p className="mt-1 text-body-md text-foreground">
            Here&apos;s what is happening with your classes today.
          </p>
          <p className="mt-1 text-body-md text-muted">{session}</p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-surface-border bg-surface px-4 py-2 text-muted">
          <Icon name="calendar_today" className="text-[20px]" />
          <span className="text-body-md font-semibold text-foreground">{today}</span>
        </div>
      </header>

      {/* Quick actions */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <button className="group flex items-center gap-4 rounded-xl border border-surface-border bg-surface p-6 text-left elevation-1 transition-colors hover:border-primary">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-on-primary">
            <Icon name="auto_stories" />
          </div>
          <div>
            <p className="text-body-lg font-semibold text-foreground">Prepare a lesson</p>
            <p className="text-body-md text-muted">Update your teaching plans</p>
          </div>
        </button>

        <Link
          href="/assessments/new"
          className="group flex items-center gap-4 rounded-xl border border-surface-border bg-surface p-6 text-left elevation-1 transition-colors hover:border-primary"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-on-primary">
            <Icon name="assignment_add" />
          </div>
          <div>
            <p className="text-body-lg font-semibold text-foreground">Create Assessment</p>
            <p className="text-body-md text-muted">Design quizzes or exams</p>
          </div>
        </Link>

        <Link
          href="/ask-pal"
          className="group relative flex items-center gap-4 overflow-hidden rounded-xl border-2 border-ai/30 bg-surface p-6 text-left elevation-1 transition-shadow hover:elevation-2"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-ai text-on-ai shadow-md">
            <Icon name="auto_awesome" />
          </div>
          <div>
            <p className="text-body-lg font-bold text-ai">Ask Pal</p>
            <p className="text-body-md text-muted">Get AI teaching insights</p>
          </div>
        </Link>
      </div>

      {/* Bento layout */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left column */}
        <div className="col-span-12 space-y-6 lg:col-span-8">
          {/* Next class card */}
          <div className="relative overflow-hidden rounded-2xl bg-primary p-8 text-on-primary elevation-2">
            <Icon
              name="calculate"
              filled
              className="absolute right-0 top-0 p-8 text-[120px] opacity-10"
            />
            <div className="relative z-10">
              <div className="mb-4 flex items-center gap-2">
                <span className="rounded-full bg-white/20 px-3 py-1 text-label-sm font-bold uppercase tracking-wider">
                  {nextClass.status}
                </span>
                <span className="text-body-md text-white/80">{nextClass.time}</span>
              </div>
              <h3 className="mb-2 text-[28px] font-extrabold leading-tight">
                {nextClass.subject}
              </h3>
              <div className="mt-4 flex flex-wrap items-center gap-6 text-on-primary/90">
                <div className="flex items-center gap-2">
                  <Icon name="topic" />
                  <span className="text-body-md font-semibold">Topic: {nextClass.topic}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="location_on" />
                  <span className="text-body-md">{nextClass.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="groups" />
                  <span className="text-body-md">{nextClass.learnerCount} learners</span>
                </div>
              </div>
              <div className="mt-8 flex gap-4">
                <button className="flex items-center gap-2 rounded-lg bg-white px-6 py-2.5 font-bold text-primary transition-opacity hover:opacity-90">
                  <Icon name="launch" className="text-[20px]" />
                  Open lesson
                </button>
                <Link
                  href="/ask-pal"
                  className="flex items-center gap-2 rounded-lg border border-white/30 bg-primary-hover px-6 py-2.5 font-bold text-white transition-colors hover:bg-white/10"
                >
                  <Icon name="bolt" className="text-[20px]" />
                  Prepare with Pal
                </Link>
              </div>
            </div>
          </div>

          {/* Today's schedule */}
          <Card>
            <h4 className="mb-6 flex items-center gap-2 text-body-lg font-semibold text-foreground">
              <Icon name="schedule" className="text-primary" />
              Today&apos;s Schedule
            </h4>
            <div className="space-y-4">
              {schedule.map((item) => (
                <div key={item.time} className="flex gap-4">
                  <div className="w-16 py-2 text-right">
                    <span className="text-label-md text-muted">{item.time}</span>
                  </div>
                  <div
                    className={`flex-1 rounded-xl border-l-4 p-4 ${scheduleVariantClasses[item.variant]}`}
                  >
                    <p
                      className={`text-body-md font-bold ${scheduleTitleClasses[item.variant]}`}
                    >
                      {item.title}
                    </p>
                    <p className="text-label-sm text-muted">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div className="col-span-12 space-y-6 lg:col-span-4">
          {/* Pal's insights */}
          <div className="rounded-2xl bg-ai p-6 text-on-ai elevation-2">
            <div className="mb-4 flex items-center gap-2">
              <Icon name="smart_toy" filled />
              <span className="text-body-lg font-bold">Pal&apos;s Insights</span>
            </div>
            <p className="text-body-md leading-relaxed">{palInsight.message}</p>
            <div className="mt-4 rounded-xl border border-white/20 bg-white/10 p-4">
              <p className="mb-2 text-label-sm font-bold uppercase text-white/80">
                Recommended Action
              </p>
              <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-white py-2.5 text-body-md font-bold text-ai transition-opacity hover:opacity-90">
                <Icon name="auto_fix_high" className="text-[18px]" />
                {palInsight.actionLabel}
              </button>
            </div>
          </div>

          {/* Urgent tasks */}
          <Card className="p-6">
            <div className="mb-6 flex items-center justify-between">
              <h4 className="text-body-lg font-semibold text-foreground">Urgent Tasks</h4>
              <span className="rounded bg-error/10 px-2 py-0.5 text-label-sm font-black text-error">
                {urgentTasks.length} PENDING
              </span>
            </div>
            <div className="space-y-4">
              {urgentTasks.map((task) => (
                <div key={task.title} className="flex items-start gap-3">
                  <Icon
                    name={task.severity === "high" ? "error" : "priority_high"}
                    className={`mt-0.5 text-[20px] ${task.severity === "high" ? "text-error" : "text-muted"}`}
                  />
                  <div className="flex-1">
                    <p className="text-body-md font-bold leading-snug text-foreground">
                      {task.title}
                    </p>
                    <p className="text-label-sm text-muted">{task.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Curriculum progress */}
          <Card className="p-6">
            <h4 className="mb-6 text-body-lg font-semibold text-foreground">
              Curriculum Progress
            </h4>
            <div className="space-y-5">
              {curriculumProgress.map((item) => (
                <div key={item.subject}>
                  <div className="mb-2 flex justify-between text-label-sm">
                    <span className="font-bold text-foreground">{item.subject}</span>
                    <span className="text-muted">{item.percent}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-background">
                    <div
                      className={`h-full rounded-full ${item.accent === "primary" ? "bg-primary" : "bg-muted"}`}
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Recent work */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-body-lg font-semibold text-foreground">Recent Work &amp; Documents</h3>
          <button className="flex items-center gap-1 text-body-md font-bold text-primary hover:underline">
            View all <Icon name="chevron_right" className="text-[18px]" />
          </button>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {recentDocuments.map((doc) => (
            <div
              key={doc.title}
              className="flex cursor-pointer items-center gap-4 rounded-xl border border-surface-border bg-surface p-4 transition-colors hover:border-primary"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded bg-background text-primary">
                <Icon name={doc.icon} />
              </div>
              <div className="overflow-hidden">
                <p className="truncate text-body-md font-bold text-foreground">{doc.title}</p>
                <p className="text-label-sm text-muted">{doc.updatedLabel}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
