# Permissions Matrix

This matrix is the initial permission model. It must be enforced server-side before production use.

| Role | Core Permissions | Screens | API Operations | Sensitive Fields | Tenant Boundary |
| --- | --- | --- | --- | --- | --- |
| Platform administrator | platform-wide support/admin permissions | Support admin, audit tools | platform support endpoints | cross-tenant metadata | Must be explicitly scoped and audited |
| School administrator | `school.settings.manage`, `staff.manage`, `class.manage`, `attendance.record`, `attendance.view_reports`, `timetable.manage`, `report.review`, `audit.view` | Admin/settings/staff/classes/reports | school management APIs | staff/learner PII, attendance, audit logs | Own school only |
| Teacher | `class.view_assigned`, `lesson.create`, `attendance.record`, `attendance.view_reports`, `assessment.create`, `assessment.mark`, `report.prepare`, `ai.use` | Teacher dashboard, classes, attendance, gradebook, reports, Ask Pal | teacher class APIs, attendance APIs, assessment draft APIs | learner scores, attendance, comments | Assigned classes unless broader permission |
| Reviewer | `assessment.moderate`, `assessment.approve`, `report.review`, `ai.approve_action` | Approvals, assessments, reports | approval/review APIs | assessment content, report comments | Assigned school/review scope |
| Support administrator | `support.manage` | Help/support admin | support ticket APIs | ticket metadata | Assigned support scope |
| Parent/guardian | `learner.view_guardian_scope` proposed | Guardian portal future | guardian learner APIs | own learner records only | Linked learner only |
| Learner | `learner.view_self` proposed | Learner portal future | learner self APIs | own records only | Own membership only |
| Custom school role | configured permission set | depends on assignment | depends on assignment | depends on permissions | Own school only |

## Screen-Level Requirements

| Screen | Minimum Permission |
| --- | --- |
| `/` | `dashboard.view` or authenticated teacher membership |
| `/classes` | `class.view_assigned` |
| `/classes/[classId]` | `class.view_assigned` or `class.manage` scoped to active school |
| `/lesson-planner` | `lesson.view` |
| `/lesson-planner/new` | `lesson.create` |
| `/assessments` | `assessment.view` |
| `/assessments/new` | `assessment.create` |
| `/question-bank` | `question.view` |
| `/gradebook` | `assessment.mark` or `gradebook.view` |
| `/attendance` | `attendance.record` or `attendance.view_reports` |
| `/attendance/[classId]` | `attendance.record` scoped to assigned class or `class.manage` |
| `/reports` | `report.prepare` |
| `/approvals` | `assessment.moderate` or `report.review` |
| `/ask-pal` | `ai.use` |
| `/settings` | `account.manage_self` |

## API Enforcement

Every protected API must:

1. Resolve session.
2. Resolve active school.
3. Verify membership.
4. Check permission.
5. Scope resource query by `schoolId`.
6. Audit sensitive operations.
