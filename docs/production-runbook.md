# Sellzy SaaS Production Runbook

## 1. Environment Topology
- **Web App**: Next.js 14 SSG/SSR (`apps/web`, Port 3000)
- **API Server**: Express API (`apps/api`, Port 4000)
- **Worker**: BullMQ Background Worker (`apps/worker`)
- **Database**: MongoDB Atlas Replica Set (Primary + 2 Secondaries)
- **Cache/Queue**: Managed Redis 7 (TLS Enabled)
- **Reverse Proxy**: Nginx (Port 80/443 with TLS Termination)

## 2. Deployment Procedures
```bash
# 1. Pull latest verified release tag
git checkout tags/v1.0.0

# 2. Verify environment configuration
npm run build

# 3. Deploy container stack via Docker Compose
docker-compose -f docker-compose.prod.yml up -d --build

# 4. Verify deployment health
curl -f http://localhost/live
curl -f http://localhost/ready
```

## 3. Rollback Procedure
```bash
# 1. Rollback code containers to previous stable SHA
docker-compose -f docker-compose.prod.yml up -d --build api worker web

# 2. Database backward-compatible migration safety check
# Note: Migrations are append-safe and non-destructive.
```

## 4. Subsystem Health Checks
- **Process Liveness**: `GET /live`
- **Dependency Readiness**: `GET /ready`
- **Platform Health Dashboard**: `GET /api/v1/platform/health` (Requires `platform.system_health.view`)

## 5. Secret Rotation Procedures
### 5.1 JWT Secret Rotation
1. Deploy new `JWT_SECRET_NEW` environment variable while maintaining `JWT_SECRET` verification capability.
2. Force active users to re-authenticate or re-issue tokens during next session refresh.
3. Remove legacy `JWT_SECRET`.

### 5.2 API Key Rotation
1. Invoke `POST /api/v1/api-keys/:id/revoke` to invalidate compromised key.
2. Generate new key via `POST /api/v1/api-keys` and record one-time raw secret.

## 6. Backup & Restore Execution
- **Automated Backup**: MongoDB Atlas automated snapshot scheduled every 6 hours with 30-day retention.
- **Manual Point-in-time Restore**: Execute via MongoDB Atlas Console or `mongorestore` tool into staging target.
