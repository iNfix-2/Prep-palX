import Link from "next/link";
import { SupportGuideCard } from "@/components/help/support-guide-card";
import { SupportRequestCard } from "@/components/help/support-request-card";
import {
  EmptyState,
  ForbiddenState,
  UnauthorizedState,
} from "@/components/states/data-states";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import {
  supportCategoryOptions,
  supportPriorityOptions,
  toHelpCentrePageView,
} from "@/lib/features/help/adapters";
import { getPageAuthContext } from "@/lib/server/auth-context";
import { getHelpCentre } from "@/lib/server/help-service";
import { createSupportRequestAction } from "./actions";

export default async function HelpCentrePage() {
  const result = getHelpCentre(await getPageAuthContext());

  if (!result.ok) {
    if (result.status === 401) {
      return <UnauthorizedState />;
    }

    return <ForbiddenState message={result.message} />;
  }

  const view = toHelpCentrePageView(result.data);

  if (view.guides.length === 0 && view.requests.length === 0) {
    return (
      <EmptyState
        title="No support content"
        message="Guides and support requests will appear here when your workspace has help content."
        action={{ label: "Back to classes", href: "/classes", icon: "groups" }}
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
            Help Centre
          </h1>
          <p className="mt-2 text-body-lg text-muted">
            Guides, workspace support requests, and teacher help conversations.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/my-tasks"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-surface-border bg-surface px-4 text-body-md font-semibold text-foreground transition-colors hover:bg-background"
          >
            <Icon name="task_alt" className="text-[18px]" />
            My tasks
          </Link>
          {view.canUseAi && (
            <Link
              href="/ask-pal"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-ai px-4 text-body-md font-semibold text-on-ai transition-colors hover:bg-ai-hover"
            >
              <Icon name="smart_toy" className="text-[18px]" />
              Ask Pal
            </Link>
          )}
        </div>
      </header>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <MetricCard icon="description" label="Guides" value={String(view.guideCount)} />
        <MetricCard icon="help" label="Open tickets" value={String(view.openRequestCount)} />
        <MetricCard icon="task_alt" label="Resolved" value={String(view.resolvedRequestCount)} />
        <MetricCard
          icon="verified_user"
          label="Support role"
          value={view.canManageSupport ? "Manager" : "Teacher"}
        />
      </section>

      <div className="grid grid-cols-12 gap-6">
        <section className="col-span-12 space-y-6 xl:col-span-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Icon name="description" className="text-primary" />
              <h2 className="font-display text-headline-sm text-foreground">
                Recommended Guides
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {view.guides.map((guide) => (
                <SupportGuideCard key={guide.id} guide={guide} />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Icon name="help" className="text-primary" />
              <h2 className="font-display text-headline-sm text-foreground">
                Support Requests
              </h2>
            </div>
            {view.requests.length === 0 ? (
              <Card>
                <p className="text-body-md text-muted">
                  No support requests are currently visible in your scope.
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {view.requests.map((request) => (
                  <SupportRequestCard key={request.id} request={request} />
                ))}
              </div>
            )}
          </div>
        </section>

        <aside className="col-span-12 space-y-6 xl:col-span-4">
          {view.canCreateSupportRequest && (
            <Card>
              <h2 className="font-display text-headline-sm text-foreground">
                New Support Request
              </h2>
              <form action={createSupportRequestAction} className="mt-4 space-y-4">
                <label className="block">
                  <span className="text-label-md font-bold uppercase tracking-wider text-muted">
                    Title
                  </span>
                  <input
                    name="title"
                    minLength={5}
                    required
                    className="mt-2 h-11 w-full rounded-md border border-surface-border bg-background px-3 text-body-md text-foreground"
                  />
                </label>
                <label className="block">
                  <span className="text-label-md font-bold uppercase tracking-wider text-muted">
                    Category
                  </span>
                  <select
                    name="category"
                    className="mt-2 h-11 w-full rounded-md border border-surface-border bg-background px-3 text-body-md text-foreground"
                  >
                    {supportCategoryOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="text-label-md font-bold uppercase tracking-wider text-muted">
                    Priority
                  </span>
                  <select
                    name="priority"
                    className="mt-2 h-11 w-full rounded-md border border-surface-border bg-background px-3 text-body-md text-foreground"
                  >
                    {supportPriorityOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="text-label-md font-bold uppercase tracking-wider text-muted">
                    Summary
                  </span>
                  <textarea
                    name="summary"
                    rows={5}
                    minLength={12}
                    required
                    className="mt-2 w-full rounded-md border border-surface-border bg-background px-3 py-2 text-body-md text-foreground"
                  />
                </label>
                <button
                  type="submit"
                  className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-body-md font-semibold text-on-primary transition-colors hover:bg-primary-hover"
                >
                  <Icon name="send" className="text-[18px]" />
                  Open request
                </button>
              </form>
            </Card>
          )}

          <Card>
            <div className="flex items-center gap-2">
              <Icon name="verified_user" className="text-primary" />
              <h2 className="font-display text-headline-sm text-foreground">Support Scope</h2>
            </div>
            <p className="mt-3 text-body-md text-muted">
              Teachers see their own requests. Support managers can review every request in the
              active workspace.
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
