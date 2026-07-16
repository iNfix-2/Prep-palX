import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import {
  aiConfirmationOptions,
  densityOptions,
  languageOptions,
  timezoneOptions,
} from "@/lib/features/settings/adapters";
import type { AccountSettingsView } from "@/lib/features/settings/types";

export function AccountSettingsPanel({
  view,
  settingsAction,
  workspaceAction,
  saved,
  workspaceSaved,
  error,
}: {
  view: AccountSettingsView;
  settingsAction: (formData: FormData) => void | Promise<void>;
  workspaceAction: (formData: FormData) => void | Promise<void>;
  saved?: boolean;
  workspaceSaved?: boolean;
  error?: string;
}) {
  return (
    <div className="mx-auto w-full max-w-(--container-max) space-y-6">
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div className="max-w-3xl">
          <p className="text-label-md font-bold uppercase tracking-wider text-muted">
            Account & Preferences
          </p>
          <h1 className="mt-2 font-display text-display-lg font-extrabold text-foreground">
            Settings
          </h1>
          <p className="mt-2 text-body-lg text-muted">
            {view.activeWorkspaceName} / {view.academicContextLabel}
          </p>
        </div>
        <Link
          href="/help"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-surface-border bg-surface px-4 text-body-md font-semibold text-foreground transition-colors hover:bg-background"
        >
          <Icon name="help" className="text-[18px]" />
          Help Centre
        </Link>
      </header>

      {saved && (
        <div className="rounded-lg border border-status-approved/20 bg-status-approved/10 p-4 text-body-md font-semibold text-status-approved">
          Settings saved.
        </div>
      )}

      {workspaceSaved && (
        <div className="rounded-lg border border-status-approved/20 bg-status-approved/10 p-4 text-body-md font-semibold text-status-approved">
          Workspace updated.
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-error/20 bg-error/10 p-4 text-body-md font-semibold text-error">
          Settings could not be saved. Check the highlighted preferences and try again.
        </div>
      )}

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard icon="person_check" label="Profile" value={view.roleLabel} />
        <SummaryCard icon="notifications" label="Notifications" value={view.notificationCountLabel} />
        <SummaryCard icon="verified_user" label="Security" value={view.securityStatusLabel} />
        <SummaryCard icon="smart_toy" label="AI usage" value={view.aiUsageLabel} />
      </section>

      <div className="grid grid-cols-12 gap-6">
        <form action={settingsAction} className="col-span-12 space-y-6 xl:col-span-8">
          <Card className="p-0">
            <div className="border-b border-surface-border p-6">
              <h2 className="font-display text-headline-sm text-foreground">Notifications</h2>
              <p className="mt-1 text-body-md text-muted">{view.updatedLabel}</p>
            </div>
            <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2">
              <ToggleField
                icon="notifications"
                name="emailNotifications"
                label="Email"
                detail="Approvals, support, and due dates"
                defaultChecked={view.preferences.emailNotifications}
              />
              <ToggleField
                icon="notifications"
                name="inAppNotifications"
                label="In-app"
                detail="Workspace alerts inside Prep Pal"
                defaultChecked={view.preferences.inAppNotifications}
              />
              <ToggleField
                icon="calendar_today"
                name="dueDateReminders"
                label="Due date reminders"
                detail="Tasks, reports, and grading deadlines"
                defaultChecked={view.preferences.dueDateReminders}
              />
              <ToggleField
                icon="help"
                name="supportUpdates"
                label="Support updates"
                detail="Replies to your support requests"
                defaultChecked={view.preferences.supportUpdates}
              />
              <ToggleField
                icon="description"
                name="weeklyDigest"
                label="Weekly digest"
                detail="One summary of workspace activity"
                defaultChecked={view.preferences.weeklyDigest}
              />
            </div>
          </Card>

          <Card className="p-0">
            <div className="border-b border-surface-border p-6">
              <h2 className="font-display text-headline-sm text-foreground">Display</h2>
            </div>
            <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2">
              <SelectField
                name="density"
                label="Density"
                defaultValue={view.preferences.density}
                options={densityOptions}
              />
              <SelectField
                name="language"
                label="Language"
                defaultValue={view.preferences.language}
                options={languageOptions}
              />
              <SelectField
                name="timezone"
                label="Timezone"
                defaultValue={view.preferences.timezone}
                options={timezoneOptions}
              />
              <ToggleField
                icon="settings"
                name="highContrast"
                label="High contrast"
                detail="Increase visual contrast"
                defaultChecked={view.preferences.highContrast}
              />
            </div>
          </Card>

          <Card className="p-0">
            <div className="border-b border-surface-border p-6">
              <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="font-display text-headline-sm text-foreground">AI Preferences</h2>
                  <p className="mt-1 text-body-md text-muted">
                    {view.canUseAi ? `${view.aiUsagePercent}% monthly usage` : "AI access disabled"}
                  </p>
                </div>
                <Link
                  href="/ask-pal"
                  className="inline-flex h-9 w-fit items-center justify-center gap-2 rounded-md bg-ai px-3 text-body-md font-semibold text-on-ai transition-colors hover:bg-ai-hover"
                >
                  <Icon name="smart_toy" className="text-[18px]" />
                  Ask Pal
                </Link>
              </div>
            </div>
            <div className="space-y-5 p-5">
              {!view.canUseAi && (
                <input
                  type="hidden"
                  name="aiConfirmationMode"
                  value={view.preferences.aiConfirmationMode}
                />
              )}

              <div className="h-2 overflow-hidden rounded-full bg-background">
                <div
                  className="h-full rounded-full bg-ai"
                  style={{ width: `${view.aiUsagePercent}%` }}
                />
              </div>

              <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                {aiConfirmationOptions.map((option) => (
                  <label
                    key={option.value}
                    className="flex cursor-pointer items-center justify-center rounded-lg border border-surface-border bg-background px-3 py-2 text-center text-body-md font-semibold text-foreground transition-colors has-[:checked]:border-ai has-[:checked]:bg-ai has-[:checked]:text-on-ai has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50"
                  >
                    <input
                      type="radio"
                      name="aiConfirmationMode"
                      value={option.value}
                      defaultChecked={view.preferences.aiConfirmationMode === option.value}
                      disabled={!view.canUseAi}
                      className="sr-only"
                    />
                    {option.label}
                  </label>
                ))}
              </div>

              <ToggleField
                icon="link"
                name="aiSourceAccess"
                label="Allow source context"
                detail="Class, lesson, report, and support context"
                defaultChecked={view.preferences.aiSourceAccess}
                disabled={!view.canUseAi}
              />
            </div>
          </Card>

          <div className="flex flex-wrap justify-end gap-2">
            <Link
              href="/"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-surface-border bg-surface px-4 text-body-md font-semibold text-foreground transition-colors hover:bg-background"
            >
              Cancel
            </Link>
            {view.canManageAccount && (
              <button
                type="submit"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-body-md font-semibold text-on-primary transition-colors hover:bg-primary-hover"
              >
                <Icon name="task_alt" className="text-[18px]" />
                Save settings
              </button>
            )}
          </div>
        </form>

        <aside className="col-span-12 space-y-6 xl:col-span-4">
          <Card>
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-primary text-headline-sm font-extrabold text-on-primary">
                {view.userInitials}
              </div>
              <div className="min-w-0">
                <h2 className="font-display text-headline-sm text-foreground">{view.userName}</h2>
                <p className="break-words text-body-md text-muted">{view.email}</p>
                <p className="mt-2 text-body-md font-semibold text-foreground">
                  {view.jobTitle}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="font-display text-headline-sm text-foreground">Workspace</h2>
            <form action={workspaceAction} className="mt-4 space-y-4">
              <label className="space-y-2">
                <span className="text-label-sm font-bold uppercase tracking-wider text-muted">
                  Active workspace
                </span>
                <select
                  name="workspaceId"
                  defaultValue={view.workspaces.find((workspace) => workspace.isActive)?.id}
                  className="h-10 w-full rounded-md border border-surface-border bg-background px-3 text-body-md outline-none focus:ring-2 focus:ring-primary"
                  disabled={!view.canSwitchWorkspace}
                >
                  {view.workspaces.map((workspace) => (
                    <option key={workspace.id} value={workspace.id}>
                      {workspace.name}
                    </option>
                  ))}
                </select>
              </label>
              <div className="space-y-3">
                {view.workspaces.map((workspace) => (
                  <div
                    key={workspace.id}
                    className={cn(
                      "rounded-lg border p-3",
                      workspace.isActive
                        ? "border-primary/20 bg-primary/10"
                        : "border-surface-border bg-background",
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-body-md font-bold text-foreground">{workspace.name}</p>
                        <p className="text-label-sm text-muted">
                          {workspace.roleName} / {workspace.termName}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "rounded-full border px-2.5 py-1 text-label-sm font-bold",
                          workspace.isActive
                            ? "border-primary/20 bg-primary text-on-primary"
                            : "border-surface-border bg-surface text-muted",
                        )}
                      >
                        {workspace.statusLabel}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              {view.canSwitchWorkspace && (
                <button
                  type="submit"
                  className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-surface-border bg-surface px-4 text-body-md font-semibold text-foreground transition-colors hover:bg-background"
                >
                  <Icon name="launch" className="text-[18px]" />
                  Switch workspace
                </button>
              )}
            </form>
          </Card>

          <Card>
            <h2 className="font-display text-headline-sm text-foreground">Security</h2>
            <div className="mt-4 space-y-3">
              <Fact icon="verified_user" label="Status" value={view.securityStatusLabel} />
              <Fact icon="settings" label="Sessions" value={view.activeSessionLabel} />
              <Fact icon="verified_user" label="Password" value={view.passwordUpdatedLabel} />
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function SummaryCard({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-label-md font-bold uppercase tracking-wider text-muted">{label}</p>
          <p className="mt-2 font-display text-headline-sm text-foreground">{value}</p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
          <Icon name={icon} />
        </div>
      </div>
    </Card>
  );
}

function ToggleField({
  icon,
  name,
  label,
  detail,
  defaultChecked,
  disabled,
}: {
  icon: string;
  name: string;
  label: string;
  detail: string;
  defaultChecked: boolean;
  disabled?: boolean;
}) {
  return (
    <label className="flex items-start gap-3 rounded-lg border border-surface-border bg-background p-4">
      <input
        type="checkbox"
        name={name}
        value="on"
        defaultChecked={defaultChecked}
        disabled={disabled}
        className="peer sr-only"
      />
      <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
        <Icon name={icon} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-body-md font-bold text-foreground">{label}</span>
        <span className="block text-body-sm text-muted">{detail}</span>
      </span>
      <span className="relative mt-1 h-6 w-11 shrink-0 rounded-full bg-surface-border transition-colors after:absolute after:left-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-transform peer-checked:bg-primary peer-checked:after:translate-x-5 peer-disabled:opacity-50" />
    </label>
  );
}

function SelectField({
  name,
  label,
  defaultValue,
  options,
}: {
  name: string;
  label: string;
  defaultValue: string;
  options: ReadonlyArray<{ value: string; label: string }>;
}) {
  return (
    <label className="space-y-2">
      <span className="text-label-sm font-bold uppercase tracking-wider text-muted">{label}</span>
      <select
        name={name}
        defaultValue={defaultValue}
        className="h-10 w-full rounded-md border border-surface-border bg-background px-3 text-body-md outline-none focus:ring-2 focus:ring-primary"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function Fact({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-surface-border bg-background p-3">
      <div className="mb-1 flex items-center gap-2 text-muted">
        <Icon name={icon} className="text-[16px]" />
        <p className="text-label-sm font-bold uppercase">{label}</p>
      </div>
      <p className="text-body-md font-semibold text-foreground">{value}</p>
    </div>
  );
}
