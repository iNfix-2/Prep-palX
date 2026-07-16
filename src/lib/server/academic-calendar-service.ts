import type { WorkspaceSummaryDto } from "@/lib/features/classes/types";
import type {
  AcademicCalendarEventDetailDto,
  AcademicCalendarEventDto,
  AcademicCalendarTermDto,
  TeacherAcademicCalendarResponseDto,
} from "@/lib/features/academic-calendar/types";
import { hasPermission } from "@/lib/security/permissions";
import type { RequestAuthContext } from "@/lib/server/auth-context";
import {
  DEMO_TODAY,
  demoAcademicCalendarEvents,
  demoClasses,
  demoMemberships,
  demoUsers,
  type DemoAcademicCalendarEvent,
  type DemoClass,
} from "@/lib/server/demo-store";

export type AcademicCalendarServiceErrorStatus = 400 | 401 | 403 | 404;

export type AcademicCalendarServiceResult<T> =
  | { ok: true; data: T }
  | {
      ok: false;
      status: AcademicCalendarServiceErrorStatus;
      code: "AUTH_REQUIRED" | "FORBIDDEN" | "NOT_FOUND" | "VALIDATION_ERROR";
      message: string;
      fields?: Record<string, string[]>;
    };

type AuthenticatedContext = Extract<RequestAuthContext, { status: "authenticated" }>;

export function listTeacherAcademicCalendar(
  context: RequestAuthContext,
  fromDate = DEMO_TODAY,
): AcademicCalendarServiceResult<TeacherAcademicCalendarResponseDto> {
  const access = getCalendarAccess(context);

  if (!access.ok) {
    return access;
  }

  const selectedDate = normalizeDate(fromDate);

  if (!selectedDate) {
    return {
      ok: false,
      status: 400,
      code: "VALIDATION_ERROR",
      message: "Academic calendar date must use YYYY-MM-DD format.",
      fields: { from: ["Use YYYY-MM-DD format."] },
    };
  }

  const events = demoAcademicCalendarEvents
    .filter((event) => event.workspaceId === access.data.activeWorkspace.id)
    .filter((event) => event.endDate >= selectedDate)
    .filter((event) => canAccessEvent(access.data, event))
    .sort(sortCalendarEvents);

  return {
    ok: true,
    data: {
      workspace: toWorkspaceSummary(access.data),
      selectedDate,
      term: getTermSummary(access.data, selectedDate),
      permissions: {
        canUseAi: hasPermission(access.data.activeMembership, "ai.use"),
      },
      events: events.map(toAcademicCalendarEventDto),
    },
  };
}

export function getAcademicCalendarEvent(
  context: RequestAuthContext,
  eventId: string,
): AcademicCalendarServiceResult<AcademicCalendarEventDetailDto> {
  const access = getCalendarAccess(context);

  if (!access.ok) {
    return access;
  }

  const event = demoAcademicCalendarEvents.find((candidate) => candidate.id === eventId);

  if (!event || event.workspaceId !== access.data.activeWorkspace.id) {
    return notFound();
  }

  if (!canAccessEvent(access.data, event)) {
    return forbidden("This calendar event is outside your assigned teaching scope.");
  }

  return {
    ok: true,
    data: {
      ...toAcademicCalendarEventDto(event),
      workspace: toWorkspaceSummary(access.data),
      term: getTermSummary(access.data, event.startDate),
      ownerName: event.ownerMembershipId ? getMembershipUserName(event.ownerMembershipId) : undefined,
      classHref: event.classId ? `/classes/${event.classId}` : undefined,
      timetableHref: event.linkedTimetableEventId
        ? `/timetable/${event.linkedTimetableEventId}`
        : undefined,
      assessmentHref: event.linkedAssessmentId
        ? `/assessments/${event.linkedAssessmentId}`
        : undefined,
      reportHref: event.linkedReportClassId ? `/reports/${event.linkedReportClassId}` : undefined,
    },
  };
}

