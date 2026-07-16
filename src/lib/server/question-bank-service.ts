import type { WorkspaceSummaryDto } from "@/lib/features/classes/types";
import type {
  CreateQuestionDto,
  QuestionCreateOptionsDto,
  QuestionDetailDto,
  QuestionDifficulty,
  QuestionStatus,
  QuestionType,
  TeacherQuestionsResponseDto,
} from "@/lib/features/question-bank/types";
import { hasAnyPermission, hasPermission } from "@/lib/security/permissions";
import type { RequestAuthContext } from "@/lib/server/auth-context";
import {
  createDemoQuestion,
  demoClasses,
  demoMemberships,
  demoQuestions,
  demoUsers,
  type DemoClass,
  type DemoQuestion,
} from "@/lib/server/demo-store";

export type QuestionBankServiceErrorStatus = 400 | 401 | 403 | 404;

export type QuestionBankServiceResult<T> =
  | { ok: true; data: T }
  | {
      ok: false;
      status: QuestionBankServiceErrorStatus;
      code: "AUTH_REQUIRED" | "FORBIDDEN" | "NOT_FOUND" | "VALIDATION_ERROR";
      message: string;
      fields?: Record<string, string[]>;
    };

type AuthenticatedContext = Extract<RequestAuthContext, { status: "authenticated" }>;

const questionTypes = [
  "multiple_choice",
  "short_answer",
  "structured_response",
] as const satisfies readonly QuestionType[];

const questionDifficulties = ["easy", "medium", "hard"] as const satisfies readonly QuestionDifficulty[];
const questionStatuses = ["draft", "in_review", "approved"] as const satisfies readonly QuestionStatus[];

export function listTeacherQuestions(
  context: RequestAuthContext,
): QuestionBankServiceResult<TeacherQuestionsResponseDto> {
  const access = getQuestionWorkspaceAccess(context, "view");

  if (!access.ok) {
    return access;
  }

  const { context: authenticatedContext, accessibleClasses } = access.data;
  const accessibleClassIds = new Set(accessibleClasses.map((classRecord) => classRecord.id));
  const questions = demoQuestions
    .filter((question) => question.workspaceId === authenticatedContext.activeWorkspace.id)
    .filter((question) => accessibleClassIds.has(question.classId))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  return {
    ok: true,
    data: {
      workspace: toWorkspaceSummary(authenticatedContext),
      permissions: {
        canManageQuestions: hasPermission(authenticatedContext.activeMembership, "question.manage"),
        canUseAi: hasPermission(authenticatedContext.activeMembership, "ai.use"),
      },
      questions: questions.map(toQuestionBankItemDto),
    },
  };
}

export function getQuestionCreateOptions(
  context: RequestAuthContext,
): QuestionBankServiceResult<QuestionCreateOptionsDto> {
  const access = getQuestionWorkspaceAccess(context, "manage");

  if (!access.ok) {
    return access;
  }

  return {
    ok: true,
    data: {
      workspace: toWorkspaceSummary(access.data.context),
      classes: access.data.accessibleClasses.map((classRecord) => ({
        id: classRecord.id,
        displayName: classRecord.displayName,
        subjectName: classRecord.subjectName,
        gradeName: classRecord.gradeName,
        room: classRecord.room,
      })),
    },
  };
}

export function getQuestion(
  context: RequestAuthContext,
  questionId: string,
): QuestionBankServiceResult<QuestionDetailDto> {
  if (context.status === "unauthenticated") {
    return authRequired();
  }

  if (!hasAnyPermission(context.activeMembership, ["question.view", "question.manage"])) {
    return forbidden("You do not have permission to view question bank items.");
  }

  const question = demoQuestions.find((candidate) => candidate.id === questionId);

  if (!question || question.workspaceId !== context.activeWorkspace.id) {
    return notFound();
  }

  const classAccess = getAccessibleClass(context, question.classId);

  if (!classAccess.ok) {
    return classAccess.status === 404 ? notFound() : classAccess;
  }

  return {
    ok: true,
    data: {
      ...toQuestionBankItemDto(question),
      workspace: toWorkspaceSummary(context),
      options: question.options,
      answer: question.answer,
      explanation: question.explanation,
      createdByName: getCreatorName(question.createdByMembershipId),
    },
  };
}

