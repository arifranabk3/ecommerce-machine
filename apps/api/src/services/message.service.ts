import { MessageModel, IMessageDocument } from '../models/Message';
import { ConversationModel } from '../models/Conversation';
import { ConsentService } from './consent.service';
import { CommunicationChannel, MessageDirection, MessageStatus } from '@sellzy/shared';
import { MockWhatsAppProvider } from '../providers/communication/mock-whatsapp.provider';
import { MockEmailProvider } from '../providers/communication/IEmailProvider';
import { MockSmsProvider } from '../providers/communication/ISmsProvider';

const VALID_STATUS_TRANSITIONS: Record<MessageStatus, MessageStatus[]> = {
  [MessageStatus.QUEUED]: [MessageStatus.PROCESSING, MessageStatus.SENT, MessageStatus.FAILED, MessageStatus.CANCELLED],
  [MessageStatus.PENDING]: [MessageStatus.QUEUED, MessageStatus.PROCESSING, MessageStatus.SENT, MessageStatus.FAILED, MessageStatus.CANCELLED],
  [MessageStatus.PROCESSING]: [MessageStatus.SENT, MessageStatus.DELIVERED, MessageStatus.FAILED, MessageStatus.CANCELLED],
  [MessageStatus.SENT]: [MessageStatus.DELIVERED, MessageStatus.READ, MessageStatus.FAILED],
  [MessageStatus.DELIVERED]: [MessageStatus.READ],
  [MessageStatus.READ]: [],
  [MessageStatus.FAILED]: [],
  [MessageStatus.CANCELLED]: [],
};

export class MessageService {
  private whatsappProvider = new MockWhatsAppProvider();
  private emailProvider = new MockEmailProvider();
  private smsProvider = new MockSmsProvider();
  private consentService = new ConsentService();

  async sendMessage(params: {
    tenantId: string;
    conversationId?: string;
    customerId?: string;
    recipientPhone?: string;
    recipientEmail?: string;
    channel: CommunicationChannel;
    content: string;
    templateId?: string;
    mediaUrl?: string;
    metadata?: Record<string, any>;
    idempotencyKey?: string;
    isMarketing?: boolean;
    senderId?: string;
  }): Promise<IMessageDocument> {
    // 1. Idempotency Check
    if (params.idempotencyKey) {
      const existing = await MessageModel.findOne({
        tenantId: params.tenantId,
        idempotencyKey: params.idempotencyKey,
      });
      if (existing) {
        return existing;
      }
    }

    // 2. Consent Enforcement Check
    const channelKey = params.channel.toLowerCase() as 'whatsapp' | 'email' | 'sms';
    if (params.customerId && params.isMarketing) {
      const optedIn = await this.consentService.isOptedIn(params.tenantId, params.customerId, channelKey, true);
      if (!optedIn) {
        throw new Error(`Customer has not given explicit opt-in consent for ${params.channel} marketing communications`);
      }
    }

    // 3. Resolve or Create Conversation
    let conversationId = params.conversationId;
    if (!conversationId && params.customerId) {
      let conversation = await ConversationModel.findOne({
        tenantId: params.tenantId,
        customerId: params.customerId,
        channel: params.channel,
      });

      if (!conversation) {
        try {
          conversation = await ConversationModel.create({
            tenantId: params.tenantId,
            customerId: params.customerId,
            channel: params.channel,
            status: 'OPEN',
            lastMessageAt: new Date(),
            unreadCount: 0,
          });
        } catch (err: any) {
          if (err.code === 11000) {
            conversation = await ConversationModel.findOne({
              tenantId: params.tenantId,
              customerId: params.customerId,
              channel: params.channel,
            });
          }
        }
      }
      if (conversation) {
        conversationId = (conversation._id as any).toString();
      }
    }

    // 4. Atomic Message Document Creation with Duplicate Idempotency Key Handling
    let message: IMessageDocument;
    try {
      message = await MessageModel.create({
        tenantId: params.tenantId,
        conversationId: conversationId || undefined,
        customerId: params.customerId || undefined,
        channel: params.channel,
        direction: MessageDirection.OUTBOUND,
        status: MessageStatus.PENDING,
        content: params.content,
        templateId: params.templateId || undefined,
        mediaUrl: params.mediaUrl || undefined,
        idempotencyKey: params.idempotencyKey || undefined,
        metadata: params.metadata || {},
        senderId: params.senderId || undefined,
      });
    } catch (err: any) {
      if (err.code === 11000 && params.idempotencyKey) {
        const existing = await MessageModel.findOne({
          tenantId: params.tenantId,
          idempotencyKey: params.idempotencyKey,
        });
        if (existing) return existing;
      }
      throw err;
    }

    // 5. Send via provider
    try {
      let providerResp: { success: boolean; providerMessageId: string; status: string; error?: string };

      if (params.channel === CommunicationChannel.WHATSAPP) {
        const dest = params.recipientPhone || '1234567890';
        providerResp = await this.whatsappProvider.sendText(dest, params.content);
      } else if (params.channel === CommunicationChannel.EMAIL) {
        const dest = params.recipientEmail || 'customer@example.com';
        providerResp = await this.emailProvider.sendEmail({
          to: dest,
          subject: (params.metadata?.subject as string) || 'Notification from Sellzy',
          body: params.content,
        });
      } else if (params.channel === CommunicationChannel.SMS) {
        const dest = params.recipientPhone || '1234567890';
        providerResp = await this.smsProvider.sendSms({
          to: dest,
          body: params.content,
        });
      } else {
        providerResp = {
          success: true,
          providerMessageId: `msg_system_${Date.now()}`,
          status: 'SENT',
        };
      }

      if (providerResp.success) {
        message.status = MessageStatus.SENT;
        message.providerMessageId = providerResp.providerMessageId;
        message.sentAt = new Date();
      } else {
        message.status = MessageStatus.FAILED;
        message.errorMessage = providerResp.error || 'Provider delivery failure';
      }
    } catch (err: any) {
      message.status = MessageStatus.FAILED;
      message.errorMessage = err.message || 'Transmission error';
    }

    await message.save();

    // 6. Update conversation if exists
    if (conversationId) {
      await ConversationModel.updateOne(
        { _id: conversationId, tenantId: params.tenantId },
        {
          $set: {
            lastMessage: params.content,
            lastMessageAt: new Date(),
          },
        }
      );
    }

    return message;
  }

  async getMessages(tenantId: string, conversationId: string, limit = 50, page = 1) {
    const skip = (page - 1) * limit;
    const [messages, total] = await Promise.all([
      MessageModel.find({ tenantId, conversationId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      MessageModel.countDocuments({ tenantId, conversationId }),
    ]);

    return { messages, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async updateMessageStatus(tenantId: string, providerMessageId: string, targetStatus: MessageStatus, errorMessage?: string) {
    const message = await MessageModel.findOne({ tenantId, providerMessageId });
    if (!message) return null;

    // Validate delivery state machine transition
    if (message.status !== targetStatus) {
      const allowed = VALID_STATUS_TRANSITIONS[message.status] || [];
      if (!allowed.includes(targetStatus)) {
        throw new Error(`Invalid message status transition from ${message.status} to ${targetStatus}`);
      }
    }

    message.status = targetStatus;
    if (targetStatus === MessageStatus.DELIVERED) {
      message.deliveredAt = new Date();
    } else if (targetStatus === MessageStatus.READ) {
      message.readAt = new Date();
    } else if (targetStatus === MessageStatus.FAILED) {
      message.errorMessage = errorMessage;
    }

    await message.save();
    return message;
  }
}