function getCalendarAccess(
  context: RequestAuthContext,
): AcademicCalendarServiceResult<AuthenticatedContext> {
  if (context.status === "unauthenticated") {
    return authRequired();
  }

  if (!hasPermission(context.activeMembership, "calendar.view")) {
    return forbidden("You do not have permission to view the academic calendar.");
  }

  return { ok: true, data: context };
}

function canAccessEvent(context: AuthenticatedContext, event: DemoAcademicCalendarEvent) {
  const canManageClasses = hasPermission(context.activeMembership, "class.manage");

  if (event.visibility === "workspace") {
    return true;
  }

  if (event.visibility === "teacher") {
    return canManageClasses || event.ownerMembershipId === context.activeMembership.id;
  }

  if (!event.classId) {
    return false;
  }

  const classAccess = getAccessibleClass(context, event.classId);
  return classAccess.ok;
}

function getAccessibleClass(
  context: AuthenticatedContext,
  classId: string,
): AcademicCalendarServiceResult<{ classRecord: DemoClass }> {
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

function toAcademicCalendarEventDto(
  event: DemoAcademicCalendarEvent,
): AcademicCalendarEventDto {
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
    visibility: event.visibility,
    priority: event.priority,
    startDate: event.startDate,
    endDate: event.endDate,
    location: event.location,
    description: event.description,
    requiredAction: event.requiredAction,
    linkedTimetableEventId: event.linkedTimetableEventId,
    linkedAssessmentId: event.linkedAssessmentId,
    linkedReportClassId: event.linkedReportClassId,
  };
}

function getTermSummary(
  context: AuthenticatedContext,
  selectedDate: string,
): AcademicCalendarTermDto {
  const termEvent = demoAcademicCalendarEvents.find(
    (event) =>
      event.workspaceId === context.activeWorkspace.id &&
      event.type === "term" &&
      event.startDate <= selectedDate &&
      event.endDate >= selectedDate,
  );
  const startDate = termEvent?.startDate ?? "2026-06-08";
  const endDate = termEvent?.endDate ?? "2026-08-21";
  const dayMs = 86_400_000;
  const weekNumber =
    Math.floor(
      (Date.parse(`${selectedDate}T00:00:00.000Z`) -
        Date.parse(`${startDate}T00:00:00.000Z`)) /
        dayMs /
        7,
    ) + 1;
  const weekCount = Math.ceil(
    ((Date.parse(`${endDate}T00:00:00.000Z`) -
      Date.parse(`${startDate}T00:00:00.000Z`)) /
      dayMs +
      1) /
      7,
  );

  return {
    academicYearName: context.activeWorkspace.currentAcademicYearName,
    termName: context.activeWorkspace.currentTermName,
    weekNumber: Math.max(1, Math.min(weekNumber, weekCount)),
    weekCount,
    startDate,
    endDate,
  };
}

function normalizeDate(date: string) {
  const trimmed = date.trim();

  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return null;
  }

  return trimmed;
}

function sortCalendarEvents(a: DemoAcademicCalendarEvent, b: DemoAcademicCalendarEvent) {
  const dateOrder = a.startDate.localeCompare(b.startDate);

  if (dateOrder !== 0) {
    return dateOrder;
  }

  return a.title.localeCompare(b.title);
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

function authRequired(): AcademicCalendarServiceResult<never> {
  return {
    ok: false,
    status: 401,
    code: "AUTH_REQUIRED",
    message: "Sign in to continue.",
  };
}

function forbidden(message: string): AcademicCalendarServiceResult<never> {
  return {
    ok: false,
    status: 403,
    code: "FORBIDDEN",
    message,
  };
}

function notFound(): AcademicCalendarServiceResult<never> {
  return {
    ok: false,
    status: 404,
    code: "NOT_FOUND",
    message: "Academic calendar event could not be found in this workspace.",
  };
}
