import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderIdempotencyDocument extends Document {
  tenantId: string;
  operation: string;
  idempotencyKey: string;
  orderId: string;
  responseData: any;
  createdAt: Date;
}

const OrderIdempotencySchema: Schema = new Schema(
  {
    tenantId: { type: String, required: true },
    operation: { type: String, required: true },
    idempotencyKey: { type: String, required: true },
    orderId: { type: String, required: true },
    responseData: { type: Schema.Types.Mixed, required: true }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

OrderIdempotencySchema.index({ tenantId: 1, operation: 1, idempotencyKey: 1 }, { unique: true });

export const OrderIdempotencyModel = mongoose.model<IOrderIdempotencyDocument>('OrderIdempotency', OrderIdempotencySchema);
