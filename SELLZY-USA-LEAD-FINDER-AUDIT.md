# SELLZY — USA BUSINESS LEAD FINDER & COMPLIANT EMAIL OUTREACH AUDIT
**Document Version:** 1.0.0  
**Audit Date:** 2026-11-01  
**Auditor:** Senior SaaS Architect, Full-Stack TypeScript Engineer, Security & Compliance Lead  
**Repository Path:** `D:\projects\ecommerce-machine`  
**Current Monorepo Status:** Clean Git working tree (`origin/main`), Turbo 2.10.12, Node v24.20.0.

---

## 1. Executive Summary & Existing Platform Baseline

This audit evaluates the feasibility, architectural alignment, and implementation gaps for introducing the **USA Business Lead Finder & Compliant Email Outreach Automation** module into the Sellzy SaaS platform.

### Key Architectural Strengths Available for Reuse:
1. **Tenant & Store Isolation**: All MongoDB models enforce strict scoping via `tenantId` and `storeId` with indexing and middleware assertions.
2. **AI Copilot & Tool Infrastructure**: `apps/api/src/services/AiCopilotService.ts` and `AiToolRegistry.ts` provide structured drafting, message classification, and prompt-injection sanitization.
3. **Communication Infrastructure**: `MessageModel`, `CommunicationPreferenceModel`, and `ConsentService` enforce message tracking, status lifecycle, and consent checks.
4. **Automation Engine**: `WorkflowEngine`, `RulesEngine`, and `ActionRegistry` support condition evaluation and event-driven automation.

### Existing Gaps for USA Lead Finder & Cold Outreach:
- **No Lead Management Domain**: Currently, Sellzy only has a `Customer` model (consumer e-commerce buyers). There is **no `Lead` or `BusinessContact` model** to store US business profiles, discovery sources, verification statuses, or outreach history.
- **No Business Directory / Data Source Connector**: There is no integration with licensed US business directories, official registry APIs, or verified company databases.
- **Cold B2B CAN-SPAM Compliance Layer**: While `ConsentService` strictly governs existing consumer marketing, cold B2B outreach in the US requires a dedicated CAN-SPAM compliance layer:
  - Valid physical postal address of the sender.
  - Clear and conspicuous opt-out / unsubscribe mechanism with immediate suppression.
  - Non-deceptive subject lines and accurate header info.
  - Global suppression list preventing re-contacting unsubscribed or bounced domains/emails.
- **Email Delivery Provider**: Only `MockEmailProvider` exists. Real SMTP / SendGrid / Amazon SES / Postmark delivery is required with DKIM/SPF alignment.
- **Human Approval Workflow for AI Drafts**: While `ApprovalEngine` exists in Sellzy for financial risks (vendor payments, refunds), outreach drafts currently have no human-in-the-loop review queue before sending.

---

## 2. Existing Functionality vs. Missing Functionality Inventory

| Capability | Current State in Repository | Production Ready? | Required Additions |
| :--- | :--- | :--- | :--- |
| **Business Lead Discovery** | None. | **NO (GAP)** | Add `LeadFinderService` supporting US states/cities, industry categories, verified business directories, and public role-based contacts (`info@`, `sales@`, `partnerships@`). |
| **Lead Management CRM** | Only `CustomerModel` (B2C) exists. | **NO (GAP)** | Add `BusinessLead` model with tenant/store scoping, business metadata, verification status, contact source URL, and deduplication by normalized domain/email. |
| **Suppression & Do-Not-Contact** | Basic `CommunicationPreferenceModel` exists. | **PARTIALLY** | Add tenant-wide and global `EmailSuppression` model to instantly block unsubscribed emails, bounced addresses, and domain-level opt-outs. |
| **AI Email Outreach Drafting** | `AiCopilotService` exists for customer support drafts. | **PARTIALLY** | Register new AI tool `draft_b2b_outreach` with truthful value propositions, source attribution, and CAN-SPAM required footer elements. |
| **Human Review & Approval Queue** | `ApprovalEngine` and `ApprovalRequestModel` exist. | **READY FOR INTEGRATION** | Route AI-generated outreach drafts to `ApprovalRequest` with `PENDING_REVIEW` state before any email can be scheduled or dispatched. |
| **Email Delivery Engine** | `MockEmailProvider` only. | **NO (GAP)** | Implement production `SmtpEmailProvider` supporting standard authenticated SMTP, bounce tracking, and `List-Unsubscribe` headers. |
| **Outreach Automation Worker** | Skeleton BullMQ worker. | **NO (GAP)** | Add `OutreachJobProcessor` in `apps/worker` to handle scheduled sends, time-zone restrictions (US business hours), and follow-up sequences. |
| **Dashboard & Performance Reporting** | E-commerce analytics exist in `analytics.routes.ts`. | **NO (GAP)** | Add Lead Finder & Outreach Analytics endpoints: leads discovered, verified contacts, pending drafts, delivered emails, and replies. |

---

## 3. Security, Legal & Compliance Safeguards (CAN-SPAM & Ethics)

1. **CAN-SPAM Act Mandatory Requirements**:
   - Every outreach email must include the sender's registered physical postal address.
   - Every email must contain a functional one-click unsubscribe URL or reply-to opt-out instruction.
   - Unsubscribe requests must be honored immediately and persisted permanently in `EmailSuppressionModel`.
   - Headers (`From:`, `Reply-To:`) and subject lines must not be deceptive.
2. **Anti-Scraping & Privacy Compliance**:
   - No unauthorized scraping, credential harvesting, or CAPTCHA bypass.
   - Leads must only be sourced from authorized public business registries, public company websites, or licensed directories.
   - Prefer role-based public business contacts (`contact@company.com`, `sales@company.com`).
3. **Safety Defaults**:
   - Autonomous sending is **disabled by default**. All AI outreach drafts require explicit human approval via the Approval Engine.
   - Rate limiting: max daily outreach volume per tenant to protect domain reputation and avoid spam flags.

---

## 4. Test Baseline & Commands Executed

Existing verified test suites:
- `npm run test -- tests/health.test.ts`: **2 passed, 2 total**
- `npm run test -- tests/phase12_marketing_communication.test.ts`: **97 passed, 97 total**
- `npm run test -- tests/phase13_automation_ai.test.ts`: **160 passed, 160 total**
- `npm run test -- tests/phase15_saas_integrations.test.ts`: **170 passed, 170 total**

---

## 5. Recommended Implementation Sequence

1. **Lead Discovery & CRM Domain**: Implement `BusinessLeadModel` and `EmailSuppressionModel`.
2. **Lead Finder Service**: Implement authorized US directory search, location/industry filters, and contact verification.
3. **Compliant Email Provider & CAN-SPAM Layer**: Build `SmtpEmailProvider` and `OutreachPolicyService`.
4. **AI Outreach Generator & Approval Integration**: Add prompt-safe B2B draft generator linked to `ApprovalEngine`.
5. **Background Worker & Follow-up Scheduler**: Add BullMQ outreach processor with US time-zone scheduling and suppression check immediately before dispatch.
6. **Dashboard API & UI**: Add Lead Finder & Outreach management views in `apps/web`.

