# Sellzy — Country Email Collection End-to-End Verification

## 1. Grabber Country Collection Flow
1. User navigates to `/marketing/leads/grabber`.
2. Selects country (e.g. `United Kingdom 🇬🇧`).
3. Enters filters (`Financial Technology`, `London`).
4. Clicks "Start Collection Engine".
5. Backend invokes `POST /api/v1/leads/jobs/start`.
6. `CountryLeadService` selects `UKCompaniesHouseProvider`, creates job record in `CollectionJobModel`, and executes worker task.
7. Frontend monitors live progress via `GET /api/v1/leads/jobs/:id` (polling percentage, discovered count, saved records).
8. Records appear in the live table with source registry links.
9. Clicking "Download Country CSV" invokes `GET /api/v1/leads/export-csv?country=GB` delivering `Sellzy-GB-Emails-[DATE].csv`.

## 2. Sender Recipient Builder Flow
1. User navigates to `/campaigns`.
2. Selects "Country Recipient Builder" tab.
3. Selects country and target saved list (e.g. `Q4 Europe Logistics`).
4. Clicks "Run Audience Discovery".
5. Uses the exact same provider registry and deduplication service.
6. Recipients are attached to the saved list.
7. Under the "Campaigns" tab, creating a campaign requires selecting an approved sender identity, physical CAN-SPAM address, and explicit authorization before any emails can be sent. Zero auto-dispatch on collection.
