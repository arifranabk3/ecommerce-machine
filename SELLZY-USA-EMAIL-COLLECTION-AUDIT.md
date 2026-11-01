# SELLZY — USA BUSINESS EMAIL COLLECTION, VERIFICATION & SAVED LEAD LISTS AUDIT
**Document Version:** 1.0.0  
**Audit Date:** 2026-11-01  
**Auditor:** Senior SaaS Architect, Full-Stack TypeScript Engineer, Security & Compliance Lead  
**Repository Path:** `D:\projects\ecommerce-machine`  
**Monorepo Health:** Clean Git tree on `main`, Turbo 2.10.12, Node.js v24.20.0, npm 10.8.2.

---

## 1. Architectural Baseline & Existing Capabilities to Reuse

We have inspected the existing Sellzy monorepo structure across `apps/api`, `apps/worker`, `apps/web`, and shared packages (`@sellzy/shared`, `@sellzy/validation`, `@sellzy/config`).

### Existing Architectural Assets:
1. **Multi-Tenant & Store Isolation Infrastructure**:
   - Authentication middleware (`apps/api/src/middleware/auth.ts`) enforces JWT validation, extracts authenticated `req.user.tenantId`, and verifies `x-store-id` headers.
   - RBAC service (`RbacService`) performs server-side permission checks. Client headers cannot override authenticated ownership.
2. **Campaign & Marketing Communications**:
   - `CampaignModel` (`apps/api/src/models/Campaign.ts`) and `CampaignRecipientModel` handle campaigns and audience recipients with statuses: `DRAFT`, `SCHEDULED`, `RUNNING`, `COMPLETED`, `PAUSED`, `CANCELLED`.
   - `CampaignService` (`apps/api/src/services/campaign.service.ts`) executes campaign dispatching, audience filtering, and scheduling.
   - `CommunicationPreferenceModel` and `ConsentService` handle opt-in/opt-out status.
3. **Approval Engine**:
   - `ApprovalEngine` (`apps/api/src/services/ApprovalEngine.ts`) and `ApprovalRequestModel` provide human-in-the-loop review mechanisms.
4. **Queue Worker Infrastructure**:
   - `apps/worker/src/index.ts` uses BullMQ with ioredis and pino logger with automatic secret redaction.

---

## 2. Gap Analysis for Lead Collection, Verification & Saved Lists

| Component | Existing State | Required Production Implementation |
| :--- | :--- | :--- |
| **Lead Model & Schema** | Only `CustomerModel` (B2C consumers) exists. | Need `LeadModel` (`apps/api/src/models/Lead.ts`) with tenantId, storeId, companyName, website, normalized email, phone, city, state, country (`US`), industry, source, verificationStatus, and listIds. |
| **Saved Lead Lists** | None. Customer segments exist, but no static saved lists for B2B leads. | Need `LeadListModel` (`apps/api/src/models/LeadList.ts`) for named saved lists, tag metadata, lead counts, and export/import tracking. |
| **Email Verification Statuses** | None. Only basic email format validation in `@sellzy/validation`. | Need granular verification enum: `unverified`, `syntax_valid`, `domain_valid`, `verification_pending`, `deliverable`, `undeliverable`, `risky_or_unknown`, `suppressed`. |
| **Email Verification Engine** | None. | Need `EmailVerificationService` providing RFC-compliant syntax checking, DNS MX lookup validation, disposable provider detection, and verification adapter interface. |
| **Suppression Management** | `CommunicationPreferenceModel` is scoped to consumer `customerId`. | Need `EmailSuppressionModel` (`apps/api/src/models/EmailSuppression.ts`) to enforce tenant-wide and global suppression of unsubscribed, bounced, or do-not-contact emails. |
| **Lead Collection Provider** | None. | Need `LeadDiscoveryService` querying public, authorized US business directories and business registries. Strictly separate collection from sending. |
| **Campaign Integration & Safety Gate** | Campaigns currently pull from B2C `CustomerModel`. | Support creating campaigns from a `LeadListId` with explicit approval workflow and mandatory pre-send suppression checks. |
| **UI Integration** | `apps/web/src/app/marketing` has basic campaign views. | Add dedicated Lead Collection & Saved Lists tab in Marketing UI, with verification status pills, search/filter, CSV export, and "Create Campaign Draft" flow. |

---

## 3. Strict Two-Stage Separation & Safety Rules

1. **Stage 1: Collect, Validate, Deduplicate & Save**:
   - Collecting leads **NEVER triggers email transmission**.
   - Validating emails **NEVER triggers email transmission**.
   - Leads are saved into tenant-isolated lists with full source attribution.
2. **Stage 2: Manual Review & Explicit Approval Before Live Campaign**:
   - Users select saved leads to create a campaign in `DRAFT` status.
   - Campaign requires explicit human review and approval (`READY_FOR_REVIEW` -> `APPROVED`).
   - Immediately prior to sending each message, the system re-verifies suppression status, verification status, and opt-out history.

---

## 4. Test Baseline & Commands

The existing test suites confirm a clean, passing platform baseline:
- `tests/health.test.ts`: **2 passed**
- `tests/phase12_marketing_communication.test.ts`: **97 passed**
- `tests/phase13_automation_ai.test.ts`: **160 passed**
- `tests/phase15_saas_integrations.test.ts`: **170 passed**
- Total passing baseline tests: **429 passed**.

---

## 5. Phased Implementation Plan

1. **Phase 1: Domain Models & Schemas**
   - Implement `LeadModel`, `LeadListModel`, and `EmailSuppressionModel` with compound unique indices for deduplication and tenant isolation.
2. **Phase 2: Lead Collection & Discovery Engine**
   - Implement `LeadDiscoveryService` with US geographic (state/city) and industry filters, public source attribution, and rate-limiting.
3. **Phase 3: Email Verification Engine**
   - Implement `EmailVerificationService` with 8 distinct statuses, RFC syntax validation, DNS MX domain check, disposable detection, and deliverability simulation/adapter.
4. **Phase 4: Saved Lists Management & CSV Import/Export**
   - Implement REST endpoints for list CRUD, lead association, filtering, search, pagination, bulk CSV import, and secure CSV export.
5. **Phase 5: Campaign Creation & Explicit Approval Gate**
   - Connect saved lists to campaign drafting with mandatory human approval before live sending and pre-send suppression enforcement.
6. **Phase 6: Frontend Marketing UI Integration**
   - Add Lead Collection & Saved Lists interface to `apps/web/src/app/marketing`.
7. **Phase 7: Test Suite & Reports**
   - Build comprehensive unit and integration tests verifying isolation, duplicate prevention, verification transitions, suppression enforcement, and zero-send guarantees during collection.

