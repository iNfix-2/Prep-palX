import type {
  AssistantActionImpact,
  AssistantContextCardDto,
  AssistantConversationDto,
  AssistantMessageDto,
  AssistantProposalDto,
  AssistantQuickActionDto,
  AssistantSourceDto,
  AssistantSuggestedActionDto,
  AssistantWorkspaceDto,
  CreateAssistantProposalDto,
} from "@/lib/features/assistant/types";
import type { WorkspaceSummaryDto, TeacherClassListItemDto } from "@/lib/features/classes/types";
import type { GradebookSheetSummaryDto } from "@/lib/features/gradebook/types";
import type { ResourceDto } from "@/lib/features/resources/types";
import type { TeacherTaskDto } from "@/lib/features/tasks/types";
import type { TimetableEventDto } from "@/lib/features/timetable/types";
import { hasPermission } from "@/lib/security/permissions";
import type { RequestAuthContext } from "@/lib/server/auth-context";
import { listTeacherClasses } from "@/lib/server/classes-service";
import {
  createDemoAiProposal,
  DEMO_TODAY,
} from "@/lib/server/demo-store";
import { listTeacherGradebooks } from "@/lib/server/gradebook-service";
import { getRepositories } from "@/lib/server/repositories";
import { listTeacherResources } from "@/lib/server/resources-service";
import { listTeacherTasks } from "@/lib/server/tasks-service";
import { listTeacherTimetable } from "@/lib/server/timetable-service";

export type AssistantServiceErrorStatus = 400 | 401 | 403;

export type AssistantServiceResult<T> =
  | { ok: true; data: T }
  | {
      ok: false;
      status: AssistantServiceErrorStatus;
      code: "AUTH_REQUIRED" | "FORBIDDEN" | "VALIDATION_ERROR";
      message: string;
      fields?: Record<string, string[]>;
    };

type AuthenticatedContext = Extract<RequestAuthContext, { status: "authenticated" }>;
type AssistantWorkspaceBuild = AssistantWorkspaceDto & {
  selectedSourceIds: string[];
  primaryClassName: string;
  primaryTopic: string;
};

const demoGeneratedAt = "2026-07-16T09:10:00.000Z";
const demoProposalCreatedAt = "2026-07-16T15:45:00.000Z";

export function getAssistantWorkspace(
  context: RequestAuthContext,
): AssistantServiceResult<AssistantWorkspaceDto> {
  const access = getAssistantAccess(context);

  if (!access.ok) {
    return access;
  }

  return { ok: true, data: buildAssistantWorkspace(access.data.context) };
}

export function createAssistantProposal(
  context: RequestAuthContext,
  input: CreateAssistantProposalDto,
): AssistantServiceResult<AssistantProposalDto> {
  const access = getAssistantAccess(context);

  if (!access.ok) {
    return access;
  }

  const validation = validateProposalInput(input);

  if (!validation.ok) {
    return validation;
  }

  const workspace = buildAssistantWorkspace(access.data.context);
  const allowedSourceIds = new Set(workspace.sources.map((source) => source.id));
  const sourceIds =
    validation.data.sourceIds.length > 0
      ? validation.data.sourceIds.filter((sourceId) => allowedSourceIds.has(sourceId))
      : workspace.selectedSourceIds;
  const quickAction = workspace.quickActions.find(
    (action) => action.id === validation.data.quickActionId,
  );
  const suggestedAction = buildSuggestedAction(
    validation.data.prompt,
    quickAction?.id,
    workspace,
    access.data.context,
  );
  const response = buildResponse(validation.data.prompt, quickAction?.id, workspace);
  const record = createDemoAiProposal({
    workspaceId: access.data.context.activeWorkspace.id,
    membershipId: access.data.context.activeMembership.id,
    conversationId: workspace.activeConversationId,
    prompt: validation.data.prompt,
    response,
    sourceIds,
    actionKind: suggestedAction.kind,
    actionImpact: suggestedAction.impact,
    createdAt: demoProposalCreatedAt,
  });

  return {
    ok: true,
    data: {
      id: record.id,
      conversationId: record.conversationId,
      userMessage: {
        id: `${record.id}-user`,
        role: "user",
        body: record.prompt,
        createdAt: record.createdAt,
        sourceIds,
      },
      assistantMessage: {
        id: `${record.id}-assistant`,
        role: "assistant",
        body: record.response,
        createdAt: record.createdAt,
        sourceIds,
      },
      suggestedActions: [suggestedAction],
      sourceIds,
      requiresConfirmation: requiresConfirmation(
        access.data.context.activeMembership.id,
        suggestedAction.impact,
      ),
      audit: {
        id: `${record.id}-audit`,
        provider: "demo-assistant",
        modelLabel: "Prep Pal demo assistant",
        createdAt: record.createdAt,
        confirmationMode: getRepositories().accountSettings.getForMembership(
          access.data.context.activeMembership.id,
        )
          .aiConfirmationMode,
        tenantScoped: true,
      },
    },
  };
}

