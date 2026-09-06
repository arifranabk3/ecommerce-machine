# Sellzy Platform — Granular Permission Catalog & Enforcement Specification

## Permission Catalog Breakdown

Permissions in Sellzy are structured domain-qualified strings (`domain.action`) mapped to 20 functional groups:

| Permission Group | Permission Keys | Risk Level | Description |
| :--- | :--- | :--- | :--- |
| **Store & Settings** | `store.view`, `store.update`, `settings.view`, `settings.update` | LOW - MEDIUM | Store profile and business localization configuration. |
| **Products & Catalog** | `products.view`, `products.create`, `products.update`, `products.delete` | LOW - MEDIUM | Manage product catalog, variants, pricing, and categories. |
| **Inventory** | `inventory.view`, `inventory.update`, `inventory.adjust` | LOW - MEDIUM | Stock tracking, multi-warehouse adjustments, and reorder alerts. |
| **Orders & Fulfillment**| `orders.view`, `orders.create`, `orders.update`, `orders.cancel`, `orders.fulfill` | LOW - HIGH | Order processing, refunds, status updates, and shipping. |
| **Customers** | `customers.view`, `customers.create`, `customers.update`, `customers.delete` | LOW - MEDIUM | Customer profiles, tags, and purchasing history. |
| **Finance & Billing** | `finance.view`, `finance.reports`, `finance.payouts`, `billing.manage` | HIGH | Financial reports, payment gateways, payouts, and SaaS billing. |
| **Analytics & Reports** | `analytics.view`, `reports.export` | LOW - MEDIUM | Business intelligence metrics and CSV/PDF exports. |
| **Users & Team** | `users.view`, `users.invite`, `users.update`, `users.suspend`, `users.remove` | HIGH | Team member invitations, status management, and session revocation. |
| **Roles & RBAC** | `roles.view`, `roles.create`, `roles.update`, `roles.assign`, `roles.archive` | CRITICAL | Custom role management and role assignment. |
| **System & Security** | `security.mfa`, `audit.view`, `apikeys.manage`, `system.transfer_ownership` | CRITICAL | Step-up security, audit trail inspection, API keys, ownership transfer. |
| **Integrations & Webhooks**| `integrations.view`, `integrations.manage`, `webhooks.manage` | HIGH | Third-party apps, OAuth integrations, and outgoing webhooks. |
| **Automation & AI** | `automation.manage`, `ai.copilot` | MEDIUM | Workflow automations and AI copilot interactions. |

---

## API Authorization Middleware Flow

```typescript
// Example permission enforcement pattern in Express routes:
router.post('/roles', authenticateToken, requirePermission('roles.create'), RoleController.createRole);
```

1. **`authenticateToken` Middleware**:
   - Decodes Bearer JWT token.
   - Validates `SessionModel` state (checks `revokedAt` and expiration).
   - Validates `UserModel` account status (`ACTIVE`).

2. **`requirePermission(permissionKey)` Middleware**:
   - Compares request header `x-tenant-id` (if present) against `req.user.tenantId`.
   - Calls `RbacService.getEffectivePermissions(userId, tenantId)`.
   - Returns `200 OK` if effective permissions contain `*` (Owner) or exact `permissionKey`.
   - Throws `AppError(403, 'INSUFFICIENT_PERMISSIONS')` if authorization fails.

---

## System vs Custom Role Permission Evaluation

### System Role Resolution
- `Owner`: Automatically granted `['*', ...ALL_PERMISSION_KEYS]`.
- `Admin`: Granted operational permissions across store, products, orders, customers, finance, analytics, users, and roles.
- `Staff`: Granted operational baseline permissions (`products.view`, `orders.view`, `customers.view`).

### Custom Role Evaluation Algorithm
When a user possesses multiple roles in a tenant:
1. Fetch all active custom roles from `RoleModel` where `name` is in `membership.roles` and `archivedAt` is undefined.
2. Construct a `Set<string>` union of all permissions across assigned roles.
3. If any assigned role includes `*`, return universal wildcard permission set.
4. Cache effective array in Redis for 300 seconds.
