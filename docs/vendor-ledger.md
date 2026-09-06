# Vendor Ledger & Financial Subledger — Technical Specification

## Overview & Financial Principles
The Sellzy Vendor Ledger is the immutable source of truth for all vendor payables, return adjustments, RTO deductions, manual adjustments, reversals, and settlements.

### Key Rules
1. **Append-Only Immutability**: Once posted, `POSTED` ledger entries CANNOT be updated or deleted. Corrections are strictly created as `REVERSAL` or `ADJUSTMENT` entries.
2. **Integer Minor Units**: All money amounts are integer minor units (e.g. PKR 1,250.50 -> 125050). Floats, NaN, Infinity, and unauthorized negative numbers are rejected.
3. **Double-Entry-like Integrity**: Every ledger entry has explicit direction (`CREDIT` for payables owed to vendor, `DEBIT` for settlements/returns/deductions).
4. **Historical Cost Snapshots**: `ORDER_PAYABLE` entries use historical cost snapshots at order creation time (never recalculating from dynamic vendor product prices).

---

## Data Model & Numbering
- **VendorLedgerEntry**: Model containing `tenantId`, `vendorId`, `entryNumber` (`LED-000001`), `entryType`, `direction`, `amountMinor`, `currency`, `sourceType`, `sourceId`, `status` (`POSTED`/`REVERSED`), `reversalOfEntryId`.
- **VendorSettlement**: Model tracking settlement calculations (`grossPayableMinor`, `returnAdjustmentsMinor`, `rtoAdjustmentsMinor`, `deductionsMinor`, `netPayableMinor`), settlement numbers (`SET-YYYY-000001`), and locks eligible entries.

---

## Double Settlement Protection & Entry Locking
When a settlement transitions to `APPROVED`, all underlying eligible `POSTED` ledger entries for that period are tagged with `settlementId`. Subsequent settlement queries exclude entries with an existing `settlementId`, preventing duplicate payouts.
