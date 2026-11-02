# Sellzy — Country-Based Email Grabber & Email Sender Audit

**Document Version:** 1.0.0  
**Repository:** `D:\projects\ecommerce-machine`  
**Date:** 2026-11-01  
**Author:** Lead Architecture & Engineering Review  

---

## 1. Executive Summary

This audit assesses the existing state of Email Grabber, Email Sender, Lead Generation, Lead Lists, Email Verification, CSV Export/Import, background workers, and multi-tenant security within the Sellzy SaaS monorepo.

The goal is to transition the current US-centric directory collection into a **robust, multi-country collection engine with real background processing, live job telemetry, shared lead lists, and canonical CSV exports**—shared symmetrically between **Email Grabber** and **Email Sender**.

---

## 2. Current Architecture & Implementation Baseline

### 2.1 Backend Models (`apps/api/src/models`)
- `Lead.ts`:
  - Contains `tenantId`, `storeId`, `companyName`, `website`, `email`, `normalizedEmail`, `phone`, `city`, `state`, `country` (defaults to 'US'), `industry`, `source`, `sourceUrl`, `collectedAt`, `verificationStatus`, `verificationDetails`, `listIds`.
  - Compound unique index: `{ tenantId: 1, normalizedEmail: 1 }` prevents duplicate emails per tenant.
  - Country field currently defaults to `'US'`; needs to accept any ISO-2 country code (`US`, `GB`, `CA`, `AU`, `DE`, `FR`, `IN`, `AE`, etc.).
- `LeadList.ts`:
  - Contains `tenantId`, `storeId`, `name`, `description`, `leadCount`, `tags`.
  - Compound unique index `{ tenantId: 1, name: 1 }`. Reusable across Grabber and Sender.
- `EmailSuppression.ts`:
  - Contains `tenantId`, `email`, `normalizedEmail`, `reason`, `source`, `suppressedAt`.
- `ImportJob.ts`:
  - Used for tracking spreadsheet matching jobs.
- **Gap:** Missing an explicit `CollectionJob.ts` model to track asynchronous multi-country collection runs with statuses (`QUEUED`, `RUNNING`, `COMPLETED`, `COMPLETED_WITH_WARNINGS`, `FAILED`, `CANCELLED`), progress percentage, filter metadata, and error details.

### 2.2 Backend Services (`apps/api/src/services`)
- `LeadDiscoveryService.ts`:
  - Currently contains static curated records in `VERIFIED_US_PUBLIC_DIRECTORY` filtered by state/city/industry.
  - Lacks multi-country support, provider adapter architecture, rate limiting, and unsupported country fallback erroring.
- `LeadService.ts`:
  - Orchestrates collection, deduplication, suppression checking, and persistence.
  - Already contains methods: `collectAndSaveLeads`, `getLeads`, `createList`, `getLists`, `updateList`, `manageListMembers`, `deleteList`, `grabEmailsFromDomains`, `verifyBatchLeads`, `suppressEmail`.
- `SpreadsheetParserService.ts`:
  - Formula injection defense (`=`, `+`, `-`, `@`, `\t`, `\r` escaped with single quote).
  - Validates the 11-column canonical schema:
    1. `Email`
    2. `First Name`
    3. `Last Name`
    4. `Company`
    5. `Website`
    6. `Industry`
    7. `Country`
    8. `State`
    9. `City`
    10. `Source URL`
    11. `Verification Status`
- `EmailVerificationService.ts`:
  - Layered RFC 5322 syntax validation, disposable domain checks, and DNS MX resolution with timeout guards.

### 2.3 Background Queue & Worker (`apps/worker/src/index.ts`)
- Uses BullMQ and ioredis on Redis URI `env.REDIS_URI`.
- Currently listens to `system-events` queue with a basic switch statement.
- **Gap:** Needs a dedicated `lead-collection` queue/job processor with progress reporting, cancellation tokens, and idempotent execution. For systems running without a separate worker process or during local execution, the API must support immediate background execution with identical job tracking.

### 2.4 Frontend Workspaces (`apps/web/src/app`)
- `/marketing/leads/grabber/page.tsx`:
  - Domain-based email extraction. Missing country selection, live job queue telemetry, and filterable multi-country directories.
- `/marketing/leads/finder/page.tsx`:
  - Hardcoded to US States (`US_STATES` dropdown).
- `/campaigns/page.tsx` (Email Sender):
  - Campaign creation and broadcast list management, but lacks the country-based recipient list builder workflow using the shared collection engine.

---

## 3. Provider Adapter Architecture Design

To support country-specific business data discovery legally and reliably:

```
                  ┌─────────────────────────────────────────┐
                  │          CollectionJobController        │
                  └────────────────────┬────────────────────┘
                                       │
                  ┌────────────────────▼────────────────────┐
                  │          CountryLeadService             │
                  └────────────────────┬────────────────────┘
                                       │
                  ┌────────────────────▼────────────────────┐
                  │       DataProviderRegistry              │
                  ├─────────────────────────────────────────┤
                  │ - USDirectoryProvider (US)              │
                  │ - UKCompaniesHouseProvider (GB / UK)    │
                  │ - CanadaEnterpriseProvider (CA)         │
                  │ - GlobalRegistryProvider (AU, DE, FR)   │
                  └─────────────────────────────────────────┘
```

If a user selects an unsupported country (e.g. `XX`), the engine must not fabricate fake results; it must return:
`"No configured data provider supports this country."` with job status `FAILED`.

---

## 4. Zero-Regression Guarantees
1. No existing leads or collections will be deleted or altered.
2. The 11-column canonical CSV export specification remains unchanged.
3. Two-Stage Separation: Zero automatic emails on collection or CSV download.
4. Tenant and store isolation enforced on every query and mutation.

