# Current State Audit

Last updated: 2026-07-16

## 1. Repository Structure

Confirmed paths:

- `src/app/`: Next.js App Router routes and route handlers.
- `src/app/(teacher)/`: authenticated teacher workspace route group.
- `src/app/(teacher)/[section]/page.tsx`: dynamic teacher workspace screen route.
- `src/app/(teacher)/[section]/new/page.tsx`: dynamic builder route for supported creation flows.
- `src/app/ask-pal/page.tsx`: full-screen Ask Pal AI copilot route.
- `src/app/api/`: mock JSON route handlers.
- `src/components/layout/`: teacher sidebar, mobile nav, and top bar.
- `src/components/ui/`: small local UI primitives.
- `src/components/workspace/`: reusable workspace and builder page renderers.
- `src/lib/`: mock data, shared utilities, and server data service.
- `docs/`: architecture and integration documentation.

No `pages/` directory is present. No backend framework directory, database schema, migrations, or ORM configuration exists yet.

## 2. Detected Technology Stack

- Front-end framework: Next.js `16.2.10` App Router.
- UI runtime: React `19.2.4`.
- Programming language: TypeScript with `strict: true` in `tsconfig.json`.
- Package manager: npm, confirmed by `package-lock.json`.
- Styling: Tailwind CSS 4 through `@tailwindcss/postcss`.
- Component helpers: `clsx` and `tailwind-merge`.
- Icons: local SVG icon component in `src/components/ui/icon.tsx`.
- Backend framework: none beyond Next.js route handlers in `src/app/api`.
- Database: none configured.
- ORM/query builder: none configured.
- Authentication implementation: demo cookie session in `src/lib/server/auth-context.ts`.
- Routing: Next.js App Router file-system routing.
- State management: no external state library; current pages are server components with static/mock data.
- Form library: none.
- Validation library: none.
- Testing tools: Node built-in test runner through `npm test`.
- Existing API client: `src/lib/api/client.ts` for standardized JSON responses.
- Environment strategy: `.env*` ignored by `.gitignore`; no documented env vars or `.env.example` exists yet.
- Deployment configuration: none detected (`vercel.json`, Dockerfile, CI config absent).
- CI/CD: none detected.

## 3. Local Startup

From `package.json`:

```bash
npm install
npm run dev
```

The app runs at `http://localhost:3000` by default.

Validation commands currently available:

```bash
npx tsc --noEmit
npm run lint
npm run build
```

## 4. Environment Variables

No environment variables are currently required by source code. This is a blocker for production authentication, database, session signing, email, file uploads, AI providers, and observability.

## 5. Existing Routes

UI routes:

- `/` via `src/app/(teacher)/page.tsx`
- `/login` via `src/app/login/page.tsx`
- `/classes` via `src/app/(teacher)/classes/page.tsx`
- `/classes/[classId]` via `src/app/(teacher)/classes/[classId]/page.tsx`
- `/attendance` via `src/app/(teacher)/attendance/page.tsx`
- `/attendance/[classId]` via `src/app/(teacher)/attendance/[classId]/page.tsx`
- `/lesson-planner` via `src/app/(teacher)/lesson-planner/page.tsx`
- `/lesson-planner/new` via `src/app/(teacher)/lesson-planner/new/page.tsx`
- `/lesson-planner/[lessonPlanId]` via `src/app/(teacher)/lesson-planner/[lessonPlanId]/page.tsx`
- `/assessments` via `src/app/(teacher)/assessments/page.tsx`
- `/assessments/new` via `src/app/(teacher)/assessments/new/page.tsx`
- `/assessments/[assessmentId]` via `src/app/(teacher)/assessments/[assessmentId]/page.tsx`
- `/gradebook` via `src/app/(teacher)/gradebook/page.tsx`
- `/gradebook/[assessmentId]` via `src/app/(teacher)/gradebook/[assessmentId]/page.tsx`
- `/reports` via `src/app/(teacher)/reports/page.tsx`
- `/reports/[classId]` via `src/app/(teacher)/reports/[classId]/page.tsx`
- `/approvals` via `src/app/(teacher)/approvals/page.tsx`
- `/approvals/[approvalId]` via `src/app/(teacher)/approvals/[approvalId]/page.tsx`
- `/ask-pal` via `src/app/ask-pal/page.tsx`
- `/:section` via `src/app/(teacher)/[section]/page.tsx`
- `/:section/new` via `src/app/(teacher)/[section]/new/page.tsx`

