# Authentication, Tenancy, and Permissions

## Current State

First vertical-slice demo implementation exists:

- `src/app/login/page.tsx` renders the demo login form.
- `src/app/api/v1/auth/login/route.ts` sets HttpOnly demo session and active workspace cookies.
- `src/app/api/v1/auth/logout/route.ts` clears those cookies.
- `src/lib/server/auth-context.ts` resolves user, active workspace, membership, and permissions.
- `src/lib/security/permissions.ts` defines the first permission set.
- `src/lib/server/classes-service.ts` enforces tenant and class permissions.
- `src/lib/server/settings-service.ts` enforces self-account and workspace selection permissions.

This is not production authentication. Passwords and sessions are deterministic demo
fixtures in `src/lib/server/demo-store.ts`.

## Target Model

The system must distinguish:

- Authentication: who the user is.
- Tenancy: which school/workspace is active.
- Authorization: what the user can do in that school/workspace.

Use membership-based roles:

```text
User -> Membership -> School/Workspace
Membership -> RoleAssignment -> Permission
```

Do not use a single global `user.role` for school permissions.

## Required Flows

1. Signup creates a user and may create or join a school.
2. Login creates a server-managed session.
3. Logout revokes the current session.
4. Password recovery uses time-limited tokens.
5. Email verification gates sensitive flows where required.
6. Invitation acceptance creates or activates a membership.
7. Workspace creation creates a school/workspace and owner/admin membership.
8. Workspace selection stores active tenant context in a server-verified session.
9. Session expiration returns a consistent `401`.
10. Session renewal rotates session identifiers where applicable.
11. Protected routes validate session and tenant membership.
12. Multiple-device sessions are visible and revocable.

## Route Protection

Server-side checks are mandatory for protected API operations. UI button hiding is optional convenience, not authorization.

Recommended request context:

- `userId`
- `membershipId`
- `schoolId`
- `permissions`
- `requestId`

## Session Storage

Preferred production approach:

- HttpOnly, Secure, SameSite session cookie.
- Server-side session table or durable session store.
- Signed/opaque session IDs; do not trust client-provided school IDs.

## Permission Examples

- `dashboard.view`
- `task.view`
- `task.manage`
- `account.manage_self`
- `workspace.select`
- `support.view`
- `support.request`
- `support.manage`
- `class.view_assigned`
- `class.manage`
- `learner.view`
- `timetable.view`
- `calendar.view`
- `attendance.record`
- `attendance.view_reports`
- `lesson.view`
- `lesson.create`
- `assessment.view`
- `assessment.create`
- `assessment.mark`
- `question.view`
- `question.manage`
- `resource.view`
- `resource.manage`
- `gradebook.view`
- `assessment.moderate`
- `assessment.approve`
- `report.prepare`
- `report.review`
- `report.publish`
- `approval.view`
- `approval.review`
- `school.settings.manage`
- `staff.manage`
- `timetable.manage`
- `automation.manage`
- `ai.use`
- `ai.approve_action`
- `audit.view`

## Unauthorized and Forbidden

- `401 UNAUTHENTICATED`: no valid session.
- `403 FORBIDDEN`: valid session but no membership/permission for requested tenant/resource.

Both must use the standard API error format defined in `docs/openapi.yaml`.

## Audit Requirements

Audit login events, logout, session revocation, role changes, permission changes, tenant selection, sensitive reads where required, and all write operations in school-owned domains.
