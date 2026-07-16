export const permissions = [
  "dashboard.view",
  "workspace.select",
  "task.view",
  "task.manage",
  "class.view_assigned",
  "class.manage",
  "timetable.view",
  "calendar.view",
  "attendance.record",
  "attendance.view_reports",
  "lesson.view",
  "lesson.create",
  "assessment.view",
  "assessment.create",
  "assessment.mark",
  "question.view",
  "question.manage",
  "resource.view",
  "resource.manage",
  "gradebook.view",
  "report.prepare",
  "report.review",
  "approval.view",
  "approval.review",
  "support.view",
  "support.request",
  "support.manage",
  "ai.use",
] as const;

export type Permission = (typeof permissions)[number];

export interface PermissionPrincipal {
  permissions: readonly Permission[];
}

export function hasPermission(
  principal: PermissionPrincipal | null | undefined,
  permission: Permission,
) {
  return Boolean(principal?.permissions.includes(permission));
}

export function hasAnyPermission(
  principal: PermissionPrincipal | null | undefined,
  requiredPermissions: readonly Permission[],
) {
  return requiredPermissions.some((permission) => hasPermission(principal, permission));
}
