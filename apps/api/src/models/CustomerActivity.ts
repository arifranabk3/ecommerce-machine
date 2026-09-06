import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomerActivityDocument extends Document {
  tenantId: string;
  customerId: string;
  eventType: string;
  actorId?: string;
  source: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

const CustomerActivitySchema = new Schema<ICustomerActivityDocument>(
  {
    tenantId: { type: String, required: true, index: true },
    customerId: { type: String, required: true, index: true },
    eventType: { type: String, required: true, index: true },
    actorId: { type: String },
    source: { type: String, required: true, default: 'SYSTEM' },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

CustomerActivitySchema.index({ tenantId: 1, customerId: 1, createdAt: -1 });

export const CustomerActivityModel = mongoose.model<ICustomerActivityDocument>('CustomerActivity', CustomerActivitySchema);
