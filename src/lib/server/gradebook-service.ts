import type { WorkspaceSummaryDto } from "@/lib/features/classes/types";
import type {
  GradebookLearnerScoreDto,
  GradebookScoreStatus,
  GradebookSheetDto,
  GradebookSheetSummaryDto,
  SaveGradebookScoreDto,
  SaveGradebookScoresRequestDto,
  TeacherGradebooksResponseDto,
} from "@/lib/features/gradebook/types";
import { hasAnyPermission, hasPermission } from "@/lib/security/permissions";
import type { RequestAuthContext } from "@/lib/server/auth-context";
import {
  demoAssessments,
  demoClasses,
  demoLearners,
  getGradebookScoresForAssessment,
  upsertDemoGradebookScores,
  type DemoAssessment,
  type DemoClass,
  type DemoLearner,
} from "@/lib/server/demo-store";

export type GradebookServiceErrorStatus = 400 | 401 | 403 | 404;

export type GradebookServiceResult<T> =
  | { ok: true; data: T }
  | {
      ok: false;
      status: GradebookServiceErrorStatus;
      code: "AUTH_REQUIRED" | "FORBIDDEN" | "NOT_FOUND" | "VALIDATION_ERROR";
      message: string;
      fields?: Record<string, string[]>;
    };

type AuthenticatedContext = Extract<RequestAuthContext, { status: "authenticated" }>;

const scoreStatuses: GradebookScoreStatus[] = ["scored", "missing", "excused"];

export function listTeacherGradebooks(
  context: RequestAuthContext,
): GradebookServiceResult<TeacherGradebooksResponseDto> {
  const access = getGradebookWorkspaceAccess(context, "view");

  if (!access.ok) {
    return access;
  }

  const { context: authenticatedContext, accessibleClasses } = access.data;
  const accessibleClassIds = new Set(accessibleClasses.map((classRecord) => classRecord.id));
  const gradebooks = demoAssessments
    .filter((assessment) => assessment.workspaceId === authenticatedContext.activeWorkspace.id)
    .filter((assessment) => accessibleClassIds.has(assessment.classId))
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .map(toGradebookSheetSummaryDto);

  return {
    ok: true,
    data: {
      workspace: toWorkspaceSummary(authenticatedContext),
      permissions: {
        canMarkScores: hasPermission(authenticatedContext.activeMembership, "assessment.mark"),
        canUseAi: hasPermission(authenticatedContext.activeMembership, "ai.use"),
      },
      gradebooks,
    },
  };
}

export function getGradebookSheet(
  context: RequestAuthContext,
  assessmentId: string,
): GradebookServiceResult<GradebookSheetDto> {
  const access = getAccessibleAssessment(context, assessmentId, "view");

  if (!access.ok) {
    return access;
  }

  const { context: authenticatedContext, assessment, classRecord } = access.data;
  const summary = toGradebookSheetSummaryDto(assessment);

  return {
    ok: true,
    data: {
      ...summary,
      workspace: toWorkspaceSummary(authenticatedContext),
      topics: assessment.topics,
      instructions: assessment.instructions,
      learners: classRecord.learnerIds
        .map((learnerId) => demoLearners.find((learner) => learner.id === learnerId))
        .filter(isDefined)
        .map((learner) => toGradebookLearnerScoreDto(learner, assessment)),
    },
  };
}

