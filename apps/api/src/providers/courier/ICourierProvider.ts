import { ShipmentStatus } from '@sellzy/shared';

export interface ICreateShipmentResult {
  courierShipmentId: string;
  trackingNumber: string;
  trackingUrl?: string;
  labelUrl?: string;
  estimatedDeliveryAt?: Date;
}

export interface ITrackingResult {
  status: ShipmentStatus;
  carrierStatus: string;
  location?: string;
  description?: string;
  eventAt: Date;
}

export interface ICourierProvider {
  createShipment(params: any): Promise<ICreateShipmentResult>;
  cancelShipment(courierShipmentId: string): Promise<boolean>;
  getTracking(trackingNumber: string): Promise<ITrackingResult[]>;
  schedulePickup(shipmentId: string, pickupWindow: Date): Promise<boolean>;
  createLabel(shipmentId: string): Promise<{ labelUrl: string }>;
  verifyWebhook(headers: Record<string, string>, rawBody: string | Buffer): Promise<{
    isValid: boolean;
    providerEventId?: string;
    trackingNumber?: string;
    shipmentId?: string;
    eventType?: string;
    status?: ShipmentStatus;
  }>;
}
