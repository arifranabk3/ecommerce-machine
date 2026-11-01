# SELLZY — EXCEL EMAIL IMPORT + LEAD GRABBER MATCHING ENGINE IMPLEMENTATION REPORT
**Implementation Version:** 1.0.0  
**Date:** 2026-11-01  
**Architecture:** Multi-Tenant TypeScript Monorepo (Next.js 14, Express API, Mongoose, BullMQ)  
**Status:** **VERIFIED**

---

## 1. Executive Summary

We have implemented and verified the **Excel Email Import + Lead Grabber Matching Engine** inside the Sellzy platform (`D:\projects\ecommerce-machine`).

The system adheres strictly to the primary business and safety requirement:
> **Importing, collecting, or matching emails NEVER sends emails automatically.**
> **Sending requires a separately reviewed and explicitly approved campaign with mandatory CAN-SPAM verification.**

---

## 2. Changed & Created Files Inventory

### Packages & Shared Definitions (`packages/shared/src/index.ts`)
- Added `MatchResultStatus`:
  - `exact_match`: Normalized email exists in both Excel and collected CRM leads.
  - `grabbed_only`: Collected/grabbed lead exists in CRM but is absent from the Excel file.
  - `excel_only`: Valid email exists in Excel but is absent from CRM leads.
  - `duplicate_in_file`: Repeated address inside the uploaded spreadsheet.
  - `invalid_email`: Malformed email failing RFC 5322 syntax validation.
  - `verification_pending`: Format is valid, mailbox verification pending.
  - `undeliverable`: Domain has no active MX records or is a disposable temporary mailbox.
  - `suppressed`: Email is on the persistent unsubscribe or complaint suppression list.
- Added `IImportColumnMapping`, `IMatchRecord`, and `IImportJob` data contracts.

### Database Models (`apps/api/src/models`)
- `apps/api/src/models/ImportJob.ts`:
  - Tracks import jobs per tenant: `fileName`, `fileSize`, `totalRows`, `validRows`, `invalidRows`, `duplicateRows`, `exactMatchRows`, `excelOnlyRows`, `grabbedOnlyRows`, `suppressedRows`, and column `mapping`.
  - Scoped by `tenantId` and `storeId` with indexing on `{ tenantId: 1, createdAt: -1 }`.

### Services & Engine (`apps/api/src/services`)
- `apps/api/src/services/EmailNormalizationService.ts`:
  - Consistent domain lowercasing and surrounding whitespace trimming.
  - Preserves legitimate mailbox identity without universal dot/plus-tag stripping.
- `apps/api/src/services/SpreadsheetParserService.ts`:
  - Safe CSV and delimited spreadsheet parser with size limits (10MB) and row limits (5,000 rows).
  - **Formula Injection Defense**: Escapes cells beginning with `=`, `+`, `-`, `@`, `\t`, or `\r` with single quotes (`'`) to protect downstream users in Excel/Google Sheets.
- `apps/api/src/services/LeadMatchingService.ts`:
  - Compares uploaded datasets against existing collected leads in `LeadModel` and suppressions in `EmailSuppressionModel`.
  - Identifies `exact_match`, `duplicate_in_file`, `suppressed`, `excel_only`, and `grabbed_only` leads.
  - Provides secondary indicators for matching domain and company names.
  - **Strictly read-only & analytical: 0 emails dispatched.**

### Controllers & Routes (`apps/api/src/controllers` & `apps/api/src/routes`)
- `apps/api/src/controllers/lead.controller.ts`:
  - Added `parseSpreadsheetUpload`: Parses uploaded spreadsheet text, returns headers, row counts, and preview.
  - Added `matchImportedDataset`: Runs matching analysis, saves `ImportJobModel`, and returns full categorization summary.
  - Added `exportMatchingReportCsv`: Produces downloadable sanitized CSV matching report.
- `apps/api/src/routes/lead.routes.ts`:
  - Mounted `/api/v1/leads/imports/parse`, `/api/v1/leads/imports/match`, and `/api/v1/leads/imports/export-report`.

---

## 3. Endpoints & REST Interface Summary

| Method | Endpoint | RBAC Permission | Purpose | Safe / Zero Send |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/leads/imports/parse` | `customers.create` | Parses CSV/spreadsheet content, detects headers and previews | **YES (0 sends)** |
| `POST` | `/api/v1/leads/imports/match` | `customers.view` | Matches imported list against collected CRM leads | **YES (0 sends)** |
| `POST` | `/api/v1/leads/imports/export-report` | `customers.view` | Exports sanitized matching report to CSV (formula defense) | **YES (0 sends)** |
| `POST` | `/api/v1/leads/campaigns/draft` | `messages.send` | Creates campaign draft from matched/unmatched subsets | **YES (DRAFT status)** |
| `POST` | `/api/v1/leads/campaigns/:id/approve` | `messages.send` | Explicit administrative approval before live sending | **YES (Approval Gate)**|

