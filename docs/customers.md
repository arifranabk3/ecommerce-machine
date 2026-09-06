# Sellzy — Customers & CRM Module

## 1. Overview
The **Customers & CRM** module provides a multi-tenant, enterprise-grade customer relationship management foundation. It manages customer profiles, human-friendly customer numbers (`CUS-000001`), addresses, staff notes, immutable activity logs, lifecycle states, duplicate detection, atomic profile merge workflows, and dynamic customer segment evaluation.

## 2. Architecture & Data Principles
- **Source of Truth**: `Customer.ts` is the active source of truth for CRM profiles. `Order.ts` retains immutable `customerSnapshot` and address snapshots locked at time of order creation. Editing a customer profile never alters historical order records.
- **Atomic Customer Numbering**: `CustomerCounter.ts` produces sequential, tenant-isolated numbers (`CUS-000001`).
- **Identity Normalization**:
  - Email: `trim().toLowerCase()`
  - Phone: Strip whitespace/hyphens (`+15550192`)
- **Deduplication & Atomic Merge**:
  - `CustomerService.detectDuplicates` scores confidence matching normalized email (60%) and phone (40%).
  - `CustomerService.mergeCustomers` atomically transfers secondary addresses, notes, activities, and orders to primary while archiving secondary with `mergedIntoCustomerId`.

## 3. Dynamic Segments & Injection Defense
Segment rules strictly enforce allowlisted schema fields (`totalSpentMinor`, `totalOrders`, `averageOrderValueMinor`, `lifecycleStage`, `status`, `source`, `tags`, `country`) and safe operators (`eq`, `neq`, `gt`, `gte`, `lt`, `lte`, `in`, `contains`). Raw Mongo operations (`$where`, `$accumulator`) are strictly prohibited.

## 4. RBAC & Fine-Grained Permissions
- `customers.view`: View customer catalog, detail profiles, and metrics.
- `customers.create`: Create new customer accounts.
- `customers.update`: Edit customer contact info and lifecycle.
- `customers.archive`: Archive customer accounts while preserving order history.
- `customers.merge`: Perform atomic deduplication merge operations.
- `customers.notes`: Create and list staff internal notes.
- `customers.addresses`: Manage shipping/billing addresses.
- `customers.tags`: Assign or remove organizational tags.
- `customers.consent`: Update marketing consent records.
- `customers.segments.view` & `customers.segments.manage`: Dynamic segment controls.
