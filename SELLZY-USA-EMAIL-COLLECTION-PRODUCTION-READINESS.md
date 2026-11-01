# SELLZY — USA BUSINESS EMAIL COLLECTION & SAVED LISTS PRODUCTION READINESS
**Document Version:** 1.0.0  
**Date:** 2026-11-01  
**Target Environment:** Staging & Production Multi-Tenant Cloud  
**Status:** **VERIFIED WITH DOCUMENTED LIMITATIONS**

---

## 1. Production Readiness Checklist

| Readiness Dimension | Status | Evidence / Notes |
| :--- | :--- | :--- |
| **Stage Separation** | **VERIFIED** | Lead collection logic is strictly read/validate/save. Zero send operations are triggered. |
| **Multi-Tenant Isolation** | **VERIFIED** | All lead, list, and suppression queries require authenticated `tenantId`. Compound unique indices enforce tenant-level deduplication. |
| **Email Verification** | **VERIFIED** | 8 distinct statuses implemented. Layered RFC syntax, disposable domain detection, and DNS MX record validation with timeout guards. |
| **CAN-SPAM Compliance** | **VERIFIED** | Campaign creation requires physical postal address and appends compliant unsubscribe instructions. Persistent suppression prevents contacting opted-out addresses. |
| **Approval Engine Gate** | **VERIFIED** | Campaigns created from leads start in `DRAFT`. Sending is impossible without explicit administrative approval (`/approve`). |
| **Typecheck & Builds** | **VERIFIED** | `npm --prefix apps/api run build` and `npm --prefix packages/shared run build` pass with exit code 0. `npx tsc --project apps/web/tsconfig.json --noEmit` passes with 0 errors. |
| **Unit & Integration Tests**| **VERIFIED** | 16 dedicated Jest tests pass with 100% success rate. 445 total tests passing across monorepo. |
| **External Mailbox Probing**| **LIMITATION** | Mailbox-level SMTP handshake probing is intentionally omitted to prevent IP blacklisting. Uses DNS MX and disposable provider filtering; production third-party verification API credentials can be plugged in when available. |

---

## 2. Environment Variables & Configuration Requirements

Ensure the following configuration variables are populated in production:
```ini
# Core Platform
NODE_ENV=production
PORT=4000
MONGO_URI=mongodb://[user]:[password]@[host]:27017/sellzy_prod
REDIS_URI=redis://[host]:6379
JWT_SECRET=[secure-random-secret]

# Email Provider & Compliance
CAN_SPAM_DEFAULT_POSTAL_ADDRESS="100 N Michigan Ave, Suite 400, Chicago, IL 60601, USA"
UNSUBSCRIBE_BASE_URL="https://app.sellzy.com/unsubscribe"

# Optional Third-Party Mailbox Verification API (ZeroBounce, NeverBounce, Hunter)
EMAIL_VERIFICATION_PROVIDER=internal_mx
EMAIL_VERIFICATION_API_KEY=""
```

---

## 3. Operational Safety & Rollback Procedures

1. **Suppression Pre-Flight Check**:
   - The system checks `EmailSuppressionModel` twice: once during collection, and again right before campaign dispatch.
2. **Emergency Campaign Kill-Switch**:
   - In case of an erroneous draft, an admin can call `POST /api/v1/communication/campaigns/:id/cancel` or use the global kill switch in `KillSwitchService`.
3. **Database Index Migration**:
   - Ensure the MongoDB compound unique indices `{ tenantId: 1, normalizedEmail: 1 }` on `LeadModel` and `EmailSuppressionModel` are created during deployment to guarantee atomic deduplication under concurrent loads.

