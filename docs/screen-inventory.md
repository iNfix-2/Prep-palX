# Screen Inventory and Canonicalization

Last updated: 2026-07-16

## Summary

Confirmed source routes in this repository:

| Category | Count | Notes |
| --- | ---: | --- |
| UI routes implemented | 20 | Includes dynamic section routes, Ask Pal, login, My Classes, and Class Overview. |
| Mock API routes | 5 | JSON route handlers under `src/app/api`. |
| First-slice integrated | 2 | `/classes` and `/classes/[classId]` use auth, tenant, permission, service, DTO, and adapter layers backed by in-memory seed data. |
| Partially integrated | 10 | Prototype API handlers plus `/api/v1` demo-backed handlers. |
| Mock-only | 16 | Remaining teacher workspace screens depend on mock data/config. |
| Duplicate or experimental in repo | 0 | Duplicate dashboard variants exist in Stitch reference, not repo source. |
| Blocked by missing requirements | 16 | Validation, persistence, production auth, and domain-specific services. |
| Blocked by missing backend capabilities | 20 | Database, migrations, durable sessions, audit, and production authorization storage. |

## Canonicalization Notes

- The current source repository contains one teacher dashboard route: `src/app/(teacher)/page.tsx`.
- The earlier Stitch project contains multiple dashboard variants. Based on prior screen review, the canonical target is `Teacher Dashboard - Refined & Connected`.
- Older Stitch dashboard variants should be treated as deprecated candidates until product confirms otherwise.
- The current app consolidates many Stitch screens through `src/components/workspace/workspace-page.tsx`; this is useful for prototyping, but domain-specific vertical slices should replace generic rendering when real behavior is introduced.

## Screen Inventory

| Screen | Route | Domain | Role | Status | Responsive | Mock Data | API Calls | Data Displayed | Actions | Forms | Permission | Related | Canonical | Missing States | Integration Readiness |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Teacher Dashboard | `/` | Teaching operations | Teacher | Implemented mock UI | Desktop and mobile layout support | `src/lib/dashboard-data.ts` | No | schedule, urgent tasks, curriculum progress, recent docs | create assessment, Ask Pal, open lesson placeholder | No | `dashboard.view` proposed | Ask Pal, lesson planner, assessments | Canonical current repo dashboard | loading, empty, error, unauthorized, forbidden | Low |
| My Classes | `/classes` | Classes | Teacher | First-slice integrated UI | Responsive through shell and custom cards | `src/lib/server/demo-store.ts` | Server service; `/api/v1/teacher/classes` available | assigned classes, readiness, learner counts, support flags, open tasks | prepare lesson, Ask Pal, open class | No | `class.view_assigned` or `class.manage` | Class Overview, attendance, gradebook | Canonical first slice | Implemented | High for demo, medium for production |
| Class Overview | `/classes/[classId]` | Classes | Teacher/Admin | First-slice integrated UI | Responsive custom overview | `src/lib/server/demo-store.ts` | Server service; `/api/v1/classes/{classId}` available | class summary, next lesson, roster, tasks, recent activity | prepare lesson, Ask Pal, back to classes | No | assigned class or `class.manage` | My Classes, Lesson Planner | Canonical first slice | Implemented | High for demo, medium for production |
| Lesson Planner | `/lesson-planner` | Teaching operations | Teacher | Generic workspace screen | Responsive | `workspace-data.ts` | No | lesson queue, templates | new lesson, generate with Pal | No | `lesson.view` / `lesson.manage` | Builder, Ask Pal | Canonical placeholder | all async states | Low |
| New Lesson Plan | `/lesson-planner/new` | Teaching operations | Teacher | Builder mock UI | Responsive | `workspace-data.ts` | No | default lesson fields and outline | save draft placeholder, Draft with Pal | Yes, static uncontrolled | `lesson.create` | Lesson Planner, Ask Pal | Canonical placeholder | validation, submission, unsaved changes, errors | Low |
| Assessments | `/assessments` | Assessment | Teacher/Reviewer | Generic workspace screen | Responsive | `workspace-data.ts` | No | assessment pipeline and moderation tasks | new assessment, question bank | No | `assessment.create` / `assessment.view` | Question Bank, Approvals | Canonical placeholder | all async states | Low |
| New Assessment | `/assessments/new` | Assessment | Teacher | Builder mock UI | Responsive | `workspace-data.ts` | No | default assessment fields and structure | save draft placeholder, Draft with Pal | Yes, static uncontrolled | `assessment.create` | Assessments, Question Bank | Canonical placeholder | validation, submission, errors | Low |
| Question Bank | `/question-bank` | Assessment | Teacher/Reviewer | Generic workspace screen | Responsive | `workspace-data.ts` | No | question stats and quality checks | add question placeholder, generate questions | No | `question.view` / `question.manage` | Assessments | Canonical placeholder | all async states | Low |
| Timetable | `/timetable` | Scheduling | Teacher | Generic workspace screen | Responsive | `workspace-data.ts` | No | daily schedule and health | Today, optimize week | No | `timetable.view` | Calendar | Canonical placeholder | all async states | Low |
| Academic Calendar | `/academic-calendar` | Scheduling | Teacher | Generic workspace screen | Responsive | `workspace-data.ts` | No | events, milestones | add event placeholder, plan with Pal | No | `calendar.view` | Timetable | Canonical placeholder | all async states | Low |
| Gradebook | `/gradebook` | Gradebook/results | Teacher | Generic workspace screen | Responsive | `workspace-data.ts` | No | result sheets, learner flags | enter scores placeholder, analyze gaps | No | `gradebook.view` / `assessment.mark` | Reports | Canonical placeholder | all async states | Low |
| Attendance | `/attendance` | Attendance | Teacher | Generic workspace screen | Responsive | `workspace-data.ts` | No | registers and follow-ups | mark today placeholder | No | `attendance.record` | Classes | Canonical placeholder | all async states | Low |
| Resources | `/resources` | Teaching resources | Teacher | Generic workspace screen | Responsive | `workspace-data.ts` | No | library resources and hygiene | upload placeholder, generate worksheet | No | `resource.view` / `resource.manage` | Lesson Planner | Canonical placeholder | all async states | Low |
| Approvals | `/approvals` | Workflow approvals | Reviewer/Teacher | Generic workspace screen | Responsive | `workspace-data.ts` | No | approval queue and reviewer activity | review queue, delegate placeholder | No | `approval.review` | Assessments, Reports | Canonical placeholder | all async states | Low |
| Reports | `/reports` | Reporting | Teacher/Reviewer | Generic workspace screen | Responsive | `workspace-data.ts` | No | readiness, profiles, publishing checklist | generate report placeholder | No | `report.prepare` | Gradebook | Canonical placeholder | all async states | Low |
| My Tasks | `/my-tasks` | Workflow/tasks | Teacher | Generic workspace screen | Responsive | `workspace-data.ts` | No | priority and completed tasks | add task placeholder | No | `task.view` | Dashboard | Canonical placeholder | all async states | Low |
| Ask Pal | `/ask-pal` | AI assistant | Teacher | Full-screen mock UI | Desktop/mobile checked | `src/lib/ask-pal-data.ts` | No | conversations, quick actions, context, sources | prompt composer, review AI tasks placeholder | Prompt textarea only | `ai.use` | All modules | Canonical current repo Ask Pal | loading, error, unauthorized, action confirmation | Low until AI boundaries exist |
| Help Centre | `/help` | Support | Teacher | Generic workspace screen | Responsive | `workspace-data.ts` | No | guides and support requests | new support request placeholder | No | `support.view` | Settings | Canonical placeholder | all async states | Low |
| Settings | `/settings` | Account/security | Teacher | Generic workspace screen | Responsive | `workspace-data.ts` | No | preferences, security, AI usage | save changes placeholder | No | `account.manage_self` | Auth, Ask Pal | Canonical placeholder | all async states | Low |

