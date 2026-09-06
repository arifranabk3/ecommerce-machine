# Sellzy — Security Architecture & Hardening Guide

Sellzy implements a multi-layered security model built for enterprise-grade SaaS ecommerce operations.

---

## 1. Security Architecture Principles

1. **Zero-Trust Backend Validation**: Frontends are treated as untrusted presentation layers. All authentication, tenant authorization, permission checks, and permission ceiling calculations are enforced strictly on the Express backend engine.
2. **Tenant Isolation**: Data access requires matching `tenantId` extracted from cryptographically verified JWT tokens. Client attempt to set `x-tenant-id` to another store is explicitly rejected with `403 TENANT_MISMATCH`.
3. **Session Revocation & Lifecycle Enforcement**: Session state is validated against database records on every request (`revokedAt: { $exists: false }`). Revoking user sessions immediately terminates active connections across all devices.

---

## 2. Production-Grade RBAC Security Controls (Phase 04)

- **Server-Authoritative Evaluation**: Permissions are calculated dynamically (`RbacService.getEffectivePermissions`) by resolving all assigned active roles for a user within their tenant context.
- **Permission Ceiling Rule**: Users cannot grant permissions they do not possess (`Privilege escalation blocked`). Attempting to assign higher permissions triggers audit log recording and returns a `403` error.
- **Owner Protection**:
  - The Tenant Owner role cannot be assigned by non-owner admins.
  - The Tenant Owner cannot be removed, suspended, or demoted by normal admins.
  - Ownership transfer requires current Owner's password re-authentication.
- **Protected System Roles**: System roles (`Owner`, `Admin`, `Staff`) cannot be edited, renamed, or deleted.
- **Redis Namespaced Cache Invalidation**: Permission cache keys (`tenant:{tenantId}:user:{userId}:permissions`) are automatically invalidated when user roles or custom role definitions are updated.
- **Audit Logging**: Sensitive RBAC operations (`ROLE_CREATED`, `ROLE_UPDATED`, `ROLE_ASSIGNED`, `PRIVILEGE_ESCALATION_BLOCKED`, `OWNERSHIP_TRANSFERRED`) are logged immutably with redacting of sensitive secrets.
