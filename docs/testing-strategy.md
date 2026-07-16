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

- Unauthenticated `/api/v1/teacher/dashboard` returns `401`.
- Teacher Dashboard aggregates active-workspace classes, timetable events, tasks, and recent work.
- Teacher Dashboard filters out same-tenant unassigned class data and cross-tenant data.
- Admin Dashboard includes managed active-workspace classes and timetable events.
- Unauthenticated `/api/v1/ai/conversations` returns `401`.
- Ask Pal rejects memberships without `ai.use`.
- Ask Pal assistant context and sources are filtered to the active tenant and visible teaching scope.
- Ask Pal proposal creation validates prompt input and returns confirmation metadata for high-impact actions.
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
- Unauthenticated `/api/v1/teacher/questions` returns `401`.
- Teacher question bank items are filtered to assigned classes.
- Question detail follows same-tenant `403` and cross-tenant `404` rules.
- Question creation validates required fields, multiple-choice options, and assigned-class scope.
- Admin membership can view all questions in the active tenant.
- Unauthenticated `/api/v1/teacher/timetable` returns `401`.
- Teacher timetable events are filtered to assigned classes and owned workspace events.
- Timetable event detail follows same-tenant `403` and cross-tenant `404` rules.
- Timetable date filtering validates `YYYY-MM-DD`.
- Admin membership can view all timetable events in the active tenant.
- Unauthenticated `/api/v1/teacher/academic-calendar` returns `401`.
- Teacher calendar events are filtered to workspace, assigned class, and teacher-owned visibility.
- Calendar event detail follows same-tenant `403` and cross-tenant `404` rules.
- Academic calendar date filtering validates `YYYY-MM-DD`.
- Admin membership can view all calendar events in the active tenant.
- Unauthenticated `/api/v1/teacher/resources` returns `401`.
- Teacher resources are filtered to workspace, assigned class, and teacher-owned visibility.
- Resource detail follows same-tenant `403` and cross-tenant `404` rules.
- Admin membership can view all resources in the active tenant.
- Unauthenticated `/api/v1/teacher/gradebooks` returns `401`.
- Teacher gradebook sheets are filtered to assigned classes.
- Gradebook sheet detail follows same-tenant `403` and cross-tenant `404` rules.
- Gradebook score save validates learner IDs, score ranges, and assigned-class scope.
- Admin membership can view all gradebook sheets in the active tenant.
- Unauthenticated `/api/v1/teacher/reports` returns `401`.
- Teacher report readiness is filtered to assigned classes.
- Class report detail follows same-tenant `403` and cross-tenant `404` rules.
- Report comment save validates learner IDs, ready comments, and assigned-class scope.
- Admin membership can view all reports in the active tenant.
- Unauthenticated `/api/v1/teacher/approvals` returns `401`.
- Teacher approval tracking is filtered to submitted or assigned-class requests.
- Approval detail follows same-tenant `403` and cross-tenant `404` rules.
- Teachers cannot submit reviewer decisions without reviewer permission.
- Reviewer decisions validate required change notes and update linked workflow state.
- Admin membership can review all approvals in the active tenant.
- Unauthenticated `/api/v1/teacher/tasks` returns `401`.
- Teacher tasks are filtered to owner, assignee, workspace, and assigned-class scope.
- Task detail follows same-tenant `403` and cross-tenant `404` rules.
- Task status updates validate supported statuses and append activity notes.
- Admin membership can view and update all tasks in the active tenant.
- Unauthenticated `/api/v1/help` returns `401`.
- Help Centre guides are filtered to global or active-workspace visibility.
- Teacher support requests are filtered to creator/assignee scope.
- Support request detail follows same-tenant `403` and cross-tenant `404` rules.
- Support request creation validates required fields and active-workspace scope.
- Support messages append to the request conversation.
- Support managers can view and resolve all requests in the active tenant.
- Unauthenticated `/api/v1/settings` returns `401`.
- Settings returns active user, workspace, memberships, preferences, security metadata, and AI usage.
- Settings preference saves validate supported density, language, timezone, and AI confirmation modes.
- Workspace selection rejects workspaces outside the current user's memberships.

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
3. Teacher Dashboard.
4. Ask Pal.
5. Settings.
6. My Classes.
7. Class Overview.
8. My Tasks.
9. Task Detail.
10. Help Centre.
11. Support Request Detail.
12. Attendance.
13. Attendance Register.
14. Lesson Planner.
15. New Lesson Plan.
16. Lesson Plan Detail.
17. Assessments.
18. New Assessment.
19. Assessment Detail.
20. Question Bank.
21. New Question.
22. Question Detail.
23. Timetable.
24. Timetable Event.
25. Academic Calendar.
26. Calendar Event.
27. Resources.
28. Resource Detail.
29. Gradebook.
30. Gradebook Sheet.
31. Reports.
32. Class Report.
33. Approvals.
34. Approval Detail.

Future paths:

- Report template review and publication.
- Workflow assignment, audit exports, and reviewer load balancing.

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
