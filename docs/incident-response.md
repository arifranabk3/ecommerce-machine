# Sellzy SaaS Incident Response Plan

## 1. Overview & Escalation
This document outlines standard operational procedures for identifying, triaging, mitigating, and documenting infrastructure or application incidents across the Sellzy multi-tenant SaaS platform.

## 2. Emergency Escalation Hierarchy
- **Incident Commander**: DevOps Lead / Platform Architect
- **Technical Lead**: Core API Lead
- **Communications Owner**: Tenant Operations Lead

## 3. Incident Severity Levels
- **SEV-0 (Critical)**: Platform-wide outage, database corruption, active security breach, or tenant data leakage. Resolution Target: < 15 mins.
- **SEV-1 (High)**: Subsystem failure (Payment gateway outage, WhatsApp/SMS failure, BullMQ worker queue backing up). Resolution Target: < 1 hr.
- **SEV-2 (Medium)**: Degraded non-critical service (Analytics latency, export delay). Resolution Target: < 4 hrs.

## 4. Subsystem Outage Runbooks

### 4.1 Database Outage (MongoDB Atlas)
1. Verify database ping via `/api/v1/platform/health`.
2. Inspect MongoDB Atlas console for replica set primary failover status or network partition.
3. If primary failover stalls, initiate forced failover via Atlas Management Console.
4. Verify application reconnection upon primary election.

### 4.2 Redis Outage (ElastiCache / Upstash)
1. Verify Redis connectivity via PING command.
2. Confirm API rate limiting and session management fail closed safely without bypassing tenant permissions.
3. Restart managed Redis instance or failover to secondary replica node.
4. Re-populate active session cache from database on startup.

### 4.3 Payment Gateway Outage
1. Place payment gateway in Maintenance / Fallback mode via `/super-admin/integrations`.
2. Switch payment routing adapter to secondary gateway (e.g. Stripe -> Razorpay).
3. Queue pending payment webhooks in BullMQ for automatic retry.

### 4.4 WhatsApp / Communication Outage
1. Switch communication channels from WhatsApp Business API to transactional SMS fallback.
2. Log delivery failures in `CommunicationLogModel` without exposing secrets.

### 4.5 Courier / Logistics Outage
1. Flag courier provider status as `DEGRADED` in `/settings/couriers`.
2. Automatically reroute new shipments to secondary courier adapter.

### 4.6 Worker Outage
1. Inspect BullMQ queue backlog via `/super-admin/queues`.
2. Restart worker container instances: `docker-compose restart worker`.
3. Check failed job dead-letter queue and execute controlled job retries.

### 4.7 Security Incident / Credential Leak
1. Revoke compromised API keys, JWT secrets, or provider tokens immediately via `/super-admin/api-keys`.
2. Force user session invalidation across affected tenant domain (`SessionModel.updateMany({ tenantId }, { revoked: true })`).
3. Audit `PlatformAuditModel` to trace unauthorized access logs.

### 4.8 Tenant Data Corruption
1. Restore database snapshot to isolated staging instance.
2. Perform point-in-time document delta recovery for affected tenant collection.
3. Validate financial ledger balance reconciliation before re-enabling tenant traffic.
