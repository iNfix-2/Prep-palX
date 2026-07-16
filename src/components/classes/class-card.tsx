import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import type { TeacherClassCardView } from "@/lib/features/classes/types";

const statusClasses = {
  primary: "border-primary/20 bg-primary/10 text-primary",
  review: "border-status-review/20 bg-status-review/10 text-status-review",
  approved: "border-status-approved/20 bg-status-approved/10 text-status-approved",
} as const;

export function ClassCard({ classItem }: { classItem: TeacherClassCardView }) {
  return (
    <Link href={classItem.href} className="block h-full">
      <Card className="flex h-full flex-col gap-5 p-5 transition-colors hover:border-primary">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-label-md font-bold uppercase tracking-wider text-muted">
              {classItem.grade}
            </p>
            <h2 className="mt-1 font-display text-headline-sm text-foreground">
              {classItem.title}
            </h2>
            <p className="mt-1 text-body-md text-muted">{classItem.room}</p>
          </div>
          <span
            className={cn(
              "shrink-0 rounded-full border px-2.5 py-1 text-label-sm font-bold",
              statusClasses[classItem.statusTone],
            )}
          >
            {classItem.statusLabel}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-body-md">
          <ClassMeta icon="groups" label={classItem.learnerLabel} />
          <ClassMeta icon="schedule" label={classItem.nextLessonLabel} />
        </div>

        <div className="space-y-3">
          <ProgressRow label="Lesson readiness" value={classItem.readinessPercent} />
          <ProgressRow label="Curriculum progress" value={classItem.curriculumProgressPercent} />
        </div>

        <div className="mt-auto rounded-lg border border-surface-border bg-background p-3">
          <p className="text-label-md font-bold uppercase tracking-wider text-muted">Next lesson</p>
          <p className="mt-1 text-body-md font-semibold text-foreground">
            {classItem.nextLessonTopic}
          </p>
          <p className="mt-1 text-label-sm text-muted">{classItem.supportLabel}</p>
        </div>
      </Card>
    </Link>
  );
}

function ClassMeta({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex min-w-0 items-center gap-2 rounded-lg bg-background px-3 py-2 text-muted">
      <Icon name={icon} className="text-[18px]" />
      <span className="truncate">{label}</span>
    </div>
  );
}

function ProgressRow({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex justify-between gap-3 text-label-sm">
        <span className="font-bold text-foreground">{label}</span>
        <span className="text-muted">{value}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-background">
        <div className="h-full rounded-full bg-primary" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
