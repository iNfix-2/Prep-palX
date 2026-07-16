# Implementation Roadmap

Use dependency order, not time estimates.

## Phase A: Access and Setup

- Objective: establish auth, sessions, tenancy, memberships, permissions.
- Dependencies: database, migration tooling, environment strategy.
- Features: login, logout, workspace selection, session renewal/revocation.
- Backend: user/session/membership services.
- Frontend: login, workspace selector, protected route states.
- Database: users, schools, memberships, sessions, roles.
- Security: server-side authorization and audit.
- Testing: auth, tenant isolation, role checks.
- Risk: wrong auth model creates broad rework.
- Acceptance: protected APIs enforce session, tenant, permission.
- Complexity: large.
- Status: first demo implementation complete for teacher login, active workspace cookies,
  workspace selection, self-service account settings, membership lookup, and class
  permissions. Production session storage, password security, audit, and
  database-backed roles/preferences are still required.

## Phase B: Academic Foundation

Objective: create school structure required by classes and reports.

Dependencies: Phase A.

Features: academic years, terms, grade levels, subjects, classes, staff, learner enrolments, academic calendar.

Complexity: large. Status: not started.

## Phase C: Daily Teacher Workflow

Objective: first production vertical slice.

Dependencies: Phase A, minimal classes from Phase B.

Features: Teacher Dashboard, My Classes, Class Overview, daily attendance, classroom records, teacher tasks.

Acceptance: teacher sees only assigned classes; class detail is tenant-scoped.

Complexity: large. Status: demo slices implemented for My Classes, Class Overview,
My Tasks, daily Attendance, and Lesson Planner with in-memory seed data. Classroom
records, production task persistence, and dashboard backend integration are not started.

## Phase D: Assessment and Gradebook

Objective: assessment creation, marking, moderation, gradebook.

Dependencies: Phase A-C.

Complexity: extra-large. Status: assessment list, draft creation, assessment
detail, question bank list/create/detail, gradebook list, and score-entry demo
slices are implemented with in-memory seed data. Question search/import/reuse,
report calculations, and production persistence are not started.
Approval queue demo handling now covers basic moderation decisions for submitted
assessments and lesson plans; richer reviewer assignment, rubric checks, and
production audit remain outstanding.

## Phase E: Reporting

Objective: report templates, report cards, review, publishing, learner profiles.

Dependencies: assessment, attendance, behaviour, permissions.

Complexity: extra-large. Status: report readiness list, class report detail,
and comment preparation demo slices are implemented with in-memory assessment,
attendance, and comment evidence. Report templates, reviewer workflow,
publishing, parent/learner delivery, behaviour evidence, and production
persistence are not started.

## Phase F: Additional Operations

Objective: behaviour, psychomotor, incidents, homework, parent contact, extended lesson planning, timetable.

Dependencies: core people/classes model.

Complexity: large. Status: lesson planning, tasks, timetable, academic calendar, and
resources demo slices are implemented with in-memory seed data. Behaviour,
psychomotor, incidents, homework, parent contact, production scheduling, and
scheduling/resource write operations are not started.

## Phase G: Advanced Features

Objective: approvals, automation, support administration, AI assistant.

Dependencies: stable domain services, audit, permissions.

Complexity: extra-large. Status: approval queue, approval detail, Help Centre,
and support request detail demo slices are implemented with teacher tracking,
reviewer/support actions, and in-memory workflow fixtures. Automation, AI action
approval, durable audit, production support storage, and production workflow
storage are not started.

## Minimum Next Changes for First Vertical Slice

1. Add mockable auth/session context. Done.
2. Add membership and permission utility. Done.
3. Add class repository/service with tenant checks. Done.
4. Add `/api/v1/me`, `/api/v1/workspaces`, `/api/v1/workspaces/select`, `/api/v1/teacher/classes`, `/api/v1/classes/{classId}`. Done.
5. Add API DTOs and UI adapters. Done.
6. Replace `/classes` generic renderer with first-slice classes page. Done.
7. Add `/classes/[classId]`. Done.
8. Add loading, empty, error, unauthorized, forbidden states. Done.
9. Add tests for permission and tenant isolation. Done.

## Next Backend Hardening Step

Replace `src/lib/server/demo-store.ts` with a real database repository layer while
preserving the service boundaries in `src/lib/server/classes-service.ts` and
`src/lib/server/tasks-service.ts`,
`src/lib/server/help-service.ts`,
`src/lib/server/settings-service.ts`,
`src/lib/server/attendance-service.ts`, `src/lib/server/lesson-plans-service.ts`,
`src/lib/server/assessments-service.ts`, `src/lib/server/gradebook-service.ts`,
`src/lib/server/question-bank-service.ts`, `src/lib/server/timetable-service.ts`,
`src/lib/server/academic-calendar-service.ts`, `src/lib/server/resources-service.ts`,
`src/lib/server/reports-service.ts`, and `src/lib/server/approvals-service.ts`.
