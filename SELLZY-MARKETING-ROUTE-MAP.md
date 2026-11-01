# SELLZY — MARKETING & LEAD GENERATION ROUTE MAP
**Document Version:** 1.0.0  
**Scope:** Frontend App Router Routes & Backend API Endpoint Mapping  
**Date:** 2026-11-01  

---

## 1. Frontend Route Hierarchy (`apps/web/src/app`)

```
/ (Root)
└── marketing/                        # Main Marketing & Outreach Workspace (DashboardLayout)
    ├── page.tsx                      # Executive Marketing Overview, Recent Campaigns, Fast Actions
    ├── leads/
    │   ├── page.tsx                  # USA Business Lead Discovery, Saved Lists & CRM Filters
    │   └── [id]/page.tsx             # Lead Detail Profile, Verification Details & Outreach History
    ├── match/
    │   └── page.tsx                  # Excel/CSV Import, Canonical Schema Ingestion & Lead Grabber Matching
    ├── campaigns/                    # (Aliased / synced with /campaigns)
    │   ├── page.tsx                  # All Campaigns, Scheduled Queues & Execution Actions
    │   ├── new/page.tsx              # Multi-step Campaign Creator (Audience, Content, CAN-SPAM Footer)
    │   └── [id]/page.tsx             # Campaign Analytics, Delivery Funnel, and Recipient States
    ├── templates/                    # Message Templates (Aliased with /templates)
    │   └── page.tsx                  # WhatsApp & Email Template Manager
    └── suppression/
        └── page.tsx                  # Persistent Suppression & Unsubscribe Management
```

---

## 2. Detailed Page Specification

### Page 1: Marketing Overview (`/marketing`)
- **Parent Layout:** `DashboardLayout` (`apps/web/src/components/layout/DashboardLayout.tsx`)
- **Required RBAC Permission:** `dashboard.view` OR `customers.view`
- **Required Backend APIs:**
  - `GET /api/v1/communication/campaigns`
  - `GET /api/v1/leads`
  - `GET /api/v1/leads/lists`
- **Existing Reusable Components:** `Card`, `Button`, `Badge`, `Table`, `Thead`, `Tbody`, `Tr`, `Th`, `Td`
- **States Required:**
  - Loading: Skeleton table rows
  - Empty: "No active campaigns found. Create your first campaign."
  - Error: Inline error banner with retry trigger
  - Success: Metrics cards and campaign table
- **Mobile Behavior:** Horizontal scroll table, responsive KPI card grid (1 col on mobile, 4 col on desktop)

### Page 2: USA Business Leads & Saved Lists (`/marketing/leads`)
- **Parent Layout:** `DashboardLayout`
- **Required RBAC Permission:** `customers.view` (Read), `customers.create` (Collect / Import)
- **Required Backend APIs:**
  - `GET /api/v1/leads` (Paginated, filters by state, city, industry, verificationStatus)
  - `POST /api/v1/leads/collect` (Stage 1 lead discovery)
  - `GET /api/v1/leads/export-csv` (Canonical CSV export)
  - `POST /api/v1/leads/lists` (Create list)
  - `GET /api/v1/leads/lists` (List inventory)
- **Existing Reusable Components:** `Input`, `Button`, `Badge`, `Table`, `Card`
- **States Required:**
  - Loading: Spinner in table body
  - Empty: "No saved leads in database. Click 'Collect US Leads' to discover verified business contacts."
  - Success: Table with Company, Location, Industry, Verification Badge, and Source URL

### Page 3: Excel Import & Lead Matching Workspace (`/marketing/match`)
- **Parent Layout:** `DashboardLayout`
- **Required RBAC Permission:** `customers.create` (Upload), `customers.view` (Match)
- **Required Backend APIs:**
  - `POST /api/v1/leads/imports/parse` (Spreadsheet parser & header detection)
  - `POST /api/v1/leads/imports/match` (Matching engine computation)
  - `POST /api/v1/leads/imports/export-report` (Formula-sanitized report download)
- **Existing Reusable Components:** `Card`, `Badge`, `Button`, `Table`
- **States Required:**
  - Upload Step: Drag & drop zone with file size validation (<10MB)
  - Preview Step: Column mapping preview & canonical schema verification indicator
  - Matched Summary: Breakdown cards (`exact_match`, `grabbed_only`, `excel_only`, `duplicate_in_file`, `suppressed`)

### Page 4: Message Templates (`/templates`)
- **Parent Layout:** `DashboardLayout`
- **Required RBAC Permission:** `messages.send` OR `customers.view`
- **Required Backend APIs:**
  - `GET /api/v1/communication/templates`
  - `POST /api/v1/communication/templates`
- **Existing Reusable Components:** `PageHeader`, `Card`, `Badge`, `Button`, `Input`
- **States Required:**
  - Loading: Card skeleton
  - Empty: "No message templates configured."
  - Success: Grid of templates categorized by channel (WhatsApp, Email) and status (`APPROVED`, `PENDING`)

### Page 5: Unified Communication Inbox (`/messages`)
- **Parent Layout:** `DashboardLayout`
- **Required RBAC Permission:** `messages.send` OR `customers.view`
- **Required Backend APIs:**
  - `GET /api/v1/communication/conversations`
  - `GET /api/v1/communication/conversations/:id/messages`
  - `POST /api/v1/communication/messages`
- **Existing Reusable Components:** `Card`, `Badge`, `Button`, `Input`
- **States Required:**
  - Two-pane layout: Conversation list on left, message timeline on right
  - Opt-in warning: If customer has not opted into marketing channel, alert is shown

