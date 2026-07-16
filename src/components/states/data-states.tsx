import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

interface StateAction {
  label: string;
  href: string;
  icon?: string;
  variant?: "primary" | "secondary";
}

interface StateShellProps {
  icon: string;
  title: string;
  message: string;
  tone?: "primary" | "error" | "muted";
  actions?: StateAction[];
  className?: string;
}

export function LoadingState({ label = "Loading workspace..." }: { label?: string }) {
  return (
    <div className="mx-auto w-full max-w-(--container-max) space-y-4">
      <div className="h-8 w-56 animate-pulse rounded-md bg-surface-border" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-28 animate-pulse rounded-xl border border-surface-border bg-surface"
          />
        ))}
      </div>
      <div className="h-72 animate-pulse rounded-xl border border-surface-border bg-surface" />
      <p className="text-body-md text-muted">{label}</p>
    </div>
  );
}

export function EmptyState({
  title,
  message,
  action,
}: {
  title: string;
  message: string;
  action?: StateAction;
}) {
  return (
    <StateShell
      icon="folder_open"
      title={title}
      message={message}
      actions={action ? [action] : undefined}
    />
  );
}

export function ErrorState({
  title = "Something went wrong",
  message,
  action,
}: {
  title?: string;
  message: string;
  action?: StateAction;
}) {
  return (
    <StateShell
      icon="error"
      title={title}
      message={message}
      tone="error"
      actions={action ? [action] : undefined}
    />
  );
}

export function UnauthorizedState() {
  return (
    <StateShell
      icon="logout"
      title="Sign in to continue"
      message="Use the demo teacher account to open your active workspace and view assigned classes."
      tone="primary"
      actions={[{ label: "Go to login", href: "/login", icon: "launch", variant: "primary" }]}
    />
  );
}

export function ForbiddenState({
  message = "Your account does not have permission to view this workspace area.",
}: {
  message?: string;
}) {
  return (
    <StateShell
      icon="verified_user"
      title="Permission required"
      message={message}
      tone="error"
      actions={[{ label: "Back to classes", href: "/classes", icon: "groups" }]}
    />
  );
}

function StateShell({
  icon,
  title,
  message,
  tone = "muted",
  actions,
  className,
}: StateShellProps) {
  return (
    <div
      className={cn(
        "mx-auto flex min-h-[420px] w-full max-w-2xl flex-col items-center justify-center rounded-xl border border-surface-border bg-surface p-8 text-center elevation-1",
        className,
      )}
    >
      <div
        className={cn(
          "mb-5 flex h-14 w-14 items-center justify-center rounded-lg border",
          tone === "primary" && "border-primary/20 bg-primary/10 text-primary",
          tone === "error" && "border-error/20 bg-error/10 text-error",
          tone === "muted" && "border-surface-border bg-background text-muted",
        )}
      >
        <Icon name={icon} className="text-[26px]" />
      </div>
      <h1 className="font-display text-headline-md text-foreground">{title}</h1>
      <p className="mt-2 max-w-md text-body-md text-muted">{message}</p>
      {actions && (
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {actions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className={cn(
                "inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-body-md font-semibold transition-colors",
                action.variant === "primary"
                  ? "bg-primary text-on-primary hover:bg-primary-hover"
                  : "border border-surface-border bg-surface text-foreground hover:bg-background",
              )}
            >
              {action.icon && <Icon name={action.icon} className="text-[18px]" />}
              {action.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