export function saveGradebookScores(
  context: RequestAuthContext,
  assessmentId: string,
  request: SaveGradebookScoresRequestDto,
): GradebookServiceResult<GradebookSheetDto> {
  const access = getAccessibleAssessment(context, assessmentId, "mark");

  if (!access.ok) {
    return access;
  }

  const { context: authenticatedContext, assessment, classRecord } = access.data;
  const validation = validateGradebookScores(classRecord, assessment, request.scores);

  if (!validation.ok) {
    return validation;
  }

  upsertDemoGradebookScores(
    request.scores.map((scoreRecord) => ({
      workspaceId: assessment.workspaceId,
      assessmentId: assessment.id,
      classId: classRecord.id,
      learnerId: scoreRecord.learnerId,
      score:
        scoreRecord.status === "scored" && scoreRecord.score !== null
          ? scoreRecord.score
          : null,
      maxScore: assessment.totalMarks,
      status: scoreRecord.status,
      feedback: scoreRecord.feedback?.trim() ?? "",
      markedByMembershipId: authenticatedContext.activeMembership.id,
    })),
  );

  return getGradebookSheet(context, assessmentId);
}

function getGradebookWorkspaceAccess(
  context: RequestAuthContext,
  mode: "view" | "mark",
): GradebookServiceResult<{
  context: AuthenticatedContext;
  accessibleClasses: DemoClass[];
}> {
  if (context.status === "unauthenticated") {
    return authRequired();
  }

  if (mode === "mark" && !hasPermission(context.activeMembership, "assessment.mark")) {
    return forbidden("You do not have permission to enter scores.");
  }

  if (
    mode === "view" &&
    !hasAnyPermission(context.activeMembership, ["gradebook.view", "assessment.mark"])
  ) {
    return forbidden("You do not have permission to view gradebooks.");
  }

  return { ok: true, data: { context, accessibleClasses: getAccessibleClasses(context) } };
}

function getAccessibleAssessment(
  context: RequestAuthContext,
  assessmentId: string,
  mode: "view" | "mark",
): GradebookServiceResult<{
  context: AuthenticatedContext;
  assessment: DemoAssessment;
  classRecord: DemoClass;
}> {
  const access = getGradebookWorkspaceAccess(context, mode);

  if (!access.ok) {
    return access;
  }

  const { context: authenticatedContext } = access.data;
  const assessment = demoAssessments.find((candidate) => candidate.id === assessmentId);

  if (!assessment || assessment.workspaceId !== authenticatedContext.activeWorkspace.id) {
    return notFound();
  }

  const classAccess = getAccessibleClass(authenticatedContext, assessment.classId);

  if (!classAccess.ok) {
    return classAccess.status === 404 ? notFound() : classAccess;
  }

  return {
    ok: true,
    data: {
      context: authenticatedContext,
      assessment,
      classRecord: classAccess.data.classRecord,
    },
  };
}

