# SELLZY — MARKETING AUTOMATION & ABANDONED CHECKOUT RECOVERY AUDIT
**Document Version:** 1.0.0  
**Audit Date:** 2026-11-01  
**Auditor:** Senior SaaS Architect, Full-Stack TypeScript Engineer, Security & QA Lead  
**Repository Path:** `D:\projects\ecommerce-machine`  
**Current Monorepo Status:** Clean Git working tree (`origin/main`), Turbo 2.10.12, Node v24.20.0, npm 10.8.2.

---

## 1. Executive Summary & Baseline Findings

A comprehensive baseline inspection was conducted across the Sellzy multi-tenant monorepo (`apps/api`, `apps/worker`, `apps/web`, `packages/shared`, `packages/validation`, and `packages/config`). 

Sellzy already possesses an advanced, production-grade foundation for:
1. **Multi-tenant and multi-store RBAC isolation**: JWT authentication with `tenantId` and `storeId` enforcement, permission checking (`requirePermission`), and cross-tenant query safeguards.
2. **Deterministic Automation & Rule Engine**: Full AST evaluation (`RulesEngine`), kill switches (`KillSwitchService`), approvals (`ApprovalEngine`), and exception tracking (`ExceptionManager`).
3. **Communication & Consent Management**: `ConsentService`, `CommunicationPreferenceModel` with channel opt-in/opt-out status (`whatsapp`, `email`, `sms`), topic tracking, and audit trails.
4. **Resilient Message State Machine**: Strict message status progression (`QUEUED -> PROCESSING -> SENT -> DELIVERED -> READ -> FAILED`), idempotency protection, and webhook HMAC signature deduplication.

### Critical Gaps Identified
However, the specific **Marketing Automation & Abandoned Checkout Recovery** system currently has the following missing components and mock gaps:
- **Shopify Connector & Webhook Integration**: There is **no Shopify OAuth flow, webhook handler, or GraphQL API connector** in `apps/api`. In `apps/web/src/app/integrations/page.tsx`, Shopify is displayed using static/mock state (`status: 'ERROR', lastSync: '2 hrs ago'`).
- **Abandoned Checkout Domain & Models**: No database schema exists for abandoned checkouts (`AbandonedCheckoutModel` or `CheckoutSessionModel`). In `apps/web/src/app/automations/page.tsx`, abandoned cart recovery exists strictly as a hardcoded UI template with mock KPI numbers.
- **Background Worker Processors**: `apps/worker/src/index.ts` is a barebones skeleton handling only `SEND_WELCOME_EMAIL`. It does not process recovery workflows, delay timers, or retry queues.
- **Production Email Provider**: Currently only a `MockEmailProvider` exists in `apps/api/src/providers/communication/IEmailProvider.ts`. No production SMTP/SendGrid/SES adapter is implemented. WhatsApp Cloud API exists (`whatsapp-cloud.provider.ts`) but lacks checkout recovery template bindings.
- **Recovery Revenue Attribution & Precision Analytics**: Current order analytics compute macro revenue, but do not attribute recovered checkouts, recovery conversion rates, or direct vs. inferred attribution windows.

---

## 2. Existing Architecture vs. Missing Functionality Inventory

| Component / Subsystem | Current State in Repository | Production Ready? | Gaps & Missing Capabilities |
| :--- | :--- | :--- | :--- |
| **Shopify OAuth & Connection** | Not implemented. `apps/api/src/routes/platform.routes.ts` returns static list. | **NO (GAP)** | Needs Shopify OAuth app installation, encrypted token storage, minimum scope validation (`read_orders`, `read_checkouts`), and secure disconnect / app-uninstall handling. |
| **Shopify Webhooks** | Not implemented. | **NO (GAP)** | Needs HMAC signature verification (`X-Shopify-Hmac-Sha256`), raw body parsing, duplicate replay defense, and asynchronous worker queue ingestion. |
| **Checkout Persistence & Data Mapping** | No model exists. | **NO (GAP)** | Needs `AbandonedCheckout` model with `tenantId`, `storeId`, `shopifyCheckoutId`, recovery URL, cart token, line items, monetary totals, customer snapshot, and status lifecycle. |
| **Consent & Customer Eligibility** | `ConsentService` and `CommunicationPreferenceModel` exist and enforce explicit opt-in for marketing. | **PARTIALLY (Needs Integration)** | Separate check required right before recovery dispatch: verify email marketing consent, WhatsApp marketing consent, check if order was completed, and verify customer opt-out. |
| **Recovery Workflow Engine** | `WorkflowEngine`, `RulesEngine`, `ActionRegistry` exist with 160 passing tests. | **PARTIALLY (Needs Actions)** | Needs registration of `RECOVER_CHECKOUT_EMAIL` and `RECOVER_CHECKOUT_WHATSAPP` actions with delay timers and conversion cancellation. |
| **Background Worker (`apps/worker`)** | Skeleton BullMQ worker listening to `system-events`. | **NO (GAP)** | Needs dedicated queue/processor for scheduled recovery evaluations, delayed step dispatches, and dead-letter handling. |
| **Email & WhatsApp Providers** | `MockEmailProvider` and `WhatsAppCloudProvider` exist. | **PARTIALLY** | Email provider needs real SMTP / Resend / SendGrid compliant adapter with unsubscribe headers (`List-Unsubscribe`) and error normalization. WhatsApp provider needs recovery template parameters. |
| **Recovery Revenue Attribution** | `OrderModel` tracks orders, but has no checkout recovery attribution fields. | **NO (GAP)** | Needs `recoveryToken` or checkout ID tracking to tie recovered orders back to the specific recovery message and calculate genuine recovered revenue. |
| **Web UI (`apps/web`)** | Hardcoded mock data in `automations/page.tsx`, `marketing/page.tsx`, and `integrations/page.tsx`. | **NO (MOCK DATA)** | Needs real backend API connections for Shopify integration health, abandoned checkout recovery workflows, and consent metrics. |

