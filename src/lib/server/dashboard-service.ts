import type { WorkspaceSummaryDto } from "@/lib/features/classes/types";
import type {
  DashboardMetricDto,
  DashboardRecentWorkDto,
  DashboardScheduleItemDto,
  DashboardTaskDto,
  TeacherDashboardDto,
} from "@/lib/features/dashboard/types";
import type { SupportRequestDto } from "@/lib/features/help/types";
import type { TeacherTaskDto, TaskPriority } from "@/lib/features/tasks/types";
import type { TimetableEventDto } from "@/lib/features/timetable/types";
import { hasPermission } from "@/lib/security/permissions";
import type { RequestAuthContext } from "@/lib/server/auth-context";
import { listTeacherApprovals } from "@/lib/server/approvals-service";
import { listTeacherClasses } from "@/lib/server/classes-service";
import { DEMO_TODAY } from "@/lib/server/demo-store";
import { listTeacherGradebooks } from "@/lib/server/gradebook-service";
import { getHelpCentre } from "@/lib/server/help-service";
import { listTeacherReports } from "@/lib/server/reports-service";
import { listTeacherResources } from "@/lib/server/resources-service";
import { listTeacherTasks } from "@/lib/server/tasks-service";
import { listTeacherTimetable } from "@/lib/server/timetable-service";

export type DashboardServiceErrorStatus = 401 | 403;

export type DashboardServiceResult<T> =
  | { ok: true; data: T }
  | {
      ok: false;
      status: DashboardServiceErrorStatus;
      code: "AUTH_REQUIRED" | "FORBIDDEN";
      message: string;
    };

type AuthenticatedContext = Extract<RequestAuthContext, { status: "authenticated" }>;

const demoGeneratedAt = "2026-07-16T09:05:00.000Z";
const priorityOrder: Record<TaskPriority, number> = {
  urgent: 0,
  high: 1,
  medium: 2,
  low: 3,
};

