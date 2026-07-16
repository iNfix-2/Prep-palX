"use client";

import Link from "next/link";
import { type FormEvent, useMemo, useRef, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { toAssistantProposalView } from "@/lib/features/assistant/adapters";
import type {
  AssistantMessageView,
  AssistantProposalDto,
  AssistantProposalView,
  AssistantQuickActionDto,
  AssistantSourceDto,
  AssistantSourceTone,
  AssistantWorkspaceView,
} from "@/lib/features/assistant/types";

interface ApiResponse<T> {
  data?: T;
  error?: {
    message: string;
    fields?: Record<string, string[]>;
  };
}

const quickActionToneClasses: Record<AssistantQuickActionDto["tone"], string> = {
  ai: "border-ai/20 bg-ai/5 text-ai hover:border-ai/40",
  primary: "border-primary/20 bg-primary/5 text-primary hover:border-primary/40",
  neutral: "border-surface-border bg-surface text-muted hover:border-muted/50",
};

const sourceToneClasses: Record<AssistantSourceTone, string> = {
  ai: "bg-ai/10 text-ai",
  primary: "bg-primary/10 text-primary",
  warning: "bg-status-review/10 text-status-review",
};

export function AskPalWorkbench({ view }: { view: AssistantWorkspaceView }) {
  const [messages, setMessages] = useState<AssistantMessageView[]>(view.messages);
  const [prompt, setPrompt] = useState("");
  const [quickActionId, setQuickActionId] = useState<string | undefined>();
  const [selectedSourceIds, setSelectedSourceIds] = useState<string[]>(
    view.sources.filter((source) => source.selected).map((source) => source.id),
  );
  const [conversationQuery, setConversationQuery] = useState("");
  const [latestProposal, setLatestProposal] = useState<AssistantProposalView | null>(null);
  const [confirmationLabel, setConfirmationLabel] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const filteredConversations = useMemo(() => {
    const query = conversationQuery.trim().toLowerCase();

    if (!query) {
      return view.conversations;
    }

    return view.conversations.filter(
      (conversation) =>
        conversation.title.toLowerCase().includes(query) ||
        conversation.summary.toLowerCase().includes(query),
    );
  }, [conversationQuery, view.conversations]);

  const selectedSources = useMemo(
    () => view.sources.filter((source) => selectedSourceIds.includes(source.id)),
    [selectedSourceIds, view.sources],
  );

  function handleQuickAction(action: AssistantQuickActionDto) {
    setPrompt(action.prompt);
    setQuickActionId(action.id);
    setError("");
    textareaRef.current?.focus();
  }

  function toggleSource(source: AssistantSourceDto) {
    setSelectedSourceIds((current) =>
      current.includes(source.id)
        ? current.filter((sourceId) => sourceId !== source.id)
        : [...current, source.id],
    );
  }

  function toggleAllSources() {
    setSelectedSourceIds((current) =>
      current.length === view.sources.length ? [] : view.sources.map((source) => source.id),
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedPrompt = prompt.trim();

    if (trimmedPrompt.length < 3) {
      setError("Enter at least 3 characters before asking Prep Pal.");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setConfirmationLabel("");

    const response = await fetch("/api/v1/ai/proposals", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        prompt: trimmedPrompt,
        quickActionId,
        sourceIds: selectedSourceIds,
        contextTags: view.activeTags,
      }),
    });
    const payload = (await response.json()) as ApiResponse<AssistantProposalDto>;

    setIsSubmitting(false);

    if (!response.ok || !payload.data) {
      setError(payload.error?.message ?? "Prep Pal could not prepare a response.");
      return;
    }

    const proposal = toAssistantProposalView(payload.data);
    setMessages((current) => [...current, proposal.userMessage, proposal.assistantMessage]);
    setLatestProposal(proposal);
    setPrompt("");
    setQuickActionId(undefined);
  }

  return (
    <div className="min-h-screen bg-background text-foreground lg:grid lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)_320px]">
      <aside className="flex border-b border-navy-border bg-navy text-on-navy lg:min-h-screen lg:flex-col lg:border-b-0 lg:border-r">
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
          <button
            type="button"
            onClick={() => {
              setMessages(view.messages);
              setLatestProposal(null);
              setPrompt(view.suggestedPrompt);
              setQuickActionId("prepare-next-lesson");
              textareaRef.current?.focus();
            }}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-body-md font-bold text-on-primary transition-opacity hover:opacity-90 active:scale-[0.98]"
          >
            <Icon name="add" />
            New Conversation
          </button>
        </div>

        <nav className="custom-scrollbar hidden flex-1 space-y-1 overflow-y-auto px-2 lg:block">
          <p className="px-4 pb-2 text-label-sm font-semibold uppercase tracking-wider text-on-navy-muted">
            Recent
          </p>
          {filteredConversations.map((conversation) => (
            <button
              key={conversation.id}
              type="button"
              onClick={() => {
                setPrompt(conversation.title);
                setQuickActionId(undefined);
              }}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-body-md transition-colors",
                conversation.active
                  ? "rounded-l-none border-l-4 border-primary bg-primary/15 font-semibold text-on-navy"
                  : "text-on-navy-muted hover:bg-navy-hover hover:text-on-navy",
              )}
            >
              <Icon name={conversation.icon} className="text-[19px]" filled={conversation.active} />
              <span className="min-w-0 flex-1">
                <span className="block truncate">{conversation.title}</span>
                <span className="block truncate text-label-sm opacity-80">
                  {conversation.updatedLabel}
                </span>
              </span>
            </button>
          ))}
        </nav>

        <div className="hidden border-t border-navy-border/70 p-2 lg:block">
          <Link
            href="/help"
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-body-md text-on-navy-muted transition-colors hover:bg-navy-hover hover:text-on-navy"
          >
            <Icon name="help" />
            Help
          </Link>
          <form action="/api/v1/auth/logout" method="post">
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-body-md text-on-navy-muted transition-colors hover:bg-navy-hover hover:text-on-navy"
            >
              <Icon name="logout" />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      <main className="flex min-h-[calc(100vh-72px)] flex-col bg-background lg:min-h-screen">
        <header className="flex min-h-16 items-center justify-between gap-4 border-b border-surface-border bg-surface px-4 py-3 md:px-8">
          <div className="relative min-w-0 flex-1 md:max-w-md">
            <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={conversationQuery}
              onChange={(event) => setConversationQuery(event.target.value)}
              placeholder="Search conversations..."
              className="h-10 w-full rounded-full border border-transparent bg-background py-2 pl-10 pr-4 text-body-md outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex shrink-0 items-center gap-3 md:gap-5">
            <div className="hidden items-center gap-3 text-muted sm:flex">
              <Link href="/help" aria-label="Help" className="hover:text-primary">
                <Icon name="help" />
              </Link>
              <Link href="/my-tasks" aria-label="History" className="hover:text-primary">
                <Icon name="history" />
              </Link>
              <Link href="/settings" aria-label="AI settings" className="hover:text-primary">
                <Icon name="settings" />
              </Link>
            </div>
            <Link
              href="/my-tasks"
              className="hidden rounded-lg bg-ai px-4 py-2 text-body-md font-bold text-on-ai transition-opacity hover:opacity-90 md:block"
            >
              Review AI Tasks
            </Link>
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-surface-border bg-primary/10 text-body-md font-bold text-primary">
              {view.user.shortName.slice(0, 2).toUpperCase()}
            </div>
          </div>
        </header>

        <div className="custom-scrollbar flex-1 overflow-y-auto px-4 py-8 md:px-8 md:py-12">
          <div className="mx-auto w-full max-w-3xl space-y-8">
            <section className="space-y-3 text-center">
              <p className="text-label-md font-bold uppercase tracking-wider text-muted">
                {view.workspace.name}
              </p>
              <h1 className="font-display text-display-lg-mobile font-extrabold text-foreground md:text-display-lg">
                Good morning, {view.user.displayName}.
              </h1>
              <p className="bg-gradient-to-r from-ai to-primary bg-clip-text font-display text-headline-sm font-bold text-transparent">
                What are we preparing today?
              </p>
            </section>

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {view.quickActions.map((action) => (
                <button
                  key={action.id}
                  type="button"
                  onClick={() => handleQuickAction(action)}
                  className={cn(
                    "group rounded-xl border border-surface-border bg-white/75 p-5 text-left shadow-[0_2px_8px_rgba(15,23,42,0.04)] backdrop-blur transition hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(15,23,42,0.08)]",
                    quickActionId === action.id && "border-primary ring-2 ring-primary/15",
                  )}
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

            <section className="space-y-4">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              {isSubmitting && (
                <div className="rounded-xl border border-ai/20 bg-ai/5 p-5 text-body-md text-ai">
                  Prep Pal is checking your selected sources...
                </div>
              )}
            </section>

            {latestProposal && (
              <section className="rounded-xl border border-surface-border bg-surface p-5 elevation-1">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-label-md font-bold uppercase tracking-wider text-muted">
                      Proposed Action
                    </p>
                    <h2 className="mt-1 font-display text-headline-sm text-foreground">
                      {latestProposal.suggestedActions[0]?.label}
                    </h2>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full border border-ai/20 bg-ai/10 px-3 py-1 text-label-sm font-semibold text-ai">
                    <Icon name="bolt" className="text-[14px]" />
                    {latestProposal.auditLabel}
                  </span>
                </div>
                <p className="mt-3 text-body-md text-muted">
                  {latestProposal.suggestedActions[0]?.detail}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {latestProposal.requiresConfirmation && !confirmationLabel ? (
                    <button
                      type="button"
                      onClick={() => setConfirmationLabel("Action approved for the demo queue.")}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-body-md font-bold text-on-primary transition-colors hover:bg-primary-hover"
                    >
                      <Icon name="task_alt" className="text-[18px]" />
                      Approve action
                    </button>
                  ) : (
                    <span className="inline-flex h-10 items-center gap-2 rounded-md border border-status-approved/20 bg-status-approved/10 px-4 text-body-md font-bold text-status-approved">
                      <Icon name="task_alt" className="text-[18px]" />
                      {confirmationLabel || "Ready to open"}
                    </span>
                  )}
                  <Link
                    href={latestProposal.suggestedActions[0]?.href ?? "/my-tasks"}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-surface-border bg-surface px-4 text-body-md font-semibold text-foreground transition-colors hover:bg-background"
                  >
                    <Icon name="launch" className="text-[18px]" />
                    Open linked screen
                  </Link>
                </div>
              </section>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mx-auto w-full max-w-4xl px-4 pb-6 md:px-8 md:pb-8">
          <div className="rounded-xl border border-surface-border bg-white/80 p-4 shadow-[0_12px_32px_rgba(15,23,42,0.08)] backdrop-blur transition focus-within:ring-2 focus-within:ring-primary/20">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              {view.activeTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-label-sm font-bold text-primary"
                >
                  {tag}
                  <Icon name="close" className="text-[14px]" />
                </span>
              ))}
              {selectedSources.slice(0, 2).map((source) => (
                <span
                  key={source.id}
                  className="inline-flex items-center gap-1 rounded-full bg-ai/10 px-3 py-1 text-label-sm font-bold text-ai"
                >
                  {source.title}
                </span>
              ))}
              <button
                type="button"
                onClick={toggleAllSources}
                className="inline-flex items-center gap-1 rounded-full border border-surface-border px-3 py-1 text-label-sm font-bold text-muted transition-colors hover:bg-background"
              >
                <Icon name="add" className="text-[14px]" />
                Sources
              </button>
            </div>
            <div className="flex items-end gap-3">
              <textarea
                ref={textareaRef}
                aria-label="Ask Prep Pal"
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                className="min-h-11 flex-1 resize-none border-none bg-transparent py-2 text-body-lg outline-none placeholder:text-muted"
                placeholder="Ask Prep Pal to prepare anything..."
                rows={2}
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
                  type="submit"
                  aria-label="Send message"
                  disabled={isSubmitting}
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-on-primary shadow-md transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Icon name="send" />
                </button>
              </div>
            </div>
          </div>
          {error ? (
            <p className="mt-4 text-center text-label-sm font-semibold text-error">{error}</p>
          ) : (
            <p className="mt-4 text-center text-label-sm text-muted">{view.disclaimer}</p>
          )}
        </form>
      </main>

      <aside className="custom-scrollbar flex min-h-0 flex-col border-t border-surface-border bg-surface xl:max-h-screen xl:overflow-y-auto xl:border-l xl:border-t-0">
        <section className="border-b border-surface-border p-6">
          <h2 className="mb-4 text-label-md font-bold uppercase tracking-wider text-muted">
            Active Context
          </h2>
          <div className="space-y-4">
            {view.context.map((item) => (
              <ContextCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        <section className="p-6">
          <h2 className="mb-4 text-label-md font-bold uppercase tracking-wider text-muted">
            Active Sources
          </h2>
          <div className="space-y-3">
            {view.sources.map((source) => (
              <button
                key={source.id}
                type="button"
                aria-pressed={selectedSourceIds.includes(source.id)}
                onClick={() => toggleSource(source)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg border border-surface-border bg-surface p-3 text-left transition-shadow hover:elevation-1",
                  selectedSourceIds.includes(source.id) && "border-primary bg-primary/5",
                )}
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
                  <span className="block truncate text-label-sm text-muted">{source.type}</span>
                </span>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={toggleAllSources}
            className="mt-6 w-full rounded-lg border border-dashed border-surface-border py-2 text-body-md font-semibold text-muted transition-colors hover:bg-background"
          >
            {selectedSourceIds.length === view.sources.length ? "Clear Sources" : "Add Sources"}
          </button>
        </section>

        <section className="mt-auto bg-background p-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-label-sm text-muted">AI Usage this month</span>
            <span className="text-label-sm font-bold text-primary">{view.usage.percent}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-surface-border">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${view.usage.percent}%` }}
            />
          </div>
          <p className="mt-3 text-label-sm text-muted">{view.usage.resetLabel}</p>
          <p className="mt-1 text-label-sm text-muted">
            {view.usage.used}/{view.usage.limit} demo credits used
          </p>
        </section>
      </aside>
    </div>
  );
}

function MessageBubble({ message }: { message: AssistantMessageView }) {
  const isUser = message.role === "user";

  return (
    <article
      className={cn(
        "rounded-xl border p-5 elevation-1",
        isUser
          ? "ml-auto max-w-2xl border-primary/20 bg-primary/5"
          : "border-surface-border bg-surface",
      )}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg",
              isUser ? "bg-primary text-on-primary" : "bg-ai text-on-ai",
            )}
          >
            <Icon name={isUser ? "person_check" : "auto_awesome"} filled className="text-[18px]" />
          </span>
          <span className="text-body-md font-bold text-foreground">
            {isUser ? "You" : "Prep Pal Assistant"}
          </span>
        </div>
        <span className="text-label-sm text-muted">{message.createdLabel}</span>
      </div>
      <p className="text-body-lg leading-relaxed text-foreground">{message.body}</p>
      {!isUser && (
        <span className="mt-4 inline-flex items-center gap-1 rounded-full border border-ai/20 bg-ai/10 px-3 py-1 text-label-sm font-semibold text-ai">
          <Icon name="bolt" className="text-[14px]" />
          AI Generated
        </span>
      )}
    </article>
  );
}

function ContextCard({
  item,
}: {
  item: AssistantWorkspaceView["context"][number];
}) {
  const content = (
    <div className="rounded-xl border border-surface-border bg-background p-4">
      <div className="mb-2 flex items-center gap-3 text-primary">
        <Icon name={item.icon} />
        <span className="text-label-md font-bold text-foreground">{item.label}</span>
      </div>
      <p className="text-body-md font-semibold text-foreground">{item.value}</p>
      <p className="mt-1 text-label-sm text-muted">{item.detail}</p>
    </div>
  );

  if (!item.href) {
    return content;
  }

  return <Link href={item.href}>{content}</Link>;
}
