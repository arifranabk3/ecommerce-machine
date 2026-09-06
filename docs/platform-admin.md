# Sellzy Platform Super Admin & Tenant Lifecycle Management

## Overview
Sellzy Super Admin (`/super-admin`) provides platform-level administrative capabilities, strict platform vs tenant RBAC separation, tenant suspension/reactivation, plan management, queue monitoring, system health checks, feature flags, maintenance mode controls, and platform audit logging.

## Platform Permissions Catalog
- `platform.dashboard.view`
- `platform.tenants.view`
- `platform.tenants.manage`
- `platform.tenants.suspend`
- `platform.tenants.reactivate`
- `platform.plans.view`
- `platform.plans.manage`
- `platform.subscriptions.view`
- `platform.subscriptions.manage`
- `platform.integrations.view`
- `platform.integrations.manage`
- `platform.webhooks.view`
- `platform.webhooks.manage`
- `platform.api_keys.view`
- `platform.api_keys.manage`
- `platform.usage.view`
- `platform.system_health.view`
- `platform.queues.view`
- `platform.audit.view`
- `platform.settings.manage`

## Tenant States & Transitions
- `ACTIVE`: Normal business operation.
- `TRIAL`: Evaluating platform features with initial quota.
- `PAST_DUE`: Payment failed; grace period active.
- `SUSPENDED`: Access blocked; data preserved safely for audit/recovery.
- `CANCELLED`: Subscription ended.
- `DELETED_PENDING`: Scheduled for soft archive.
