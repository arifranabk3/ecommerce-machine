# SELLZY — USA BUSINESS EMAIL COLLECTION & SAVED LISTS IMPLEMENTATION REPORT
**Implementation Version:** 1.0.0  
**Date:** 2026-11-01  
**Architecture:** Multi-Tenant TypeScript Monorepo (Next.js 14, Express API, BullMQ, Mongoose)  
**Status:** **VERIFIED**

---

## 1. Executive Summary

We have designed, engineered, and verified the **USA Business Email Collection, Verification and Saved Lead Lists** module inside the Sellzy platform (`D:\projects\ecommerce-machine`).

The implementation strictly satisfies the fundamental business rule:
> **The workflow has two strictly separate stages:**
> 1. Collect, validate, deduplicate, and save publicly listed US business contact emails.
> 2. Allow the user to review the saved list and send emails later through a separately approved campaign.
> **Collecting leads NEVER automatically sends an email.**

---

## 2. Changed & Created Files Inventory

### Packages & Domain Types
- `packages/shared/src/index.ts`:
  - Added `LeadVerificationStatus` (`unverified`, `syntax_valid`, `domain_valid`, `verification_pending`, `deliverable`, `undeliverable`, `risky_or_unknown`, `suppressed`).
  - Added `LeadSourceType` (`DIRECTORY_SEARCH`, `PUBLIC_REGISTRY`, `CSV_IMPORT`, `MANUAL`).
  - Added `ILead`, `ILeadList`, and `IEmailSuppression` interface definitions.

### Database Models (`apps/api/src/models`)
- `apps/api/src/models/Lead.ts`:
  - Mongoose schema with `tenantId`, `storeId`, `companyName`, `normalizedEmail`, `phone`, `city`, `state`, `country: 'US'`, `industry`, `source`, `sourceUrl`, `verificationStatus`, and `listIds`.
  - Compound Unique Index: `{ tenantId: 1, normalizedEmail: 1 }` preventing cross-lead duplicates within a tenant.
- `apps/api/src/models/LeadList.ts`:
  - Mongoose schema for organizing leads into named saved lists, tracking `leadCount`, and compound unique index `{ tenantId: 1, name: 1 }`.
- `apps/api/src/models/EmailSuppression.ts`:
  - Mongoose schema for persistent suppression (`UNSUBSCRIBE`, `BOUNCE`, `COMPLAINT`, `MANUAL`), indexed on `{ tenantId: 1, normalizedEmail: 1 }`.

### Services & Business Logic (`apps/api/src/services`)
- `apps/api/src/services/EmailVerificationService.ts`:
  - RFC 5322 syntax validation.
  - Disposable email domain blacklist detection (e.g. Mailinator, Guerrillamail).
  - Role-based account detection (`info@`, `sales@`, `partnerships@`).
  - Real DNS MX record resolution with timeout handling.
- `apps/api/src/services/LeadDiscoveryService.ts`:
  - Authoritative US public business directory search engine.
  - Filters by US state (e.g., IL, TX, NY, CA), city, industry, and business keywords.
  - Strict compliance: only public, source-attributed role contacts; zero scraping, zero guessed emails.
- `apps/api/src/services/LeadService.ts`:
  - Atomic collection, validation, deduplication, suppression checking, and persistence.
  - Saved list CRUD and lead association.
  - CSV bulk import and export.
  - Permanent email suppression enforcement.

### Controllers & Routes (`apps/api/src/controllers` & `apps/api/src/routes`)
- `apps/api/src/controllers/lead.controller.ts`:
  - `collectLeads`: Stage 1 execution (returns discovered, saved, duplicate, and suppressed counts; zero sends).
  - `getLeads` & `exportLeadsCsv`: Paginated search/filter and secure CSV export.
  - `importLeadsCsv`: Bulk import with validation and deduplication.
  - `createList`, `getLists`, `deleteList`: Saved list management.
  - `createCampaignFromLeads`: Stage 2 campaign creation (creates campaign in `DRAFT` status, mandates CAN-SPAM physical postal address, excludes suppressed leads).
  - `approveCampaign`: Explicit approval gate transitioning campaign from `DRAFT` to `APPROVED`.
  - `addSuppression`: Dedicated suppression addition.
- `apps/api/src/routes/lead.routes.ts`:
  - Protected API routes mounted under `/api/v1/leads` requiring `authenticateToken` and RBAC permissions.
- `apps/api/src/app.ts`:
  - Mounted `/api/v1/leads` route.

### Frontend Integration (`apps/web/src/app/marketing`)
- `apps/web/src/app/marketing/page.tsx`:
  - Tabbed interface switching between Active Campaigns and USA Business Leads & Lists.
  - Lead collection modal with state, industry, and keyword filters.
  - Live table rendering saved leads, deliverability badges, and clickable source URLs.
  - Export CSV button calling real export endpoint.
  - Create Campaign Draft modal enforcing CAN-SPAM physical address and explicit approval step.

---

## 3. Endpoints & REST Interface Summary

| Method | Endpoint | RBAC Permission | Purpose | Stage |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/leads/collect` | `customers.view` | Collects, verifies, and saves US leads (ZERO emails sent) | **Stage 1** |
| `GET` | `/api/v1/leads` | `customers.view` | Paginated search, filter by state, status, industry | **Stage 1** |
| `GET` | `/api/v1/leads/export-csv` | `customers.view` | Exports leads to RFC-compliant CSV | **Stage 1** |
| `POST` | `/api/v1/leads/import-csv` | `customers.create` | Imports CSV records with deduplication | **Stage 1** |
| `POST` | `/api/v1/leads/lists` | `customers.create` | Creates a new named saved lead list | **Stage 1** |
| `GET` | `/api/v1/leads/lists` | `customers.view` | Fetches saved lead lists for tenant | **Stage 1** |
| `DELETE` | `/api/v1/leads/lists/:id` | `customers.create` | Deletes a saved lead list | **Stage 1** |
| `POST` | `/api/v1/leads/suppress` | `customers.consent` | Adds email to persistent suppression list | **Compliance** |
| `POST` | `/api/v1/leads/campaigns/draft` | `messages.send` | Creates campaign draft from selected leads (CAN-SPAM verified) | **Stage 2** |
| `POST` | `/api/v1/leads/campaigns/:id/approve` | `messages.send` | Explicit human approval transitioning draft to approved | **Stage 2** |

