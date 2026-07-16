# Permissions Matrix

This matrix is the initial permission model. It must be enforced server-side before production use.

| Role | Core Permissions | Screens | API Operations | Sensitive Fields | Tenant Boundary |
| --- | --- | --- | --- | --- | --- |
| Platform administrator | platform-wide support/admin permissions | Support admin, audit tools | platform support endpoints | cross-tenant metadata | Must be explicitly scoped and audited |
| School administrator | `school.settings.manage`, `staff.manage`, `class.manage`, `timetable.view`, `calendar.view`, `timetable.manage`, `attendance.record`, `attendance.view_reports`, `lesson.view`, `lesson.create`, `assessment.view`, `assessment.create`, `assessment.mark`, `question.view`, `question.manage`, `resource.view`, `resource.manage`, `gradebook.view`, `report.review`, `approval.view`, `approval.review`, `audit.view` | Admin/settings/staff/classes/reports/approvals | school management APIs | staff/learner PII, attendance, lesson notes, timetable events, calendar events, resources, assessment content, question content, scores, audit logs | Own school only |
| Teacher | `class.view_assigned`, `timetable.view`, `calendar.view`, `lesson.view`, `lesson.create`, `attendance.record`, `attendance.view_reports`, `assessment.view`, `assessment.create`, `assessment.mark`, `question.view`, `question.manage`, `resource.view`, `resource.manage`, `gradebook.view`, `report.prepare`, `approval.view`, `ai.use` | Teacher dashboard, classes, timetable, academic calendar, lesson planner, attendance, assessments, question bank, resources, gradebook, reports, approvals, Ask Pal | teacher class APIs, timetable APIs, academic calendar APIs, lesson plan APIs, attendance APIs, assessment APIs, question APIs, resource APIs, gradebook APIs, approval tracking APIs | learner scores, attendance, timetable events, calendar events, resources, lesson notes, assessment content, question content, comments | Assigned classes unless broader permission |
| Reviewer | `approval.view`, `approval.review`, `question.view`, `assessment.moderate`, `assessment.approve`, `report.review`, `ai.approve_action` | Approvals, assessments, question bank, reports | approval/review APIs | assessment content, question content, report comments | Assigned school/review scope |
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
| `/lesson-planner` | `lesson.view` or `lesson.create` |
| `/lesson-planner/new` | `lesson.create` |
| `/lesson-planner/[lessonPlanId]` | `lesson.view` or `lesson.create` scoped to assigned class or `class.manage` |
| `/assessments` | `assessment.view` |
| `/assessments/new` | `assessment.create` |
| `/assessments/[assessmentId]` | `assessment.view` or `assessment.create` scoped to assigned class or `class.manage` |
| `/question-bank` | `question.view` or `question.manage` |
| `/question-bank/new` | `question.manage` scoped to assigned class or `class.manage` |
| `/question-bank/[questionId]` | `question.view` or `question.manage` scoped to assigned class or `class.manage` |
| `/timetable` | `timetable.view` scoped to assigned class or `class.manage` |
| `/timetable/[eventId]` | `timetable.view` scoped to assigned class or `class.manage` |
| `/academic-calendar` | `calendar.view` scoped to workspace/class/teacher visibility or `class.manage` |
| `/academic-calendar/[eventId]` | `calendar.view` scoped to workspace/class/teacher visibility or `class.manage` |
| `/resources` | `resource.view` or `resource.manage` scoped to workspace/class/teacher visibility or `class.manage` |
| `/resources/[resourceId]` | `resource.view` or `resource.manage` scoped to workspace/class/teacher visibility or `class.manage` |
| `/gradebook` | `assessment.mark` or `gradebook.view` |
| `/gradebook/[assessmentId]` | `assessment.mark` or `gradebook.view` scoped to assigned class or `class.manage` |
| `/attendance` | `attendance.record` or `attendance.view_reports` |
| `/attendance/[classId]` | `attendance.record` scoped to assigned class or `class.manage` |
| `/reports` | `report.prepare` or `report.review` |
| `/reports/[classId]` | `report.prepare` or `report.review` scoped to assigned class or `class.manage` |
| `/approvals` | `approval.view` or `approval.review` |
| `/approvals/[approvalId]` | `approval.view` or `approval.review`; decisions require `approval.review` or `report.review` |
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
