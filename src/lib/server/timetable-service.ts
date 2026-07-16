import type { WorkspaceSummaryDto } from "@/lib/features/classes/types";
import type {
  TeacherTimetableResponseDto,
  TimetableEventDetailDto,
  TimetableEventDto,
} from "@/lib/features/timetable/types";
import { hasPermission } from "@/lib/security/permissions";
import type { RequestAuthContext } from "@/lib/server/auth-context";
import {
  DEMO_TODAY,
  demoClasses,
  demoMemberships,
  demoTimetableEvents,
  demoUsers,
  type DemoClass,
  type DemoTimetableEvent,
} from "@/lib/server/demo-store";

export type TimetableServiceErrorStatus = 400 | 401 | 403 | 404;

export type TimetableServiceResult<T> =
  | { ok: true; data: T }
  | {
      ok: false;
      status: TimetableServiceErrorStatus;
      code: "AUTH_REQUIRED" | "FORBIDDEN" | "NOT_FOUND" | "VALIDATION_ERROR";
      message: string;
      fields?: Record<string, string[]>;
    };

type AuthenticatedContext = Extract<RequestAuthContext, { status: "authenticated" }>;

export function listTeacherTimetable(
  context: RequestAuthContext,
  date = DEMO_TODAY,
): TimetableServiceResult<TeacherTimetableResponseDto> {
  const access = getTimetableAccess(context);

  if (!access.ok) {
    return access;
  }

  const selectedDate = normalizeDate(date);

  if (!selectedDate) {
    return {
      ok: false,
      status: 400,
      code: "VALIDATION_ERROR",
      message: "Timetable date must use YYYY-MM-DD format.",
      fields: { date: ["Use YYYY-MM-DD format."] },
    };
  }

  const events = demoTimetableEvents
    .filter((event) => event.workspaceId === access.data.activeWorkspace.id)
    .filter((event) => event.startAt.slice(0, 10) === selectedDate)
    .filter((event) => canAccessEvent(access.data, event))
    .sort((a, b) => a.startAt.localeCompare(b.startAt));

  return {
    ok: true,
    data: {
      workspace: toWorkspaceSummary(access.data),
      selectedDate,
      permissions: {
        canUseAi: hasPermission(access.data.activeMembership, "ai.use"),
      },
      events: events.map(toTimetableEventDto),
    },
  };
}

export function getTimetableEvent(
  context: RequestAuthContext,
  eventId: string,
): TimetableServiceResult<TimetableEventDetailDto> {
  const access = getTimetableAccess(context);

  if (!access.ok) {
    return access;
  }

  const event = demoTimetableEvents.find((candidate) => candidate.id === eventId);

  if (!event || event.workspaceId !== access.data.activeWorkspace.id) {
    return notFound();
  }

  if (!canAccessEvent(access.data, event)) {
    return forbidden("This timetable event is outside your assigned teaching scope.");
  }

  return {
    ok: true,
    data: {
      ...toTimetableEventDto(event),
      workspace: toWorkspaceSummary(access.data),
      teacherName: getTeacherName(event.teacherMembershipId),
      classHref: event.classId ? `/classes/${event.classId}` : undefined,
      lessonPlanHref: event.linkedLessonPlanId
        ? `/lesson-planner/${event.linkedLessonPlanId}`
        : undefined,
      assessmentHref: event.linkedAssessmentId
        ? `/assessments/${event.linkedAssessmentId}`
        : undefined,
    },
  };
}

function getTimetableAccess(
  context: RequestAuthContext,
): TimetableServiceResult<AuthenticatedContext> {
  if (context.status === "unauthenticated") {
    return authRequired();
  }

  if (!hasPermission(context.activeMembership, "timetable.view")) {
    return forbidden("You do not have permission to view the timetable.");
  }

  return { ok: true, data: context };
}

function canAccessEvent(context: AuthenticatedContext, event: DemoTimetableEvent) {
  const canManageClasses = hasPermission(context.activeMembership, "class.manage");

  if (!event.classId) {
    return canManageClasses || event.teacherMembershipId === context.activeMembership.id;
  }

  const classAccess = getAccessibleClass(context, event.classId);
  return classAccess.ok;
}

function getAccessibleClass(
  context: AuthenticatedContext,
  classId: string,
): TimetableServiceResult<{ classRecord: DemoClass }> {
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

function toTimetableEventDto(event: DemoTimetableEvent): TimetableEventDto {
  const classRecord = event.classId
    ? demoClasses.find((candidate) => candidate.id === event.classId)
    : null;

  return {
    id: event.id,
    classId: event.classId,
    classDisplayName: classRecord?.displayName,
    subjectName: classRecord?.subjectName,
    gradeName: classRecord?.gradeName,
    title: event.title,
    type: event.type,
    status: event.status,
    preparationStatus: event.preparationStatus,
    startAt: event.startAt,
    endAt: event.endAt,
    location: event.location,
    notes: event.notes,
    linkedLessonPlanId: event.linkedLessonPlanId,
    linkedAssessmentId: event.linkedAssessmentId,
  };
}

function normalizeDate(date: string) {
  const trimmed = date.trim();

  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return null;
  }

  return trimmed;
}

function getTeacherName(membershipId: string) {
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

function authRequired(): TimetableServiceResult<never> {
  return {
    ok: false,
    status: 401,
    code: "AUTH_REQUIRED",
    message: "Sign in to continue.",
  };
}

function forbidden(message: string): TimetableServiceResult<never> {
  return {
    ok: false,
    status: 403,
    code: "FORBIDDEN",
    message,
  };
}

function notFound(): TimetableServiceResult<never> {
  return {
    ok: false,
    status: 404,
    code: "NOT_FOUND",
    message: "Timetable event could not be found in this workspace.",
  };
}
