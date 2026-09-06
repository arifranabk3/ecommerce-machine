import { AuditLogModel } from '../models/AuditLog';
import { mailProvider } from '../utils/mail.provider';
import { logger } from '../utils/logger';

export interface SecurityEventOptions {
  tenantId: string;
  actorUserId: string;
  action: string;
  resourceType?: string;
  resourceId?: string;
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
  source?: string;
  metadata?: Record<string, unknown>;
  result?: 'SUCCESS' | 'FAILURE';
  userEmail?: string;
}

export class SecurityService {
  static async logSecurityEvent(options: SecurityEventOptions): Promise<void> {
    try {
      await AuditLogModel.create({
        tenantId: options.tenantId,
        actorUserId: options.actorUserId,
        action: options.action,
        resourceType: options.resourceType || 'AUTH',
        resourceId: options.resourceId || options.actorUserId,
        before: options.before,
        after: options.after,
        source: options.source || 'API',
        metadata: options.metadata || {},
        result: options.result || 'SUCCESS',
        timestamp: new Date()
      });

      logger.info({ action: options.action, tenantId: options.tenantId, userId: options.actorUserId }, 'Security Audit Event Recorded');
    } catch (err) {
      logger.error({ err }, 'Failed to record audit event');
    }
  }

  static async notifySecurityAlert(email: string, eventName: string, details: string): Promise<void> {
    const subject = `[Sellzy Security Alert] ${eventName}`;
    const html = `<p>Security Alert for your Sellzy Account:</p><p><strong>${eventName}</strong>: ${details}</p>`;
    await mailProvider.sendEmail(email, subject, html);
  }
}
