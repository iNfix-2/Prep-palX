# Identified Risks

- Legacy mock UI/API data may not match eventual backend entities.
- Authentication and tenant isolation exist only for the demo-backed `/api/v1`
  dashboard, Ask Pal, tasks, help/support, settings, classes, attendance, lesson-planner, assessment, question-bank, timetable,
  academic calendar, resources, gradebook, reports, and approvals slices;
  production auth, durable sessions, audit, and database-backed
  tenant checks are still required.
- Dynamic generic screens can hide domain-specific missing behavior.
- Test coverage currently protects demo vertical slices, not production persistence or audit flows.
- No validation library or forms strategy.
- Repository boundaries exist for access/account settings only; most domain services still depend on demo fixtures directly.
- No durable audit logging yet for sensitive school operations, account settings, support requests, assistant proposals, or approval decisions.
- Ask Pal has demo permission/action boundaries, but no production AI provider, moderation, rate limiting, or durable action audit yet.
- No database migration system.
