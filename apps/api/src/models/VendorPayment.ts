import mongoose, { Schema, Document } from 'mongoose';
import { IVendorPayment, VendorPaymentStatus } from '@sellzy/shared';

export interface IVendorPaymentDocument extends Omit<IVendorPayment, 'id'>, Document {}

const VendorPaymentSchema: Schema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    vendorId: { type: String, required: true, index: true },
    settlementId: { type: String, required: true, index: true },
    paymentReference: { type: String, required: true, trim: true },
    amountMinor: {
      type: Number,
      required: true,
      validate: {
        validator: Number.isInteger,
        message: 'amountMinor must be an integer'
      }
    },
    currency: { type: String, required: true, uppercase: true, trim: true, default: 'PKR' },
    status: {
      type: String,
      enum: Object.values(VendorPaymentStatus),
      default: VendorPaymentStatus.PAID,
      required: true,
      index: true
    },
    provider: { type: String, trim: true },
    providerTransactionId: { type: String, trim: true },
    paidAt: { type: Date, default: Date.now },
    createdBy: { type: String }
  },
  {
    timestamps: true
  }
);

VendorPaymentSchema.index({ tenantId: 1, settlementId: 1, status: 1 }, { unique: true });
VendorPaymentSchema.index({ tenantId: 1, vendorId: 1, createdAt: -1 });

export const VendorPaymentModel = mongoose.model<IVendorPaymentDocument>(
  'VendorPayment',
  VendorPaymentSchema
);