---

## 3. Mock Data & Hardcoded Value Inventory

1. **`apps/web/src/app/automations/page.tsx`**:
   - Hardcoded KPIs: `Active Automations: 24`, `Runs This Month: 142.5k`, `Revenue: PKR 4.2M`.
   - Hardcoded automation templates: `Abandoned Cart`, `Welcome Series`, `Win Back`.
   - Builder view does not persist canvas nodes or triggers to `AutomationWorkflowModel`.
2. **`apps/web/src/app/integrations/page.tsx`**:
   - Hardcoded integration list: `Shopify (ERROR)`, `Stripe (CONNECTED)`, `Twilio`, `FedEx`, `Klaviyo`.
   - Connect modal steps simulate OAuth without redirection or server token exchange.
3. **`apps/api/src/routes/platform.routes.ts`**:
   - Hardcoded integration endpoint `/api/v1/platform/integrations` returning static JSON array.
4. **`apps/api/src/providers/communication/IEmailProvider.ts`**:
   - `MockEmailProvider` returns synthetic `msg_email_${Date.now()}` and status `SENT` without network transmission.

---

## 4. Security, Isolation & Compliance Gaps

1. **PII and Recovery URL Protection**:
   - Shopify checkout recovery URLs contain customer tokens. These must never be logged in application logs, worker job payloads, or plaintext audit reports.
2. **HMAC Webhook Validation**:
   - Shopify webhooks require computing HMAC-SHA256 with the app's client secret over the raw binary request body before JSON parsing. A dedicated raw-body buffer middleware is required.
3. **Double Send & Concurrency Hazard**:
   - If a customer places an order while a BullMQ delay job is sitting in queue, the job must query `OrderModel` atomically right before dispatch to prevent messaging a converted customer.
4. **CAN-SPAM, TCPA & WhatsApp Business Policy Compliance**:
   - WhatsApp business-initiated messages require pre-approved templates and explicit opt-in.
   - Commercial recovery emails must provide physical address and one-click unsubscribe links.
5. **Token Encryption at Rest**:
   - Shopify offline access tokens must be AES-256-GCM encrypted in MongoDB with tenant/store ownership tagging.

---

## 5. Test Baseline & Verification

The test baseline was executed using Jest across the test suites:
- `tests/health.test.ts`: **2 passed, 2 total** (exit code 0).
- `tests/phase12_marketing_communication.test.ts`: **97 passed, 97 total** (exit code 0). Tested message status transitions, template sanitization, consent validation, and HMAC deduplication.
- `tests/phase13_automation_ai.test.ts`: **160 passed, 160 total** (exit code 0). Tested RulesEngine operators, ActionRegistry, approval flows, kill switches, and prompt injection defense.
- `tests/phase15_saas_integrations.test.ts`: **170 passed, 170 total** (exit code 0). Tested tenant isolation, API keys, feature flags, and RBAC security.

**Total Verified Baseline Tests:** 429 passing tests across existing modules.

---

## 6. Recommended Implementation Sequence

1. **Phase 1: Shopify Connector & Webhook Ingestion Engine**
   - Add `ShopifyIntegration` model with AES-256-GCM encrypted tokens.
   - Implement Shopify OAuth endpoints (`/api/v1/integrations/shopify/auth`, `/callback`) with state and scope verification.
   - Implement Shopify Webhook receiver with HMAC-SHA256 signature verification for `checkouts/create`, `checkouts/update`, and `orders/create`.
2. **Phase 2: Abandoned Checkout Domain & Eligibility Service**
   - Create `AbandonedCheckout` model with unique indices on `(tenantId, shopifyCheckoutId)`.
   - Implement `CheckoutEligibilityService` verifying: checkout status, non-conversion, email/phone presence, and explicit consent records.
3. **Phase 3: Automated Recovery Workflow & Background Worker**
   - Register `RECOVER_CHECKOUT_EMAIL` and `RECOVER_CHECKOUT_WHATSAPP` in `ActionRegistry`.
   - Implement `AbandonedCheckoutProcessor` in `apps/worker` with configurable delay (e.g. 1 hour, 24 hours), idempotency checks, and dead-letter queue routing.
4. **Phase 4: Production Email & WhatsApp Provider Integration**
   - Implement production-ready `SmtpEmailProvider` supporting standard transactional/marketing SMTP with DKIM, SPF compliance, and `List-Unsubscribe` headers.
   - Enhance `WhatsAppCloudProvider` for template message delivery.
5. **Phase 5: Attributed Revenue Recovery Analytics & UI Integration**
   - Implement conversion tracking: link completed orders to recovered checkout IDs.
   - Connect `apps/web/src/app/automations` and `integrations` to live backend APIs.

---

## 7. Blocking Issues

- **Shopify Developer App Credentials**: Actual Shopify App Client ID / Secret and test store (`.myshopify.com`) credentials are required for live end-to-end sandbox authorization. In their absence, a fully compliant mock development adapter with deterministic HMAC verification and OAuth token exchange will be provided alongside the real integration client.
- **WhatsApp Cloud API Credentials**: Live Meta WABA ID, Phone Number ID, and System User Token are required for live WhatsApp sending. Test verification mode will validate template structures against Meta's Cloud API specs.