Mock API routes:

- `/api/teacher/overview`
- `/api/ask-pal`
- `/api/workspace/sections`
- `/api/workspace/sections/[section]`
- `/api/workspace/builders/[section]`

First-slice API routes:

- `/api/v1/auth/login`
- `/api/v1/auth/logout`
- `/api/v1/me`
- `/api/v1/workspaces`
- `/api/v1/workspaces/select`
- `/api/v1/teacher/classes`
- `/api/v1/classes/[classId]`
- `/api/v1/teacher/attendance`
- `/api/v1/classes/[classId]/attendance`
- `/api/v1/teacher/lesson-plans`
- `/api/v1/lesson-plans`
- `/api/v1/lesson-plans/[lessonPlanId]`
- `/api/v1/teacher/assessments`
- `/api/v1/assessments`
- `/api/v1/assessments/[assessmentId]`
- `/api/v1/teacher/gradebooks`
- `/api/v1/gradebooks/[assessmentId]`
- `/api/v1/teacher/reports`
- `/api/v1/reports/[classId]`
- `/api/v1/teacher/approvals`
- `/api/v1/approvals/[approvalId]`

## 6. Existing Page and Screen Structure

The current repo contains a scaffolded subset of the larger Stitch design:

- Teacher dashboard at `/`.
- Ask Pal full-screen copilot at `/ask-pal`.
- Dynamic teacher workspace renderer for sidebar modules.
- Dynamic builder renderer for lesson and assessment draft flows.
- First-slice My Classes and Class Overview screens.
- Attendance and Attendance Register demo slice.
- Lesson Planner, New Lesson Plan, and Lesson Plan Detail demo slice.
- Assessments, New Assessment, and Assessment Detail demo slice.
- Gradebook and Gradebook Sheet demo slice.
- Reports and Class Report demo slice.
- Approvals and Approval Detail demo slice.

The broader 88-screen Stitch design is not present as discrete source files in this repository. The implemented app uses consolidated renderers and typed mock configuration instead of one component per Stitch screen.

## 7. Existing API Calls

No UI component currently performs client-side network calls with `fetch`, `axios`, or another API client. The class, attendance, lesson-planner, assessment, gradebook, reports, and approvals slices use server components/actions calling `src/lib/server/classes-service.ts`, `src/lib/server/attendance-service.ts`, `src/lib/server/lesson-plans-service.ts`, `src/lib/server/assessments-service.ts`, `src/lib/server/gradebook-service.ts`, `src/lib/server/reports-service.ts`, and `src/lib/server/approvals-service.ts`; `/api/v1` exposes the same demo-backed contracts for clients and tests.

## 8. Existing Mock Services and Mock Data

Mock data paths:

- `src/lib/dashboard-data.ts`
- `src/lib/ask-pal-data.ts`
- `src/lib/workspace-data.ts`
- `src/lib/server/demo-store.ts`

Mock service path:

- `src/lib/server/data-service.ts`

The mock service is thin and not tenant-aware yet.

## 9. Existing Authentication Code

Demo authentication exists for the first vertical slice:

- `src/app/login/page.tsx`
- `src/app/api/v1/auth/login/route.ts`
- `src/app/api/v1/auth/logout/route.ts`
- `src/lib/server/auth-context.ts`

It uses deterministic in-memory fixtures, not production password hashing or durable sessions.

## 10. Existing Role and Permission Logic

First-slice permission enforcement exists:

- `src/lib/security/permissions.ts`
- `src/lib/server/classes-service.ts`

