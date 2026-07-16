# ADR 0002: Use Membership-Based Permissions

## Status

Accepted.

## Context

Users may belong to multiple schools and can have different roles in each school. A single global role would create tenant leakage and authorization ambiguity.

## Decision

Authorization is based on `Membership` within an active `School` or `Workspace`. Permissions are checked server-side against membership-scoped role assignments.

## Consequences

- API routes must resolve active tenant before resource access.
- UI may hide actions, but backend remains source of truth.
- Tests must include users with memberships in multiple schools.

