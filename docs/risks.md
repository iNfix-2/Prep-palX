# Identified Risks

- Mock UI data may not match eventual backend entities.
- Authentication and tenant isolation exist only for the demo-backed `/api/v1`
  classes and attendance slices; production auth, durable sessions, and
  database-backed tenant checks are still required.
- Dynamic generic screens can hide domain-specific missing behavior.
- Test coverage currently protects only the first class vertical slice.
- No validation library or forms strategy.
- No audit logging yet for sensitive school operations.
- AI UI exists before AI permission/action boundaries exist.
- No database migration system.
