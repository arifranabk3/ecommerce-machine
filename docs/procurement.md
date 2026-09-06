# Procurement & Purchase Order System

## Overview
The Procurement module manages purchase order lifecycles, stock replenishment, vendor acknowledgments, and warehouse receiving.

## State Machine
Purchase orders strictly move through state transitions:
`DRAFT` → `PENDING_APPROVAL` → `APPROVED` → `SUBMITTED` → `ACKNOWLEDGED` → `PARTIALLY_FULFILLED` / `FULFILLED` / `CANCELLED` / `ON_HOLD`

## Automated Procurement Features
1. **Order Split (`splitOrderToProcurement`)**: Customer sales orders are analyzed and automatically split by vendor into distinct purchase orders.
2. **Low-Stock Replenishment (`evaluateLowStockProcurement`)**: Automated reorder engine scans location inventory levels against reorder points and generates reorder POs.
3. **Goods Receiving (`receiveGoods`)**: Atomic inventory balance updates and `STOCK_RECEIVED` audit movements.