## API Route Inventory

| Route | Handler | Status | Notes |
| --- | --- | --- | --- |
| `/api/teacher/overview` | `src/app/api/teacher/overview/route.ts` | Mock-only | No auth/tenant checks. |
| `/api/ask-pal` | `src/app/api/ask-pal/route.ts` | Mock-only | No AI provider or permission boundary. |
| `/api/workspace/sections` | `src/app/api/workspace/sections/route.ts` | Mock-only | Lists generic screen configs. |
| `/api/workspace/sections/[section]` | `src/app/api/workspace/sections/[section]/route.ts` | Mock-only | Returns generic page config. |
| `/api/workspace/builders/[section]` | `src/app/api/workspace/builders/[section]/route.ts` | Mock-only | Returns generic builder config. |
| `/api/v1/auth/login` | `src/app/api/v1/auth/login/route.ts` | Demo integrated | Sets demo session and active workspace cookies. |
| `/api/v1/auth/logout` | `src/app/api/v1/auth/logout/route.ts` | Demo integrated | Clears demo cookies. |
| `/api/v1/me` | `src/app/api/v1/me/route.ts` | Demo integrated | Returns current user, active workspace, memberships, permissions. |
| `/api/v1/workspaces` | `src/app/api/v1/workspaces/route.ts` | Demo integrated | Lists workspaces for current user. |
| `/api/v1/workspaces/select` | `src/app/api/v1/workspaces/select/route.ts` | Demo integrated | Verifies membership before setting active workspace. |
| `/api/v1/teacher/classes` | `src/app/api/v1/teacher/classes/route.ts` | Demo integrated | Tenant-scoped class list with permission filtering. |
| `/api/v1/classes/[classId]` | `src/app/api/v1/classes/[classId]/route.ts` | Demo integrated | Class overview with assigned-class, admin, and tenant checks. |

## Deprecated-Screen Candidates

Not present in repo source, but present in Stitch reference:

- `Teacher Dashboard - Desktop`
- `Teacher Dashboard - Mobile`
- `Teacher Dashboard - Refined (Desktop)`
- `Teacher Dashboard - Refined (Mobile)`

Candidate canonical variant:

- `Teacher Dashboard - Refined & Connected`

Rationale: this variant was used as the source for the current dashboard scaffold and appears later in the design evolution.
