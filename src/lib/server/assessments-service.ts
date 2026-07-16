import type { WorkspaceSummaryDto } from "@/lib/features/classes/types";
import type {
  AssessmentCreateOptionsDto,
  AssessmentDetailDto,
  AssessmentListItemDto,
  AssessmentType,
  CreateAssessmentDto,
  TeacherAssessmentsResponseDto,
} from "@/lib/features/assessments/types";
import { hasAnyPermission, hasPermission } from "@/lib/security/permissions";
import type { RequestAuthContext } from "@/lib/server/auth-context";
import {
  createDemoAssessment,
  demoAssessments,
  demoClasses,
  type DemoAssessment,
  type DemoAssessmentItem,
  type DemoClass,
} from "@/lib/server/demo-store";

export type AssessmentServiceErrorStatus = 400 | 401 | 403 | 404;

export type AssessmentServiceResult<T> =
  | { ok: true; data: T }
  | {
      ok: false;
      status: AssessmentServiceErrorStatus;
      code: "AUTH_REQUIRED" | "FORBIDDEN" | "NOT_FOUND" | "VALIDATION_ERROR";
      message: string;
      fields?: Record<string, string[]>;
    };

type AuthenticatedContext = Extract<RequestAuthContext, { status: "authenticated" }>;

const assessmentTypes = [
  "classwork",
  "quiz",
  "continuous_assessment",
  "exam",
] as const satisfies readonly AssessmentType[];

export function listTeacherAssessments(
  context: RequestAuthContext,
): AssessmentServiceResult<TeacherAssessmentsResponseDto> {
  const access = getAssessmentWorkspaceAccess(context, "view");

  if (!access.ok) {
    return access;
  }

  const { context: authenticatedContext, accessibleClasses } = access.data;
  const accessibleClassIds = new Set(accessibleClasses.map((classRecord) => classRecord.id));
  const assessments = demoAssessments
    .filter((assessment) => assessment.workspaceId === authenticatedContext.activeWorkspace.id)
    .filter((assessment) => accessibleClassIds.has(assessment.classId))
    .sort((a, b) => a.scheduledFor.localeCompare(b.scheduledFor));

  return {
    ok: true,
    data: {
      workspace: toWorkspaceSummary(authenticatedContext),
      permissions: {
        canCreateAssessment: hasPermission(
          authenticatedContext.activeMembership,
          "assessment.create",
        ),
        canUseAi: hasPermission(authenticatedContext.activeMembership, "ai.use"),
      },
      assessments: assessments.map(toAssessmentListItemDto),
    },
  };
}

