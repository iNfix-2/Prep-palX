import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import type { SupportGuideView } from "@/lib/features/help/types";

export function SupportGuideCard({ guide }: { guide: SupportGuideView }) {
  const content = (
    <Card className="grid grid-cols-[48px_1fr] gap-4 p-5 transition-colors hover:border-primary">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
        <Icon name={guide.categoryIcon} className="text-[24px]" />
      </div>
      <div className="min-w-0">
        <p className="text-label-md font-bold uppercase tracking-wider text-muted">
          {guide.categoryLabel} / {guide.readLabel}
        </p>
        <h2 className="mt-1 font-display text-headline-sm text-foreground">{guide.title}</h2>
        <p className="mt-2 text-body-md leading-relaxed text-muted">{guide.summary}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {guide.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-surface-border bg-background px-2.5 py-1 text-label-sm font-semibold text-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );

  if (!guide.href) {
    return content;
  }

  return (
    <Link href={guide.href} className="block">
      {content}
    </Link>
  );
}
