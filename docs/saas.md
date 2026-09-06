# Sellzy SaaS Lifecycle, Subscriptions & Entitlement Engine

## 1. Subscriptions & Tiered Plans
- Supported Tiers: `FREE`, `STARTER`, `GROWTH`, `ENTERPRISE`.
- Subscription Statuses: `TRIAL`, `ACTIVE`, `PAST_DUE`, `CANCELED`, `SUSPENDED`, `EXPIRED`.
- Currency Precision: Financial figures and subscription prices use integer minor units (e.g. `priceInCents`, `billingCycle`) to eliminate floating-point errors.

## 2. Entitlement Engine & Limits
- Feature Checks: `EntitlementService.canTenantUseFeature(tenantId, featureKey)` evaluates plan-assigned capabilities.
- Usage Limits: `EntitlementService.checkTenantLimit(tenantId, limitKey, currentCount)` validates monthly quota metrics (e.g. `MAX_TEAM_MEMBERS`, `MAX_PRODUCTS`, `MAX_MONTHLY_ORDERS`).
- Cached Entitlements: Feature entitlements are cached in Redis with a 5-minute TTL per tenant.

## 3. Team Member Invitations
- Workspace owners and admins invite team members via secure invitation tokens (`InvitationModel`).
- Expiration: Invitations expire after 7 days and track `PENDING`, `ACCEPTED`, `EXPIRED`, `REVOKED` states.
