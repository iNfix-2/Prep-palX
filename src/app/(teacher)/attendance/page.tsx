import Link from "next/link";
import { AttendanceClassCard } from "@/components/attendance/attendance-class-card";
import {
  EmptyState,
  ForbiddenState,
  UnauthorizedState,
} from "@/components/states/data-states";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { toAttendancePageView } from "@/lib/features/attendance/adapters";
import { getPageAuthContext } from "@/lib/server/auth-context";
import { listTeacherAttendance } from "@/lib/server/attendance-service";

export default async function AttendancePage() {
  const result = listTeacherAttendance(await getPageAuthContext());

  if (!result.ok) {
    if (result.status === 401) {
      return <UnauthorizedState />;
    }

    return <ForbiddenState message={result.message} />;
  }

  const view = toAttendancePageView(result.data);

  if (view.classes.length === 0) {
    return (
      <EmptyState
        title="No attendance registers"
        message="Attendance registers appear once classes are assigned in this active workspace."
        action={{ label: "Open classes", href: "/classes", icon: "groups" }}
      />
    );
  }

  return (
    <div className="mx-auto w-full max-w-(--container-max) space-y-6">
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div className="max-w-3xl">
          <p className="text-label-md font-bold uppercase tracking-wider text-muted">
            {view.workspaceName} / {view.dateLabel}
          </p>
          <h1 className="mt-2 font-display text-display-lg font-extrabold text-foreground">
            Attendance
          </h1>
          <p className="mt-2 text-body-lg text-muted">
            Mark today&apos;s registers and spot absences that need quick follow-up.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {view.canViewReports && (
            <Link
              href="/reports"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-surface-border bg-surface px-4 text-body-md font-semibold text-foreground transition-colors hover:bg-background"
            >
              <Icon name="analytics" className="text-[18px]" />
              Attendance report
            </Link>
          )}
        </div>
      </header>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <MetricCard icon="groups" label="Classes" value={String(view.totalClasses)} />
        <MetricCard icon="how_to_reg" label="Present" value={String(view.totalPresent)} />
        <MetricCard icon="priority_high" label="Absent" value={String(view.totalAbsent)} />
        <MetricCard icon="schedule" label="Pending" value={String(view.totalPending)} />
      </section>

      <div className="grid grid-cols-12 gap-6">
        <section className="col-span-12 grid grid-cols-1 gap-4 xl:col-span-8 xl:grid-cols-2">
          {view.classes.map((classItem) => (
            <AttendanceClassCard key={classItem.id} classItem={classItem} />
          ))}
        </section>

        <aside className="col-span-12 space-y-6 xl:col-span-4">
          <Card>
            <div className="flex items-center gap-2">
              <Icon name="verified_user" className="text-primary" />
              <h2 className="font-display text-headline-sm text-foreground">
                Attendance Scope
              </h2>
            </div>
            <p className="mt-3 text-body-md text-muted">
              Registers are filtered to assigned classes unless the active membership can
              manage classes for this workspace.
            </p>
          </Card>

          <Card className="border-ai/20 bg-ai text-on-ai">
            <div className="flex items-center gap-2">
              <Icon name="smart_toy" filled />
              <h2 className="text-body-lg font-bold">Pal Suggestion</h2>
            </div>
            <p className="mt-3 text-body-md text-white/90">
              Save pending registers first, then use the absence list to prepare guardian
              follow-up notes.
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
