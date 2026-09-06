# Sellzy Platform — Payment Security & Webhook Integrity

## Server-Authoritative Payment Rule
Client-submitted payment amounts, currencies, order totals, and status overrides are strictly rejected. The backend independently calculates expected totals from historical order documents in MongoDB.

## Webhook Signature Verification & Idempotency
Provider webhooks require raw body HMAC signature verification (`x-sellzy-signature`). Webhooks are deduplicated by `(provider, providerEventId)`. Repeated webhook deliveries trigger idempotent execution without duplicate state transitions or duplicate financial transactions.

## Card Data Policy
Raw primary account numbers (PAN), CVVs, and magnetic stripe data are NEVER stored or logged. Tokenized provider references are used exclusively.
