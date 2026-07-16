import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import type { LessonPlanCreateOptionsDto } from "@/lib/features/lesson-plans/types";

export function LessonPlanForm({
  options,
  action,
  defaultClassId,
  error,
}: {
  options: LessonPlanCreateOptionsDto;
  action: (formData: FormData) => void | Promise<void>;
  defaultClassId?: string;
  error?: string;
}) {
  const selectedClassId = defaultClassId ?? options.classes[0]?.id;

  return (
    <div className="mx-auto w-full max-w-(--container-max) space-y-6">
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div className="max-w-3xl">
          <p className="text-label-md font-bold uppercase tracking-wider text-muted">
            {options.workspace.name}
          </p>
          <h1 className="mt-2 font-display text-display-lg font-extrabold text-foreground">
            New Lesson Plan
          </h1>
          <p className="mt-2 text-body-lg text-muted">
            Draft a curriculum-aligned lesson from your assigned classes.
          </p>
        </div>
        <Link
          href="/lesson-planner"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-surface-border bg-surface px-4 text-body-md font-semibold text-foreground transition-colors hover:bg-background"
        >
          <Icon name="chevron_right" className="rotate-180 text-[18px]" />
          Back
        </Link>
      </header>

      {error && (
        <div className="rounded-lg border border-error/20 bg-error/10 p-4 text-body-md font-semibold text-error">
          Lesson plan could not be saved. Check the required fields and try again.
        </div>
      )}

      <form action={action} className="grid grid-cols-12 gap-6">
        <Card className="col-span-12 space-y-6 lg:col-span-8">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-label-md font-bold uppercase tracking-wider text-muted">
                Class
              </span>
              <select
                name="classId"
                defaultValue={selectedClassId}
                className="h-10 w-full rounded-md border border-surface-border bg-background px-3 text-body-md outline-none focus:ring-2 focus:ring-primary"
                required
              >
                {options.classes.map((classOption) => (
                  <option key={classOption.id} value={classOption.id}>
                    {classOption.displayName}
                  </option>
                ))}
              </select>
            </label>
            <Input label="Teaching Date" name="scheduledFor" type="date" defaultValue="2026-07-21" />
            <Input label="Title" name="title" defaultValue="Guided Lesson Draft" />
            <Input label="Topic" name="topic" defaultValue="Core concept and guided practice" />
            <Input label="Duration" name="durationMinutes" type="number" defaultValue="40" />
          </div>

          <TextArea
            label="Objectives"
            name="objectives"
            defaultValue={"State the lesson objective clearly\nComplete one evidence-based practice task"}
          />
          <TextArea
            label="Materials"
            name="materials"
            defaultValue={"Mini whiteboards\nWorksheet\nExit ticket"}
          />
          <TextArea
            label="Starter Activity"
            name="starterActivity"
            defaultValue="Use a short retrieval prompt to activate prior knowledge."
          />
          <TextArea
            label="Teaching Activity"
            name="teachingActivity"
            defaultValue="Model the concept, ask hinge questions, and correct misconceptions in the moment."
          />
          <TextArea
            label="Learner Practice"
            name="learnerPractice"
            defaultValue="Learners complete paired practice before independent application."
          />
          <TextArea
            label="Assessment Check"
            name="assessmentCheck"
            defaultValue="Collect an exit ticket and group responses by misconception."
          />
          <TextArea
            label="Differentiation"
            name="differentiation"
            defaultValue="Provide worked examples for support learners and extension prompts for early finishers."
          />
        </Card>

        <aside className="col-span-12 space-y-6 lg:col-span-4">
          <Card>
            <h2 className="font-display text-headline-sm text-foreground">Draft Checklist</h2>
            <div className="mt-4 space-y-3">
              {[
                "Select an assigned class",
                "Add measurable objectives",
                "Include assessment evidence",
                "Plan support and extension",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <Icon name="task_alt" className="mt-0.5 text-status-approved" />
                  <span className="text-body-md text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="border-ai/20 bg-ai text-on-ai">
            <div className="flex items-center gap-2">
              <Icon name="smart_toy" filled />
              <h2 className="text-body-lg font-bold">Pal Drafting</h2>
            </div>
            <p className="mt-3 text-body-md text-white/90">
              The saved plan becomes structured context for future AI refinement.
            </p>
          </Card>

          <button
            type="submit"
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-body-md font-semibold text-on-primary transition-colors hover:bg-primary-hover"
          >
            <Icon name="task_alt" className="text-[18px]" />
            Save draft
          </button>
        </aside>
      </form>
    </div>
  );
}

function Input({
  label,
  name,
  defaultValue,
  type = "text",
}: {
  label: string;
  name: string;
  defaultValue: string;
  type?: string;
}) {
  return (
    <label className="space-y-2">
      <span className="text-label-md font-bold uppercase tracking-wider text-muted">{label}</span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        className="h-10 w-full rounded-md border border-surface-border bg-background px-3 text-body-md outline-none focus:ring-2 focus:ring-primary"
        required
      />
    </label>
  );
}

function TextArea({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue: string;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-label-md font-bold uppercase tracking-wider text-muted">{label}</span>
      <textarea
        name={name}
        defaultValue={defaultValue}
        className="min-h-28 w-full resize-none rounded-md border border-surface-border bg-background px-3 py-2 text-body-md outline-none focus:ring-2 focus:ring-primary"
        required
      />
    </label>
  );
}