export function createQuestion(
  context: RequestAuthContext,
  input: CreateQuestionDto,
): QuestionBankServiceResult<QuestionDetailDto> {
  if (context.status === "unauthenticated") {
    return authRequired();
  }

  if (!hasPermission(context.activeMembership, "question.manage")) {
    return forbidden("You do not have permission to manage question bank items.");
  }

  const validation = validateCreateQuestion(input);

  if (!validation.ok) {
    return validation;
  }

  const classAccess = getAccessibleClass(context, input.classId);

  if (!classAccess.ok) {
    return classAccess;
  }

  const question = createDemoQuestion({
    workspaceId: context.activeWorkspace.id,
    classId: classAccess.data.classRecord.id,
    prompt: input.prompt.trim(),
    type: input.type,
    difficulty: input.difficulty,
    status: input.status,
    marks: input.marks,
    topic: input.topic.trim(),
    skill: input.skill.trim(),
    options: normalizeLines(input.options),
    answer: input.answer.trim(),
    explanation: input.explanation.trim(),
    createdByMembershipId: context.activeMembership.id,
  });

  return getQuestion(context, question.id);
}

function getQuestionWorkspaceAccess(
  context: RequestAuthContext,
  mode: "view" | "manage",
): QuestionBankServiceResult<{
  context: AuthenticatedContext;
  accessibleClasses: DemoClass[];
}> {
  if (context.status === "unauthenticated") {
    return authRequired();
  }

  if (mode === "manage" && !hasPermission(context.activeMembership, "question.manage")) {
    return forbidden("You do not have permission to manage question bank items.");
  }

  if (
    mode === "view" &&
    !hasAnyPermission(context.activeMembership, ["question.view", "question.manage"])
  ) {
    return forbidden("You do not have permission to view question bank items.");
  }

  const accessibleClasses = getAccessibleClasses(context);

  return { ok: true, data: { context, accessibleClasses } };
}

function getAccessibleClass(
  context: AuthenticatedContext,
  classId: string,
): QuestionBankServiceResult<{ classRecord: DemoClass }> {
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

function toQuestionBankItemDto(question: DemoQuestion) {
  const classRecord = demoClasses.find((candidate) => candidate.id === question.classId);

  return {
    id: question.id,
    classId: question.classId,
    classDisplayName: classRecord?.displayName ?? "Unknown class",
    subjectName: classRecord?.subjectName ?? "Unknown subject",
    gradeName: classRecord?.gradeName ?? "Unknown grade",
    prompt: question.prompt,
    type: question.type,
    difficulty: question.difficulty,
    status: question.status,
    marks: question.marks,
    topic: question.topic,
    skill: question.skill,
    usageCount: question.usageCount,
    qualityPercent: question.qualityPercent,
    updatedAt: question.updatedAt,
  };
}

function validateCreateQuestion(
  input: CreateQuestionDto,
): QuestionBankServiceResult<{ valid: true }> {
  const fields: Record<string, string[]> = {};
  const normalizedOptions = normalizeLines(input.options);

  if (!input.classId?.trim()) {
    fields.classId = ["Class is required."];
  }

  if (!input.prompt?.trim() || input.prompt.trim().length < 10) {
    fields.prompt = ["Question prompt must be at least 10 characters."];
  }

  if (!questionTypes.includes(input.type)) {
    fields.type = ["Question type is invalid."];
  }

  if (!questionDifficulties.includes(input.difficulty)) {
    fields.difficulty = ["Difficulty is invalid."];
  }

  if (!questionStatuses.includes(input.status)) {
    fields.status = ["Status is invalid."];
  }

  if (!Number.isFinite(input.marks) || input.marks < 1 || input.marks > 100) {
    fields.marks = ["Marks must be between 1 and 100."];
  }

  if (!input.topic?.trim()) {
    fields.topic = ["Topic is required."];
  }

  if (!input.skill?.trim()) {
    fields.skill = ["Skill is required."];
  }

  if (input.type === "multiple_choice" && normalizedOptions.length < 2) {
    fields.options = ["Multiple choice questions need at least two answer options."];
  }

  if (!input.answer?.trim()) {
    fields.answer = ["Answer is required."];
  }

  if (!input.explanation?.trim()) {
    fields.explanation = ["Explanation is required."];
  }

  if (Object.keys(fields).length > 0) {
    return {
      ok: false,
      status: 400,
      code: "VALIDATION_ERROR",
      message: "Question could not be saved. Check the highlighted fields.",
      fields,
    };
  }

  return { ok: true, data: { valid: true } };
}

function normalizeLines(values: readonly string[]) {
  return values.map((value) => value.trim()).filter(Boolean);
}

function getCreatorName(membershipId: string) {
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

function authRequired(): QuestionBankServiceResult<never> {
  return {
    ok: false,
    status: 401,
    code: "AUTH_REQUIRED",
    message: "Sign in to continue.",
  };
}

function forbidden(message: string): QuestionBankServiceResult<never> {
  return {
    ok: false,
    status: 403,
    code: "FORBIDDEN",
    message,
  };
}

function notFound(): QuestionBankServiceResult<never> {
  return {
    ok: false,
    status: 404,
    code: "NOT_FOUND",
    message: "Question could not be found in this workspace.",
  };
}
