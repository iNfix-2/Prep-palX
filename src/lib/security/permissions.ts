export const permissions = [
  "dashboard.view",
  "workspace.select",
  "class.view_assigned",
  "class.manage",
  "lesson.create",
  "assessment.create",
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
