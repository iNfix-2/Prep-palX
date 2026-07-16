import Link from "next/link";
import { CalendarEventCard } from "@/components/academic-calendar/calendar-event-card";
import {
  EmptyState,
  ErrorState,
  ForbiddenState,
  UnauthorizedState,
} from "@/components/states/data-states";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { toAcademicCalendarPageView } from "@/lib/features/academic-calendar/adapters";
import { getPageAuthContext } from "@/lib/server/auth-context";
import { listTeacherAcademicCalendar } from "@/lib/server/academic-calendar-service";

export default async function AcademicCalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;
  const result = listTeacherAcademicCalendar(await getPageAuthContext(), from);

  if (!result.ok) {
    if (result.status === 401) {
      return <UnauthorizedState />;
    }

    if (result.status === 400) {
      return (
        <ErrorState
          title="Calendar date is invalid"
          message={result.message}
          action={{ label: "Open calendar", href: "/academic-calendar", icon: "calendar_month" }}
        />
      );
    }

    return <ForbiddenState message={result.message} />;
  }

  const view = toAcademicCalendarPageView(result.data);

  if (view.events.length === 0) {
    return (
      <EmptyState
        title="No calendar events"
        message="There are no accessible academic calendar events from the selected date."
        action={{ label: "Open timetable", href: "/timetable", icon: "calendar_view_day" }}
      />
    );
  }

  return (
    <div className="mx-auto w-full max-w-(--container-max) space-y-6">
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div className="max-w-3xl">
          <p className="text-label-md font-bold uppercase tracking-wider text-muted">
            {view.workspaceName}
          </p>
          <h1 className="mt-2 font-display text-display-lg font-extrabold text-foreground">
            Academic Calendar
          </h1>
          <p className="mt-2 text-body-lg text-muted">
            {view.termLabel} planning from {view.selectedDateLabel}.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/academic-calendar"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-body-md font-semibold text-on-primary transition-colors hover:bg-primary-hover"
          >
            <Icon name="calendar_today" className="text-[18px]" />
            Today
          </Link>
          <Link
            href="/timetable"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-surface-border bg-surface px-4 text-body-md font-semibold text-foreground transition-colors hover:bg-background"
          >
            <Icon name="calendar_view_day" className="text-[18px]" />
            Timetable
          </Link>
          {view.canUseAi && (
            <Link
              href="/ask-pal"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-ai px-4 text-body-md font-semibold text-on-ai transition-colors hover:bg-ai-hover"
            >
              <Icon name="smart_toy" className="text-[18px]" />
              Plan with Pal
            </Link>
          )}
        </div>
      </header>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <MetricCard icon="calendar_month" label="Term week" value={view.termWeekLabel} />
        <MetricCard icon="schedule" label="Upcoming" value={String(view.upcomingCount)} />
        <MetricCard
          icon="assignment"
          label="Assessment"
          value={String(view.assessmentWindowCount)}
        />
        <MetricCard icon="priority_high" label="At risk" value={String(view.atRiskCount)} />
      </section>

      <div className="grid grid-cols-12 gap-6">
        <section className="col-span-12 space-y-4 xl:col-span-8">
          {view.events.map((event) => (
            <CalendarEventCard key={event.id} event={event} />
          ))}
        </section>

        <aside className="col-span-12 space-y-6 xl:col-span-4">
          <Card>
            <div className="flex items-center gap-2">
              <Icon name="calendar_month" className="text-primary" />
              <h2 className="font-display text-headline-sm text-foreground">Term Window</h2>
            </div>
            <p className="mt-3 text-body-md text-muted">{view.termRangeLabel}</p>
            <p className="mt-2 text-body-md text-muted">
              Calendar events are filtered to the active workspace and your assigned class scope.
            </p>
          </Card>

          <Card>
            <div className="flex items-center gap-2">
              <Icon name="priority_high" className="text-primary" />
              <h2 className="font-display text-headline-sm text-foreground">Deadline Watch</h2>
            </div>
            <p className="mt-3 font-display text-[28px] font-extrabold leading-none text-foreground">
              {view.atRiskCount}
            </p>
            <p className="mt-2 text-body-md text-muted">
              Calendar items need intervention before they affect reporting or assessment flow.
            </p>
          </Card>

          <Card className="border-ai/20 bg-ai text-on-ai">
            <div className="flex items-center gap-2">
              <Icon name="smart_toy" filled />
              <h2 className="text-body-lg font-bold">Pal Suggestion</h2>
            </div>
            <p className="mt-3 text-body-md text-white/90">
              Rebalance remaining lessons around the CA window and consultation day.
            </p>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value }: { icon: string; label: string; value: string }) {
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
