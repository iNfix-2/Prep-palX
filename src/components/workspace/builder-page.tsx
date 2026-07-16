import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import type { BuilderPageConfig } from "@/lib/workspace-data";

export function BuilderPage({ config }: { config: BuilderPageConfig }) {
  return (
    <div className="mx-auto w-full max-w-(--container-max) space-y-6">
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div className="max-w-3xl">
          <p className="mb-2 text-label-md font-bold uppercase tracking-wider text-muted">
            {config.eyebrow}
          </p>
          <h1 className="font-display text-display-lg font-extrabold text-foreground">
            {config.title}
          </h1>
          <p className="mt-2 text-body-lg text-muted">{config.description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={config.backHref}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-surface-border bg-surface px-4 text-body-md font-bold text-foreground transition-colors hover:bg-background"
          >
            <Icon name="chevron_right" className="rotate-180 text-[18px]" />
            Back
          </Link>
          <button className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-ai px-4 text-body-md font-bold text-on-ai transition-opacity hover:opacity-90">
            <Icon name="auto_awesome" className="text-[18px]" />
            Draft with Pal
          </button>
          <button className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-body-md font-bold text-on-primary transition-opacity hover:opacity-90">
            <Icon name="task_alt" className="text-[18px]" />
            Save Draft
          </button>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-6">
        <Card className="col-span-12 space-y-6 p-6 lg:col-span-8">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {config.fields.map((field) => (
              <label key={field.label} className="space-y-2">
                <span className="text-label-md font-bold uppercase tracking-wider text-muted">
                  {field.label}
                </span>
                {field.kind === "textarea" ? (
                  <textarea
                    className="min-h-28 w-full resize-none rounded-lg border border-surface-border bg-background px-3 py-2 text-body-md outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    defaultValue={field.value}
                  />
                ) : (
                  <input
                    className="h-10 w-full rounded-lg border border-surface-border bg-background px-3 text-body-md outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    defaultValue={field.value}
                  />
                )}
              </label>
            ))}
          </div>

          <div className="space-y-3">
            <h2 className="font-display text-headline-sm text-foreground">{config.outlineTitle}</h2>
            <div className="space-y-3">
              {config.outline.map((item, index) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-surface-border bg-background p-4"
                >
                  <div className="mb-2 flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      {index + 1}
                    </span>
                    <h3 className="text-body-lg font-bold text-foreground">{item.title}</h3>
                  </div>
                  <p className="text-body-md text-muted">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <aside className="col-span-12 space-y-6 lg:col-span-4">
          <Card className="p-6">
            <h2 className="font-display text-headline-sm text-foreground">Readiness Checklist</h2>
            <div className="mt-4 space-y-3">
              {config.checklist.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <Icon name="task_alt" className="mt-0.5 text-status-approved" />
                  <span className="text-body-md text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="border-ai/20 bg-ai p-6 text-on-ai">
            <div className="mb-3 flex items-center gap-2">
              <Icon name="smart_toy" filled />
              <h2 className="text-body-lg font-bold">Pal Review</h2>
            </div>
            <p className="text-body-md leading-relaxed text-white/90">{config.palReview}</p>
            <Link
              href="/ask-pal"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-body-md font-bold text-ai"
            >
              Refine with Pal
              <Icon name="chevron_right" className="text-[16px]" />
            </Link>
          </Card>
        </aside>
      </div>
    </div>
  );
}