function buildAssistantWorkspace(context: AuthenticatedContext): AssistantWorkspaceBuild {
  const classes = getData(listTeacherClasses(context))?.classes ?? [];
  const tasks = getData(listTeacherTasks(context))?.tasks ?? [];
  const timetable = getData(listTeacherTimetable(context, DEMO_TODAY))?.events ?? [];
  const resources = getData(listTeacherResources(context))?.resources ?? [];
  const gradebooks = getData(listTeacherGradebooks(context))?.gradebooks ?? [];
  const settings = getRepositories().accountSettings.getForMembership(context.activeMembership.id);
  const primaryClass = classes.find((classItem) => classItem.id === "class-p4-math") ?? classes[0];
  const nextEvent = timetable.find((event) => event.status !== "completed");
  const openTasks = tasks.filter((task) => task.status !== "done");
  const missingScoreCount = gradebooks.reduce((sum, sheet) => sum + sheet.missingCount, 0);
  const primaryClassName = primaryClass?.displayName ?? "your active class";
  const primaryTopic = nextEvent?.notes ?? primaryClass?.nextLesson.topic ?? "today";
  const sources = settings.aiSourceAccess
    ? buildSources({ timetable, resources, gradebooks, tasks })
    : [];
  const selectedSourceIds = sources.filter((source) => source.selected).map((source) => source.id);

  return {
    workspace: toWorkspaceSummary(context),
    user: {
      id: context.user.id,
      displayName: context.user.displayName,
      shortName: context.user.shortName,
      email: context.user.email,
    },
    permissions: {
      canUseAi: true,
      canCreateLessonPlan: hasPermission(context.activeMembership, "lesson.create"),
      canCreateAssessment: hasPermission(context.activeMembership, "assessment.create"),
      canCreateTask: hasPermission(context.activeMembership, "task.manage"),
    },
    conversations: buildConversations(classes, gradebooks),
    activeConversationId: "conversation-p4-fractions",
    messages: buildMessages(
      primaryClassName,
      primaryTopic,
      nextEvent ? formatEventTime(nextEvent) : undefined,
      selectedSourceIds,
    ),
    quickActions: buildQuickActions(primaryClassName),
    context: buildContextCards({
      context,
      primaryClassName,
      nextEventLabel: nextEvent
        ? `${formatEventTime(nextEvent)} / ${nextEvent.classDisplayName ?? nextEvent.title}`
        : "No block queued",
      openTasks: openTasks.length,
      missingScoreCount,
    }),
    activeTags: primaryClass
      ? [primaryClass.gradeName, primaryClass.subjectName]
      : [context.activeWorkspace.name],
    sources,
    usage: {
      used: settings.monthlyAiUsed,
      limit: settings.monthlyAiLimit,
      percent:
        settings.monthlyAiLimit > 0
          ? Math.min(100, Math.round((settings.monthlyAiUsed / settings.monthlyAiLimit) * 100))
          : 0,
      resetLabel: "Next reset in 4 days",
      confirmationMode: settings.aiConfirmationMode,
      sourceAccessEnabled: settings.aiSourceAccess,
    },
    suggestedPrompt: `Prepare ${primaryClassName} for ${primaryTopic}.`,
    disclaimer: "Prep Pal can make mistakes. Please check important information.",
    selectedSourceIds,
    primaryClassName,
    primaryTopic,
  };
}

