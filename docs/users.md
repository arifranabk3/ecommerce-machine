# Sellzy Platform — User & Membership Lifecycle Management

## Overview
Sellzy decouples global user credentials (`UserModel`) from store-level tenant memberships (`TenantMembershipModel`). A single user identity can belong to multiple tenants with completely distinct roles and permissions.

---

## 1. User & Membership Lifecycle States

```
                 Invitation Sent
                        │
                        ▼
               ┌────────────────┐
               │    INVITED     │
               └────────┬───────┘
                        │ Accept Invitation (Token Validated)
                        ▼
               ┌────────────────┐
               │     ACTIVE     ├──────────┐
               └───────┬────────┘          │
         Suspend       │                   │ Remove Member
         Member        ▼                   ▼
               ┌────────────────┐  ┌────────────────┐
               │   SUSPENDED    │  │    REMOVED     │
               └────────────────┘  └────────────────┘
```

### Lifecycle States Defined
- **`ACTIVE`**: Fully authorized team member. Can access tenant resources based on assigned roles.
- **`SUSPENDED`**: Access temporarily frozen by admin. `getEffectivePermissions` returns `[]`. Active sessions are immediately revoked (`revokeReason: MEMBERSHIP_SUSPENDED`).
- **`REMOVED`**: Member soft-deleted from tenant. Cannot access tenant endpoints. Active sessions immediately revoked.
- **`INVITED`**: Pending email invitation sent with 7-day token expiration.

---

## 2. Invitation Security & Workflow

### Security Rules
1. **Raw Token Protection**: Only the SHA256 hash (`tokenHash`) of the invitation token is stored in the database. Raw tokens are never logged or stored.
2. **Permission Ceiling Validation**: Users cannot invite new team members with roles containing permissions beyond their own ceiling.
3. **Owner Safeguard**: Only the existing Tenant Owner can invite another `Owner`.
4. **Platform Admin Boundary**: Cannot invite `PLATFORM_ADMIN` or `SUPER_ADMIN`.
5. **Rate Limiting & Cooldown**: Resending invitations enforces a 60-second cooldown per target email to prevent email spamming.
6. **Automatic Expiration**: Invitations automatically expire after 7 days (168 hours).

---

## 3. Session Management & Revocation

### Active Session Storage (`SessionModel`)
- Tracks `sessionId`, `userId`, `tenantId`, `token`, `userAgent`, `ipAddress`, `lastActivityAt`, and `expiresAt`.

### Revocation Triggers
- **Manual Revocation**: Admin calls `POST /api/v1/users/:id/revoke-sessions` or user calls `DELETE /api/v1/auth/sessions/:sessionId`.
- **Status Change**: Member suspended or removed -> all active sessions for that user in that tenant are marked `revokedAt: new Date()`.
- **Ownership Transfer**: Old owner sessions invalidated and permission cache cleared.

---

## 4. Ownership Transfer Workflow

```
1. Authenticated Tenant Owner calls POST /api/v1/users/transfer-ownership
2. Provide newOwnerUserId + password (Step-up authentication)
3. Validate current owner password via bcrypt
4. Verify target user has status: 'ACTIVE' in current tenant
5. Demote current owner -> isOwner: false, roles: ['Admin']
6. Promote target user -> isOwner: true, roles: ['Admin', 'Owner']
7. Update TenantModel ownerUserId
8. Invalidate Redis permission caches for both users
9. Log SystemEvents.OWNERSHIP_TRANSFERRED security audit log
```
