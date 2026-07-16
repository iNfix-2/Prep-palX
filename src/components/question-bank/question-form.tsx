import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import type { QuestionCreateOptionsDto } from "@/lib/features/question-bank/types";

export function QuestionForm({
  options,
  action,
  defaultClassId,
  error,
}: {
  options: QuestionCreateOptionsDto;
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
            New Question
          </h1>
          <p className="mt-2 text-body-lg text-muted">
            Add a reusable assessment question with answer guidance and moderation status.
          </p>
        </div>
        <Link
          href="/question-bank"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-surface-border bg-surface px-4 text-body-md font-semibold text-foreground transition-colors hover:bg-background"
        >
          <Icon name="chevron_right" className="rotate-180 text-[18px]" />
          Back
        </Link>
      </header>

      {error && (
        <div className="rounded-lg border border-error/20 bg-error/10 p-4 text-body-md font-semibold text-error">
          Question could not be saved. Check the required fields and try again.
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
                defaultValue="multiple_choice"
                className="h-10 w-full rounded-md border border-surface-border bg-background px-3 text-body-md outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="multiple_choice">Multiple Choice</option>
                <option value="short_answer">Short Answer</option>
                <option value="structured_response">Structured Response</option>
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-label-md font-bold uppercase tracking-wider text-muted">
                Difficulty
              </span>
              <select
                name="difficulty"
                defaultValue="medium"
                className="h-10 w-full rounded-md border border-surface-border bg-background px-3 text-body-md outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-label-md font-bold uppercase tracking-wider text-muted">
                Status
              </span>
              <select
                name="status"
                defaultValue="draft"
                className="h-10 w-full rounded-md border border-surface-border bg-background px-3 text-body-md outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="draft">Draft</option>
                <option value="in_review">In review</option>
                <option value="approved">Approved</option>
              </select>
            </label>
            <Input label="Marks" name="marks" type="number" defaultValue="4" />
            <Input label="Topic" name="topic" defaultValue="Current unit" />
            <Input label="Skill" name="skill" defaultValue="Reasoning" />
          </div>

          <TextArea
            label="Prompt"
            name="prompt"
            defaultValue="Which option best answers the current unit question? Explain the reason for your choice."
          />
          <TextArea
            label="Options"
            name="options"
            defaultValue={"Option A\nOption B\nOption C\nOption D"}
            optional
          />
          <TextArea
            label="Answer"
            name="answer"
            defaultValue="Option B, with a short evidence-based explanation."
          />
          <TextArea
            label="Explanation"
            name="explanation"
            defaultValue="The answer should connect the selected option to the taught concept and include one supporting detail."
          />
        </Card>

        <aside className="col-span-12 space-y-6 lg:col-span-4">
          <Card>
            <h2 className="font-display text-headline-sm text-foreground">Question Checks</h2>
            <div className="mt-4 space-y-3">
              {[
                "Use an assigned class",
                "Set marks and difficulty",
                "Add answer guidance",
                "Keep options for multiple choice",
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
              <h2 className="text-body-lg font-bold">Pal Support</h2>
            </div>
            <p className="mt-3 text-body-md text-white/90">
              Saved questions become reusable assessment context for drafting, review, and reuse.
            </p>
          </Card>

          <button
            type="submit"
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-body-md font-semibold text-on-primary transition-colors hover:bg-primary-hover"
          >
            <Icon name="task_alt" className="text-[18px]" />
            Save question
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
  optional = false,
}: {
  label: string;
  name: string;
  defaultValue: string;
  optional?: boolean;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-label-md font-bold uppercase tracking-wider text-muted">{label}</span>
      <textarea
        name={name}
        defaultValue={defaultValue}
        className="min-h-28 w-full resize-none rounded-md border border-surface-border bg-background px-3 py-2 text-body-md outline-none focus:ring-2 focus:ring-primary"
        required={!optional}
      />
    </label>
  );
}
