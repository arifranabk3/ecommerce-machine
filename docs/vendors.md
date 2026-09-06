# Vendors & Suppliers Architecture

## Overview
Sellzy's Vendor & Supplier module enables multi-tenant ecommerce operations to manage supplier profiles, multi-channel vendor contacts, product cost mappings, lead times, minimum order thresholds, and vendor documents.

## Multi-Tenant Security & Data Models
- **Vendor (`Vendor.ts`)**: Authoritative vendor profiles isolated per tenant using compound unique index `{ tenantId: 1, normalizedVendorNumber: 1 }`.
- **Vendor Contact (`VendorContact.ts`)**: Multi-contact mapping for account managers and sales contacts.
- **Vendor Product (`VendorProduct.ts`)**: Maps internal catalog products and variants to vendor SKUs, minor unit cost prices, MOQs, lead times, and priority routing.
- **Vendor Note (`VendorNote.ts`)**: Internal staff notes attached to vendor accounts.
- **Vendor Document (`VendorDocument.ts`)**: Supplier contracts, tax compliance documents, and SLAs.

## Deterministic Supplier Selection
When customer orders are processed or stock falls below reorder points, `SupplierSelectionService` dynamically selects the optimal vendor using the following priority order:
1. `priority` (ASC)
2. `costPriceMinor` (ASC)
3. `leadTimeDays` (ASC)
4. `minimumOrderQuantity` (ASC)

If no valid vendor is available, a `ProcurementException` record is automatically emitted.