Implemented permissions include `class.view_assigned`, `class.manage`, `lesson.create`, `assessment.view`, `assessment.create`, `assessment.mark`, `gradebook.view`, and `ai.use`.
Attendance adds `attendance.record` and `attendance.view_reports`.
Lesson planning adds `lesson.view` and uses `lesson.create`.
Assessment creation and detail use `assessment.view` and `assessment.create`.
Gradebook uses `gradebook.view` and `assessment.mark`.
Reports use `report.prepare` and `report.review`.
Approvals use `approval.view`, `approval.review`, and reviewer-compatible `report.review`.

## 11. Existing State Management

No global client-side state-management library is used. Current data is imported directly into server components or route handlers.

## 12. Existing Form and Validation Patterns

Builder forms in `src/components/workspace/builder-page.tsx` are static uncontrolled inputs. No submit handler, client validation, server validation, field errors, or duplicate-submit protection exists.

## 13. Existing Database Models and Migrations

No database models, migrations, seed files, or schema tooling are present.

## 14. Existing Tests

`npm test` runs `tests/vertical-slice.test.mjs`, which boots Next dev and verifies demo login, active workspace, teacher class filtering, attendance register filtering and save, lesson plan filtering and create, assessment filtering and create, gradebook filtering and score save, report filtering and comment save, approval filtering and reviewer decisions, admin access, `403` for same-tenant unassigned access, and `404` for cross-tenant access.

## 15. Existing Deployment Configuration

No deployment configuration files were found in the repo root.

## 16. Technical Debt Affecting Integration

- UI screens are mock-data driven.
- API responses are not standardized.
- Auth, tenancy, and authorization foundation exists for integrated `/api/v1` demo slices and is demo-backed.
- No form validation standard.
- Loading/error/empty/unauthorized/forbidden states exist in `src/components/states/data-states.tsx`.
- No database model or migration system.
- Node test runner configured for the first integration test.
- Dynamic section route may hide missing feature-specific behavior unless each domain is later split into real use cases.

## 17. Security Concerns

- No production authentication or authorization enforcement.
- Tenant context exists for the first slice through a demo active-workspace cookie.
- No audit logging.
- No CSRF/session strategy.
- Server-side validation exists in the integrated demo slices, but no shared validation library or production persistence validation exists yet.
- No rate limiting.
- No secrets/env strategy.
- Mock-only API routes still expose fixture data without permission checks; integrated `/api/v1` demo routes enforce session, tenant, and membership scope.

## 18. Duplicate or Inconsistent Patterns

The repo itself does not contain multiple dashboard implementation files. The Stitch source project referenced by prior work contains multiple dashboard variants; current implementation treats `Teacher Dashboard - Refined & Connected` as canonical.

## 19. Reusable Components

Reusable candidates:

- `src/components/ui/card.tsx`
- `src/components/ui/badge.tsx`
- `src/components/ui/button.tsx`
- `src/components/ui/icon.tsx`
- `src/components/layout/teacher-sidebar.tsx`
- `src/components/layout/top-bar.tsx`
- `src/components/workspace/workspace-page.tsx`
- `src/components/workspace/builder-page.tsx`

## 20. Components Tightly Coupled to Mock Data

- `src/app/(teacher)/page.tsx` imports `teacherDashboardMock` directly.
- `src/app/ask-pal/page.tsx` imports `askPalMock` directly.
- `src/components/workspace/workspace-page.tsx` renders generic config shapes from `workspace-data.ts`.
- `src/components/workspace/builder-page.tsx` renders generic builder config shapes from `workspace-data.ts`.

## 21. Screens with Partial Backend Integration

Integrated demo route handlers exist for classes, attendance, lesson planning,
assessments, gradebook, reports, and approvals. No screen is integrated with a real
backend or database.

## 22. Missing Infrastructure Required Before Integration

- Authentication and session management.
- Tenant and active workspace context.
- Membership-based authorization.
- Database and migration tooling.
- Seed data strategy.
- Central API client and adapters.
- Standard API error format.
- Validation strategy.
- Test runner and integration test approach.
- Audit logging strategy.
- CI pipeline.
