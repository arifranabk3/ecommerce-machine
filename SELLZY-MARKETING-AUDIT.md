# SELLZY — MARKETING & LEAD GENERATION MODULE AUDIT
**Document Version:** 1.0.0  
**Audit Date:** 2026-11-01  
**Scope:** Phase 00 Monorepo Audit & Zero-Regression Architecture Plan  
**Repository:** `D:\projects\ecommerce-machine`  
**Application Stack:** Next.js 14/15 App Router, Express Node.js API, MongoDB / Mongoose, Redis / BullMQ, Turborepo monorepo (`npm@10.8.2`, Node v24.20.0).

---

## 1. Executive Summary

This audit assesses the entire existing Sellzy application architecture, with specific focus on establishing a zero-regression, production-grade foundation for the **Marketing & Lead Generation** module.

### Core Architecture Findings:
1. **Multi-Tenant & Multi-Store Hierarchy:**
   - Every API request authenticates a JWT token bound to `tenantId` and `userId`.
   - Store scoping is asserted via the `x-store-id` header and validated by `tenantStoreScope` middleware and Mongoose plugins.
   - Client headers (`x-tenant-id`) cannot override authenticated token ownership.
2. **Current Navigation & Route Structure:**
   - Sidebar navigation (`apps/web/src/components/layout/Sidebar.tsx`) currently links Growth to `/campaigns`, `/automation`, and `/analytics`.
   - `/marketing` exists as an active marketing hub with lead collection and campaign creation capabilities.
   - `/campaigns` exists as a dedicated campaign list and execution view.
   - `/messages` and `/templates` exist as early mock/prototype screens.
3. **Backend Communication & Automation Foundation:**
   - `MessageModel`, `CampaignModel`, `CampaignRecipientModel`, `LeadModel`, `LeadListModel`, `EmailSuppressionModel`, `ImportJobModel`, and `CommunicationPreferenceModel`.
   - Complete AST `RulesEngine`, `ActionRegistry`, `ApprovalEngine`, and `KillSwitchService` with 160 passing test cases.
   - `LeadService`, `EmailVerificationService`, `SpreadsheetParserService`, and `LeadMatchingService`.

---

## 2. Monorepo Structure & Package Inventory

```
D:\projects\ecommerce-machine\
├── apps/
│   ├── api/          # Express API server (port 4000)
│   ├── web/          # Next.js App Router frontend (port 3000)
│   ├── worker/       # BullMQ Background Job Worker
│   ├── admin/        # Platform super admin portal
│   ├── public/       # Public landing portal
│   └── storefront/   # Customer storefront engine
├── packages/
│   ├── shared/       # Shared TypeScript enums, models, interfaces, canonical schemas
│   ├── validation/   # Shared Zod validation schemas
│   └── config/       # Environment configuration and logger definitions
```

---

## 3. Existing vs. Missing Marketing & Lead Generation Capabilities

| Module / Screen | Current Status | Reusable Assets | Missing / Required Enhancements |
| :--- | :--- | :--- | :--- |
| **Marketing Dashboard (`/marketing`)** | **Functional** | Live campaigns table, USA business lead discovery, save to list, CSV export, Stage 2 campaign drafting. | Add sub-route navigation tabs to seamlessly access Leads, Campaigns, Templates, and Matching without switching top-level pages. |
| **Campaigns (`/campaigns`)** | **Functional** | Real API integration with `/api/v1/communication/campaigns`, execute & cancel controls. | Audience selection modal, template selector, CAN-SPAM sender configuration. |
| **Lead Grabber & Lists (`/marketing/leads`)** | **Functional via API** | `LeadModel`, `LeadListModel`, `LeadService`, `LeadDiscoveryService`, `EmailVerificationService`. | Dedicated full-page list management view (rename lists, tag management, filter by verification status). |
| **Excel Matching Engine (`/marketing/match`)** | **Functional via API** | `SpreadsheetParserService`, `LeadMatchingService`, `ImportJobModel`, canonical column compatibility. | Dedicated interactive spreadsheet drag-and-drop UI with header preview, matching progress bar, and breakdown charts. |
| **Message Templates (`/templates`)** | **Mock Prototype** | UI layout exists (`PageHeader`, `Card`, `Badge`). | Backend API `/api/v1/communication/templates` exists with 100% test coverage. Frontend needs live API binding via `useApiQuery`. |
| **Unified Inbox (`/messages`)** | **Mock Prototype** | UI layout exists (`PageHeader`, `Input`, `Button`). | Backend API `/api/v1/communication/conversations` exists. Frontend needs live API binding via `useApiQuery`. |

---

## 4. Security, Isolation & Safety Rules (What Must Not Be Touched)

1. **Do Not Touch Core Auth & RBAC:**
   - `apps/api/src/middleware/auth.ts`, `apps/api/src/services/rbac.service.ts`, `apps/api/src/services/auth.service.ts`.
   - Modifying these will compromise tenant isolation across the entire platform.
2. **Do Not Touch Store & Tenant Context Middleware:**
   - `apps/api/src/middleware/context.ts` and `apps/api/src/models/plugins/tenantStoreScope.ts`.
3. **Do Not Touch Billing & SaaS Subscriptions:**
   - `apps/api/src/routes/tenantBilling.routes.ts`, `apps/api/src/services/SaaSBillingService.ts`.
4. **Preserve Two-Stage Lead & Email Outreach Separation:**
   - Lead collection, spreadsheet parsing, and matching **must NEVER dispatch live emails**.
   - Sending must strictly route through explicit campaign approval with CAN-SPAM physical address validation.

