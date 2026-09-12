---
name: supabase
description: >-
  Architecture, security, and integration workflows for Supabase (PostgreSQL, Auth, RLS, Storage, Realtime, Edge Functions).
  Use this skill whenever configuring or querying Supabase, writing Row Level Security (RLS) policies,
  managing server/browser auth clients, handling JWT tokens, or setting up database schemas in Supabase.
---

# Supabase Mastery & Architecture Skill

Guidance for building production-ready, secure, and performant backends on Supabase.

## 1. Client Segregation & Security
- **Browser Client (`createBrowserClient`)**:
  - Uses public anonymous key (`NEXT_PUBLIC_SUPABASE_ANON_KEY`).
  - Subject to strict Row Level Security (RLS) rules based on `auth.uid()`.
- **Server Client (`createServerClient`)**:
  - Uses SSR cookie-based session management (`@supabase/ssr`).
  - Required for Server Actions, Route Handlers, and Server Components.
- **Admin Client (`createClient` with `SUPABASE_SERVICE_ROLE_KEY`)**:
  - NEVER expose in browser code or client bundles.
  - Bypasses RLS. Use strictly for backend operations like tenant provisioning, system audits, or background webhooks.

## 2. Row Level Security (RLS) Standard
Every single table must have RLS enabled:
```sql
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE trainings ENABLE ROW LEVEL SECURITY;
```

Tenant Isolation Pattern:
```sql
CREATE POLICY "tenant_isolation_select" ON reports
  FOR SELECT
  USING (company_id = (SELECT company_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "tenant_isolation_insert" ON reports
  FOR INSERT
  WITH CHECK (company_id = (SELECT company_id FROM profiles WHERE id = auth.uid()));
```

## 3. Whistleblower & Anonymous Ingestion
- For public reporting endpoints (`/canal/[slug]`), allow unauthenticated insert with strict payload validation:
```sql
CREATE POLICY "allow_public_report_submission" ON reports
  FOR INSERT
  TO anon
  WITH CHECK (true);
```
- Restrict read access solely to the owning tenant's authenticated compliance officers, or by protocol hash + access key.
