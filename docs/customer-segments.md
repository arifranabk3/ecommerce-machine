# Sellzy — Customer Segments & Security Specification

## 1. Structured Condition Engine
Dynamic customer segments evaluate structured criteria without executing arbitrary user code.

### Supported Fields
- `totalSpentMinor` (integer minor units)
- `totalOrders` (integer count)
- `averageOrderValueMinor` (integer minor units)
- `lifecycleStage` (`NEW`, `ACTIVE`, `REPEAT`, `VIP`, `AT_RISK`, `DORMANT`, `LOST`)
- `status` (`ACTIVE`, `INACTIVE`, `BLOCKED`, `ARCHIVED`)
- `source` (`WEBSITE`, `MANUAL`, `IMPORT`, `API`, `WHATSAPP`, `FACEBOOK`, `INSTAGRAM`, `MARKETPLACE`, `OTHER`)
- `tags` (array match)
- `country` (ISO country string)

### Allowed Operators
- `eq`: Exact equality
- `neq`: Not equal
- `gt`: Greater than
- `gte`: Greater than or equal to
- `lt`: Less than
- `lte`: Less than or equal to
- `in`: Value contained in array
- `contains`: Regex case-insensitive string match

## 2. Anti-Injection Rules
- Any query payload containing `$where`, `javascript`, or un-allowlisted fields is rejected by Zod validation in `packages/validation`.
- Segments are scoped rigidly to `tenantId`.
