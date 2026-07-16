import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import type {
  AttendanceRegisterView,
  AttendanceStatus,
} from "@/lib/features/attendance/types";

const statusOptions: Array<{ value: AttendanceStatus; label: string }> = [
  { value: "present", label: "Present" },
  { value: "late", label: "Late" },
  { value: "absent", label: "Absent" },
  { value: "excused", label: "Excused" },
];

const statusClasses = {
  approved: "border-status-approved/20 bg-status-approved/10 text-status-approved",
  review: "border-status-review/20 bg-status-review/10 text-status-review",
  draft: "border-status-draft/20 bg-status-draft/10 text-status-draft",
} as const;

export function AttendanceRegister({
  view,
  action,
  saved,
}: {
  view: AttendanceRegisterView;
  action: (formData: FormData) => void | Promise<void>;
  saved?: boolean;
}) {
  return (
    <div className="mx-auto w-full max-w-(--container-max) space-y-6">
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div className="max-w-3xl">
          <Link
            href="/attendance"
            className="mb-3 inline-flex items-center gap-1 text-body-md font-semibold text-primary hover:underline"
          >
            <Icon name="chevron_right" className="rotate-180 text-[16px]" />
            Attendance
          </Link>
          <p className="text-label-md font-bold uppercase tracking-wider text-muted">
            {view.workspaceName} / {view.dateLabel}
          </p>
          <h1 className="mt-2 font-display text-display-lg font-extrabold text-foreground">
            {view.title}
          </h1>
          <p className="mt-2 text-body-lg text-muted">
            Mark the daily register for {view.scheduleLabel}.
          </p>
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
          Attendance register saved.
        </div>
      )}

      <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <SummaryCard icon="groups" label="Learners" value={String(view.learnerCount)} />
        <SummaryCard icon="how_to_reg" label="Marked" value={String(view.markedCount)} />
        <SummaryCard icon="priority_high" label="Absent" value={String(view.counts.absent)} />
        <SummaryCard icon="schedule" label="Late" value={String(view.counts.late)} />
      </section>

      <div className="grid grid-cols-12 gap-6">
        <form action={action} className="col-span-12 space-y-4 xl:col-span-8">
          <Card className="p-0">
            <div className="border-b border-surface-border p-6">
              <h2 className="font-display text-headline-sm text-foreground">Class Register</h2>
              <p className="mt-1 text-body-md text-muted">
                Use the status controls for each learner, then save the register.
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
                        {learner.admissionNo} / {learner.attendancePercent}% attendance / last
                        score {learner.lastScore}%
                      </p>
                    </div>
                    <span
                      className={cn(
                        "w-fit rounded-full border px-2.5 py-1 text-label-sm font-bold",
                        learner.isMarked
                          ? "border-primary/20 bg-primary/10 text-primary"
                          : "border-status-draft/20 bg-status-draft/10 text-status-draft",
                      )}
                    >
                      {learner.isMarked ? "Marked" : "New"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                    {statusOptions.map((option) => (
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
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>

                  <label className="block">
                    <span className="text-label-sm font-bold uppercase tracking-wider text-muted">
                      Note
                    </span>
                    <input
                      name={`note:${learner.learnerId}`}
                      defaultValue={learner.note}
                      placeholder="Optional note"
                      className="mt-1 w-full rounded-md border border-surface-border bg-background px-3 py-2 text-body-md outline-none focus:ring-2 focus:ring-primary"
                    />
                  </label>
                </div>
              ))}
            </div>
          </Card>

          <div className="flex flex-wrap justify-end gap-2">
            <Link
              href="/attendance"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-surface-border bg-surface px-4 text-body-md font-semibold text-foreground transition-colors hover:bg-background"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-body-md font-semibold text-on-primary transition-colors hover:bg-primary-hover"
            >
              <Icon name="task_alt" className="text-[18px]" />
              Save register
            </button>
          </div>
        </form>

        <aside className="col-span-12 space-y-6 xl:col-span-4">
          <Card>
            <h2 className="font-display text-headline-sm text-foreground">Register Context</h2>
            <div className="mt-4 space-y-3">
              <Fact icon="topic" label="Current unit" value={view.currentUnit} />
              <Fact icon="location_on" label="Room" value={view.room} />
              <Fact icon="schedule" label="Schedule" value={view.scheduleLabel} />
            </div>
          </Card>

          <Card className="border-ai/20 bg-ai text-on-ai">
            <div className="flex items-center gap-2">
              <Icon name="smart_toy" filled />
              <h2 className="text-body-lg font-bold">Follow-up Cue</h2>
            </div>
            <p className="mt-3 text-body-md text-white/90">
              Learners marked absent or late can feed guardian follow-up tasks once the task
              workflow is connected.
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
