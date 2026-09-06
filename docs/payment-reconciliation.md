# Sellzy Platform — Payment Reconciliation System

## Purpose
The Payment Reconciliation System compares internal payment records against provider settlement feeds.

## Status Flags
- `MATCHED`: Internal amount, currency, and provider status match settlement report.
- `MISMATCH`: Amount, currency, or status mismatch detected. Flags `differenceMinor`.
- `MISSING_PROVIDER`: Payment captured internally but missing in provider report.
- `MISSING_INTERNAL`: Settlement present in provider report but missing in internal database.

Reconciliation discrepancies require manual resolution notes and step-up authorization.
