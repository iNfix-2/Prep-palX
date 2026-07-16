import Link from "next/link";
import { ResourceCard } from "@/components/resources/resource-card";
import {
  EmptyState,
  ForbiddenState,
  UnauthorizedState,
} from "@/components/states/data-states";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { toResourcesPageView } from "@/lib/features/resources/adapters";
import { getPageAuthContext } from "@/lib/server/auth-context";
import { listTeacherResources } from "@/lib/server/resources-service";

export default async function ResourcesPage() {
  const result = listTeacherResources(await getPageAuthContext());

  if (!result.ok) {
    if (result.status === 401) {
      return <UnauthorizedState />;
    }

    return <ForbiddenState message={result.message} />;
  }

  const view = toResourcesPageView(result.data);

  if (view.resources.length === 0) {
    return (
      <EmptyState
        title="No resources"
        message="There are no resources in your accessible library scope yet."
        action={{ label: "Open lesson planner", href: "/lesson-planner", icon: "auto_stories" }}
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
            Resource Library
          </h1>
          <p className="mt-2 text-body-lg text-muted">
            Teaching materials, shared guides, and class-linked resources in your scope.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/lesson-planner"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-body-md font-semibold text-on-primary transition-colors hover:bg-primary-hover"
          >
            <Icon name="auto_stories" className="text-[18px]" />
            Lesson planner
          </Link>
          <Link
            href="/question-bank"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-surface-border bg-surface px-4 text-body-md font-semibold text-foreground transition-colors hover:bg-background"
          >
            <Icon name="database" className="text-[18px]" />
            Question bank
          </Link>
          {view.canUseAi && (
            <Link
              href="/ask-pal"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-ai px-4 text-body-md font-semibold text-on-ai transition-colors hover:bg-ai-hover"
            >
              <Icon name="smart_toy" className="text-[18px]" />
              Generate with Pal
            </Link>
          )}
        </div>
      </header>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <MetricCard icon="folder_open" label="Resources" value={String(view.totalResources)} />
        <MetricCard icon="history" label="Recently used" value={String(view.recentlyUsedCount)} />
        <MetricCard icon="link" label="Shared" value={String(view.sharedCount)} />
        <MetricCard icon="auto_awesome" label="AI assisted" value={String(view.aiGeneratedCount)} />
      </section>

      <div className="grid grid-cols-12 gap-6">
        <section className="col-span-12 space-y-4 xl:col-span-8">
          {view.resources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </section>

        <aside className="col-span-12 space-y-6 xl:col-span-4">
          <Card>
            <div className="flex items-center gap-2">
              <Icon name="folder_open" className="text-primary" />
              <h2 className="font-display text-headline-sm text-foreground">Library Scope</h2>
            </div>
            <p className="mt-3 text-body-md text-muted">
              Resources are filtered to workspace-wide items, your assigned classes, and your
              personal drafts unless your membership can manage classes.
            </p>
          </Card>

          <Card>
            <div className="flex items-center gap-2">
              <Icon name="topic" className="text-primary" />
              <h2 className="font-display text-headline-sm text-foreground">Hygiene</h2>
            </div>
            <p className="mt-3 font-display text-[28px] font-extrabold leading-none text-foreground">
              {view.needsTagsCount}
            </p>
            <p className="mt-2 text-body-md text-muted">
              Resources need tag cleanup before the library is easy to search.
            </p>
          </Card>

          <Card className="border-ai/20 bg-ai text-on-ai">
            <div className="flex items-center gap-2">
              <Icon name="smart_toy" filled />
              <h2 className="text-body-lg font-bold">Pal Suggestion</h2>
            </div>
            <p className="mt-3 text-body-md text-white/90">
              Convert the newest worksheet into a differentiated revision set for tomorrow.
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
