import type { WorkspaceSummaryDto } from "@/lib/features/classes/types";
import type {
  AddSupportMessageDto,
  CreateSupportRequestDto,
  HelpCentreResponseDto,
  SupportGuideCategory,
  SupportGuideDto,
  SupportMessageDto,
  SupportRequestDetailDto,
  SupportRequestDto,
  SupportRequestPriority,
  SupportRequestStatus,
} from "@/lib/features/help/types";
import { hasAnyPermission, hasPermission } from "@/lib/security/permissions";
import type { RequestAuthContext } from "@/lib/server/auth-context";
import {
  addDemoSupportMessage,
  createDemoSupportRequest,
  demoMemberships,
  demoSupportGuides,
  demoSupportRequests,
  demoUsers,
  getSupportRequest,
  type DemoSupportMessage,
  type DemoSupportRequest,
} from "@/lib/server/demo-store";

export type HelpServiceErrorStatus = 400 | 401 | 403 | 404;

export type HelpServiceResult<T> =
  | { ok: true; data: T }
  | {
      ok: false;
      status: HelpServiceErrorStatus;
      code: "AUTH_REQUIRED" | "FORBIDDEN" | "NOT_FOUND" | "VALIDATION_ERROR";
      message: string;
      fields?: Record<string, string[]>;
    };

type AuthenticatedContext = Extract<RequestAuthContext, { status: "authenticated" }>;

const categories: SupportGuideCategory[] = [
  "getting_started",
  "assessment",
  "reports",
  "ai",
  "account",
  "troubleshooting",
];
const priorities: SupportRequestPriority[] = ["low", "medium", "high"];
const statuses: SupportRequestStatus[] = [
  "open",
  "waiting_support",
  "waiting_teacher",
  "resolved",
];

export function getHelpCentre(
  context: RequestAuthContext,
): HelpServiceResult<HelpCentreResponseDto> {
  const access = getHelpAccess(context);

  if (!access.ok) {
    return access;
  }

  const authenticatedContext = access.data.context;
  const guides = demoSupportGuides
    .filter(
      (guide) => !guide.workspaceId || guide.workspaceId === authenticatedContext.activeWorkspace.id,
    )
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  const requests = demoSupportRequests
    .filter((request) => request.workspaceId === authenticatedContext.activeWorkspace.id)
    .filter((request) => canAccessSupportRequest(authenticatedContext, request))
    .sort(compareSupportRequests);

  return {
    ok: true,
    data: {
      workspace: toWorkspaceSummary(authenticatedContext),
      permissions: {
        canCreateSupportRequest: canCreateSupportRequest(authenticatedContext),
        canManageSupport: canManageSupport(authenticatedContext),
        canUseAi: hasPermission(authenticatedContext.activeMembership, "ai.use"),
      },
      guides: guides.map(toSupportGuideDto),
      requests: requests.map(toSupportRequestDto),
    },
  };
}

export function getSupportRequestDetail(
  context: RequestAuthContext,
  requestId: string,
): HelpServiceResult<SupportRequestDetailDto> {
  const access = getAccessibleSupportRequest(context, requestId);

  if (!access.ok) {
    return access;
  }

  return {
    ok: true,
    data: toSupportRequestDetailDto(access.data.request, access.data.context),
  };
}

export function createSupportRequest(
  context: RequestAuthContext,
  input: CreateSupportRequestDto,
): HelpServiceResult<SupportRequestDetailDto> {
  const access = getHelpAccess(context);

  if (!access.ok) {
    return access;
  }

  if (!canCreateSupportRequest(access.data.context)) {
    return forbidden("You do not have permission to open support requests.");
  }

  const validation = validateCreateSupportRequest(input);

  if (!validation.ok) {
    return validation;
  }

  const created = createDemoSupportRequest({
    workspaceId: access.data.context.activeWorkspace.id,
    createdByMembershipId: access.data.context.activeMembership.id,
    ...validation.data,
  });

  return {
    ok: true,
    data: toSupportRequestDetailDto(created, access.data.context),
  };
}

