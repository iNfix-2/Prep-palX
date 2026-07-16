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
  membership lookup, and class permissions. Production session storage, password security,
  audit, and database-backed roles are still required.

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
and daily Attendance with in-memory seed data. Classroom records, tasks persistence,
and dashboard backend integration are not started.

## Phase D: Assessment and Gradebook

Objective: assessment creation, marking, moderation, gradebook.

Dependencies: Phase A-C.

Complexity: extra-large. Status: not started.

## Phase E: Reporting

Objective: report templates, report cards, review, publishing, learner profiles.

Dependencies: assessment, attendance, behaviour, permissions.

Complexity: extra-large. Status: not started.

## Phase F: Additional Operations

Objective: behaviour, psychomotor, incidents, homework, parent contact, lesson planning, timetable.

Dependencies: core people/classes model.

Complexity: large. Status: not started.

## Phase G: Advanced Features

Objective: approvals, automation, support administration, AI assistant.

Dependencies: stable domain services, audit, permissions.

Complexity: extra-large. Status: not started.

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
`src/lib/server/attendance-service.ts`.
