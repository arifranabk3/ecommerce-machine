import { PlatformAuditModel } from '../models/PlatformAudit';

export interface IPlatformAuditEntry {
  actorId: string;
  actorEmail?: string;
  action: string;
  resource: string;
  resourceId?: string;
  tenantId?: string;
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
  reason?: string;
  result: 'SUCCESS' | 'FAILED';
  ipAddress?: string;
}

export class PlatformAuditService {
  /**
   * Record a privileged platform administrative audit log
   */
  static async record(entry: IPlatformAuditEntry) {
    // Sanitize secrets before logging
    const sanitize = (obj?: Record<string, unknown>) => {
      if (!obj) return obj;
      const clean = { ...obj };
      delete clean['password'];
      delete clean['jwtSecret'];
      delete clean['apiKey'];
      delete clean['signingSecret'];
      delete clean['providerSecret'];
      return clean;
    };

    return await PlatformAuditModel.create({
      ...entry,
      before: sanitize(entry.before),
      after: sanitize(entry.after)
    });
  }

  static async listLogs(limit = 100) {
    return await PlatformAuditModel.find().sort({ createdAt: -1 }).limit(limit);
  }
}
