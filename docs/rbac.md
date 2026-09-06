# Sellzy Platform — Production-Grade Role-Based Access Control (RBAC) Architecture

## Overview
Sellzy enforces a multi-tenant, server-evaluated Role-Based Access Control (RBAC) engine. All privilege calculations occur server-side; client tokens or headers cannot override tenant or role boundaries.

---

## Core Principles & Governance

### 1. Server-Side Context Authority
- **Tenant Context**: Extracted strictly from verified JWT tokens (`req.user.tenantId`).
- **Header Tampering Defense**: Client `x-tenant-id` header manipulation is explicitly validated against `req.user.tenantId`. Any mismatch results in `403 TENANT_MISMATCH`.
- **Stateless Authorization**: JWT payload contains `userId`, `tenantId`, `roles`, and `sessionId`. Session validity and user status are verified against database state on every authenticated request.

### 2. Role Architecture
- **System Roles (Default & Immutable)**:
  - `Owner`: Universal wildcard authority (`*`). Immune to deletion, removal, or modification.
  - `Admin`: Full operational administrative access across business modules.
  - `Staff`: Default baseline operational role (view products, manage orders).
- **Custom Roles**:
  - Dynamically created per tenant.
  - Composed of granular permission keys selected from the permission catalog.
  - Cannot modify or delete protected system roles.

### 3. Permission Ceiling & Self-Escalation Controls
- **Non-Owner Ceiling Rule**: A non-owner user cannot create or edit a role with permissions they do not personally possess.
- **Role Assignment Ceiling**: A user cannot assign a role containing permissions beyond their own effective permission ceiling.
- **Owner Escalation Protection**: Only existing Tenant Owners can grant or transfer the `Owner` role.
- **Platform Admin Boundary**: Tenant roles cannot grant or possess platform administration permissions (`PLATFORM_ADMIN`).

### 4. High-Risk Permissions
Permissions categorized as `HIGH` or `CRITICAL` risk require explicit authorization and are logged as security audit events:
- `roles.manage`, `roles.assign`
- `users.invite`, `users.suspend`, `users.remove`
- `security.mfa`, `audit.view`
- `system.transfer_ownership`

---

## Caching & Invalidation Architecture

```
Client Request
      │
      ▼
Authenticate JWT
      │
      ▼
Check Redis Cache: tenant:{tenantId}:user:{userId}:permissions
 ┌────┴────────────────────────┐
 │ HIT                         │ MISS
 ▼                             ▼
Return Permissions      Evaluate DB Models:
                        1. UserModel status check
                        2. TenantMembershipModel active check
                        3. System & Custom Role permissions
                        │
                        ▼
                        Cache in Redis (TTL: 300s)
```

### Redis Key Namespacing & Isolation
- Permission Cache Key: `tenant:{tenantId}:user:{userId}:permissions`
- Ensures complete namespaced isolation across multi-tenant boundaries.

### Instant Cache Invalidation Trigger Events
Permission caches are invalidated instantly when:
1. A role's permissions or name are updated (`invalidateTenantCache`).
2. A user's roles are modified (`invalidateUserCache`).
3. A user's tenant membership status changes (`SUSPENDED`, `REMOVED`).
4. Active user sessions are revoked.

---

## Audit Trail & Security Event Logging
All RBAC mutations generate structured, immutable security audit records stored in `AuditLogModel`:
- `ROLE_CREATED`, `ROLE_UPDATED`, `ROLE_ARCHIVED`
- `ROLE_ASSIGNED`, `MEMBER_INVITED`, `MEMBER_JOINED`, `MEMBER_REMOVED`
- `USER_SUSPENDED`, `USER_ACTIVATED`, `OWNERSHIP_TRANSFERRED`
- `PRIVILEGE_ESCALATION_BLOCKED`, `UNAUTHORIZED_ROLE_ASSIGNMENT_ATTEMPT`

Secrets (passwords, MFA secrets, JWT tokens) are strictly sanitized and never written to audit logs.
