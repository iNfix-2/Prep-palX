# Testing Strategy

The repo now uses Node's built-in test runner for the first vertical-slice integration test:

```bash
npm test
```

Current test file:

- `tests/vertical-slice.test.mjs`

## Unit Tests

Cover:

- Permission utilities.
- Tenant scoping helpers.
- API DTO to UI adapters.
- Validation logic.
- Domain status transitions.

## Backend Integration Tests

Implemented coverage:

- Unauthenticated `/api/v1/teacher/classes` returns `401`.
- Demo teacher login sets session/workspace cookies.
- `/api/v1/me` returns active user and workspace.
- Teacher sees only assigned classes in the active tenant.
- Same-tenant unassigned class access returns `403`.
- Cross-tenant class access returns `404`.
- Admin membership can view all classes in the active tenant.

Cover:

- Authentication and session resolution.
- Tenant isolation.
- Role enforcement.
- API validation and error format.
- Not-found and conflict behavior.
- Duplicate requests and idempotency.

## Frontend Tests

Cover:

- Loading, empty, error, unauthorized, forbidden states.
- Permission-based rendering.
- Form validation.
- API error mapping.
- Responsive critical flows.

## End-to-End Tests

Initial critical path is partially covered by the integration test:

1. Login.
2. Workspace selection.
3. My Classes.
4. Class Overview.

Future paths:

- Daily attendance.
- Grade entry.
- Report review and publication.

## Security Tests

Must verify:

- Cross-tenant access attempts.
- Horizontal privilege escalation.
- Vertical privilege escalation.
- IDOR attempts through URL changes.
- Missing authorization checks.
- Revoked/expired sessions.
- Sensitive data exposure.

## Seed Data Requirements

Use realistic seed data:

- Multiple schools.
- Users with memberships in different schools.
- Teachers assigned to different classes.
- Empty and large classes.
- Learners with long names.
- Archived records.
- Unauthorized users.
