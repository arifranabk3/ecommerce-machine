# Sellzy Multi-Tenancy Architecture & Isolation Specification

## 1. Multi-Tenant Core Principles
- **Logical Schema Isolation**: Every tenant-scoped collection in MongoDB enforces indexed `tenantId: 1`.
- **Server-Side Context Resolution**: The server NEVER trusts client-supplied headers or query parameters for tenant identity. `req.user.tenantId` extracted from signed JWT claims serves as the single source of truth.
- **Tenant Switching**: Users with memberships in multiple tenants switch context via `/api/v1/tenant/switch`. The server verifies active `TenantMembership` before issuing a updated JWT scoped to the new tenant.
- **Cache Isolation**: Redis keys are strictly namespaced by tenant ID (e.g., `tenant:{tenantId}:features`, `tenant:{tenantId}:limits`).

## 2. Multi-Tenant Lifecycle
- `SUSPENDED` / `INACTIVE` state checks are performed on every authenticated API request.
- Deactivating or suspending a tenant immediately blocks API access across all associated user sessions.
