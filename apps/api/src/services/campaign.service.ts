import { CampaignModel } from '../models/Campaign';
import { CampaignRecipientModel } from '../models/CampaignRecipient';
import { CustomerModel } from '../models/Customer';
import { ConsentService } from './consent.service';
import { CampaignStatus, CampaignRecipientStatus, CommunicationChannel } from '@sellzy/shared';
import { MessageService } from './message.service';

export class CampaignService {
  private messageService = new MessageService();
  private consentService = new ConsentService();

  async createCampaign(params: {
    tenantId: string;
    name: string;
    channel: CommunicationChannel;
    templateId?: string;
    subject?: string;
    content: string;
    audienceFilter?: {
      tags?: string[];
      minOrdersCount?: number;
      minTotalSpent?: number;
      createdAfter?: Date;
    };
    scheduledAt?: Date;
    idempotencyKey?: string;
  }) {
    if (params.idempotencyKey) {
      const existing = await CampaignModel.findOne({
        tenantId: params.tenantId,
        idempotencyKey: params.idempotencyKey,
      });
      if (existing) return existing;
    }

    try {
      const campaign = await CampaignModel.create({
        tenantId: params.tenantId,
        name: params.name,
        channel: params.channel,
        status: params.scheduledAt ? CampaignStatus.SCHEDULED : CampaignStatus.DRAFT,
        templateId: params.templateId || undefined,
        subject: params.subject || undefined,
        content: params.content,
        audienceFilter: params.audienceFilter || {},
        scheduledAt: params.scheduledAt || undefined,
        idempotencyKey: params.idempotencyKey || undefined,
        metrics: {
          totalRecipients: 0,
          sentCount: 0,
          deliveredCount: 0,
          readCount: 0,
          failedCount: 0,
        },
      });
      return campaign;
    } catch (err: any) {
      if (err.code === 11000 && params.idempotencyKey) {
        const existing = await CampaignModel.findOne({
          tenantId: params.tenantId,
          idempotencyKey: params.idempotencyKey,
        });
        if (existing) return existing;
      }
      throw err;
    }
  }

  async getCampaigns(tenantId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [campaigns, total] = await Promise.all([
      CampaignModel.find({ tenantId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
      CampaignModel.countDocuments({ tenantId }),
    ]);

    return { campaigns, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async getCampaignById(tenantId: string, campaignId: string) {
    return CampaignModel.findOne({ _id: campaignId, tenantId });
  }

  async executeCampaign(tenantId: string, campaignId: string) {
    // Atomic state transition to prevent race condition when multiple requests execute simultaneously
    const campaign = await CampaignModel.findOneAndUpdate(
      {
        _id: campaignId,
        tenantId,
        status: { $in: [CampaignStatus.DRAFT, CampaignStatus.SCHEDULED, CampaignStatus.APPROVED, CampaignStatus.PENDING_APPROVAL] },
      },
      {
        $set: {
          status: CampaignStatus.PROCESSING,
          startedAt: new Date(),
        },
      },
      { new: true }
    );

    if (!campaign) {
      const existing = await CampaignModel.findOne({ _id: campaignId, tenantId });
      if (!existing) throw new Error('Campaign not found');
      throw new Error(`Campaign cannot be executed because status is ${existing.status}`);
    }

    // 1. Build audience query
    const customerQuery: any = { tenantId };
    const filter = campaign.audienceFilter || {};

    const tags = filter.tags as string[] | undefined;
    if (tags && Array.isArray(tags) && tags.length > 0) {
      customerQuery.tags = { $in: tags };
    }
    if (filter.minOrdersCount !== undefined) {
      customerQuery.ordersCount = { $gte: filter.minOrdersCount };
    }
    if (filter.minTotalSpent !== undefined) {
      customerQuery.totalSpent = { $gte: filter.minTotalSpent };
    }
    if (filter.createdAfter) {
      customerQuery.createdAt = { $gte: filter.createdAfter };
    }

    const targetCustomers = await CustomerModel.find(customerQuery);
    campaign.metrics.totalRecipients = targetCustomers.length;
    await campaign.save();

    let sent = 0;
    let failed = 0;

    const channelKey = campaign.channel.toLowerCase() as 'whatsapp' | 'email' | 'sms';

    for (const customer of targetCustomers) {
      const customerIdStr = (customer._id as any).toString();

      // Immediate pre-dispatch consent check to prevent consent race condition!
      const optedIn = await this.consentService.isOptedIn(tenantId, customerIdStr, channelKey, true);

      // Create/upsert recipient record with atomic protection
      let recipient: any;
      try {
        recipient = await CampaignRecipientModel.create({
          tenantId,
          campaignId,
          customerId: customerIdStr,
          destination: customer.email || customer.phone || customerIdStr,
          status: optedIn ? CampaignRecipientStatus.PENDING : CampaignRecipientStatus.SKIPPED_CONSENT,
        });
      } catch (err: any) {
        if (err.code === 11000) {
          recipient = await CampaignRecipientModel.findOne({ tenantId, campaignId, customerId: customerIdStr });
          if (!recipient) continue;
        } else {
          throw err;
        }
      }

      if (!optedIn) {
        recipient.status = CampaignRecipientStatus.SKIPPED_CONSENT;
        recipient.errorMessage = 'Skipped due to missing marketing consent';
        await recipient.save();
        continue;
      }

      try {
        const msg = await this.messageService.sendMessage({
          tenantId,
          customerId: customerIdStr,
          recipientPhone: customer.phone,
          recipientEmail: customer.email,
          channel: campaign.channel,
          content: campaign.content || '',
          templateId: campaign.templateId,
          metadata: { campaignId, subject: campaign.subject },
          isMarketing: true,
        });

        if (msg.status === 'SENT' || msg.status === 'DELIVERED') {
          recipient.status = CampaignRecipientStatus.SENT;
          recipient.messageId = (msg._id as any).toString();
          sent++;
        } else {
          recipient.status = CampaignRecipientStatus.FAILED;
          recipient.errorMessage = msg.errorMessage || 'Send failure';
          failed++;
        }
      } catch (err: any) {
        recipient.status = CampaignRecipientStatus.FAILED;
        recipient.errorMessage = err.message || 'Dispatch error';
        failed++;
      }

      await recipient.save();
    }

    campaign.metrics.sentCount = sent;
    campaign.metrics.failedCount = failed;
    campaign.status = CampaignStatus.COMPLETED;
    campaign.completedAt = new Date();
    await campaign.save();

    return campaign;
  }

  async cancelCampaign(tenantId: string, campaignId: string) {
    const campaign = await CampaignModel.findOne({ _id: campaignId, tenantId });
    if (!campaign) throw new Error('Campaign not found');

    if (campaign.status === CampaignStatus.COMPLETED) {
      throw new Error('Completed campaign cannot be cancelled');
    }

    campaign.status = CampaignStatus.CANCELLED;
    campaign.cancelledAt = new Date();
    await campaign.save();
    return campaign;
  }
}
