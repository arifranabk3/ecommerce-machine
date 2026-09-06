# Sellzy Platform — Payment System Architecture

## Overview
Sellzy's Payment System is built on a server-authoritative, double-entry style financial architecture. Frontend payment amounts, currencies, and client statuses are strictly informational. All payment amounts are derived from server order records.

## Payment State Machine
Allowed transitions for `PaymentStatus`:
- `INITIATED` → `PENDING`, `FAILED`, `CANCELLED`
- `PENDING` → `AUTHORIZED`, `CAPTURED`, `FAILED`, `CANCELLED`, `EXPIRED`
- `AUTHORIZED` → `CAPTURED`, `CANCELLED`, `FAILED`
- `CAPTURED` → `PARTIALLY_REFUNDED`, `REFUNDED`
- `PARTIALLY_REFUNDED` → `REFUNDED`, `PARTIALLY_REFUNDED`
- `REFUNDED`, `FAILED`, `CANCELLED`, `EXPIRED` → Terminal

## Payment Methods
- `CARD`
- `BANK_TRANSFER`
- `WALLET`
- `COD` (Cash On Delivery)
- `PREPAID`
- `OTHER`

## Monetary Precision
All monetary values are stored as **Integer Minor Units** (e.g. 10,000 minor units = 100.00 PKR). Floating point numbers, `NaN`, and `Infinity` are rejected by validation guards.
