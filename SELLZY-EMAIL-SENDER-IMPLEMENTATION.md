# SELLZY — EMAIL SENDER IMPLEMENTATION REPORT
**Module:** Email Sender & Campaigns — Recipient Discovery Engine  
**System:** Sellzy Marketing & Lead Generation  
**Scope:** Stage 1 Recipient Discovery & Stage 2 Campaign Sending Separation  
**Repository:** `D:\projects\ecommerce-machine`

---

## 1. Executive Summary

This report documents the implementation of the Country-Based Recipient Discovery and List Builder within the Sellzy Email Sender (`/campaigns`). 

Both the **Email Grabber** (`/marketing/leads/grabber`) and the **Email Sender** (`/campaigns`) now connect to the **exact same shared backend collection engine** (`CountryLeadService`) and Data Provider Registry (`DataProviderRegistry`).

### Critical Architectural Principle: Two-Stage Workflow
The workflow strictly isolates:
1. **Stage 1 (Lead Collection & Recipient List Preparation):**
   - Country registry selection (`US`, `GB`, `CA`, `AU`, `DE`).
   - Querying official public business registries and company directories.
   - Domain deduplication (`LeadModel` unique `{ tenantId: 1, normalizedEmail: 1 }`).
   - CAN-SPAM / GDPR suppression list verification (`SuppressionListModel`).
   - Verification status checking (`VERIFIED`, `UNVERIFIED`, `RISKY`).
   - Saving to target lead lists (`LeadListModel`).
   - Canonical 11-column CSV export with formula injection defense.
   - **Zero emails are transmitted in this stage.**
2. **Stage 2 (Campaign Review & Approval Gate):**
   - Recipient lists are imported or attached to campaigns.
   - Explicit user campaign approval requiring mandatory CAN-SPAM postal address, unsubscribe links, and template confirmation.
   - No automatic trigger connects collection jobs to transmission pipelines.

---

## 2. Shared Engine & Frontend Architecture

### 2.1 Backend Reusability
The Email Sender uses the exact same API endpoints as the Email Grabber:
- `GET /api/v1/leads/countries`: Fetches capabilities and providers.
- `POST /api/v1/leads/jobs/start`: Spawns asynchronous registry collection.
- `GET /api/v1/leads/jobs/:jobId`: Live polling of collection progress.
- `GET /api/v1/leads/export-csv?country=:code`: Downloads canonical CSV.

### 2.2 Symmetrical UI Experience in `/campaigns`
The Campaigns page features a dedicated **"Country Recipient Builder"** tab alongside the Campaign Overview:
1. **Interactive Country Selection:** User selects from 5 supported country registries or unsupported countries with automatic capability badges.
2. **Filter & Query Options:** Industry selection, search keywords, max leads cap, and optional target lead list selection.
3. **Real-time Job Telemetry:** Progress bar, discovery counters, duplicate counts, and current stage indicators.
4. **Direct Canonical CSV Export:** Triggering `Sellzy-[COUNTRY]-Emails-[YYYY-MM-DD].csv` download.
5. **Campaign Safety Notice:** Visual warning reminding operators that building lists does not send communications without explicit campaign creation.

---

## 3. Strict Safety & Suppression Enforcement

| Protection Layer | Implementation | Verification Status |
| :--- | :--- | :--- |
| **Suppression Filter** | Checked against `SuppressionListModel` before saving | PASSED |
| **Tenant Isolation** | Scoped via `req.tenantId` on all database writes | PASSED |
| **Formula Injection** | Cells prefixed with `'` if starting with `=`, `+`, `-`, `@` | PASSED |
| **Unsupported Countries** | Returns 400 error `No configured data provider supports this country` | PASSED |
