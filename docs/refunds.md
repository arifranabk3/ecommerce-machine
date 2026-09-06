# Sellzy Platform — Refund Math & Lifecycle

## Remaining Refundable Validation
The maximum allowable refund for any payment is bounded by:
$$\text{Remaining Refundable} = \text{Captured Amount} - \sum \text{Successful/Pending Refunds}$$

Any refund request exceeding this value is rejected with an explicit validation error.

## Refund Lifecycle
- `REQUESTED` → `PENDING` → `PROCESSING` → `SUCCEEDED`
- Idempotency key protection prevents duplicate refund dispatching.
- Successful refunds update Payment status to `PARTIALLY_REFUNDED` or `REFUNDED` and post a `REFUND` debit to the financial ledger.
