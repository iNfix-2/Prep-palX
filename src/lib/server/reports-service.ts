import type { WorkspaceSummaryDto } from "@/lib/features/classes/types";
import type {
  ClassReportDto,
  ReportClassSummaryDto,
  ReportCommentStatus,
  ReportLearnerProfileDto,
  ReportReadinessStatus,
  SaveReportCommentDto,
  SaveReportCommentsRequestDto,
  TeacherReportsResponseDto,
} from "@/lib/features/reports/types";
import { hasAnyPermission, hasPermission } from "@/lib/security/permissions";
import type { RequestAuthContext } from "@/lib/server/auth-context";
import {
  demoAssessments,
  demoClasses,
  demoLearners,
  getGradebookScoresForAssessment,
  getReportCommentsForClass,
  upsertDemoReportComments,
  type DemoClass,
  type DemoLearner,
} from "@/lib/server/demo-store";

export type ReportsServiceErrorStatus = 400 | 401 | 403 | 404;

export type ReportsServiceResult<T> =
  | { ok: true; data: T }
  | {
      ok: false;
      status: ReportsServiceErrorStatus;
      code: "AUTH_REQUIRED" | "FORBIDDEN" | "NOT_FOUND" | "VALIDATION_ERROR";
      message: string;
      fields?: Record<string, string[]>;
    };

type AuthenticatedContext = Extract<RequestAuthContext, { status: "authenticated" }>;

const commentStatuses: ReportCommentStatus[] = ["draft", "ready"];

export function listTeacherReports(
  context: RequestAuthContext,
): ReportsServiceResult<TeacherReportsResponseDto> {
  const access = getReportsWorkspaceAccess(context, "view");

  if (!access.ok) {
    return access;
  }

  const { context: authenticatedContext, accessibleClasses } = access.data;

  return {
    ok: true,
    data: {
      workspace: toWorkspaceSummary(authenticatedContext),
      permissions: {
        canPrepareReports: hasPermission(authenticatedContext.activeMembership, "report.prepare"),
        canReviewReports: hasPermission(authenticatedContext.activeMembership, "report.review"),
        canUseAi: hasPermission(authenticatedContext.activeMembership, "ai.use"),
      },
      reports: accessibleClasses.map(toReportClassSummaryDto),
    },
  };
}

export function getClassReport(
  context: RequestAuthContext,
  classId: string,
): ReportsServiceResult<ClassReportDto> {
  const access = getAccessibleClassReport(context, classId, "view");

  if (!access.ok) {
    return access;
  }

  const { context: authenticatedContext, classRecord } = access.data;
  const summary = toReportClassSummaryDto(classRecord);

  return {
    ok: true,
    data: {
      ...summary,
      workspace: toWorkspaceSummary(authenticatedContext),
      academicSessionLabel: `${classRecord.academicYearName} - ${classRecord.termName}`,
      currentUnit: classRecord.currentUnit,
      learners: classRecord.learnerIds
        .map((learnerId) => demoLearners.find((learner) => learner.id === learnerId))
        .filter(isDefined)
        .map((learner) => toReportLearnerProfileDto(classRecord, learner)),
    },
  };
}

export function saveReportComments(
  context: RequestAuthContext,
  classId: string,
  request: SaveReportCommentsRequestDto,
): ReportsServiceResult<ClassReportDto> {
  const access = getAccessibleClassReport(context, classId, "prepare");

  if (!access.ok) {
    return access;
  }

  const { context: authenticatedContext, classRecord } = access.data;
  const validation = validateReportComments(classRecord, request.comments);

  if (!validation.ok) {
    return validation;
  }

  upsertDemoReportComments(
    validation.data.comments.map((comment) => ({
      workspaceId: classRecord.workspaceId,
      classId: classRecord.id,
      learnerId: comment.learnerId,
      academicYearId: classRecord.academicYearId,
      termId: classRecord.termId,
      comment: comment.comment.trim(),
      status: comment.status,
      updatedByMembershipId: authenticatedContext.activeMembership.id,
    })),
  );

  return getClassReport(context, classId);
}

