import { ReturnToOriginModel, IReturnToOriginDocument } from '../models/ReturnToOrigin';
import { ShipmentModel } from '../models/Shipment';
import { ShipmentService } from './shipment.service';
import { ShipmentNumberService } from './shipment-number.service';
import { RTOStateMachine } from './shipment-state-machine';
import { RTOStatus, ShipmentStatus } from '@sellzy/shared';

export interface IInitiateRTOParams {
  tenantId: string;
  shipmentId: string;
  reason: string;
  notes?: string;
}

export class RTOService {
  static async initiateRTO(params: IInitiateRTOParams): Promise<IReturnToOriginDocument> {
    const { tenantId, shipmentId, reason, notes } = params;

    const shipment = await ShipmentModel.findOne({ _id: shipmentId, tenantId });
    if (!shipment) {
      throw new Error(`Shipment not found for ID ${shipmentId}`);
    }

    if (shipment.status === ShipmentStatus.DELIVERED || shipment.status === ShipmentStatus.CANCELLED) {
      throw new Error(`Invalid shipment status transition to RTO: cannot initiate RTO on shipment in status ${shipment.status}`);
    }

    // Idempotency check: if RTO already initiated for this shipment, return existing
    const existing = await ReturnToOriginModel.findOne({ tenantId, shipmentId });
    if (existing) {
      return existing;
    }

    // Update shipment status to RTO_INITIATED
    await ShipmentService.updateShipmentStatus(
      tenantId,
      shipmentId,
      ShipmentStatus.RTO_INITIATED,
      'RTO Initiated',
      undefined,
      reason,
      'SYSTEM'
    );

    const rtoNumber = await ShipmentNumberService.generateRTONumber(tenantId);

    const rto = new ReturnToOriginModel({
      tenantId,
      rtoNumber,
      shipmentId,
      orderId: shipment.orderId,
      vendorId: shipment.vendorId,
      reason,
      attemptCount: 1,
      status: RTOStatus.INITIATED,
      rtoCostMinor: 0,
      currency: shipment.currency || 'PKR',
      initiatedAt: new Date(),
      notes
    });

    try {
      await rto.save();
      return rto;
    } catch (err: any) {
      if (err.code === 11000 || (err.message && err.message.includes('E11000'))) {
        const found = await ReturnToOriginModel.findOne({ tenantId, shipmentId });
        if (found) return found;
      }
      throw err;
    }
  }

  static async updateRTOStatus(
    tenantId: string,
    rtoId: string,
    nextStatus: RTOStatus,
    notes?: string
  ): Promise<IReturnToOriginDocument> {
    const rto = await ReturnToOriginModel.findOne({ _id: rtoId, tenantId });
    if (!rto) {
      throw new Error(`RTO record not found for ID ${rtoId}`);
    }

    RTOStateMachine.validateTransition(rto.status as RTOStatus, nextStatus);

    rto.status = nextStatus;
    if (notes) rto.notes = notes;
    if (nextStatus === RTOStatus.DELIVERED) {
      rto.deliveredAt = new Date();
      await ShipmentService.updateShipmentStatus(
        tenantId,
        rto.shipmentId,
        ShipmentStatus.RTO_DELIVERED,
        'RTO Package Delivered',
        undefined,
        'RTO physically delivered to warehouse',
        'SYSTEM'
      );
    }

    await rto.save();
    return rto;
  }
}
