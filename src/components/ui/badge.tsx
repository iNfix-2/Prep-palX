import { cn } from "@/lib/cn";

export type BadgeStatus =
  | "draft"
  | "review"
  | "approved"
  | "changes"
  | "published"
  | "ai";

const statusClasses: Record<BadgeStatus, string> = {
  draft: "bg-status-draft/10 text-status-draft",
  review: "bg-status-review/10 text-status-review",
  approved: "bg-status-approved/10 text-status-approved",
  changes: "bg-status-changes/10 text-status-changes",
  published: "bg-status-published/10 text-status-published",
  ai: "bg-status-ai/10 text-status-ai",
};

const statusLabels: Record<BadgeStatus, string> = {
  draft: "Draft",
  review: "In Review",
  approved: "Approved",
  changes: "Changes Requested",
  published: "Published",
  ai: "AI Generated",
};

export function Badge({
  status,
  children,
  className,
}: {
  status: BadgeStatus;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-label-md",
        statusClasses[status],
        className,
      )}
    >
      {children ?? statusLabels[status]}
    </span>
  );
}