function getReportsWorkspaceAccess(
  context: RequestAuthContext,
  mode: "view" | "prepare",
): ReportsServiceResult<{
  context: AuthenticatedContext;
  accessibleClasses: DemoClass[];
}> {
  if (context.status === "unauthenticated") {
    return authRequired();
  }

  if (mode === "prepare" && !hasPermission(context.activeMembership, "report.prepare")) {
    return forbidden("You do not have permission to prepare reports.");
  }

  if (
    mode === "view" &&
    !hasAnyPermission(context.activeMembership, ["report.prepare", "report.review"])
  ) {
    return forbidden("You do not have permission to view reports.");
  }

  return { ok: true, data: { context, accessibleClasses: getAccessibleClasses(context) } };
}

function getAccessibleClassReport(
  context: RequestAuthContext,
  classId: string,
  mode: "view" | "prepare",
): ReportsServiceResult<{ context: AuthenticatedContext; classRecord: DemoClass }> {
  const access = getReportsWorkspaceAccess(context, mode);

  if (!access.ok) {
    return access;
  }

  const { context: authenticatedContext } = access.data;
  const classRecord = demoClasses.find((candidate) => candidate.id === classId);

  if (!classRecord || classRecord.workspaceId !== authenticatedContext.activeWorkspace.id) {
    return notFound();
  }

  const canManageClasses = hasPermission(authenticatedContext.activeMembership, "class.manage");

  if (
    !canManageClasses &&
    !classRecord.assignedMembershipIds.includes(authenticatedContext.activeMembership.id)
  ) {
    return forbidden("This class is outside your assigned teaching scope.");
  }

  return { ok: true, data: { context: authenticatedContext, classRecord } };
}

function getAccessibleClasses(context: AuthenticatedContext) {
  const canManageClasses = hasPermission(context.activeMembership, "class.manage");

  return demoClasses
    .filter((classRecord) => classRecord.workspaceId === context.activeWorkspace.id)
    .filter(
      (classRecord) =>
        canManageClasses || classRecord.assignedMembershipIds.includes(context.activeMembership.id),
    )
    .sort((a, b) => a.displayName.localeCompare(b.displayName));
}

function toReportClassSummaryDto(classRecord: DemoClass) {
  const learners = classRecord.learnerIds
    .map((learnerId) => demoLearners.find((learner) => learner.id === learnerId))
    .filter(isDefined);
  const profiles = learners.map((learner) => toReportLearnerProfileDto(classRecord, learner));
  const learnerCount = learners.length;
  const readyLearnerCount = profiles.filter((profile) => profile.isReady).length;
  const commentCount = profiles.filter((profile) => profile.comment.trim().length > 0).length;
  const missingCommentCount = Math.max(learnerCount - commentCount, 0);
  const missingScoreCount = profiles.reduce(
    (sum, profile) => sum + profile.missingScoreCount,
    0,
  );
  const averageScorePercent =
    profiles.length > 0
      ? Math.round(
          profiles.reduce((sum, profile) => sum + profile.averageScorePercent, 0) /
            profiles.length,
        )
      : 0;
  const averageAttendancePercent =
    profiles.length > 0
      ? Math.round(
          profiles.reduce((sum, profile) => sum + profile.attendancePercent, 0) /
            profiles.length,
        )
      : 0;
  const readinessPercent =
    learnerCount > 0 ? Math.round((readyLearnerCount / learnerCount) * 100) : 0;
  const status: ReportReadinessStatus =
    learnerCount === 0
      ? "blocked"
      : readyLearnerCount === learnerCount
        ? "ready"
        : "needs_attention";

  return {
    id: `report-${classRecord.id}`,
    classId: classRecord.id,
    classDisplayName: classRecord.displayName,
    subjectName: classRecord.subjectName,
    gradeName: classRecord.gradeName,
    room: classRecord.room,
    learnerCount,
    readyLearnerCount,
    commentCount,
    missingCommentCount,
    missingScoreCount,
    averageScorePercent,
    averageAttendancePercent,
    readinessPercent,
    status,
  } satisfies ReportClassSummaryDto;
}

