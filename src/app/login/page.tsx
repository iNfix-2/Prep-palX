import Link from "next/link";
import { Icon } from "@/components/ui/icon";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-md rounded-xl border border-surface-border bg-surface p-6 elevation-2">
        <div className="mb-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon name="school" className="text-[24px]" />
          </div>
          <h1 className="font-display text-display-lg font-extrabold text-foreground">
            Prep Pal
          </h1>
          <p className="mt-2 text-body-md text-muted">
            Sign in to open your active school workspace.
          </p>
        </div>

        {error === "invalid" && (
          <div className="mb-4 rounded-lg border border-error/20 bg-error/10 p-3 text-body-md font-semibold text-error">
            Those demo credentials were not recognized.
          </div>
        )}

        <form action="/api/v1/auth/login" method="post" className="space-y-4">
          <label className="block">
            <span className="text-label-md font-bold uppercase tracking-wider text-muted">
              Email
            </span>
            <input
              name="email"
              type="email"
              autoComplete="email"
              defaultValue="mrs.adeyemi@truth.test"
              className="mt-1 w-full rounded-md border border-surface-border bg-background px-3 py-2 text-body-md outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </label>
          <label className="block">
            <span className="text-label-md font-bold uppercase tracking-wider text-muted">
              Password
            </span>
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              defaultValue="password"
              className="mt-1 w-full rounded-md border border-surface-border bg-background px-3 py-2 text-body-md outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </label>
          <button
            type="submit"
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-body-md font-semibold text-on-primary transition-colors hover:bg-primary-hover"
          >
            <Icon name="launch" className="text-[18px]" />
            Sign in as teacher
          </button>
        </form>

        <div className="mt-6 rounded-lg border border-surface-border bg-background p-4 text-body-md text-muted">
          <p className="font-semibold text-foreground">Demo accounts</p>
          <p className="mt-2">Teacher: mrs.adeyemi@truth.test / password</p>
          <p>Admin: admin@truth.test / password</p>
        </div>

        <Link
          href="/"
          className="mt-5 inline-flex items-center gap-1 text-body-md font-semibold text-primary hover:underline"
        >
          Back to dashboard
          <Icon name="chevron_right" className="text-[16px]" />
        </Link>
      </div>
    </main>
  );
}