function buildConversations(
  classes: TeacherClassListItemDto[],
  gradebooks: GradebookSheetSummaryDto[],
): AssistantConversationDto[] {
  const firstClass = classes[0];
  const secondClass = classes[1];
  const gradebookWithGap = gradebooks.find((gradebook) => gradebook.missingCount > 0);

  return [
    {
      id: "conversation-p4-fractions",
      title: firstClass ? `Prepare ${firstClass.displayName}` : "Prepare next lesson",
      summary: "Lesson preparation with active class, timetable, and resource context.",
      updatedAt: "2026-07-16T09:10:00.000Z",
      icon: "smart_toy",
      active: true,
    },
    {
      id: "conversation-learning-gaps",
      title: gradebookWithGap
        ? `Analyse ${gradebookWithGap.assessmentTitle}`
        : "Analyse learning gaps",
      summary: "Uses visible gradebook sheets and support tasks.",
      updatedAt: "2026-07-16T08:35:00.000Z",
      icon: "grade",
      active: false,
    },
    {
      id: "conversation-week-plan",
      title: secondClass ? `Plan ${secondClass.subjectName} week` : "Plan teaching week",
      summary: "Balances timetable blocks, class readiness, and open tasks.",
      updatedAt: "2026-07-15T16:20:00.000Z",
      icon: "calendar_today",
      active: false,
    },
  ];
}

function buildMessages(
  primaryClassName: string,
  primaryTopic: string,
  nextEventLabel: string | undefined,
  sourceIds: string[],
): AssistantMessageDto[] {
  return [
    {
      id: "assistant-message-welcome",
      role: "assistant",
      body: `I have loaded your active workspace context for ${primaryClassName}. ${
        nextEventLabel
          ? `Your next block is ${nextEventLabel}.`
          : "Your timetable does not have another active block today."
      } I can prepare ${primaryTopic}, analyse gaps, or turn a recommendation into a draft action.`,
      createdAt: demoGeneratedAt,
      sourceIds,
    },
  ];
}

function buildQuickActions(primaryClassName: string): AssistantQuickActionDto[] {
  return [
    {
      id: "prepare-next-lesson",
      title: "Prepare my next lesson",
      description: "Draft a lesson flow using the next timetable block and class readiness.",
      icon: "auto_stories",
      tone: "ai",
      prompt: `Prepare my next lesson for ${primaryClassName}. Include activities, checks, and support steps.`,
    },
    {
      id: "plan-week",
      title: "Plan my teaching week",
      description: "Sequence classes, tasks, and evidence gaps around the visible timetable.",
      icon: "calendar_today",
      tone: "primary",
      prompt: "Plan my teaching week using my timetable, open tasks, and class readiness.",
    },
    {
      id: "analyze-results",
      title: "Analyze results",
      description: "Summarize score gaps and suggest remediation tasks from gradebook evidence.",
      icon: "monitoring",
      tone: "neutral",
      prompt: "Analyze my visible gradebook results and suggest the highest-impact remediation steps.",
    },
    {
      id: "idea-generator",
      title: "Idea generator",
      description: "Create classroom activities that match the active class and topic.",
      icon: "psychology",
      tone: "ai",
      prompt: "Suggest three active classroom ideas for my current topic and class level.",
    },
  ];
}

function buildContextCards({
  context,
  primaryClassName,
  nextEventLabel,
  openTasks,
  missingScoreCount,
}: {
  context: AuthenticatedContext;
  primaryClassName: string;
  nextEventLabel: string;
  openTasks: number;
  missingScoreCount: number;
}): AssistantContextCardDto[] {
  return [
    {
      id: "workspace",
      label: "Workspace",
      value: context.activeWorkspace.name,
      detail: `${context.activeWorkspace.currentAcademicYearName} / ${context.activeWorkspace.currentTermName}`,
      icon: "school",
      href: "/settings",
    },
    {
      id: "role",
      label: "Role",
      value: context.activeMembership.jobTitle,
      detail: context.activeMembership.roleName,
      icon: "person_check",
    },
    {
      id: "class",
      label: "Active class",
      value: primaryClassName,
      detail: nextEventLabel,
      icon: "groups",
      href: "/classes",
    },
    {
      id: "signals",
      label: "Signals",
      value: `${openTasks} open tasks`,
      detail: `${missingScoreCount} missing gradebook scores`,
      icon: "task_alt",
      href: "/my-tasks",
    },
  ];
}

