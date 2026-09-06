import { ConversationModel, IConversationDocument } from '../models/Conversation';
import { CommunicationChannel, ConversationStatus } from '@sellzy/shared';

export interface IGetOrCreateConversationParams {
  tenantId: string;
  customerId: string;
  channel: CommunicationChannel;
  channelConversationId?: string;
}

export class ConversationService {
  static async getOrCreateConversation(params: IGetOrCreateConversationParams): Promise<IConversationDocument> {
    const { tenantId, customerId, channel, channelConversationId } = params;

    let conv = await ConversationModel.findOne({ tenantId, customerId, channel });
    if (!conv) {
      conv = new ConversationModel({
        tenantId,
        customerId,
        channel,
        channelConversationId,
        status: ConversationStatus.OPEN,
        unreadCount: 0,
        lastMessageAt: new Date()
      });
      try {
        await conv.save();
      } catch (err: any) {
        if (err.code === 11000 || (err.message && err.message.includes('E11000'))) {
          const existing = await ConversationModel.findOne({ tenantId, customerId, channel });
          if (existing) return existing;
        }
        throw err;
      }
    }
    return conv;
  }

  async getOrCreateConversation(tenantId: string, customerId: string, channel: CommunicationChannel): Promise<IConversationDocument> {
    return ConversationService.getOrCreateConversation({ tenantId, customerId, channel });
  }

  static async assignConversation(tenantId: string, conversationId: string, assignedUserId: string): Promise<IConversationDocument> {
    const conv = await ConversationModel.findOne({ _id: conversationId, tenantId });
    if (!conv) {
      throw new Error(`Conversation not found for ID ${conversationId}`);
    }

    conv.assignedUserId = assignedUserId;
    await conv.save();
    return conv;
  }

  static async updateConversationStatus(tenantId: string, conversationId: string, status: ConversationStatus): Promise<IConversationDocument> {
    const conv = await ConversationModel.findOne({ _id: conversationId, tenantId });
    if (!conv) {
      throw new Error(`Conversation not found for ID ${conversationId}`);
    }

    conv.status = status;
    await conv.save();
    return conv;
  }

  async getConversations(tenantId: string, filters?: { status?: ConversationStatus; channel?: CommunicationChannel }, page = 1, limit = 20) {
    const query: any = { tenantId };
    if (filters?.status) query.status = filters.status;
    if (filters?.channel) query.channel = filters.channel;

    const skip = (page - 1) * limit;
    const [conversations, total] = await Promise.all([
      ConversationModel.find(query).sort({ lastMessageAt: -1 }).skip(skip).limit(limit),
      ConversationModel.countDocuments(query),
    ]);

    return { conversations, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async getConversationById(tenantId: string, conversationId: string) {
    return ConversationModel.findOne({ _id: conversationId, tenantId });
  }

  async incrementUnreadCount(tenantId: string, conversationId: string) {
    return ConversationModel.findOneAndUpdate(
      { _id: conversationId, tenantId },
      { $inc: { unreadCount: 1 }, $set: { lastMessageAt: new Date() } },
      { new: true }
    );
  }

  async resetUnreadCount(tenantId: string, conversationId: string) {
    return ConversationModel.findOneAndUpdate(
      { _id: conversationId, tenantId },
      { $set: { unreadCount: 0 } },
      { new: true }
    );
  }
}
