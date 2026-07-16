import type { WorkspaceSummaryDto } from "@/lib/features/classes/types";
import type {
  ResourceDetailDto,
  ResourceDto,
  TeacherResourcesResponseDto,
} from "@/lib/features/resources/types";
import { hasAnyPermission, hasPermission } from "@/lib/security/permissions";
import type { RequestAuthContext } from "@/lib/server/auth-context";
import {
  demoClasses,
  demoMemberships,
  demoResources,
  demoUsers,
  type DemoClass,
  type DemoResource,
} from "@/lib/server/demo-store";

export type ResourcesServiceErrorStatus = 401 | 403 | 404;

export type ResourcesServiceResult<T> =
  | { ok: true; data: T }
  | {
      ok: false;
      status: ResourcesServiceErrorStatus;
      code: "AUTH_REQUIRED" | "FORBIDDEN" | "NOT_FOUND";
      message: string;
    };

type AuthenticatedContext = Extract<RequestAuthContext, { status: "authenticated" }>;

export function listTeacherResources(
  context: RequestAuthContext,
): ResourcesServiceResult<TeacherResourcesResponseDto> {
  const access = getResourcesAccess(context);

  if (!access.ok) {
    return access;
  }

  const resources = demoResources
    .filter((resource) => resource.workspaceId === access.data.activeWorkspace.id)
    .filter((resource) => canAccessResource(access.data, resource))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  return {
    ok: true,
    data: {
      workspace: toWorkspaceSummary(access.data),
      permissions: {
        canManageResources: hasPermission(access.data.activeMembership, "resource.manage"),
        canUseAi: hasPermission(access.data.activeMembership, "ai.use"),
      },
      resources: resources.map(toResourceDto),
    },
  };
}

export function getResource(
  context: RequestAuthContext,
  resourceId: string,
): ResourcesServiceResult<ResourceDetailDto> {
  const access = getResourcesAccess(context);

  if (!access.ok) {
    return access;
  }

  const resource = demoResources.find((candidate) => candidate.id === resourceId);

  if (!resource || resource.workspaceId !== access.data.activeWorkspace.id) {
    return notFound();
  }

  if (!canAccessResource(access.data, resource)) {
    return forbidden("This resource is outside your assigned teaching scope.");
  }

  return {
    ok: true,
    data: {
      ...toResourceDto(resource),
      workspace: toWorkspaceSummary(access.data),
      ownerName: resource.ownerMembershipId
        ? getMembershipUserName(resource.ownerMembershipId)
        : undefined,
      classHref: resource.classId ? `/classes/${resource.classId}` : undefined,
      lessonPlanHref: resource.linkedLessonPlanId
        ? `/lesson-planner/${resource.linkedLessonPlanId}`
        : undefined,
      assessmentHref: resource.linkedAssessmentId
        ? `/assessments/${resource.linkedAssessmentId}`
        : undefined,
      questionHref: resource.linkedQuestionId
        ? `/question-bank/${resource.linkedQuestionId}`
        : undefined,
    },
  };
}

function getResourcesAccess(
  context: RequestAuthContext,
): ResourcesServiceResult<AuthenticatedContext> {
  if (context.status === "unauthenticated") {
    return authRequired();
  }

  if (!hasAnyPermission(context.activeMembership, ["resource.view", "resource.manage"])) {
    return forbidden("You do not have permission to view resources.");
  }

  return { ok: true, data: context };
}

function canAccessResource(context: AuthenticatedContext, resource: DemoResource) {
  const canManageClasses = hasPermission(context.activeMembership, "class.manage");

  if (resource.visibility === "workspace") {
    return true;
  }

  if (resource.visibility === "teacher") {
    return canManageClasses || resource.ownerMembershipId === context.activeMembership.id;
  }

  if (!resource.classId) {
    return false;
  }

  const classAccess = getAccessibleClass(context, resource.classId);
  return classAccess.ok;
}

function getAccessibleClass(
  context: AuthenticatedContext,
  classId: string,
): ResourcesServiceResult<{ classRecord: DemoClass }> {
  const classRecord = demoClasses.find((candidate) => candidate.id === classId);

  if (!classRecord || classRecord.workspaceId !== context.activeWorkspace.id) {
    return notFound();
  }

  const canManageClasses = hasPermission(context.activeMembership, "class.manage");

  if (
    !canManageClasses &&
    !classRecord.assignedMembershipIds.includes(context.activeMembership.id)
  ) {
    return forbidden("This class is outside your assigned teaching scope.");
  }

  return { ok: true, data: { classRecord } };
}

function toResourceDto(resource: DemoResource): ResourceDto {
  const classRecord = resource.classId
    ? demoClasses.find((candidate) => candidate.id === resource.classId)
    : null;

  return {
    id: resource.id,
    classId: resource.classId,
    classDisplayName: classRecord?.displayName,
    subjectName: classRecord?.subjectName,
    gradeName: classRecord?.gradeName,
    title: resource.title,
    type: resource.type,
    status: resource.status,
    visibility: resource.visibility,
    origin: resource.origin,
    fileKind: resource.fileKind,
    description: resource.description,
    tags: resource.tags,
    sizeLabel: resource.sizeLabel,
    usageCount: resource.usageCount,
    updatedAt: resource.updatedAt,
    lastUsedAt: resource.lastUsedAt,
    url: resource.url,
    linkedLessonPlanId: resource.linkedLessonPlanId,
    linkedAssessmentId: resource.linkedAssessmentId,
    linkedQuestionId: resource.linkedQuestionId,
  };
}

function getMembershipUserName(membershipId: string) {
  const membership = demoMemberships.find((candidate) => candidate.id === membershipId);
  const user = membership ? demoUsers.find((candidate) => candidate.id === membership.userId) : null;
  return user?.displayName ?? "Unknown teacher";
}

function toWorkspaceSummary(context: AuthenticatedContext): WorkspaceSummaryDto {
  return {
    id: context.activeWorkspace.id,
    name: context.activeWorkspace.name,
    academicYearName: context.activeWorkspace.currentAcademicYearName,
    termName: context.activeWorkspace.currentTermName,
  };
}

function authRequired(): ResourcesServiceResult<never> {
  return {
    ok: false,
    status: 401,
    code: "AUTH_REQUIRED",
    message: "Sign in to continue.",
  };
}

function forbidden(message: string): ResourcesServiceResult<never> {
  return {
    ok: false,
    status: 403,
    code: "FORBIDDEN",
    message,
  };
}

function notFound(): ResourcesServiceResult<never> {
  return {
    ok: false,
    status: 404,
    code: "NOT_FOUND",
    message: "Resource could not be found in this workspace.",
  };
}
