# Testing Strategy

The repo now uses Node's built-in test runner for the first vertical-slice integration test:

```bash
npm test
```

Current test file:

- `tests/vertical-slice.test.mjs`

## Unit Tests

Cover:

- Permission utilities.
- Tenant scoping helpers.
- API DTO to UI adapters.
- Validation logic.
- Domain status transitions.

## Backend Integration Tests

Implemented coverage:

- Unauthenticated `/api/v1/teacher/classes` returns `401`.
- Demo teacher login sets session/workspace cookies.
- `/api/v1/me` returns active user and workspace.
- Teacher sees only assigned classes in the active tenant.
- Same-tenant unassigned class access returns `403`.
- Cross-tenant class access returns `404`.
- Admin membership can view all classes in the active tenant.
- Unauthenticated `/api/v1/teacher/attendance` returns `401`.
- Teacher attendance registers are filtered to assigned classes.
- Attendance register save updates learner statuses and notes.
- Invalid attendance learner IDs return `400`.
- Attendance follows the same same-tenant `403` and cross-tenant `404` rules.
- Admin membership can view attendance for all classes in the active tenant.
- Unauthenticated `/api/v1/teacher/lesson-plans` returns `401`.
- Teacher lesson plans are filtered to assigned classes.
- Lesson plan detail follows same-tenant `403` and cross-tenant `404` rules.
- Lesson plan creation validates required fields and assigned-class scope.
- Admin membership can view all lesson plans in the active tenant.
- Unauthenticated `/api/v1/teacher/assessments` returns `401`.
- Teacher assessments are filtered to assigned classes.
- Assessment detail follows same-tenant `403` and cross-tenant `404` rules.
- Assessment creation validates required fields, mark totals, and assigned-class scope.
- Admin membership can view all assessments in the active tenant.
- Unauthenticated `/api/v1/teacher/gradebooks` returns `401`.
- Teacher gradebook sheets are filtered to assigned classes.
- Gradebook sheet detail follows same-tenant `403` and cross-tenant `404` rules.
- Gradebook score save validates learner IDs, score ranges, and assigned-class scope.
- Admin membership can view all gradebook sheets in the active tenant.

Cover:

- Authentication and session resolution.
- Tenant isolation.
- Role enforcement.
- API validation and error format.
- Not-found and conflict behavior.
- Duplicate requests and idempotency.

## Frontend Tests

Cover:

- Loading, empty, error, unauthorized, forbidden states.
- Permission-based rendering.
- Form validation.
- API error mapping.
- Responsive critical flows.

## End-to-End Tests

Initial critical path is partially covered by the integration test:

1. Login.
2. Workspace selection.
3. My Classes.
4. Class Overview.
5. Attendance.
6. Attendance Register.
7. Lesson Planner.
8. New Lesson Plan.
9. Lesson Plan Detail.
10. Assessments.
11. New Assessment.
12. Assessment Detail.
13. Gradebook.
14. Gradebook Sheet.

Future paths:

- Report review and publication.

## Security Tests

Must verify:

- Cross-tenant access attempts.
- Horizontal privilege escalation.
- Vertical privilege escalation.
- IDOR attempts through URL changes.
- Missing authorization checks.
- Revoked/expired sessions.
- Sensitive data exposure.

## Seed Data Requirements

Use realistic seed data:

- Multiple schools.
- Users with memberships in different schools.
- Teachers assigned to different classes.
- Empty and large classes.
- Learners with long names.
- Archived records.
- Unauthorized users.
