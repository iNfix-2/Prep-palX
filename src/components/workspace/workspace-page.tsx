import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import type {
  WorkspaceAction,
  WorkspaceMetric,
  WorkspacePageConfig,
  WorkspacePanel,
  WorkspaceRow,
  WorkspaceTone,
} from "@/lib/workspace-data";

const toneClasses: Record<WorkspaceTone, string> = {
  ai: "bg-ai/10 text-ai border-ai/20",
  approved: "bg-status-approved/10 text-status-approved border-status-approved/20",
  changes: "bg-status-changes/10 text-status-changes border-status-changes/20",
  draft: "bg-status-draft/10 text-status-draft border-status-draft/20",
  error: "bg-error/10 text-error border-error/20",
  primary: "bg-primary/10 text-primary border-primary/20",
  review: "bg-status-review/10 text-status-review border-status-review/20",
  neutral: "bg-background text-muted border-surface-border",
};

export function WorkspacePage({ config }: { config: WorkspacePageConfig }) {
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
          {config.actions.map((action) => (
            <WorkspaceActionButton key={action.label} action={action} />
          ))}
        </div>
      </header>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {config.metrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </section>

      {config.segments && (
        <div className="flex flex-wrap gap-2">
          {config.segments.map((segment, index) => (
            <button
              key={segment}
              className={cn(
                "rounded-full border px-4 py-2 text-body-md font-semibold transition-colors",
                index === 0
                  ? "border-primary bg-primary text-on-primary"
                  : "border-surface-border bg-surface text-muted hover:bg-background",
              )}
            >
              {segment}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-12 gap-6">
        <section className="col-span-12 lg:col-span-8">
          <Panel panel={config.primaryPanel} prominent />
        </section>
        <aside className="col-span-12 space-y-6 lg:col-span-4">
          <Panel panel={config.secondaryPanel} />
          {config.palSuggestion && (
            <Card className="border-ai/20 bg-ai p-6 text-on-ai elevation-2">
              <div className="mb-3 flex items-center gap-2">
                <Icon name="smart_toy" filled />
                <h2 className="text-body-lg font-bold">Pal Suggestion</h2>
              </div>
              <p className="text-body-md leading-relaxed text-white/90">
                {config.palSuggestion}
              </p>
              <Link
                href="/ask-pal"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-body-md font-bold text-ai transition-opacity hover:opacity-90"
              >
                Open Ask Pal
                <Icon name="chevron_right" className="text-[16px]" />
              </Link>
            </Card>
          )}
        </aside>
      </div>

      {config.workflow && (
        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {config.workflow.map((step) => (
            <Card key={step.title} className="p-5">
              <div
                className={cn(
                  "mb-4 flex h-10 w-10 items-center justify-center rounded-lg border",
                  toneClasses[step.tone],
                )}
              >
                <Icon name={step.icon} />
              </div>
              <h3 className="font-display text-headline-sm text-foreground">{step.title}</h3>
              <p className="mt-1 text-body-md text-muted">{step.description}</p>
            </Card>
          ))}
        </section>
      )}
    </div>
  );
}

function WorkspaceActionButton({ action }: { action: WorkspaceAction }) {
  const variant = action.variant ?? "secondary";
  const className = cn(
    "inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-body-md font-bold transition-opacity hover:opacity-90",
    variant === "primary" && "bg-primary text-on-primary",
    variant === "ai" && "bg-ai text-on-ai",
    variant === "secondary" &&
      "border border-surface-border bg-surface text-foreground hover:bg-background",
  );

  if (action.href) {
    return (
      <Link href={action.href} className={className}>
        <Icon name={action.icon} className="text-[18px]" />
        {action.label}
      </Link>
    );
  }

  return (
    <button type="button" className={className}>
      <Icon name={action.icon} className="text-[18px]" />
      {action.label}
    </button>
  );
}

function MetricCard({ metric }: { metric: WorkspaceMetric }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-label-md font-bold uppercase tracking-wider text-muted">
            {metric.label}
          </p>
          <p className="mt-2 font-display text-[28px] font-extrabold leading-none text-foreground">
            {metric.value}
          </p>
        </div>
        <div
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-lg border",
            toneClasses[metric.tone],
          )}
        >
          <Icon name={metric.icon} />
        </div>
      </div>
      {metric.detail && <p className="mt-3 text-body-md text-muted">{metric.detail}</p>}
    </Card>
  );
}

function Panel({ panel, prominent = false }: { panel: WorkspacePanel; prominent?: boolean }) {
  return (
    <Card className={cn("p-0", prominent && "min-h-[420px]")}>
      <div className="border-b border-surface-border p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-headline-sm text-foreground">{panel.title}</h2>
            {panel.description && (
              <p className="mt-1 text-body-md text-muted">{panel.description}</p>
            )}
          </div>
          {panel.action && (
            <WorkspaceActionButton action={panel.action} />
          )}
        </div>
      </div>
      <div className="divide-y divide-surface-border">
        {panel.rows.map((row) => (
          <PanelRow key={`${row.title}-${row.meta}`} row={row} />
        ))}
      </div>
    </Card>
  );
}

function PanelRow({ row }: { row: WorkspaceRow }) {
  const content = (
    <>
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border",
          toneClasses[row.tone],
        )}
      >
        <Icon name={row.icon} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="truncate text-body-lg font-bold text-foreground">{row.title}</h3>
          {row.status && (
            <span
              className={cn(
                "rounded-full border px-2.5 py-1 text-label-sm font-bold",
                toneClasses[row.statusTone ?? row.tone],
              )}
            >
              {row.status}
            </span>
          )}
        </div>
        <p className="mt-1 text-body-md text-muted">{row.detail}</p>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-label-sm text-muted">
          {row.meta && <span>{row.meta}</span>}
          {row.owner && <span>{row.owner}</span>}
        </div>
        {typeof row.progress === "number" && (
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-background">
            <div className="h-full rounded-full bg-primary" style={{ width: `${row.progress}%` }} />
          </div>
        )}
      </div>
    </>
  );

  if (row.href) {
    return (
      <Link href={row.href} className="flex gap-4 p-5 transition-colors hover:bg-background">
        {content}
      </Link>
    );
  }

  return <div className="flex gap-4 p-5">{content}</div>;
}
