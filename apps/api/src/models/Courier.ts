import mongoose, { Schema, Document } from 'mongoose';
import { ICourier, CourierType, CourierStatus } from '@sellzy/shared';

export interface ICourierDocument extends Omit<ICourier, 'id'>, Document {}

const CourierSchema: Schema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    courierCode: { type: String, required: true, index: true },
    name: { type: String, required: true },
    type: { type: String, enum: Object.values(CourierType), default: CourierType.API, required: true },
    status: { type: String, enum: Object.values(CourierStatus), default: CourierStatus.ACTIVE, required: true },
    credentialsReference: { type: String, select: false },
    webhookSecretReference: { type: String, select: false },
    configuration: { type: Schema.Types.Mixed }
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        delete ret.credentialsReference;
        delete ret.webhookSecretReference;
        if (ret.configuration && typeof ret.configuration === 'object') {
          delete ret.configuration.apiKey;
          delete ret.configuration.apiSecret;
          delete ret.configuration.webhookSecret;
        }
        return ret;
      }
    }
  }
);

CourierSchema.index({ tenantId: 1, courierCode: 1 }, { unique: true });

export const CourierModel = mongoose.model<ICourierDocument>('Courier', CourierSchema);