export function addSupportMessage(
  context: RequestAuthContext,
  requestId: string,
  input: AddSupportMessageDto,
): HelpServiceResult<SupportRequestDetailDto> {
  const access = getAccessibleSupportRequest(context, requestId);

  if (!access.ok) {
    return access;
  }

  if (!canAddMessage(access.data.context)) {
    return forbidden("You do not have permission to update support requests.");
  }

  const validation = validateSupportMessage(input, canManageSupport(access.data.context));

  if (!validation.ok) {
    return validation;
  }

  const updated = addDemoSupportMessage(requestId, {
    authorMembershipId: access.data.context.activeMembership.id,
    body: validation.data.body,
    status: validation.data.status,
  });

  if (!updated) {
    return notFound();
  }

  return {
    ok: true,
    data: toSupportRequestDetailDto(updated, access.data.context),
  };
}

function getHelpAccess(
  context: RequestAuthContext,
): HelpServiceResult<{ context: AuthenticatedContext }> {
  if (context.status === "unauthenticated") {
    return authRequired();
  }

  if (
    !hasAnyPermission(context.activeMembership, [
      "support.view",
      "support.request",
      "support.manage",
    ])
  ) {
    return forbidden("You do not have permission to view support.");
  }

  return { ok: true, data: { context } };
}

function getAccessibleSupportRequest(
  context: RequestAuthContext,
  requestId: string,
): HelpServiceResult<{ context: AuthenticatedContext; request: DemoSupportRequest }> {
  const access = getHelpAccess(context);

  if (!access.ok) {
    return access;
  }

  const authenticatedContext = access.data.context;
  const request = getSupportRequest(requestId);

  if (!request || request.workspaceId !== authenticatedContext.activeWorkspace.id) {
    return notFound();
  }

  if (!canAccessSupportRequest(authenticatedContext, request)) {
    return forbidden("This support request is outside your support scope.");
  }

  return { ok: true, data: { context: authenticatedContext, request } };
}

function canAccessSupportRequest(context: AuthenticatedContext, request: DemoSupportRequest) {
  return (
    canManageSupport(context) ||
    request.createdByMembershipId === context.activeMembership.id ||
    request.assignedSupportMembershipId === context.activeMembership.id
  );
}

function canCreateSupportRequest(context: AuthenticatedContext) {
  return hasAnyPermission(context.activeMembership, ["support.request", "support.manage"]);
}

function canAddMessage(context: AuthenticatedContext) {
  return hasAnyPermission(context.activeMembership, ["support.request", "support.manage"]);
}

function canManageSupport(context: AuthenticatedContext) {
  return hasPermission(context.activeMembership, "support.manage");
}

function toSupportGuideDto(guide: (typeof demoSupportGuides)[number]): SupportGuideDto {
  return {
    id: guide.id,
    title: guide.title,
    summary: guide.summary,
    category: guide.category,
    readMinutes: guide.readMinutes,
    updatedAt: guide.updatedAt,
    tags: guide.tags,
    href: guide.href,
  };
}

function toSupportRequestDetailDto(
  request: DemoSupportRequest,
  context: AuthenticatedContext,
): SupportRequestDetailDto {
  return {
    ...toSupportRequestDto(request),
    workspace: toWorkspaceSummary(context),
    permissions: {
      canAddMessage: canAddMessage(context),
      canManageSupport: canManageSupport(context),
      canUseAi: hasPermission(context.activeMembership, "ai.use"),
    },
    messages: request.messages.map(toSupportMessageDto),
  };
}

function toSupportRequestDto(request: DemoSupportRequest): SupportRequestDto {
  const creator = getMembershipLabel(request.createdByMembershipId);
  const assignee = request.assignedSupportMembershipId
    ? getMembershipLabel(request.assignedSupportMembershipId)
    : null;

  return {
    id: request.id,
    workspaceId: request.workspaceId,
    title: request.title,
    summary: request.summary,
    category: request.category,
    status: request.status,
    priority: request.priority,
    createdByName: creator.name,
    assignedSupportName: assignee?.name,
    sourceHref: request.sourceHref,
    sourceLabel: request.sourceLabel,
    createdAt: request.createdAt,
    updatedAt: request.updatedAt,
    resolvedAt: request.resolvedAt,
    messageCount: request.messages.length,
  };
}

