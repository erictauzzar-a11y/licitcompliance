---
name: postgres-best-practices
description: >-
  Industry standards and performance optimizations for PostgreSQL database modeling, schema design, queries, and migrations.
  Use this skill whenever creating or altering database tables, designing indexes (B-Tree, GIN, BRIN),
  writing complex SQL/PLpgSQL queries, optimizing joins, avoiding locks, or enforcing constraints.
---

# PostgreSQL Best Practices Skill

Core standards for robust, scalable, and secure relational database engineering on PostgreSQL.

## 1. Schema & Data Types
- **Primary Keys**: Prefer `UUIDv7` or `UUID` (`gen_random_uuid()`) for distributed systems and multi-tenant security (avoids enumeration attacks inherent to sequential integers).
- **Timestamps**: Always use `TIMESTAMPTZ` (`TIMESTAMP WITH TIME ZONE`), never timezone-naive `TIMESTAMP`. Default to `now()`.
- **Text & Strings**: Use `TEXT` or `VARCHAR(n)`. Store normalized strings (lowercase emails, cleaned digits for CNPJ/CPF).
- **JSON / Unstructured**: Use `JSONB` for searchable or semi-structured data, and index with GIN when querying nested keys.

## 2. Indexing Strategy
- **Foreign Keys**: Always create an index on foreign key columns (`company_id`, `user_id`) to prevent table-level locks and slow JOINs.
- **Lookup Indexes**: Create unique composite indexes for tenant uniqueness:
  ```sql
  CREATE UNIQUE INDEX idx_companies_cnpj ON companies (cnpj);
  CREATE INDEX idx_reports_company_created ON reports (company_id, created_at DESC);
  ```
- **Partial Indexes**: Use partial indexes for filtered queries (e.g. active records):
  ```sql
  CREATE INDEX idx_active_trainings ON trainings (company_id) WHERE status = 'completed';
  ```

## 3. Query Performance & Concurrency
- **Avoid `SELECT *`**: Fetch only necessary columns to reduce memory overhead and wire transmission.
- **Transactions & Locks**: Keep transactions short. Avoid long-running network calls inside open SQL transactions.
- **Connection Pooling**: Use transaction-mode connection pooling (PgBouncer / Supabase Pooler port 6543) for serverless environments.
