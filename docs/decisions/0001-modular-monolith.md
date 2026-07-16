# ADR 0001: Start as a Modular Monolith

## Status

Accepted.

## Context

The repository currently contains a Next.js front end with mock route handlers and no separate backend application. The product domains are highly connected through schools, memberships, classes, learners, assessments, attendance, reports, approvals, and audit logs.

## Decision

Use a modular monolith architecture inside the Next.js application until repository evidence or scale requirements justify a separate service boundary.

## Consequences

- Domain services should live behind clear module boundaries.
- Route handlers stay thin and call services.
- Database transactions can cover multi-domain operations.
- Future extraction remains possible if modules avoid direct cross-domain data access.

