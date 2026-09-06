# Sellzy Platform — Financial Transaction Ledger & Cash Flow

## Immutable Finance Ledger
All cash inflows and outflows are recorded in `FinancialTransaction`:
- `PAYMENT`: Credit transaction for captured gross sales.
- `REFUND`: Debit transaction for customer refunds.
- `PAYMENT_FEE`: Debit transaction for payment gateway processing fees and taxes.
- `COD_COLLECTION`: Credit transaction for collected cash on delivery orders.

## Cash Flow Calculation
$$\text{Net Collections} = \text{Gross Revenue} - \text{Refunds} - \text{Payment Fees}$$

Financial transactions are append-only and immutable. Corrections require explicit reversal entries.
