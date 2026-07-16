import { Icon } from "@/components/ui/icon";

export function TopBar({
  userName,
  userRole,
}: {
  userName: string;
  userRole: string;
}) {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b border-surface-border bg-surface px-4 md:px-8">
      <div className="min-w-0 max-w-md flex-1">
        <div className="relative">
          <Icon
            name="search"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-muted"
          />
          <input
            type="text"
            placeholder="Search students, classes, or resources..."
            className="w-full rounded-md border border-surface-border bg-background py-2 pl-10 pr-4 text-body-md outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-4 md:gap-6">
        <button
          type="button"
          aria-label="Notifications"
          className="text-muted transition-colors hover:text-foreground"
        >
          <Icon name="notifications" className="text-[22px]" />
        </button>

        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-body-md font-semibold text-primary">
            {userName
              .split(" ")
              .map((part) => part[0])
              .slice(0, 2)
              .join("")}
          </div>
          <div className="hidden leading-tight sm:block">
            <p className="text-body-md font-semibold text-foreground">{userName}</p>
            <p className="text-label-sm uppercase tracking-wide text-muted">{userRole}</p>
          </div>
          <Icon name="expand_more" className="hidden text-[18px] text-muted sm:block" />
        </div>
      </div>
    </header>
  );
}
