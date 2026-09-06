import mongoose, { Schema, Document } from 'mongoose';
import { IOrder, OrderStatus, PaymentStatus, FulfillmentStatus, OrderSource, PaymentMethod } from '@sellzy/shared';

export interface IOrderDocument extends Omit<IOrder, 'id'>, Document {}

const CustomerSnapshotSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true }
  },
  { _id: false }
);

const AddressSnapshotSchema = new Schema(
  {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    postalCode: { type: String, trim: true },
    country: { type: String, trim: true }
  },
  { _id: false }
);

const OrderSchema: Schema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    orderNumber: { type: String, required: true, trim: true },
    normalizedOrderNumber: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
      required: true,
      index: true
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
      required: true,
      index: true
    },
    fulfillmentStatus: {
      type: String,
      enum: Object.values(FulfillmentStatus),
      default: FulfillmentStatus.PENDING,
      required: true,
      index: true
    },
    source: {
      type: String,
      enum: Object.values(OrderSource),
      default: OrderSource.MANUAL,
      required: true
    },
    channel: { type: String, trim: true },
    paymentMethod: {
      type: String,
      enum: Object.values(PaymentMethod),
      default: PaymentMethod.COD,
      required: true
    },
    externalOrderId: { type: String, trim: true },
    customerId: { type: String, index: true },
    customerSnapshot: { type: CustomerSnapshotSchema, required: true },
    billingAddressSnapshot: { type: AddressSnapshotSchema },
    shippingAddressSnapshot: { type: AddressSnapshotSchema },
    currency: { type: String, required: true, default: 'USD', uppercase: true, length: 3 },
    subtotalMinor: { type: Number, required: true, min: 0 },
    discountMinor: { type: Number, required: true, default: 0, min: 0 },
    shippingMinor: { type: Number, required: true, default: 0, min: 0 },
    taxMinor: { type: Number, required: true, default: 0, min: 0 },
    totalMinor: { type: Number, required: true, min: 0 },
    amountPaidMinor: { type: Number, required: true, default: 0, min: 0 },
    amountDueMinor: { type: Number, required: true, min: 0 },
    itemCount: { type: Number, required: true, min: 1 },
    notes: { type: String },
    metadata: { type: Schema.Types.Mixed },
    createdBy: { type: String },
    updatedBy: { type: String },
    cancelledAt: { type: Date },
    completedAt: { type: Date }
  },
  {
    timestamps: true
  }
);

// Compound Unique Indexes for Tenant Isolation
OrderSchema.index({ tenantId: 1, normalizedOrderNumber: 1 }, { unique: true });
OrderSchema.index({ tenantId: 1, source: 1, externalOrderId: 1 }, { unique: true, sparse: true });
OrderSchema.index({ tenantId: 1, status: 1, createdAt: -1 });
OrderSchema.index({ tenantId: 1, paymentStatus: 1 });
OrderSchema.index({ tenantId: 1, fulfillmentStatus: 1 });
OrderSchema.index({ tenantId: 1, customerId: 1, createdAt: -1 });
OrderSchema.index({ tenantId: 1, createdAt: -1 });

export const OrderModel = mongoose.model<IOrderDocument>('Order', OrderSchema);
