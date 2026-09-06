# Phase 05 — Product & Catalog Architecture

## Overview
Sellzy's product management engine provides multi-tenant, SKU-normalized product catalog capabilities supporting simple and variant products, integer minor-unit pricing, gross margin calculations, supplier product mapping, and category hierarchy.

## Key Principles
1. **Tenant Isolation**: Every product, variant, and category belongs strictly to a `tenantId`.
2. **Integer Minor Units**: All monetary values (`costPrice`, `sellingPrice`, `compareAtPrice`, `supplierCost`, `grossMarginAmount`) are stored as non-negative integers in minor currency units (cents/paisa).
3. **SKU Normalization & Uniqueness**: SKUs are uppercase trimmed strings. Unique index `{ tenantId: 1, normalizedSKU: 1 }` prevents SKU collision across products and variants.
4. **Calculated Gross Margin**:
   - `grossMarginAmount = max(0, sellingPrice - costPrice)`
   - `grossMarginPercentage = sellingPrice > 0 ? (grossMarginAmount / sellingPrice) * 100 : 0`
5. **Supplier Mapping**: Products & variants map suppliers with supplier SKU, cost, lead time, and preferred status.
