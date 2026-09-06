# Deterministic Supplier Selection Engine

## Algorithm
When routing items for auto-procurement, `SupplierSelectionService` performs a deterministic query:
```typescript
const candidateMappings = await VendorProductModel.find({
  tenantId,
  productId,
  variantId,
  availability: VendorProductAvailability.IN_STOCK
});
```
Mappings are evaluated against active vendors and sorted deterministically by:
1. Primary Flag & Priority Rank
2. Lowest Cost Price Minor (`costPriceMinor`)
3. Shortest Lead Time (`leadTimeDays`)
4. Lowest Minimum Order Quantity (`minimumOrderQuantity`)

## Exception Fallbacks
If no active vendor meeting constraints is found:
- Log `ProcurementException` with `reason: NO_SUPPLIER_FOUND`.
- Prevent broken PO generation while notifying operations teams via Socket.IO system events.
