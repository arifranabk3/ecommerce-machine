import { SaaSSubscriptionModel } from '../models/Subscription';
import { SaaSPlanModel } from '../models/Plan';
import { SaaSSubscriptionStatus } from '@sellzy/shared';
import { AppError } from '../middleware/error';

export interface IBillingWebhookPayload {
  eventId: string;
  eventType: string;
  provider: string;
  tenantId: string;
  providerSubscriptionId?: string;
  status?: string;
}

export class SaaSBillingService {
  /**
   * Provider Adapter Interface logic (Decoupled Billing Provider Boundary)
   */
  static async createSubscription(tenantId: string, planSlug: string, billingCycle: 'MONTHLY' | 'YEARLY' = 'MONTHLY') {
    const plan = await SaaSPlanModel.findOne({ slug: planSlug.toUpperCase() });
    if (!plan) throw new AppError(`SaaS Plan ${planSlug} not found`, 404, 'NOT_FOUND');

    const periodEnd = new Date();
    periodEnd.setMonth(periodEnd.getMonth() + (billingCycle === 'YEARLY' ? 12 : 1));

    const sub = await SaaSSubscriptionModel.findOneAndUpdate(
      { tenantId },
      {
        tenantId,
        planId: plan._id.toString(),
        status: SaaSSubscriptionStatus.ACTIVE,
        billingCycle,
        currency: plan.currency,
        currentPeriodStart: new Date(),
        currentPeriodEnd: periodEnd,
        provider: 'STRIPE_MOCK',
        cancelAtPeriodEnd: false
      },
      { upsert: true, new: true }
    );

    return sub;
  }

  /**
   * Idempotent Billing Webhook Event Processor (Duplicate protection)
   */
  private static processedWebhookEvents: Set<string> = new Set();

  static async handleBillingWebhook(payload: IBillingWebhookPayload) {
    if (this.processedWebhookEvents.has(payload.eventId)) {
      return { processed: false, duplicate: true };
    }

    this.processedWebhookEvents.add(payload.eventId);

    if (payload.eventType === 'subscription.updated' || payload.eventType === 'invoice.paid') {
      await SaaSSubscriptionModel.updateOne(
        { tenantId: payload.tenantId },
        { status: SaaSSubscriptionStatus.ACTIVE }
      );
    } else if (payload.eventType === 'invoice.payment_failed') {
      await SaaSSubscriptionModel.updateOne(
        { tenantId: payload.tenantId },
        { status: SaaSSubscriptionStatus.PAST_DUE }
      );
    }

    return { processed: true, duplicate: false };
  }
}
