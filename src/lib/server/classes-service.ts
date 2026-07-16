import type {
  ClassOverviewDto,
  TeacherClassListItemDto,
  TeacherClassesResponseDto,
  WorkspaceSummaryDto,
} from "@/lib/features/classes/types";
import { hasAnyPermission, hasPermission } from "@/lib/security/permissions";
import {
  demoClasses,
  demoLearners,
  demoMemberships,
  demoUsers,
  type DemoClass,
} from "@/lib/server/demo-store";
import type { RequestAuthContext } from "@/lib/server/auth-context";

export type ServiceErrorStatus = 401 | 403 | 404;

export type ServiceResult<T> =
  | { ok: true; data: T }
  | {
      ok: false;
      status: ServiceErrorStatus;
      code: "AUTH_REQUIRED" | "FORBIDDEN" | "NOT_FOUND";
      message: string;
    };

export function listTeacherClasses(
  context: RequestAuthContext,
): ServiceResult<TeacherClassesResponseDto> {
  if (context.status === "unauthenticated") {
    return authRequired();
  }

  if (!hasAnyPermission(context.activeMembership, ["class.view_assigned", "class.manage"])) {
    return forbidden("You do not have permission to view classes.");
  }

  const { activeMembership, activeWorkspace } = context;
  const canManageClasses = hasPermission(activeMembership, "class.manage");
  const classes = demoClasses
    .filter((classRecord) => classRecord.workspaceId === activeWorkspace.id)
    .filter(
      (classRecord) =>
        canManageClasses || classRecord.assignedMembershipIds.includes(activeMembership.id),
    )
    .sort((a, b) => a.displayName.localeCompare(b.displayName));

  return {
    ok: true,
    data: {
      workspace: toWorkspaceSummary(context),
      permissions: {
        canManageClasses,
        canCreateLessonPlan: hasPermission(activeMembership, "lesson.create"),
        canUseAi: hasPermission(activeMembership, "ai.use"),
      },
      classes: classes.map(toTeacherClassListItemDto),
    },
  };
}

export function getClassOverview(
  context: RequestAuthContext,
  classId: string,
): ServiceResult<ClassOverviewDto> {
  if (context.status === "unauthenticated") {
    return authRequired();
  }

  const classRecord = demoClasses.find((candidate) => candidate.id === classId);

  if (!classRecord || classRecord.workspaceId !== context.activeWorkspace.id) {
    return {
      ok: false,
      status: 404,
      code: "NOT_FOUND",
      message: "Class was not found in the active workspace.",
    };
  }

  if (!hasAnyPermission(context.activeMembership, ["class.view_assigned", "class.manage"])) {
    return forbidden("You do not have permission to view classes.");
  }

  const canManageClasses = hasPermission(context.activeMembership, "class.manage");

  if (
    !canManageClasses &&
    !classRecord.assignedMembershipIds.includes(context.activeMembership.id)
  ) {
    return forbidden("This class is outside your assigned teaching scope.");
  }

  return {
    ok: true,
    data: {
      ...toTeacherClassListItemDto(classRecord),
      workspace: toWorkspaceSummary(context),
      description: classRecord.description,
      currentUnit: classRecord.currentUnit,
      assignedTeachers: classRecord.assignedMembershipIds
        .map((membershipId) => demoMemberships.find((membership) => membership.id === membershipId))
        .filter(isDefined)
        .map((membership) => {
          const user = demoUsers.find((candidate) => candidate.id === membership.userId);
          return user?.displayName ?? membership.roleName;
        }),
      learners: classRecord.learnerIds
        .map((learnerId) => demoLearners.find((learner) => learner.id === learnerId))
        .filter(isDefined),
      tasks: classRecord.tasks,
      recentActivity: classRecord.recentActivity,
    },
  };
}

function toWorkspaceSummary(context: Extract<RequestAuthContext, { status: "authenticated" }>) {
  return {
    id: context.activeWorkspace.id,
    name: context.activeWorkspace.name,
    academicYearName: context.activeWorkspace.currentAcademicYearName,
    termName: context.activeWorkspace.currentTermName,
  } satisfies WorkspaceSummaryDto;
}

function toTeacherClassListItemDto(classRecord: DemoClass) {
  return {
    id: classRecord.id,
    displayName: classRecord.displayName,
    gradeName: classRecord.gradeName,
    subjectName: classRecord.subjectName,
    academicYearName: classRecord.academicYearName,
    termName: classRecord.termName,
    room: classRecord.room,
    scheduleLabel: classRecord.scheduleLabel,
    learnerCount: classRecord.learnerIds.length,
    readinessPercent: classRecord.readinessPercent,
    curriculumProgressPercent: classRecord.curriculumProgressPercent,
    attentionCount: classRecord.attentionCount,
    openTaskCount: classRecord.tasks.filter((task) => task.status !== "done").length,
    nextLesson: {
      title: classRecord.nextLessonTitle,
      timeLabel: classRecord.nextLessonTimeLabel,
      topic: classRecord.nextLessonTopic,
    },
  } satisfies TeacherClassListItemDto;
}

function authRequired(): ServiceResult<never> {
  return {
    ok: false,
    status: 401,
    code: "AUTH_REQUIRED",
    message: "Sign in to continue.",
  };
}

function forbidden(message: string): ServiceResult<never> {
  return {
    ok: false,
    status: 403,
    code: "FORBIDDEN",
    message,
  };
}

function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}
