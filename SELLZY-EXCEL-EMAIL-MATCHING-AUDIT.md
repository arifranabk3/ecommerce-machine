# SELLZY — EXCEL EMAIL IMPORT + LEAD GRABBER MATCHING ENGINE AUDIT
**Document Version:** 1.0.0  
**Audit Date:** 2026-11-01  
**Auditor:** Senior SaaS Architect, Full-Stack TypeScript Engineer, Security & QA Lead  
**Repository Path:** `D:\projects\ecommerce-machine`  
**Current Monorepo Status:** Clean Git working tree (`origin/main`), Turbo 2.10.12, Node v24.20.0, npm 10.8.2.

---

## 1. Architectural Baseline & Existing Capabilities

We have audited the existing Sellzy monorepo to determine the optimal architecture for the **Excel/CSV Email Import + Lead Grabber Matching Engine**.

### Existing Modules & Assets to Reuse:
1. **Lead & List Domain Architecture**:
   - `LeadModel` (`apps/api/src/models/Lead.ts`): Stores collected and saved leads with `tenantId`, `storeId`, `companyName`, `website`, `normalizedEmail`, `phone`, `city`, `state`, `country: 'US'`, `industry`, `verificationStatus`, and `listIds`.
   - `LeadListModel` (`apps/api/src/models/LeadList.ts`): Groups leads into named saved lists.
   - `EmailSuppressionModel` (`apps/api/src/models/EmailSuppression.ts`): Houses permanent suppressions (`UNSUBSCRIBE`, `BOUNCE`, `COMPLAINT`, `MANUAL`).
   - `EmailVerificationService` (`apps/api/src/services/EmailVerificationService.ts`): Delivers RFC 5322 syntax validation, disposable domain blocking, and DNS MX checks.
2. **Campaign Sending & Explicit Approval**:
   - `CampaignModel` (`apps/api/src/models/Campaign.ts`) and `CampaignRecipientModel` (`apps/api/src/models/CampaignRecipient.ts`): Manage audience recipients and campaign lifecycles.
   - `LeadController.createCampaignFromLeads`: Creates campaigns strictly in `DRAFT` status and validates CAN-SPAM physical postal address and active suppressions.
   - `LeadController.approveCampaign`: Enforces explicit human approval before any email dispatch.
3. **Multi-Tenant RBAC & Isolation**:
   - All models and queries strictly enforce `tenantId` and `storeId` scoping. Client headers cannot override JWT tenant identity.

---

## 2. Gaps & Missing Capabilities for Excel/CSV Import & Matching

| Capability | Current Repository State | Production Gap / Requirement |
| :--- | :--- | :--- |
| **Excel & CSV Parsing Engine** | Only raw JSON `records` array parsed via `import-csv`. No direct file parser for `.xlsx`, `.xls`, or `.csv`. | Build a secure, zero-dependency streaming CSV and spreadsheet parser with column header detection, row limit controls (e.g. max 5,000 rows), and file size enforcement (max 10MB). |
| **Formula / CSV Injection Defense** | No sanitization on cell contents during import or export. | Cells starting with `=`, `+`, `-`, `@`, `\t`, or `\r` must be escaped with single quotes to prevent spreadsheet formula execution upon export. |
| **Email Normalization Standard** | Basic `.toLowerCase().trim()`. | Implement standardized email normalization preserving mailbox identity without universal dot/plus stripping, but ensuring clean lowercased domain matching. |
| **Lead Grabber Matching Engine** | None. No comparison mechanism between imported files and collected leads. | Implement `LeadMatchingService` generating 8 distinct matching statuses: `exact_match`, `grabbed_only`, `excel_only`, `duplicate_in_file`, `invalid_email`, `verification_pending`, `undeliverable`, and `suppressed`. |
| **Matching Data Models & Persistence** | None. | Create `ImportJobModel` to persist upload metadata, row counts, mapping schema, matching results, and tenant ownership. |
| **Sender Safety Gate & Two-Stage Separation** | Supported on campaigns. | Ensure that uploading an Excel file or running matching **NEVER automatically dispatches an email**. Campaign creation from matched/unmatched subsets must require explicit human review and approval. |
| **Matching Results UI** | Basic marketing tabs. | Build dedicated Excel Import & Matching Workspace inside `apps/web/src/app/marketing/page.tsx` with summary cards, match breakdown badges, column mapping preview, CSV error download, and campaign drafting. |

---

## 3. Strict Matching Status Model

The matching engine will compute and classify each imported record into clear, non-overlapping categories:
1. `exact_match`: Normalized email address exists in both the uploaded Excel file and the saved/grabbed leads collection.
2. `grabbed_only`: Collected/grabbed lead exists in the database but was not present in the uploaded Excel list.
3. `excel_only`: Valid email exists in the uploaded Excel list but has not been collected/grabbed yet.
4. `duplicate_in_file`: Email repeated multiple times within the same uploaded spreadsheet.
5. `invalid_email`: Fails RFC 5322 syntax validation.
6. `verification_pending`: Email format is valid, but deliverability verification has not completed.
7. `undeliverable`: Domain has no MX records or is a disposable temporary provider.
8. `suppressed`: Email is on the tenant or global unsubscribe/suppression list.

---

## 4. Test Baseline & Commands Executed

Existing verified test suites:
- `tests/health.test.ts`: **2 passed**
- `tests/phase12_marketing_communication.test.ts`: **97 passed**
- `tests/phase13_automation_ai.test.ts`: **160 passed**
- `tests/phase15_saas_integrations.test.ts`: **170 passed**
- `tests/lead_collection_verification.test.ts`: **16 passed**
- **Total Existing Passing Tests: 445 tests (0 regressions).**

---

## 5. Phased Implementation Roadmap

1. **Phase 1: Domain Schemas & Parser Engine**
   - Add `ImportJobModel` and TypeScript shared types for mapping schemas and matching statuses.
   - Implement `SpreadsheetParserService` with formula injection prevention and delimiter auto-detection.
2. **Phase 2: Lead Grabber Matching Engine**
   - Implement `LeadMatchingService` comparing imported rows against `LeadModel` and `EmailSuppressionModel`.
3. **Phase 3: Controller & API Endpoints**
   - Add endpoints: `/api/v1/leads/imports/upload`, `/preview`, `/match`, and `/export-matching-report`.
4. **Phase 4: Campaign Composer Integration & Approval Gate**
   - Allow drafting campaigns from filtered match groups (`exact_match`, `grabbed_only`, or `excel_only`) with mandatory pre-send suppression check and explicit admin approval.
5. **Phase 5: Frontend Matching UI**
   - Add Excel Import & Lead Matching wizard to `apps/web/src/app/marketing`.
6. **Phase 6: Comprehensive Unit & Integration Tests**
   - Write `apps/api/tests/excel_email_matching.test.ts` testing file parsing, formula defense, deduplication, matching classifications, tenant isolation, and zero-send guarantees.

