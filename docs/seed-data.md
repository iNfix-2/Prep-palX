# Seed Data Instructions

Seed tooling does not exist yet. The first vertical slice uses deterministic in-memory
fixtures in `src/lib/server/demo-store.ts`.

## Current Demo Accounts

- Teacher: `mrs.adeyemi@truth.test` / `password`
- Admin: `admin@truth.test` / `password`
- Cross-tenant teacher fixture: `river.teacher@truth.test` / `password`

## Current Demo Fixtures

- `school-truth`: active workspace for the teacher and admin accounts.
- `school-river`: separate tenant used to verify tenant isolation.
- `class-p4-math` and `class-p3-english`: assigned to the demo teacher.
- `class-p5-science`: same tenant, not assigned to the demo teacher; visible to admin.
- `class-river-history`: different tenant; must return `404` from the Truth workspace.
- Attendance records for `2026-07-16` cover marked, partial, same-tenant
  unassigned, and cross-tenant register scenarios.
- Lesson plans cover assigned teacher drafts, in-review plans, same-tenant admin
  plans, and a cross-tenant plan.
- Assessments cover assigned teacher drafts, in-review work, same-tenant admin
  assessment content, and a cross-tenant assessment.
- Questions cover assigned teacher reusable items, in-review items, same-tenant
  admin-owned question content, and a cross-tenant question fixture.
- Gradebook scores cover partial assigned sheets, same-tenant admin sheets, missing
  scores, and a cross-tenant score fixture.
- Report comments cover ready and draft learner comments for assigned classes,
  a same-tenant admin class, and a cross-tenant fixture.
- Approval requests cover pending, changes-requested, and approved workflow states
  for lesson plans, assessments, reports, same-tenant admin-owned items, and a
  cross-tenant fixture.

Required seed scenarios:

- School A and School B.
- Teacher assigned to School A classes only.
- School admin with broad School A permissions.
- User with memberships in two schools.
- Empty class.
- Large class.
- Learners with long names and missing optional fields.
- Archived classes and learners.
- Unauthorized user with no active membership.
