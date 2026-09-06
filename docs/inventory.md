# Phase 05 — Multi-Location Inventory & Movement Ledger Architecture

## Overview
Sellzy implements a real-time, multi-location inventory ledger system designed for concurrency safety, zero-negative-stock guarantees, transient reservations, and immutable movement logging.

## Core Formula
$$\text{quantityAvailable} = \text{quantityOnHand} - \text{quantityReserved}$$

## Key Features
1. **Atomic Concurrency Control**:
   - Stock decrements and reservations execute atomic MongoDB conditional updates (`$inc` with `quantityAvailable: { $gte: qty }`).
   - Prevents race conditions and negative inventory under high-concurrency requests.
2. **Immutable Inventory Movement Ledger**:
   - Every stock adjustment, transfer, reservation, or consumption creates an immutable `InventoryMovement` entry storing `quantityBefore`, `quantityAfter`, `quantityDelta`, `movementType`, `referenceType`, `referenceId`, and `actorUserId`.
3. **Idempotency Safeguard**:
   - Stock mutation operations accept an optional `idempotencyKey`. Duplicate requests with the same key safely return the previously generated inventory state without repeating the stock mutation.
4. **Transient Stock Reservations**:
   - Supports active reservations with expiration TTL (e.g. checkout holds).
   - Reservations can be explicitly `RELEASED` (restoring available stock) or `CONSUMED` (deducting on-hand stock upon completed order).
5. **Multi-Location Transfers**:
   - Atomic two-step stock movement between active locations within the same tenant.