function toSupportMessageDto(message: DemoSupportMessage): SupportMessageDto {
  const author = getMembershipLabel(message.authorMembershipId);

  return {
    id: message.id,
    authorName: author.name,
    authorRole: author.role,
    body: message.body,
    createdAt: message.createdAt,
  };
}

function validateCreateSupportRequest(
  input: CreateSupportRequestDto,
): HelpServiceResult<CreateSupportRequestDto> {
  const fields: Record<string, string[]> = {};
  const title = String(input?.title ?? "").trim();
  const summary = String(input?.summary ?? "").trim();
  const category = input?.category;
  const priority = input?.priority;
  const sourceHref = String(input?.sourceHref ?? "").trim();
  const sourceLabel = String(input?.sourceLabel ?? "").trim();

  if (title.length < 5) {
    fields.title = ["Title must be at least 5 characters."];
  }

  if (summary.length < 12) {
    fields.summary = ["Summary must be at least 12 characters."];
  }

  if (!categories.includes(category)) {
    fields.category = ["Support category is not supported."];
  }

  if (!priorities.includes(priority)) {
    fields.priority = ["Support priority is not supported."];
  }

  if (Object.keys(fields).length > 0) {
    return validationError("Support request could not be opened.", fields);
  }

  return {
    ok: true,
    data: {
      title,
      summary,
      category,
      priority,
      sourceHref: sourceHref || undefined,
      sourceLabel: sourceLabel || undefined,
    },
  };
}

function validateSupportMessage(
  input: AddSupportMessageDto,
  allowStatusChange: boolean,
): HelpServiceResult<{ body: string; status?: SupportRequestStatus }> {
  const fields: Record<string, string[]> = {};
  const body = String(input?.body ?? "").trim();
  const status = input?.status;

  if (body.length < 2) {
    fields.body = ["Message must be at least 2 characters."];
  }

  if (body.length > 800) {
    fields.body = ["Message must be 800 characters or fewer."];
  }

  if (status && (!allowStatusChange || !statuses.includes(status))) {
    fields.status = ["Support status is not supported for this request."];
  }

  if (Object.keys(fields).length > 0) {
    return validationError("Support message could not be saved.", fields);
  }

  return { ok: true, data: { body, status: allowStatusChange ? status : undefined } };
}

function compareSupportRequests(a: DemoSupportRequest, b: DemoSupportRequest) {
  const statusDifference = statusRank(a.status) - statusRank(b.status);
  return statusDifference === 0 ? b.updatedAt.localeCompare(a.updatedAt) : statusDifference;
}

function statusRank(status: DemoSupportRequest["status"]) {
  if (status === "open") {
    return 0;
  }

  if (status === "waiting_support") {
    return 1;
  }

  if (status === "waiting_teacher") {
    return 2;
  }

  return 3;
}

function getMembershipLabel(membershipId: string): { name: string; role: string } {
  const membership = demoMemberships.find((candidate) => candidate.id === membershipId);
  const user = membership ? demoUsers.find((candidate) => candidate.id === membership.userId) : null;

  return {
    name: user?.displayName ?? "Support team",
    role: membership?.roleName ?? "Support",
  };
}

function toWorkspaceSummary(context: AuthenticatedContext) {
  return {
    id: context.activeWorkspace.id,
    name: context.activeWorkspace.name,
    academicYearName: context.activeWorkspace.currentAcademicYearName,
    termName: context.activeWorkspace.currentTermName,
  } satisfies WorkspaceSummaryDto;
}

function authRequired(): HelpServiceResult<never> {
  return {
    ok: false,
    status: 401,
    code: "AUTH_REQUIRED",
    message: "Sign in to continue.",
  };
}

function forbidden(message: string): HelpServiceResult<never> {
  return {
    ok: false,
    status: 403,
    code: "FORBIDDEN",
    message,
  };
}

function notFound(): HelpServiceResult<never> {
  return {
    ok: false,
    status: 404,
    code: "NOT_FOUND",
    message: "Support request could not be found in this workspace.",
  };
}

function validationError(
  message: string,
  fields: Record<string, string[]>,
): HelpServiceResult<never> {
  return {
    ok: false,
    status: 400,
    code: "VALIDATION_ERROR",
    message,
    fields,
  };
}
