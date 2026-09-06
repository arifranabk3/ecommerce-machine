# Vendor Settlements & Reconciliation Engine

## Settlement Formula
Net Payable = `Gross Payable (CREDIT)` - `Return Adjustments (DEBIT)` - `RTO Adjustments (DEBIT)` - `Deductions (DEBIT)` + `Approved Manual Adjustments`

## Settlement State Machine
`DRAFT` → `CALCULATING` → `PENDING_REVIEW` → `PENDING_APPROVAL` → `APPROVED` → `PROCESSING` → `PAID` (or `RECONCILIATION_REQUIRED` on payment mismatch).

## Financial Reconciliation & Period Locking
- **VendorPayment**: Links settlement payouts to payment references.
- **SettlementReconciliation**: Detects mismatches between actual paid amount and expected net payable.
- **FinancialPeriod**: Allows locking accounting periods (`status: LOCKED`) to block backdated posting.
