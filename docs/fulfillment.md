# Sellzy — Fulfillment & Tracking Architecture

## Overview
Fulfillment in Sellzy handles order packing, shipment tracking, and delivery updates. Fulfillment records remain decoupled from core Order business documents while syncing fulfillment status back to the order.

---

## 1. Fulfillment Lifecycle
```
PENDING ──> READY ──> PROCESSING ──> PACKED ──> SHIPPED ──> DELIVERED
```

- **Fulfillment Model**: `Fulfillment.ts` stores `tenantId`, `orderId`, `locationId`, `status`, `trackingNumber`, `carrierCode`, `packedAt`, `shippedAt`, `deliveredAt`.
- **Location Scope**: Fulfillment operations specify source warehouse/store `locationId` where stock was packed.
- **Order Sync**: Updating a fulfillment automatically syncs the order's `fulfillmentStatus` and records an immutable entry in `OrderTimeline`.