function buildSources({
  timetable,
  resources,
  gradebooks,
  tasks,
}: {
  timetable: TimetableEventDto[];
  resources: ResourceDto[];
  gradebooks: GradebookSheetSummaryDto[];
  tasks: TeacherTaskDto[];
}): AssistantSourceDto[] {
  const sourceItems: AssistantSourceDto[] = [];
  const nextEvent = timetable.find((event) => event.status !== "completed");

  if (nextEvent) {
    sourceItems.push({
      id: `timetable:${nextEvent.id}`,
      title: nextEvent.classDisplayName ?? nextEvent.title,
      type: "Timetable block",
      detail: `${formatEventTime(nextEvent)} / ${nextEvent.notes}`,
      href: `/timetable/${nextEvent.id}`,
      icon: "calendar_view_day",
      tone: "primary",
      selected: true,
    });
  }

  for (const resource of resources.slice(0, 2)) {
    sourceItems.push({
      id: `resource:${resource.id}`,
      title: resource.title,
      type: titleCase(resource.type),
      detail: resource.classDisplayName ?? "Workspace resource",
      href: `/resources/${resource.id}`,
      icon: "description",
      tone: "ai",
      selected: sourceItems.length < 3,
    });
  }

  const gradebookWithGap = gradebooks.find((gradebook) => gradebook.missingCount > 0);
  if (gradebookWithGap) {
    sourceItems.push({
      id: `gradebook:${gradebookWithGap.id}`,
      title: gradebookWithGap.assessmentTitle,
      type: "Gradebook evidence",
      detail: `${gradebookWithGap.classDisplayName} / ${gradebookWithGap.missingCount} missing scores`,
      href: `/gradebook/${gradebookWithGap.id}`,
      icon: "grading",
      tone: "warning",
      selected: sourceItems.length < 3,
    });
  }

  const task = tasks.find((item) => item.sourceLabel);
  if (task) {
    sourceItems.push({
      id: `task:${task.id}`,
      title: task.title,
      type: "Task signal",
      detail: task.sourceLabel ?? task.classDisplayName ?? "Visible task",
      href: `/my-tasks/${task.id}`,
      icon: "task_alt",
      tone: "primary",
      selected: false,
    });
  }

  return sourceItems.slice(0, 5);
}

function buildSuggestedAction(
  prompt: string,
  quickActionId: string | undefined,
  workspace: AssistantWorkspaceBuild,
  context: AuthenticatedContext,
): AssistantSuggestedActionDto {
  const normalized = prompt.toLowerCase();

  if (
    quickActionId === "analyze-results" ||
    normalized.includes("result") ||
    normalized.includes("gradebook")
  ) {
    return {
      id: "open-gradebook",
      label: "Open gradebook",
      detail: "Review visible score gaps before applying remediation.",
      href: "/gradebook",
      icon: "grading",
      kind: "open_link",
      impact: "medium",
      status: "draft",
    };
  }

  if (quickActionId === "plan-week" || normalized.includes("week")) {
    return {
      id: "open-timetable",
      label: "Open timetable",
      detail: "Use the timetable to confirm the generated weekly sequence.",
      href: "/timetable",
      icon: "calendar_view_day",
      kind: "open_link",
      impact: "low",
      status: "draft",
    };
  }

  if (
    hasPermission(context.activeMembership, "lesson.create") &&
    (quickActionId === "prepare-next-lesson" || normalized.includes("lesson"))
  ) {
    return {
      id: "draft-lesson",
      label: "Create lesson draft",
      detail: `Queue a draft lesson plan for ${workspace.primaryClassName}.`,
      href: "/lesson-planner/new",
      icon: "auto_stories",
      kind: "draft_lesson",
      impact: "high",
      status: "needs_confirmation",
    };
  }

  return {
    id: "open-tasks",
    label: "Review tasks",
    detail: "Keep the recommendation as a task queue planning note.",
    href: "/my-tasks",
    icon: "task_alt",
    kind: "open_link",
    impact: "low",
    status: "draft",
  };
}