function toReportLearnerProfileDto(
  classRecord: DemoClass,
  learner: DemoLearner,
): ReportLearnerProfileDto {
  const scoreStats = getLearnerScoreStats(classRecord, learner.id);
  const reportComment = getReportCommentsForClass(classRecord.id).find(
    (candidate) =>
      candidate.learnerId === learner.id &&
      candidate.academicYearId === classRecord.academicYearId &&
      candidate.termId === classRecord.termId,
  );
  const comment = reportComment?.comment ?? "";
  const commentStatus = reportComment?.status ?? "draft";
  const isReady =
    scoreStats.missingScoreCount === 0 && comment.trim().length > 0 && commentStatus === "ready";

  return {
    learnerId: learner.id,
    displayName: learner.displayName,
    admissionNo: learner.admissionNo,
    averageScorePercent: scoreStats.averageScorePercent,
    missingScoreCount: scoreStats.missingScoreCount,
    attendancePercent: learner.attendancePercent,
    comment,
    commentStatus,
    isReady,
  };
}

function getLearnerScoreStats(classRecord: DemoClass, learnerId: string) {
  const assessments = demoAssessments.filter(
    (assessment) =>
      assessment.workspaceId === classRecord.workspaceId && assessment.classId === classRecord.id,
  );
  const scorePercentages: number[] = [];
  let missingScoreCount = 0;

  for (const assessment of assessments) {
    const score = getGradebookScoresForAssessment(assessment.id).find(
      (candidate) => candidate.learnerId === learnerId,
    );

    if (!score || score.status === "missing" || score.score === null) {
      missingScoreCount += 1;
      continue;
    }

    if (score.status === "excused") {
      continue;
    }

    scorePercentages.push(Math.round((score.score / assessment.totalMarks) * 100));
  }

  return {
    averageScorePercent:
      scorePercentages.length > 0
        ? Math.round(
            scorePercentages.reduce((sum, percentage) => sum + percentage, 0) /
              scorePercentages.length,
          )
        : 0,
    missingScoreCount,
  };
}

function validateReportComments(
  classRecord: DemoClass,
  comments: SaveReportCommentDto[] | undefined,
): ReportsServiceResult<{ comments: SaveReportCommentDto[] }> {
  const fields: Record<string, string[]> = {};
  const commentRows = Array.isArray(comments) ? comments : [];

  if (commentRows.length === 0) {
    fields.comments = ["At least one report comment is required."];
  }

  commentRows.forEach((comment, index) => {
    if (!classRecord.learnerIds.includes(comment.learnerId)) {
      fields[`comments.${index}.learnerId`] = ["Learner is not enrolled in this class."];
    }

    if (!commentStatuses.includes(comment.status)) {
      fields[`comments.${index}.status`] = ["Comment status is not supported."];
    }

    if (comment.status === "ready" && !comment.comment?.trim()) {
      fields[`comments.${index}.comment`] = ["Ready comments cannot be empty."];
    }

    if (comment.comment && comment.comment.length > 500) {
      fields[`comments.${index}.comment`] = ["Comment must be 500 characters or fewer."];
    }
  });

  if (Object.keys(fields).length > 0) {
    return {
      ok: false,
      status: 400,
      code: "VALIDATION_ERROR",
      message: "Report comments could not be saved.",
      fields,
    };
  }

  return { ok: true, data: { comments: commentRows } };
}

function toWorkspaceSummary(context: AuthenticatedContext) {
  return {
    id: context.activeWorkspace.id,
    name: context.activeWorkspace.name,
    academicYearName: context.activeWorkspace.currentAcademicYearName,
    termName: context.activeWorkspace.currentTermName,
  } satisfies WorkspaceSummaryDto;
}

function authRequired(): ReportsServiceResult<never> {
  return {
    ok: false,
    status: 401,
    code: "AUTH_REQUIRED",
    message: "Sign in to continue.",
  };
}

function forbidden(message: string): ReportsServiceResult<never> {
  return {
    ok: false,
    status: 403,
    code: "FORBIDDEN",
    message,
  };
}

function notFound(): ReportsServiceResult<never> {
  return {
    ok: false,
    status: 404,
    code: "NOT_FOUND",
    message: "Report was not found in the active workspace.",
  };
}

function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}
