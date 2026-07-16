# Identified Risks

- Mock UI data may not match eventual backend entities.
- Authentication and tenant isolation exist only for the demo-backed `/api/v1`
  classes, attendance, lesson-planner, assessment, gradebook, reports, and
  approvals slices; production auth, durable sessions, audit, and database-backed
  tenant checks are still required.
- Dynamic generic screens can hide domain-specific missing behavior.
- Test coverage currently protects demo vertical slices, not production persistence or audit flows.
- No validation library or forms strategy.
- No durable audit logging yet for sensitive school operations or approval decisions.
- AI UI exists before AI permission/action boundaries exist.
- No database migration system.
