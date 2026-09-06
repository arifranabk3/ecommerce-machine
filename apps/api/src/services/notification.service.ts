import { NotificationModel } from '../models/Notification';
import { CommunicationChannel, NotificationSeverity } from '@sellzy/shared';
import { MessageService } from './message.service';

export class NotificationService {
  private messageService = new MessageService();

  async createNotification(params: {
    tenantId: string;
    customerId?: string;
    userId?: string;
    type: string;
    title: string;
    body: string;
    channel?: CommunicationChannel;
    severity?: NotificationSeverity;
    data?: Record<string, any>;
    dispatchImmediately?: boolean;
  }) {
    const notification = await NotificationModel.create({
      tenantId: params.tenantId,
      customerId: params.customerId || undefined,
      userId: params.userId || undefined,
      type: params.type,
      title: params.title,
      body: params.body,
      channel: params.channel || CommunicationChannel.EMAIL,
      severity: params.severity || NotificationSeverity.INFO,
      isRead: false,
      data: params.data || {},
    });

    if (params.dispatchImmediately && params.customerId && params.channel) {
      try {
        await this.messageService.sendMessage({
          tenantId: params.tenantId,
          customerId: params.customerId,
          channel: params.channel,
          content: `${params.title}\n\n${params.body}`,
          isMarketing: false, // Transactional!
          metadata: { notificationId: (notification._id as any).toString(), ...params.data },
        });
      } catch (err) {
        // Log but do not fail notification creation
      }
    }

    return notification;
  }

  async getNotifications(params: { tenantId: string; customerId?: string; userId?: string; isRead?: boolean; page?: number; limit?: number }) {
    const query: any = { tenantId: params.tenantId };
    if (params.customerId) query.customerId = params.customerId;
    if (params.userId) query.userId = params.userId;
    if (params.isRead !== undefined) query.isRead = params.isRead;

    const page = params.page || 1;
    const limit = params.limit || 20;
    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      NotificationModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      NotificationModel.countDocuments(query),
    ]);

    return { notifications, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async markAsRead(tenantId: string, notificationId: string) {
    const notification = await NotificationModel.findOne({ _id: notificationId, tenantId });
    if (!notification) throw new Error('Notification not found');

    notification.isRead = true;
    notification.readAt = new Date();
    await notification.save();
    return notification;
  }
}
