---
name: webapp-testing
description: >-
  Expert guidelines, workflows, and best practices for testing web applications (Next.js, React, Node.js).
  Use this skill whenever writing, debugging, or running unit tests, integration tests, E2E tests (Playwright, Cypress, Vitest, Jest),
  API route validations, or automated regression tests.
---

# Web App Testing Skill

Comprehensive framework and runbook for testing web applications, focusing on reliability, speed, and defense against regressions.

## 1. Testing Pyramid & Strategy

### A. Unit Tests (Vitest / Jest)
- **Target**: Pure utilities, data transformations, input validators (e.g. CNPJ masks, checksums, hash generators).
- **Guidelines**: Fast, isolated, deterministic, no network or real DB access.

### B. Route & Server Actions Integration Tests
- **Target**: Next.js Server Actions, API routes (`/api/*`), middleware auth verification.
- **Verification**:
  - Test valid payload -> Expect 200/201 or `{ success: true }`.
  - Test invalid input schema -> Expect 400 Bad Request / Validation error.
  - Test missing session/cookie -> Expect 401 Unauthorized or redirect to `/login`.
  - Test cross-tenant access -> Expect 403 Forbidden.

### C. End-to-End (E2E) Tests (Playwright)
- **Target**: Critical user flows:
  - Enterprise onboarding & CNPJ lookup.
  - Multi-tenant dashboard access and navigation.
  - Whistleblower channel submission and protocol lookup.
  - Quiz and microtraining completion.
- **Execution**: Run headless against staging or local preview servers (`npm run build && npm start`).

## 2. Test Execution & Automation Checklist

1. **Static Analysis & Type Checking**:
   ```bash
   npm run build # or npx tsc --noEmit
   ```
2. **Execution of Automated Scripts**:
   - Run integration scripts in `scratch/` or `test/` directory.
   - Assert HTTP response codes, headers (CSP, HSTS, X-Frame-Options), and payload schemas.
3. **Flakiness Prevention**:
   - Never rely on arbitrary timeouts (`sleep(5000)`). Use explicit condition waiters or reactive event listening.
   - Mock third-party external APIs (e.g. Receita Federal, BrasilAPI, Stripe) with deterministic fixtures.
