import crypto from 'crypto';
import { ICourierProvider, ICreateShipmentResult, ITrackingResult } from './ICourierProvider';
import { ShipmentStatus } from '@sellzy/shared';

export class MockCourierProvider implements ICourierProvider {
  private secret = 'mock_courier_webhook_secret';

  async createShipment(params: any): Promise<ICreateShipmentResult> {
    const id = params.shipmentId || `mock_shp_${Date.now()}`;
    const trackingNumber = `TRK-${Math.floor(100000 + Math.random() * 900000)}`;
    return {
      courierShipmentId: id,
      trackingNumber,
      trackingUrl: `https://courier.example.com/track/${trackingNumber}`,
      labelUrl: `https://courier.example.com/label/${id}.pdf`,
      estimatedDeliveryAt: new Date(Date.now() + 3 * 24 * 3600 * 1000)
    };
  }

  async cancelShipment(courierShipmentId: string): Promise<boolean> {
    return true;
  }

  async getTracking(trackingNumber: string): Promise<ITrackingResult[]> {
    return [
      {
        status: ShipmentStatus.PICKED_UP,
        carrierStatus: 'Picked Up from Origin Warehouse',
        location: 'Lahore Hub',
        description: 'Package received by courier',
        eventAt: new Date()
      }
    ];
  }

  async schedulePickup(shipmentId: string, pickupWindow: Date): Promise<boolean> {
    return true;
  }

  async createLabel(shipmentId: string): Promise<{ labelUrl: string }> {
    return { labelUrl: `https://courier.example.com/label/${shipmentId}.pdf` };
  }

  generateTestSignature(payload: any): string {
    const str = typeof payload === 'string' ? payload : JSON.stringify(payload);
    return crypto.createHmac('sha256', this.secret).update(str).digest('hex');
  }

  async verifyWebhook(headers: Record<string, string>, rawBody: string | Buffer): Promise<{
    isValid: boolean;
    providerEventId?: string;
    trackingNumber?: string;
    shipmentId?: string;
    eventType?: string;
    status?: ShipmentStatus;
  }> {
    const signature = headers['x-courier-signature'] || headers['X-Courier-Signature'];
    const bodyStr = typeof rawBody === 'string' ? rawBody : rawBody.toString('utf8');

    if (!signature) return { isValid: false };
    const expected = crypto.createHmac('sha256', this.secret).update(bodyStr).digest('hex');
    if (signature !== expected) return { isValid: false };

    try {
      const parsed = JSON.parse(bodyStr);
      return {
        isValid: true,
        providerEventId: parsed.eventId || `evt_${Date.now()}`,
        trackingNumber: parsed.trackingNumber,
        shipmentId: parsed.shipmentId,
        eventType: parsed.eventType || 'STATUS_UPDATE',
        status: parsed.status ? (parsed.status as ShipmentStatus) : ShipmentStatus.IN_TRANSIT
      };
    } catch {
      return { isValid: false };
    }
  }
}
