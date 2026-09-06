# Sellzy — Technical Architecture & Monorepo Overview

Sellzy is a production-grade, multi-tenant SaaS ecommerce operations platform built with a modern TypeScript monorepo architecture.

---

## 1. Monorepo Architecture

```
sellzy/
├── apps/
│   ├── api/             # Node.js + Express REST API Engine
│   └── web/             # Next.js 14 App Router SaaS Frontend
├── packages/
│   ├── config/          # Shared Environment & Feature Flag Configuration
│   ├── shared/          # Shared Interfaces, Enums, System Events & Types
│   └── validation/      # Shared Zod Validation Schemas
├── docs/                # Architecture, Multi-Tenancy & Security Documentation
└── tests/               # Workspace Security & Integration Test Suites
```

---

## 2. Platform Core Architecture & Security Stack

1. **Frontend Architecture (`apps/web`)**:
   - Next.js 14 App Router with static layout prerendering
   - Light SaaS UI design system with brand accent `#A9C2B9`
   - Dedicated User & Role Management Settings UIs (`/settings/users`, `/settings/roles`)

2. **Backend Engine (`apps/api`)**:
   - Express REST API with versioning (`/api/v1`)
   - Strict `x-tenant-id` header validation against JWT session token
   - Centralized AppError handling, Helmet security headers, rate limiting (200 req/15 min)

3. **Data Storage & Caching Layer**:
   - **MongoDB Atlas**: Tenant-isolated schemas, compound indexes (`{ tenantId: 1, userId: 1 }`, `{ tenantId: 1, normalizedName: 1 }`)
   - **Redis**: Namespaced cache keys (`tenant:{tenantId}:user:{userId}:permissions`) with automatic cache invalidation upon role change or user status change

4. **Production RBAC Architecture (Phase 04)**:
   - 20 Granular Permission Groups & 60+ individual permissions
   - Server-authoritative permission evaluation (`RbacService`)
   - Permission Ceiling enforcement (`AssignablePermissions ⊆ RequesterEffectivePermissions`)
   - Protected Tenant Owner safeguards (Ownership Transfer with password verification)
   - Immutable system roles (`Owner`, `Admin`, `Staff`)

5. **Products, Inventory & Orders Architecture (Phases 05 & 06)**:
   - Product catalog & variant schemas with integer minor unit pricing & cost margin tracking
   - Multi-location stock balances & immutable append-only `InventoryMovement` audit ledger
   - Order Management System (OMS) with historical price & SKU snapshots (`OrderItem`)
   - Controlled `OrderStateMachine` with automatic inventory reservation release on cancellation
   - Decoupled Payment (`PaymentStatus`) and Fulfillment (`FulfillmentStatus`) state management
   - Atomic order number generator (`SZ-YYYY-000001`) and scoped idempotency key protection (`OrderIdempotency`)

