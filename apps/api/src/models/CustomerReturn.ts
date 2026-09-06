import mongoose, { Schema, Document } from 'mongoose';
import { ICustomerReturn, CustomerReturnStatus } from '@sellzy/shared';

export interface ICustomerReturnDocument extends Omit<ICustomerReturn, 'id'>, Document {}

const CustomerReturnSchema: Schema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    returnNumber: { type: String, required: true, index: true },
    orderId: { type: String, required: true, index: true },
    customerId: { type: String, required: true, index: true },
    status: {
      type: String,
      enum: Object.values(CustomerReturnStatus),
      default: CustomerReturnStatus.REQUESTED,
      required: true,
      index: true
    },
    reason: { type: String, required: true },
    customerNotes: { type: String },
    requestedAt: { type: Date, required: true, default: Date.now },
    approvedAt: { type: Date },
    receivedAt: { type: Date },
    closedAt: { type: Date },
    createdBy: { type: String }
  },
  {
    timestamps: true
  }
);

CustomerReturnSchema.index({ tenantId: 1, returnNumber: 1 }, { unique: true });
CustomerReturnSchema.index({ tenantId: 1, orderId: 1, createdAt: -1 });

export const CustomerReturnModel = mongoose.model<ICustomerReturnDocument>('CustomerReturn', CustomerReturnSchema);
