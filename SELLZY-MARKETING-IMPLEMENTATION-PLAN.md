# SELLZY — MARKETING & LEAD GENERATION IMPLEMENTATION PLAN
**Document Version:** 1.0.0  
**Date:** 2026-11-01  
**Execution Strategy:** Multi-Phase Zero-Regression Delivery  
**Repository:** `D:\projects\ecommerce-machine`  

---

## 1. Implementation Philosophy

1. **Zero-Regression Guarantee:**
   - Existing modules (`orders`, `products`, `inventory`, `vendors`, `billing`, `analytics`) must not be impacted.
   - Core authentication, RBAC, tenant context, and store scoping remain untouched.
2. **Two-Stage Lead Generation Separation:**
   - **Stage 1:** Discover, validate, deduplicate, import, match, and save leads. (Strictly ZERO sending operations).
   - **Stage 2:** Explicit human review and approval before live campaign dispatch with mandatory CAN-SPAM physical postal address and active suppression filtering.
3. **No Mock or Fabricated Data in Production:**
   - Connect all screens to real persisted MongoDB data via `useApiQuery` and `useApiMutation`.

---

## 2. Phased Implementation Roadmap

### Phase 1: Navigation & Unified Marketing Hub Layout
- **Objective:** Add seamless sub-navigation in Marketing area so users can access Overview, Leads & Lists, Matching Workspace, Campaigns, and Templates cleanly without URL jumping.
- **Tasks:**
  - Create a cohesive Marketing tab bar (`/marketing`, `/marketing/leads`, `/marketing/match`).
  - Keep `/campaigns`, `/messages`, and `/templates` backward-compatible.
- **Verification:**
  - Route navigation works without full page reload.
  - Active tab highlighting matches current route.

### Phase 2: USA Business Leads & Saved Lists Page (`/marketing/leads`)
- **Objective:** Full-page dedicated CRM interface for lead discovery, state/industry filters, saved lists, and CSV export.
- **Tasks:**
  - Connect to `GET /api/v1/leads` and `POST /api/v1/leads/collect`.
  - Add search bar, verification status dropdown, and location filters.
  - Integrate List management: Create List, Associate Leads, Delete List.
  - Integrate CSV export using canonical 11-column header structure.
- **Verification:**
  - Filtering by state (e.g. `IL`) updates table.
  - Zero emails are dispatched.

### Phase 3: Excel Import & Lead Matching Workspace (`/marketing/match`)
- **Objective:** Interactive drag-and-drop file upload for Excel/CSV lists with automated canonical matching against collected CRM leads.
- **Tasks:**
  - File upload zone supporting CSV / text up to 10MB.
  - Display parsed headers, row count, and canonical schema badge (`isCanonical: true`).
  - Render matching breakdown metrics:
    - `Exact Matches` (in CRM and Excel)
    - `Excel Only` (fresh leads in Excel)
    - `Grabbed Only` (leads in CRM but missing from Excel)
    - `Duplicates in File`
    - `Suppressed Contacts`
  - Action button: "Export Matching Report" (download formula-sanitized CSV).
  - Action button: "Draft Campaign from Matches" (opens Campaign Creator in `DRAFT`).
- **Verification:**
  - Tested with compliant and non-compliant spreadsheets.
  - Zero emails dispatched during upload or matching.

### Phase 4: Message Templates Screen Real Data Binding (`/templates`)
- **Objective:** Replace static prototype array in `apps/web/src/app/templates/page.tsx` with live backend API.
- **Tasks:**
  - Bind to `useApiQuery('/api/v1/communication/templates')`.
  - Support template creation modal with content sanitization against `<script>` and `eval()`.
- **Verification:**
  - Newly created templates persist to MongoDB and show in table.

### Phase 5: Unified Communication Inbox Real Data Binding (`/messages`)
- **Objective:** Replace static prototype array in `apps/web/src/app/messages/page.tsx` with live backend API.
- **Tasks:**
  - Bind to `useApiQuery('/api/v1/communication/conversations')`.
  - Fetch conversation timeline via `GET /api/v1/communication/conversations/:id/messages`.
  - Send message input via `POST /api/v1/communication/messages` with consent warning banner.
- **Verification:**
  - Real conversations render.
  - Unconsented marketing messages display validation error.

---

## 3. Rollback & Contingency Plan

If any unexpected error occurs during future UI enhancement phases:
1. Revert UI changes using Git: `git checkout -- apps/web/src/app/marketing`.
2. All underlying backend services and APIs are already tested with 463 passing Jest tests and will remain fully operational.

