# Database and Migrations

Current state: no database, ORM, query builder, schema, or migration tooling exists.

Minimum required before production data integration:

1. Select database.
2. Select ORM/query builder.
3. Add reversible migration workflow.
4. Add local dev database setup.
5. Add seed data for multi-tenant tests.
6. Add migration rollback instructions.

No destructive production data operations are allowed.