function getAccessibleClass(
  context: AuthenticatedContext,
  classId: string,
): GradebookServiceResult<{ classRecord: DemoClass }> {
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

function toGradebookSheetSummaryDto(assessment: DemoAssessment) {
  const classRecord = demoClasses.find((candidate) => candidate.id === assessment.classId);
  const scores = getGradebookScoresForAssessment(assessment.id).filter(
    (scoreRecord) => scoreRecord.classId === assessment.classId,
  );
  const enrolledLearnerIds = new Set(classRecord?.learnerIds ?? []);
  const enrolledScores = scores.filter((scoreRecord) =>
    enrolledLearnerIds.has(scoreRecord.learnerId),
  );
  const learnerCount = classRecord?.learnerIds.length ?? 0;
  const scoredScores = enrolledScores.filter(
    (scoreRecord) => scoreRecord.status === "scored" && scoreRecord.score !== null,
  );
  const excusedCount = enrolledScores.filter((scoreRecord) => scoreRecord.status === "excused")
    .length;
  const scoredCount = scoredScores.length;
  const missingCount = Math.max(learnerCount - scoredCount - excusedCount, 0);
  const status =
    scoredCount + excusedCount === 0
      ? "not_started"
      : missingCount > 0
        ? "partial"
        : "complete";
  const averageScorePercent =
    scoredScores.length > 0
      ? Math.round(
          scoredScores.reduce((sum, scoreRecord) => {
            const score = scoreRecord.score ?? 0;
            return sum + (score / assessment.totalMarks) * 100;
          }, 0) / scoredScores.length,
        )
      : 0;

  return {
    id: `gradebook-${assessment.id}`,
    assessmentId: assessment.id,
    classId: assessment.classId,
    assessmentTitle: assessment.title,
    assessmentType: assessment.type,
    classDisplayName: classRecord?.displayName ?? "Unknown class",
    subjectName: classRecord?.subjectName ?? "Unknown subject",
    gradeName: classRecord?.gradeName ?? "Unknown grade",
    scheduledFor: assessment.scheduledFor,
    dueDate: assessment.dueDate,
    totalMarks: assessment.totalMarks,
    learnerCount,
    scoredCount,
    missingCount,
    excusedCount,
    averageScorePercent,
    status,
  } satisfies GradebookSheetSummaryDto;
}

function toGradebookLearnerScoreDto(
  learner: DemoLearner,
  assessment: DemoAssessment,
): GradebookLearnerScoreDto {
  const scoreRecord = getGradebookScoresForAssessment(assessment.id).find(
    (candidate) => candidate.learnerId === learner.id,
  );

  return {
    learnerId: learner.id,
    displayName: learner.displayName,
    admissionNo: learner.admissionNo,
    score: scoreRecord?.score ?? null,
    maxScore: assessment.totalMarks,
    status: scoreRecord?.status ?? "missing",
    feedback: scoreRecord?.feedback ?? "",
    isScored: scoreRecord?.status === "scored" && scoreRecord.score !== null,
    lastScore: learner.lastScore,
    attendancePercent: learner.attendancePercent,
  };
}

function validateGradebookScores(
  classRecord: DemoClass,
  assessment: DemoAssessment,
  scores: SaveGradebookScoreDto[],
): GradebookServiceResult<{ valid: true }> {
  const fields: Record<string, string[]> = {};

  if (!Array.isArray(scores) || scores.length === 0) {
    fields.scores = ["At least one score row is required."];
  }

  scores.forEach((scoreRecord, index) => {
    if (!classRecord.learnerIds.includes(scoreRecord.learnerId)) {
      fields[`scores.${index}.learnerId`] = ["Learner is not enrolled in this class."];
    }

    if (!scoreStatuses.includes(scoreRecord.status)) {
      fields[`scores.${index}.status`] = ["Score status is not supported."];
    }

    if (scoreRecord.status === "scored") {
      if (scoreRecord.score === null || !Number.isFinite(scoreRecord.score)) {
        fields[`scores.${index}.score`] = ["Score is required when status is scored."];
      } else if (scoreRecord.score < 0 || scoreRecord.score > assessment.totalMarks) {
        fields[`scores.${index}.score`] = [
          `Score must be between 0 and ${assessment.totalMarks}.`,
        ];
      }
    }
  });

  if (Object.keys(fields).length > 0) {
    return {
      ok: false,
      status: 400,
      code: "VALIDATION_ERROR",
      message: "Gradebook scores could not be saved.",
      fields,
    };
  }

  return { ok: true, data: { valid: true } };
}

function toWorkspaceSummary(context: AuthenticatedContext) {
  return {
    id: context.activeWorkspace.id,
    name: context.activeWorkspace.name,
    academicYearName: context.activeWorkspace.currentAcademicYearName,
    termName: context.activeWorkspace.currentTermName,
  } satisfies WorkspaceSummaryDto;
}

function authRequired(): GradebookServiceResult<never> {
  return {
    ok: false,
    status: 401,
    code: "AUTH_REQUIRED",
    message: "Sign in to continue.",
  };
}

function forbidden(message: string): GradebookServiceResult<never> {
  return {
    ok: false,
    status: 403,
    code: "FORBIDDEN",
    message,
  };
}

function notFound(): GradebookServiceResult<never> {
  return {
    ok: false,
    status: 404,
    code: "NOT_FOUND",
    message: "Gradebook sheet was not found in the active workspace.",
  };
}

function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}
