import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import type { AssessmentCreateOptionsDto } from "@/lib/features/assessments/types";

export function AssessmentForm({
  options,
  action,
  defaultClassId,
  error,
}: {
  options: AssessmentCreateOptionsDto;
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
            New Assessment
          </h1>
          <p className="mt-2 text-body-lg text-muted">
            Build a draft assessment from assigned class evidence and curriculum scope.
          </p>
        </div>
        <Link
          href="/assessments"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-surface-border bg-surface px-4 text-body-md font-semibold text-foreground transition-colors hover:bg-background"
        >
          <Icon name="chevron_right" className="rotate-180 text-[18px]" />
          Back
        </Link>
      </header>

      {error && (
        <div className="rounded-lg border border-error/20 bg-error/10 p-4 text-body-md font-semibold text-error">
          Assessment could not be saved. Check the required fields and try again.
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
            <label className="space-y-2">
              <span className="text-label-md font-bold uppercase tracking-wider text-muted">
                Type
              </span>
              <select
                name="type"
                defaultValue="quiz"
                className="h-10 w-full rounded-md border border-surface-border bg-background px-3 text-body-md outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="classwork">Classwork</option>
                <option value="quiz">Quiz</option>
                <option value="continuous_assessment">Continuous Assessment</option>
                <option value="exam">Exam</option>
              </select>
            </label>
            <Input label="Assessment Date" name="scheduledFor" type="date" defaultValue="2026-07-24" />
            <Input label="Due Date" name="dueDate" type="date" defaultValue="2026-07-24" />
            <Input label="Title" name="title" defaultValue="Class Evidence Check" />
            <Input label="Duration" name="durationMinutes" type="number" defaultValue="30" />
            <Input label="Total Marks" name="totalMarks" type="number" defaultValue="20" />
          </div>

          <TextArea
            label="Topics"
            name="topics"
            defaultValue={"Core concept\nReasoning\nShort response"}
          />
          <TextArea
            label="Instructions"
            name="instructions"
            defaultValue="Learners complete the assessment independently. Read each prompt carefully and show working where required."
          />
          <TextArea
            label="Items"
            name="items"
            defaultValue={
              "Answer one retrieval question from the current unit | 5 | Recall\nShow working for one guided problem | 7 | Reasoning\nExplain the answer in one sentence | 8 | Communication"
            }
          />
          <TextArea
            label="Review Notes"
            name="reviewNotes"
            defaultValue="Check alignment with the most recent lesson evidence before publishing."
          />
        </Card>

        <aside className="col-span-12 space-y-6 lg:col-span-4">
          <Card>
            <h2 className="font-display text-headline-sm text-foreground">Draft Checklist</h2>
            <div className="mt-4 space-y-3">
              {[
                "Select an assigned class",
                "Set dates and mark total",
                "Add valid item marks",
                "Capture review notes",
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
              The saved draft becomes structured context for review, moderation, and later marking.
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
