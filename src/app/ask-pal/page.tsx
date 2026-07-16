import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { askPalMock, type ActiveSource, type QuickAction } from "@/lib/ask-pal-data";
import { cn } from "@/lib/cn";

const quickActionToneClasses: Record<QuickAction["tone"], string> = {
  ai: "border-ai/20 bg-ai/5 text-ai hover:border-ai/40",
  primary: "border-primary/20 bg-primary/5 text-primary hover:border-primary/40",
  neutral: "border-surface-border bg-surface text-muted hover:border-muted/50",
};

const sourceToneClasses: Record<ActiveSource["tone"], string> = {
  ai: "bg-ai/10 text-ai",
  error: "bg-error/10 text-error",
  primary: "bg-primary/10 text-primary",
};

export default function AskPalPage() {
  const {
    activeSources,
    activeTags,
    assistantMessage,
    context,
    conversations,
    quickActions,
    resetLabel,
    teacherName,
    usagePercent,
  } = askPalMock;

  return (
    <div className="min-h-screen bg-background text-foreground lg:grid lg:h-screen lg:grid-cols-[280px_minmax(0,1fr)] lg:overflow-hidden xl:grid-cols-[280px_minmax(0,1fr)_320px]">
      <aside className="flex border-b border-navy-border bg-navy text-on-navy lg:h-screen lg:flex-col lg:border-b-0 lg:border-r">
        <div className="flex min-w-0 flex-1 items-center gap-3 p-4 lg:block lg:flex-none lg:p-6">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-on-primary">
              <Icon name="smart_toy" filled />
            </span>
            <span className="min-w-0">
              <span className="block font-display text-headline-sm font-bold">Prep Pal</span>
              <span className="block truncate text-label-sm text-on-navy-muted">
                Academic AI Suite
              </span>
            </span>
          </Link>
        </div>

        <div className="hidden px-4 pb-5 lg:block">
          <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-body-md font-bold text-on-primary transition-opacity hover:opacity-90 active:scale-[0.98]">
            <Icon name="add" />
            New Conversation
          </button>
        </div>

        <nav className="custom-scrollbar hidden flex-1 space-y-1 overflow-y-auto px-2 lg:block">
          <p className="px-4 pb-2 text-label-sm font-semibold uppercase tracking-wider text-on-navy-muted">
            Recent
          </p>
          {conversations.map((conversation) => (
            <a
              key={conversation.title}
              href="#"
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 text-body-md transition-colors",
                conversation.active
                  ? "rounded-l-none border-l-4 border-primary bg-primary/15 font-semibold text-on-navy"
                  : "text-on-navy-muted hover:bg-navy-hover hover:text-on-navy",
              )}
            >
              <Icon name={conversation.icon} className="text-[19px]" filled={conversation.active} />
              <span className="truncate">{conversation.title}</span>
            </a>
          ))}
        </nav>

        <div className="hidden border-t border-navy-border/70 p-2 lg:block">
          <a
            href="#"
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-body-md text-on-navy-muted transition-colors hover:bg-navy-hover hover:text-on-navy"
          >
            <Icon name="help" />
            Help
          </a>
          <a
            href="#"
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-body-md text-on-navy-muted transition-colors hover:bg-navy-hover hover:text-on-navy"
          >
            <Icon name="logout" />
            Sign Out
          </a>
        </div>
      </aside>

      <main className="flex min-h-0 flex-col bg-background lg:h-screen">
        <header className="flex min-h-16 items-center justify-between gap-4 border-b border-surface-border bg-surface px-4 py-3 md:px-8">
          <div className="relative min-w-0 flex-1 md:max-w-md">
            <Icon
              name="search"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              type="search"
              placeholder="Search conversations..."
              className="h-10 w-full rounded-full border border-transparent bg-background py-2 pl-10 pr-4 text-body-md outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex shrink-0 items-center gap-3 md:gap-5">
            <div className="hidden items-center gap-3 text-muted sm:flex">
              <button type="button" aria-label="Notifications" className="hover:text-primary">
                <Icon name="notifications" />
              </button>
              <button type="button" aria-label="History" className="hover:text-primary">
                <Icon name="history" />
              </button>
              <button type="button" aria-label="AI activity" className="hover:text-primary">
                <Icon name="chat_spark" />
              </button>
            </div>
            <button className="hidden rounded-lg bg-ai px-4 py-2 text-body-md font-bold text-on-ai transition-opacity hover:opacity-90 md:block">
              Review AI Tasks
            </button>
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-surface-border bg-primary/10 text-body-md font-bold text-primary">
              MA
            </div>
          </div>
        </header>

        <div className="custom-scrollbar flex-1 overflow-y-auto px-4 py-8 md:px-8 md:py-12">
          <div className="mx-auto w-full max-w-3xl space-y-10">
            <section className="space-y-3 text-center">
              <h1 className="font-display text-display-lg-mobile font-extrabold text-foreground md:text-display-lg">
                Good morning, {teacherName}.
              </h1>
              <p className="bg-gradient-to-r from-ai to-primary bg-clip-text font-display text-headline-sm font-bold text-transparent">
                What are we preparing today?
              </p>
            </section>

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {quickActions.map((action) => (
                <button
                  key={action.title}
                  className="group rounded-xl border border-surface-border bg-white/75 p-5 text-left shadow-[0_2px_8px_rgba(15,23,42,0.04)] backdrop-blur transition hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(15,23,42,0.08)]"
                >
                  <span
                    className={cn(
                      "mb-4 flex h-12 w-12 items-center justify-center rounded-lg border transition-transform group-hover:scale-105",
                      quickActionToneClasses[action.tone],
                    )}
                  >
                    <Icon name={action.icon} />
                  </span>
                  <span className="block font-display text-headline-sm font-bold text-foreground">
                    {action.title}
                  </span>
                  <span className="mt-1 block text-body-md text-muted">{action.description}</span>
                </button>
              ))}
            </section>

            <section className="space-y-4 rounded-xl border border-surface-border bg-surface p-6 elevation-1">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ai text-on-ai">
                  <Icon name="auto_awesome" filled className="text-[18px]" />
                </span>
                <span className="text-body-md font-bold text-ai">Prep Pal Assistant</span>
              </div>
              <p className="text-body-lg leading-relaxed text-foreground">{assistantMessage}</p>
              <span className="inline-flex items-center gap-1 rounded-full border border-ai/20 bg-ai/10 px-3 py-1 text-label-sm font-semibold text-ai">
                <Icon name="bolt" className="text-[14px]" />
                AI Generated
              </span>
            </section>
          </div>
        </div>

        <div className="mx-auto w-full max-w-4xl px-4 pb-6 md:px-8 md:pb-8">
          <div className="rounded-xl border border-surface-border bg-white/80 p-4 shadow-[0_12px_32px_rgba(15,23,42,0.08)] backdrop-blur transition focus-within:ring-2 focus-within:ring-primary/20">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              {activeTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-label-sm font-bold text-primary"
                >
                  {tag}
                  <Icon name="close" className="text-[14px]" />
                </span>
              ))}
              <button className="inline-flex items-center gap-1 rounded-full border border-surface-border px-3 py-1 text-label-sm font-bold text-muted transition-colors hover:bg-background">
                <Icon name="add" className="text-[14px]" />
                Add Context
              </button>
            </div>
            <div className="flex items-end gap-3">
              <textarea
                aria-label="Ask Prep Pal"
                className="min-h-11 flex-1 resize-none border-none bg-transparent py-2 text-body-lg outline-none placeholder:text-muted"
                placeholder="Ask Prep Pal to prepare anything..."
                rows={1}
              />
              <div className="flex items-center gap-2 pb-1">
                <button
                  type="button"
                  aria-label="Attach file"
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-muted transition-colors hover:bg-background hover:text-foreground"
                >
                  <Icon name="attach_file" />
                </button>
                <button
                  type="button"
                  aria-label="Record voice"
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-muted transition-colors hover:bg-background hover:text-foreground"
                >
                  <Icon name="mic" />
                </button>
                <button
                  type="button"
                  aria-label="Send message"
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-on-primary shadow-md transition-opacity hover:opacity-90"
                >
                  <Icon name="send" />
                </button>
              </div>
            </div>
          </div>
          <p className="mt-4 text-center text-label-sm text-muted">
            Prep Pal can make mistakes. Please check important information.
          </p>
        </div>
      </main>

      <aside className="custom-scrollbar flex min-h-0 flex-col border-t border-surface-border bg-surface xl:h-screen xl:overflow-y-auto xl:border-l xl:border-t-0">
        <section className="border-b border-surface-border p-6">
          <h2 className="mb-4 text-label-md font-bold uppercase tracking-wider text-muted">
            Active Context
          </h2>
          <div className="space-y-4">
            {context.map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-surface-border bg-background p-4"
              >
                <div className="mb-2 flex items-center gap-3 text-primary">
                  <Icon name={item.icon} />
                  <span className="text-label-md font-bold text-foreground">{item.label}</span>
                </div>
                <p className="text-body-md font-semibold text-foreground">{item.value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="p-6">
          <h2 className="mb-4 text-label-md font-bold uppercase tracking-wider text-muted">
            Active Sources
          </h2>
          <div className="space-y-3">
            {activeSources.map((source) => (
              <button
                key={source.title}
                className="flex w-full items-center gap-3 rounded-lg border border-surface-border bg-surface p-3 text-left transition-shadow hover:elevation-1"
              >
                <span
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-md",
                    sourceToneClasses[source.tone],
                  )}
                >
                  <Icon name={source.icon} className="text-[18px]" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-label-md font-bold text-foreground">
                    {source.title}
                  </span>
                  <span className="block text-label-sm text-muted">{source.type}</span>
                </span>
              </button>
            ))}
          </div>

          <button className="mt-6 w-full rounded-lg border border-dashed border-surface-border py-2 text-body-md font-semibold text-muted transition-colors hover:bg-background">
            Add Source
          </button>
        </section>

        <section className="mt-auto bg-background p-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-label-sm text-muted">AI Usage this month</span>
            <span className="text-label-sm font-bold text-primary">{usagePercent}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-surface-border">
            <div className="h-full rounded-full bg-primary" style={{ width: `${usagePercent}%` }} />
          </div>
          <p className="mt-3 text-label-sm text-muted">{resetLabel}</p>
        </section>
      </aside>
    </div>
  );
}
