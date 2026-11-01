# Sellzy — Country-Based Email Grabber & Email Sender Implementation

**Status:** IMPLEMENTED & VERIFIED  
**Repository:** `D:\projects\ecommerce-machine`  
**Date:** 2026-11-01  

---

## 1. Unified Country Engine Architecture

Rather than maintaining separate collection pipelines, **Email Grabber** and **Email Sender** now share a single unified background collection engine:

1. **`DataProviderRegistry` (`apps/api/src/services/CountryDataProvider.ts`):**
   - Pluggable provider adapter registry.
   - Initialized providers:
     - `USDirectoryProvider` (United States — State registries & chambers)
     - `UKCompaniesHouseProvider` (United Kingdom — Companies House & Trade Registry)
     - `CanadaCorporationsProvider` (Canada — Corporations Canada Registry)
     - `AustraliaBusinessRegistryProvider` (Australia — ABR & ASIC)
     - `GermanyHandelsregisterProvider` (Germany — Handelsregister Portal)
   - Real error reporting: If an unsupported country (e.g. `FR`, `IN`) is requested, the engine returns `No configured data provider supports this country` with job status `FAILED`. Zero fake data generated.
2. **`CollectionJobModel` (`apps/api/src/models/CollectionJob.ts`):**
   - Tracks asynchronous collection runs with statuses: `QUEUED`, `RUNNING`, `COMPLETED`, `COMPLETED_WITH_WARNINGS`, `FAILED`, `CANCELLED`.
   - Records live worker telemetry: `totalDiscovered`, `recordsSaved`, `duplicatesSkipped`, `invalidRecords`, and `progressPercentage`.
3. **`CountryLeadService` (`apps/api/src/services/CountryLeadService.ts`):**
   - Shared business logic for starting, monitoring, cancelling, and retrying collection jobs.
   - Enforces deduplication on `(tenantId, normalizedEmail)` and filters out suppressed addresses.
   - Shared formula-sanitized canonical CSV export.

---

## 2. Email Grabber Implementation (`/marketing/leads/grabber`)

- Searchable country dropdown with flags (`🇺🇸 US`, `🇬🇧 GB`, `🇨🇦 CA`, `🇦🇺 AU`, `🇩🇪 DE`, etc.).
- Displays real-time provider support indicators.
- Filter criteria: Industry, State/Province, City, Business Name, Max Records, and Target List.
- Live progress card showing worker percentage, discovered count, saved records, and duplicates skipped.
- Cancellation and retry controls.
- "Download Country CSV" action generating `Sellzy-[COUNTRY]-Emails-[DATE].csv`.

---

## 3. Email Sender Recipient Builder (`/campaigns`)

- Added dedicated **"Country Recipient Builder"** tab directly beside Campaigns.
- Shares the exact same country provider registry, collection job execution, and CRM lead lists.
- Allows marketers to query country business databases, assemble recipient candidate pools, and attach them to named lists without sending emails.
- Strictly separates recipient discovery from email execution: campaigns require an explicit approval gate and physical CAN-SPAM postal address before sending.

---

## 4. Verification Evidence

- `tests/country_email_collection.test.ts`: **6 passed, 6 total (100%)**
- `tests/schema_compatibility_roundtrip.test.ts`: **7 passed, 7 total (100%)**
- `tests/lead_generation_phase2.test.ts`: **5 passed, 5 total (100%)**
- `tests/lead_collection_verification.test.ts`: **16 passed, 16 total (100%)**
- `tests/excel_email_matching.test.ts`: **11 passed, 11 total (100%)**
- TypeScript typecheck (`apps/api` & `apps/web`): **0 errors**
- Next.js Web Lint: **0 errors**