export function getTeacherDashboard(
  context: RequestAuthContext,
): DashboardServiceResult<TeacherDashboardDto> {
  if (context.status === "unauthenticated") {
    return authRequired();
  }

  if (!hasPermission(context.activeMembership, "dashboard.view")) {
    return forbidden("You do not have permission to view the teacher dashboard.");
  }

  const classes = getData(listTeacherClasses(context))?.classes ?? [];
  const tasks = getData(listTeacherTasks(context))?.tasks ?? [];
  const timetable = getData(listTeacherTimetable(context, DEMO_TODAY))?.events ?? [];
  const gradebooks = getData(listTeacherGradebooks(context))?.gradebooks ?? [];
  const reports = getData(listTeacherReports(context))?.reports ?? [];
  const approvals = getData(listTeacherApprovals(context))?.approvals ?? [];
  const resources = getData(listTeacherResources(context))?.resources ?? [];
  const support = getData(getHelpCentre(context))?.requests ?? [];
  const nextEvent = timetable.find((event) => event.status !== "completed");
  const openTasks = tasks.filter((task) => task.status !== "done");
  const preparationIssues = timetable.filter(
    (event) => event.preparationStatus !== "ready" && event.status !== "completed",
  ).length;
  const missingScoreCount = gradebooks.reduce((sum, sheet) => sum + sheet.missingCount, 0);
  const openSupportCount = support.filter((request) => request.status !== "resolved").length;

  return {
    ok: true,
    data: {
      workspace: toWorkspaceSummary(context),
      user: {
        id: context.user.id,
        displayName: context.user.displayName,
        shortName: context.user.shortName,
        email: context.user.email,
      },
      today: DEMO_TODAY,
      generatedAt: demoGeneratedAt,
      permissions: {
        canUseAi: hasPermission(context.activeMembership, "ai.use"),
        canCreateAssessment: hasPermission(context.activeMembership, "assessment.create"),
        canCreateLessonPlan: hasPermission(context.activeMembership, "lesson.create"),
        canViewTasks: hasPermission(context.activeMembership, "task.view"),
        canViewSupport:
          hasPermission(context.activeMembership, "support.view") ||
          hasPermission(context.activeMembership, "support.request") ||
          hasPermission(context.activeMembership, "support.manage"),
      },
      metrics: buildMetrics({
        classCount: classes.length,
        learnerCount: classes.reduce((sum, classRecord) => sum + classRecord.learnerCount, 0),
        openTasks: openTasks.length,
        preparationIssues,
        missingScoreCount,
        openSupportCount,
      }),
      actions: [
        {
          id: "prepare-lesson",
          label: "Prepare lesson",
          detail: "Open the lesson planner",
          href: hasPermission(context.activeMembership, "lesson.create")
            ? "/lesson-planner/new"
            : "/lesson-planner",
          icon: "auto_stories",
          variant: "primary",
        },
        {
          id: "create-assessment",
          label: "Create assessment",
          detail: "Draft or review class checks",
          href: hasPermission(context.activeMembership, "assessment.create")
            ? "/assessments/new"
            : "/assessments",
          icon: "assignment_add",
          variant: "secondary",
        },
        {
          id: "ask-pal",
          label: hasPermission(context.activeMembership, "ai.use") ? "Ask Pal" : "Help Centre",
          detail: hasPermission(context.activeMembership, "ai.use")
            ? "Get teaching context"
            : "Open support and guides",
          href: hasPermission(context.activeMembership, "ai.use") ? "/ask-pal" : "/help",
          icon: hasPermission(context.activeMembership, "ai.use") ? "smart_toy" : "help",
          variant: hasPermission(context.activeMembership, "ai.use") ? "ai" : "secondary",
        },
      ],
      nextEvent: nextEvent ? toScheduleItem(nextEvent, nextEvent.id) : undefined,
      schedule: timetable.map((event) => toScheduleItem(event, nextEvent?.id)),
      urgentTasks: openTasks.sort(compareDashboardTasks).slice(0, 4).map(toDashboardTask),
      classProgress: classes.map((classRecord) => ({
        id: classRecord.id,
        title: classRecord.displayName,
        href: `/classes/${classRecord.id}`,
        subject: classRecord.subjectName,
        learnerCount: classRecord.learnerCount,
        readinessPercent: classRecord.readinessPercent,
        curriculumProgressPercent: classRecord.curriculumProgressPercent,
        attentionCount: classRecord.attentionCount,
      })),
      recentWork: buildRecentWork({
        resources: resources.map((resource) => ({
          id: resource.id,
          title: resource.title,
          detail: resource.classDisplayName ?? "Workspace resource",
          href: `/resources/${resource.id}`,
          icon: resource.fileKind === "pdf" ? "picture_as_pdf" : "description",
          updatedAt: resource.updatedAt,
        })),
        support,
        approvals: approvals.map((approval) => ({
          id: approval.id,
          title: approval.title,
          detail: approval.classDisplayName,
          href: `/approvals/${approval.id}`,
          icon: "verified_user",
          updatedAt: approval.updatedAt,
        })),
        reports: reports.map((report) => ({
          id: report.id,
          title: `${report.classDisplayName} reports`,
          detail:
            report.missingScoreCount > 0
              ? `${report.missingScoreCount} missing scores`
              : `${report.readyLearnerCount}/${report.learnerCount} ready`,
          href: `/reports/${report.classId}`,
          icon: "analytics",
          updatedAt: demoGeneratedAt,
        })),
      }),
      insight: buildInsight({
        missingScoreCount,
        preparationIssues,
        openTasks: openTasks.length,
        openSupportCount,
      }),
    },
  };
}

function buildMetrics({
  classCount,
  learnerCount,
  openTasks,
  preparationIssues,
  missingScoreCount,
  openSupportCount,
}: {
  classCount: number;
  learnerCount: number;
  openTasks: number;
  preparationIssues: number;
  missingScoreCount: number;
  openSupportCount: number;
}): DashboardMetricDto[] {
  return [
    {
      id: "classes",
      label: "Classes",
      value: String(classCount),
      detail: `${learnerCount} learners in scope`,
      icon: "groups",
      tone: "primary",
    },
    {
      id: "tasks",
      label: "Open tasks",
      value: String(openTasks),
      detail: `${preparationIssues} prep flags today`,
      icon: "task_alt",
      tone: openTasks > 0 ? "review" : "approved",
    },
    {
      id: "gradebook",
      label: "Missing scores",
      value: String(missingScoreCount),
      detail: "Across visible sheets",
      icon: "grading",
      tone: missingScoreCount > 0 ? "changes" : "approved",
    },
    {
      id: "support",
      label: "Support",
      value: String(openSupportCount),
      detail: "Open requests in scope",
      icon: "help",
      tone: openSupportCount > 0 ? "review" : "approved",
    },
  ];
}