function buildResponse(
  prompt: string,
  quickActionId: string | undefined,
  workspace: AssistantWorkspaceBuild,
) {
  if (quickActionId === "analyze-results" || prompt.toLowerCase().includes("gradebook")) {
    return `I found gradebook evidence for ${workspace.primaryClassName}. Start with missing scores, then group learners by misconception before assigning remediation. I kept the recommendation tenant-scoped to the visible gradebook and task sources.`;
  }

  if (quickActionId === "plan-week" || prompt.toLowerCase().includes("week")) {
    return `Here is a scoped weekly plan: protect the next ${workspace.primaryClassName} block for ${workspace.primaryTopic}, reserve one short follow-up for open task evidence, and use the selected sources to avoid overloading the class sequence.`;
  }

  if (quickActionId === "idea-generator" || prompt.toLowerCase().includes("idea")) {
    return `For ${workspace.primaryClassName}, try a quick misconception sort, a paired explanation round, and an exit-ticket challenge. Each activity can reuse the selected source material and stay within your current class context.`;
  }

  return `I prepared a draft path for ${workspace.primaryClassName}: start with a five-minute recall check, teach ${workspace.primaryTopic} with visual modelling, then close with a short exit check and a support task for learners who need another pass.`;
}

function requiresConfirmation(membershipId: string, impact: AssistantActionImpact) {
  const mode = getRepositories().accountSettings.getForMembership(membershipId).aiConfirmationMode;

  if (mode === "always") {
    return true;
  }

  if (mode === "high_impact") {
    return impact === "high";
  }

  return false;
}

function getAssistantAccess(
  context: RequestAuthContext,
): AssistantServiceResult<{ context: AuthenticatedContext }> {
  if (context.status === "unauthenticated") {
    return authRequired();
  }

  if (!hasPermission(context.activeMembership, "ai.use")) {
    return forbidden("You do not have permission to use Ask Pal in this workspace.");
  }

  return { ok: true, data: { context } };
}

function validateProposalInput(
  input: CreateAssistantProposalDto,
): AssistantServiceResult<{
  prompt: string;
  quickActionId?: string;
  sourceIds: string[];
  contextTags: string[];
}> {
  const fields: Record<string, string[]> = {};
  const prompt = typeof input.prompt === "string" ? input.prompt.trim() : "";

  if (prompt.length < 3) {
    fields.prompt = ["Enter at least 3 characters."];
  }

  if (prompt.length > 1000) {
    fields.prompt = [...(fields.prompt ?? []), "Keep prompts under 1000 characters."];
  }

  if (Object.keys(fields).length > 0) {
    return {
      ok: false,
      status: 400,
      code: "VALIDATION_ERROR",
      message: "Check the highlighted fields.",
      fields,
    };
  }

  return {
    ok: true,
    data: {
      prompt,
      quickActionId: typeof input.quickActionId === "string" ? input.quickActionId : undefined,
      sourceIds: Array.isArray(input.sourceIds)
        ? input.sourceIds.filter((sourceId): sourceId is string => typeof sourceId === "string")
        : [],
      contextTags: Array.isArray(input.contextTags)
        ? input.contextTags.filter((tag): tag is string => typeof tag === "string")
        : [],
    },
  };
}

function getData<T>(result: { ok: true; data: T } | { ok: false }) {
  return result.ok ? result.data : null;
}

function toWorkspaceSummary(context: AuthenticatedContext): WorkspaceSummaryDto {
  return {
    id: context.activeWorkspace.id,
    name: context.activeWorkspace.name,
    academicYearName: context.activeWorkspace.currentAcademicYearName,
    termName: context.activeWorkspace.currentTermName,
  };
}

function formatEventTime(event: TimetableEventDto) {
  return `${formatTime(event.startAt)} - ${formatTime(event.endAt)}`;
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(new Date(value));
}

function titleCase(value: string) {
  return value
    .split("_")
    .map((part) => part.slice(0, 1).toUpperCase() + part.slice(1))
    .join(" ");
}

function authRequired(): AssistantServiceResult<never> {
  return {
    ok: false,
    status: 401,
    code: "AUTH_REQUIRED",
    message: "Sign in to continue.",
  };
}

function forbidden(message: string): AssistantServiceResult<never> {
  return {
    ok: false,
    status: 403,
    code: "FORBIDDEN",
    message,
  };
}
