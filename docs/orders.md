# Sellzy — Order Management System (OMS) Architecture

## Overview
An **Order** in Sellzy represents an immutable business record of a sale. It isolates current catalog data into historical price & SKU snapshots, enforces a strict controlled **Order State Machine**, separates **Payment** and **Fulfillment** statuses, integrates atomically with Phase 05 **Inventory Reservations**, enforces idempotency and concurrency safety, and provides full multi-tenant security across database, API, real-time events, and Web UI.

---

## 1. Historical Snapshots & Price Integrity
Current catalog item prices and details change over time. When an Order is created, Sellzy captures immutable line item snapshots:
- `productNameSnapshot`
- `variantNameSnapshot`
- `skuSnapshot`
- `barcodeSnapshot`
- `unitPriceMinor` (integer minor units, e.g. 1000 = $10.00)
- `unitCostMinor`
- `lineSubtotalMinor`
- `lineTotalMinor`

Future catalog price updates or product edits in Phase 05 do **not** affect historical order totals.

---

## 2. Order State Machine
Sellzy enforces strict status transitions through `OrderStateMachine`:

```
PENDING ──> CONFIRMED ──> PROCESSING ──> READY_TO_FULFILL ──> FULFILLING ──> SHIPPED ──> DELIVERED
   │           │              │                 │                   │
   ├──> ON_HOLD├──> ON_HOLD   ├──> ON_HOLD      ├──> ON_HOLD        ├──> ON_HOLD
   │           │              │                 │                   │
   └──> CANCEL └──> CANCEL    └──> CANCEL       └──> CANCEL         └──> CANCEL
```

- **Terminal States**: `DELIVERED` and `CANCELLED`.
- **Cancellation**: Cancelling an unfulfilled order automatically releases all active stock reservations via `InventoryService.releaseReservation`.
- **Invalid Transitions**: Direct jumps like `PENDING` → `DELIVERED` or `DELIVERED` → `CANCELLED` are strictly blocked.

---

## 3. Payment & Fulfillment Separation
Order status is distinct from payment and fulfillment status:
- **PaymentStatus**: `UNPAID`, `PENDING`, `AUTHORIZED`, `PAID`, `PARTIALLY_PAID`, `FAILED`, `REFUNDED`, `CANCELLED`.
- **Cash-on-Delivery (COD)**: Orders created with COD start with `paymentStatus: PENDING` and `paymentMethod: COD`.
- **FulfillmentStatus**: `PENDING`, `READY`, `PROCESSING`, `PACKED`, `SHIPPED`, `DELIVERED`, `FAILED`.

---

## 4. Idempotency & Order Numbering
- **Order Numbering**: Sequential, collision-safe human-readable order numbers generated atomically per tenant: `SZ-YYYY-000001`.
- **Idempotency Key**: Scoped key lookup `(tenantId, operation, idempotencyKey)` prevents double-order creation on retried requests.