export function getAssessmentCreateOptions(
  context: RequestAuthContext,
): AssessmentServiceResult<AssessmentCreateOptionsDto> {
  const access = getAssessmentWorkspaceAccess(context, "create");

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

export function getAssessment(
  context: RequestAuthContext,
  assessmentId: string,
): AssessmentServiceResult<AssessmentDetailDto> {
  if (context.status === "unauthenticated") {
    return authRequired();
  }

  if (!hasAnyPermission(context.activeMembership, ["assessment.view", "assessment.create"])) {
    return forbidden("You do not have permission to view assessments.");
  }

  const assessment = demoAssessments.find((candidate) => candidate.id === assessmentId);

  if (!assessment || assessment.workspaceId !== context.activeWorkspace.id) {
    return notFound();
  }

  const classAccess = getAccessibleClass(context, assessment.classId);

  if (!classAccess.ok) {
    return classAccess.status === 404 ? notFound() : classAccess;
  }

  return {
    ok: true,
    data: {
      ...toAssessmentListItemDto(assessment),
      workspace: toWorkspaceSummary(context),
      topics: assessment.topics,
      instructions: assessment.instructions,
      items: assessment.items.map(toAssessmentItemDto),
      reviewNotes: assessment.reviewNotes,
    },
  };
}

export function createAssessment(
  context: RequestAuthContext,
  input: CreateAssessmentDto,
): AssessmentServiceResult<AssessmentDetailDto> {
  if (context.status === "unauthenticated") {
    return authRequired();
  }

  if (!hasPermission(context.activeMembership, "assessment.create")) {
    return forbidden("You do not have permission to create assessments.");
  }

  const validation = validateCreateAssessment(input);

  if (!validation.ok) {
    return validation;
  }

  const classAccess = getAccessibleClass(context, input.classId);

  if (!classAccess.ok) {
    return classAccess;
  }

  const nextAssessmentNumber = demoAssessments.length + 1;
  const assessment = createDemoAssessment({
    workspaceId: context.activeWorkspace.id,
    classId: classAccess.data.classRecord.id,
    title: input.title.trim(),
    type: input.type,
    scheduledFor: input.scheduledFor,
    dueDate: input.dueDate,
    durationMinutes: input.durationMinutes,
    totalMarks: input.totalMarks,
    topics: normalizeLines(input.topics),
    instructions: input.instructions.trim(),
    items: input.items.map((item, index) => ({
      id: `assessment-${nextAssessmentNumber}-item-${index + 1}`,
      prompt: item.prompt.trim(),
      marks: item.marks,
      skill: item.skill.trim(),
    })),
    reviewNotes: input.reviewNotes.trim(),
    createdByMembershipId: context.activeMembership.id,
  });

  return getAssessment(context, assessment.id);
}

function getAssessmentWorkspaceAccess(
  context: RequestAuthContext,
  mode: "view" | "create",
): AssessmentServiceResult<{
  context: AuthenticatedContext;
  accessibleClasses: DemoClass[];
}> {
  if (context.status === "unauthenticated") {
    return authRequired();
  }

  if (mode === "create" && !hasPermission(context.activeMembership, "assessment.create")) {
    return forbidden("You do not have permission to create assessments.");
  }

  if (
    mode === "view" &&
    !hasAnyPermission(context.activeMembership, ["assessment.view", "assessment.create"])
  ) {
    return forbidden("You do not have permission to view assessments.");
  }

  const accessibleClasses = getAccessibleClasses(context);

  return { ok: true, data: { context, accessibleClasses } };
}

function getAccessibleClass(
  context: AuthenticatedContext,
  classId: string,
): AssessmentServiceResult<{ classRecord: DemoClass }> {
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

function toAssessmentListItemDto(assessment: DemoAssessment) {
  const classRecord = demoClasses.find((candidate) => candidate.id === assessment.classId);

  return {
    id: assessment.id,
    classId: assessment.classId,
    classDisplayName: classRecord?.displayName ?? "Unknown class",
    subjectName: classRecord?.subjectName ?? "Unknown subject",
    gradeName: classRecord?.gradeName ?? "Unknown grade",
    title: assessment.title,
    type: assessment.type,
    status: assessment.status,
    scheduledFor: assessment.scheduledFor,
    dueDate: assessment.dueDate,
    durationMinutes: assessment.durationMinutes,
    totalMarks: assessment.totalMarks,
    itemCount: assessment.items.length,
    readinessPercent: assessment.readinessPercent,
    updatedAt: assessment.updatedAt,
  } satisfies AssessmentListItemDto;
}

function toAssessmentItemDto(item: DemoAssessmentItem) {
  return {
    id: item.id,
    prompt: item.prompt,
    marks: item.marks,
    skill: item.skill,
  };
}

function validateCreateAssessment(
  input: CreateAssessmentDto,
): AssessmentServiceResult<{ valid: true }> {
  const fields: Record<string, string[]> = {};

  if (!input.classId) {
    fields.classId = ["Class is required."];
  }

  if (!input.title?.trim()) {
    fields.title = ["Title is required."];
  }

  if (!assessmentTypes.includes(input.type)) {
    fields.type = ["Assessment type is invalid."];
  }

  if (!input.scheduledFor) {
    fields.scheduledFor = ["Assessment date is required."];
  }

  if (!input.dueDate) {
    fields.dueDate = ["Due date is required."];
  }

  if (!Number.isFinite(input.durationMinutes) || input.durationMinutes < 10) {
    fields.durationMinutes = ["Duration must be at least 10 minutes."];
  }

  if (!Number.isFinite(input.totalMarks) || input.totalMarks <= 0) {
    fields.totalMarks = ["Total marks must be greater than zero."];
  }

  if (normalizeLines(input.topics).length === 0) {
    fields.topics = ["At least one topic is required."];
  }

  if (!input.instructions?.trim()) {
    fields.instructions = ["Instructions are required."];
  }

  if (!Array.isArray(input.items) || input.items.length === 0) {
    fields.items = ["At least one assessment item is required."];
  } else {
    const invalidItems = input.items.filter(
      (item) =>
        !item.prompt?.trim() ||
        !item.skill?.trim() ||
        !Number.isFinite(item.marks) ||
        item.marks <= 0,
    );

    if (invalidItems.length > 0) {
      fields.items = ["Each item needs a prompt, skill, and positive mark value."];
    }

    const itemMarks = input.items.reduce((sum, item) => sum + item.marks, 0);

    if (Number.isFinite(input.totalMarks) && itemMarks !== input.totalMarks) {
      fields.totalMarks = ["Total marks must equal the sum of item marks."];
    }
  }

  if (Object.keys(fields).length > 0) {
    return {
      ok: false,
      status: 400,
      code: "VALIDATION_ERROR",
      message: "Assessment could not be saved.",
      fields,
    };
  }

  return { ok: true, data: { valid: true } };
}

function normalizeLines(value: string[] | undefined) {
  return Array.isArray(value)
    ? value.map((item) => item.trim()).filter(Boolean)
    : [];
}

function toWorkspaceSummary(context: AuthenticatedContext) {
  return {
    id: context.activeWorkspace.id,
    name: context.activeWorkspace.name,
    academicYearName: context.activeWorkspace.currentAcademicYearName,
    termName: context.activeWorkspace.currentTermName,
  } satisfies WorkspaceSummaryDto;
}

function authRequired(): AssessmentServiceResult<never> {
  return {
    ok: false,
    status: 401,
    code: "AUTH_REQUIRED",
    message: "Sign in to continue.",
  };
}

function forbidden(message: string): AssessmentServiceResult<never> {
  return {
    ok: false,
    status: 403,
    code: "FORBIDDEN",
    message,
  };
}

function notFound(): AssessmentServiceResult<never> {
  return {
    ok: false,
    status: 404,
    code: "NOT_FOUND",
    message: "Assessment was not found in the active workspace.",
  };
}