function toScheduleItem(
  event: TimetableEventDto,
  currentEventId?: string,
): DashboardScheduleItemDto {
  return {
    id: event.id,
    title: event.classDisplayName ?? event.title,
    detail:
      event.classDisplayName && event.title !== event.classDisplayName
        ? event.title
        : event.notes,
    timeLabel: `${formatTime(event.startAt)} - ${formatTime(event.endAt)}`,
    location: event.location,
    href: `/timetable/${event.id}`,
    icon: event.type === "assessment" ? "assignment" : event.type === "meeting" ? "groups" : "topic",
    variant: event.id === currentEventId ? "current" : event.type === "duty" ? "break" : "default",
  };
}

function toDashboardTask(task: TeacherTaskDto): DashboardTaskDto {
  return {
    id: task.id,
    title: task.title,
    detail: `${task.classDisplayName ?? "Workspace"} / due ${formatTime(task.dueAt)}`,
    href: `/my-tasks/${task.id}`,
    priorityLabel: task.priority === "urgent" ? "Urgent" : titleCase(task.priority),
    tone: task.priority === "urgent" ? "changes" : task.priority === "high" ? "review" : "neutral",
    sourceLabel: task.sourceLabel,
  };
}

function buildRecentWork({
  resources,
  support,
  approvals,
  reports,
}: {
  resources: DashboardRecentWorkDto[];
  support: SupportRequestDto[];
  approvals: DashboardRecentWorkDto[];
  reports: DashboardRecentWorkDto[];
}) {
  const supportItems = support.map((request) => ({
    id: request.id,
    title: request.title,
    detail: request.status === "resolved" ? "Resolved support request" : request.summary,
    href: `/help/${request.id}`,
    icon: request.status === "resolved" ? "task_alt" : "help",
    updatedAt: request.updatedAt,
  }));

  return [...resources, ...supportItems, ...approvals, ...reports]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 4);
}

function buildInsight({
  missingScoreCount,
  preparationIssues,
  openTasks,
  openSupportCount,
}: {
  missingScoreCount: number;
  preparationIssues: number;
  openTasks: number;
  openSupportCount: number;
}) {
  if (missingScoreCount > 0) {
    return {
      message: `${missingScoreCount} score rows are still missing across visible gradebook sheets.`,
      actionLabel: "Open gradebook",
      href: "/gradebook",
    };
  }

  if (preparationIssues > 0) {
    return {
      message: `${preparationIssues} timetable blocks need preparation before the day is clear.`,
      actionLabel: "Review timetable",
      href: "/timetable",
    };
  }

  if (openSupportCount > 0) {
    return {
      message: "You have open support requests that may affect today's workflow.",
      actionLabel: "Open Help Centre",
      href: "/help",
    };
  }

  return {
    message: `${openTasks} open tasks remain in your teaching queue.`,
    actionLabel: "Review tasks",
    href: "/my-tasks",
  };
}

function compareDashboardTasks(a: TeacherTaskDto, b: TeacherTaskDto) {
  const priorityDifference = priorityOrder[a.priority] - priorityOrder[b.priority];
  return priorityDifference === 0 ? a.dueAt.localeCompare(b.dueAt) : priorityDifference;
}

function getData<T>(result: { ok: true; data: T } | { ok: false }) {
  return result.ok ? result.data : null;
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(new Date(value));
}

function titleCase(value: string) {
  return value.slice(0, 1).toUpperCase() + value.slice(1).replaceAll("_", " ");
}

function toWorkspaceSummary(context: AuthenticatedContext): WorkspaceSummaryDto {
  return {
    id: context.activeWorkspace.id,
    name: context.activeWorkspace.name,
    academicYearName: context.activeWorkspace.currentAcademicYearName,
    termName: context.activeWorkspace.currentTermName,
  };
}

function authRequired(): DashboardServiceResult<never> {
  return {
    ok: false,
    status: 401,
    code: "AUTH_REQUIRED",
    message: "Sign in to continue.",
  };
}

function forbidden(message: string): DashboardServiceResult<never> {
  return {
    ok: false,
    status: 403,
    code: "FORBIDDEN",
    message,
  };
}
