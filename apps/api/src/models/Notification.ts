import mongoose, { Schema, Document } from 'mongoose';
import { INotification, NotificationSeverity, CommunicationChannel } from '@sellzy/shared';

export interface INotificationDocument extends Omit<INotification, 'id'>, Document {
  isRead: boolean;
  body: string;
}

const NotificationSchema: Schema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    userId: { type: String, index: true },
    customerId: { type: String, index: true },
    type: { type: String, required: true, index: true },
    title: { type: String, required: true },
    message: { type: String },
    body: { type: String },
    channel: { type: String, enum: Object.values(CommunicationChannel), default: CommunicationChannel.EMAIL },
    severity: { type: String, enum: Object.values(NotificationSeverity), default: NotificationSeverity.INFO, required: true },
    entityType: { type: String },
    entityId: { type: String },
    data: { type: Schema.Types.Mixed, default: {} },
    readAt: { type: Date }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

NotificationSchema.virtual('isRead').get(function (this: any) {
  return !!this.readAt;
}).set(function (this: any, val: boolean) {
  if (val && !this.readAt) {
    this.readAt = new Date();
  } else if (!val) {
    this.readAt = undefined;
  }
});

NotificationSchema.virtual('bodyText').get(function (this: any) {
  return this.body || this.message;
}).set(function (this: any, val: string) {
  this.body = val;
  this.message = val;
});

NotificationSchema.index({ tenantId: 1, userId: 1, readAt: 1 });
NotificationSchema.index({ tenantId: 1, customerId: 1 });
NotificationSchema.index({ tenantId: 1, createdAt: -1 });

export const NotificationModel = mongoose.model<INotificationDocument>('Notification', NotificationSchema);
