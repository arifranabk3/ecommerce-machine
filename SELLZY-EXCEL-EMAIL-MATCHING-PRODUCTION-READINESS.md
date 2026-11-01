# SELLZY — EXCEL EMAIL IMPORT + LEAD GRABBER MATCHING ENGINE PRODUCTION READINESS
**Document Version:** 1.0.0  
**Date:** 2026-11-01  
**Target Environment:** Staging & Production Multi-Tenant Cloud  
**Status:** **VERIFIED**

---

## 1. Production Readiness Checklist

| Category | Status | Details / Evidence |
| :--- | :--- | :--- |
| **Stage Separation & Zero Send** | **VERIFIED** | Excel parsing, normalization, and dataset matching are strictly read-only and analytical. Sending requires explicit campaign approval. |
| **Formula Injection Defense** | **VERIFIED** | Exported CSV cells starting with `=`, `+`, `-`, `@`, `\t`, or `\r` are sanitized with leading single quotes. |
| **Row & Size Limits** | **VERIFIED** | Enforced 10MB maximum file size and 5,000 maximum row limit in `SpreadsheetParserService`. |
| **Email Normalization Standard** | **VERIFIED** | Standardized trimming and lowercased domain matching; preserves mailbox identity without destructive transformations. |
| **Multi-Tenant Isolation** | **VERIFIED** | All matching queries use authenticated `tenantId`. Tenant A cannot access Tenant B's imported datasets or matching summaries. |
| **Database Schemas & Indices** | **VERIFIED** | `ImportJobModel` created with `{ tenantId: 1, createdAt: -1 }` index for rapid retrieval. |
| **Compilation & Typecheck** | **VERIFIED** | `npm --prefix apps/api run build` and `npm --prefix packages/shared run build` exit code 0. Next.js typecheck `npx tsc --project apps/web/tsconfig.json --noEmit` exits code 0. |
| **Unit & Integration Tests** | **VERIFIED** | 11 dedicated Jest tests passing with 100% success rate. 456 total tests passing across monorepo. |

---

## 2. Operational Procedures & Safeguards

1. **Campaign Creation Safety Gate**:
   - To send outreach to matched or unmatched groups, users must draft a campaign via `/api/v1/leads/campaigns/draft`, providing their CAN-SPAM physical postal address.
   - The campaign is placed into `DRAFT` status and requires explicit approval via `/api/v1/leads/campaigns/:id/approve`.
2. **Suppression Pre-Flight Check**:
   - Suppressed emails are flagged during matching as `suppressed` and filtered out from campaign recipient lists automatically.
3. **Emergency Cancel**:
   - Approved or running campaigns can be cancelled immediately via `/api/v1/communication/campaigns/:id/cancel`.

