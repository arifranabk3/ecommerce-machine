# SELLZY — MARKETING & LEAD GENERATION REGRESSION BASELINE
**Document Version:** 1.0.0  
**Audit Date:** 2026-11-01  
**Runner:** Turborepo 2.10.12, Node.js v24.20.0, Jest 29  
**Monorepo Health Status:** **BASELINE RECORDED**

---

## 1. Typecheck Baseline Execution

```bash
npm run typecheck
```
- **Exit Code:** `0` (Success)
- **Packages Checked:** 9 of 9 packages (`@sellzy/shared`, `@sellzy/config`, `@sellzy/validation`, `@sellzy/api`, `@sellzy/web`, `@sellzy/worker`, `@sellzy/admin`, `@sellzy/public`, `@sellzy/storefront`)
- **Status:** **PASS** (Zero TypeScript compiler errors across all packages).

---

## 2. Lint Baseline Execution

```bash
npm run lint
```
- **Exit Code:** `1` (Pre-existing HTML entity warnings/errors in legacy web files)
- **Recorded Issues in Baseline:**
  - `apps/web/src/app/marketing/page.tsx`: unescaped quote characters (`react/no-unescaped-entities`) at lines 372 and 519.
  - `apps/web/src/app/onboarding/page.tsx`, `products/page.tsx`, `settings/security/page.tsx`, `themes/page.tsx`: Next.js `@next/next/no-img-element` recommendations to use `<Image />`.
  - `apps/web/src/app/settings/theme/page.tsx`: exhaustive-deps recommendation on `configs` in `useEffect`.
- **Audit Policy Enforcement:** Per Non-Negotiable Rule #11, unrelated lint issues were recorded and **NOT modified** during this audit phase.

---

## 3. Automated Test Suite Baseline

All existing backend and domain test suites were executed and verified passing:

| Test Suite File | Suite Description | Tests Passed | Tests Failed | Total Tests |
| :--- | :--- | :---: | :---: | :---: |
| `tests/health.test.ts` | API Health & Base Security Verification | 2 | 0 | 2 |
| `tests/phase12_marketing_communication.test.ts`| Communication, Consent & HMAC Verification | 97 | 0 | 97 |
| `tests/phase13_automation_ai.test.ts` | Automation Engine, RulesEngine, AI Tools | 160 | 0 | 160 |
| `tests/phase15_saas_integrations.test.ts` | Multi-Tenant Isolation, RBAC & SaaS Controls | 170 | 0 | 170 |
| `tests/lead_collection_verification.test.ts` | USA Lead Collection, Verification & Saved Lists | 16 | 0 | 16 |
| `tests/excel_email_matching.test.ts` | Excel Import, Normalization & Matching Engine | 11 | 0 | 11 |
| `tests/schema_compatibility_roundtrip.test.ts` | Canonical Schema Grabber & Sender Round-Trip | 7 | 0 | 7 |
| **TOTAL VERIFIED BASELINE** | | **463** | **0** | **463** |

---

## 4. Build Baseline Status

- **`packages/shared` Build:** `tsc` completed with code `0`.
- **`apps/api` Build:** `tsc` completed with code `0`.
- **`apps/web` Typecheck:** `npx tsc --project apps/web/tsconfig.json --noEmit` completed with code `0`.
- **Runtime Dev Servers:** Both API (`http://localhost:4000`) and Next.js Web (`http://localhost:3000`) verified operational.

