import mongoose, { Schema, Document } from 'mongoose';
import { IPurchaseOrder, PurchaseOrderStatus, PurchaseOrderSource } from '@sellzy/shared';

export interface IPurchaseOrderDocument extends Omit<IPurchaseOrder, 'id'>, Document {}

const PurchaseOrderSchema: Schema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    poNumber: { type: String, required: true, trim: true },
    normalizedPoNumber: { type: String, required: true, trim: true },
    vendorId: { type: String, required: true, index: true },
    vendorNameSnapshot: { type: String, required: true, trim: true },
    destinationLocationId: { type: String, required: true, index: true },
    status: {
      type: String,
      enum: Object.values(PurchaseOrderStatus),
      default: PurchaseOrderStatus.DRAFT,
      required: true,
      index: true
    },
    source: {
      type: String,
      enum: Object.values(PurchaseOrderSource),
      default: PurchaseOrderSource.MANUAL,
      required: true
    },
    salesOrderId: { type: String, index: true },
    currency: { type: String, required: true, default: 'USD', uppercase: true, length: 3 },
    subtotalMinor: { type: Number, required: true, min: 0 },
    taxCostMinor: { type: Number, required: true, default: 0, min: 0 },
    shippingCostMinor: { type: Number, required: true, default: 0, min: 0 },
    totalMinor: { type: Number, required: true, min: 0 },
    itemCount: { type: Number, required: true, min: 1 },
    expectedDeliveryDate: { type: Date },
    notes: { type: String },
    approvedBy: { type: String },
    approvedAt: { type: Date },
    submittedAt: { type: Date },
    acknowledgedAt: { type: Date },
    fulfilledAt: { type: Date },
    cancelledAt: { type: Date },
    createdBy: { type: String },
    updatedBy: { type: String }
  },
  {
    timestamps: true
  }
);

PurchaseOrderSchema.index({ tenantId: 1, normalizedPoNumber: 1 }, { unique: true });
PurchaseOrderSchema.index({ tenantId: 1, vendorId: 1, createdAt: -1 });
PurchaseOrderSchema.index({ tenantId: 1, status: 1, createdAt: -1 });
PurchaseOrderSchema.index({ tenantId: 1, salesOrderId: 1 });

export const PurchaseOrderModel = mongoose.model<IPurchaseOrderDocument>('PurchaseOrder', PurchaseOrderSchema);
