import { ShipmentStatus, CustomerReturnStatus, RTOStatus } from '@sellzy/shared';

export class ShipmentStateMachine {
  private static allowedTransitions: Record<ShipmentStatus, ShipmentStatus[]> = {
    [ShipmentStatus.DRAFT]: [ShipmentStatus.READY, ShipmentStatus.CANCELLED],
    [ShipmentStatus.READY]: [ShipmentStatus.LABEL_CREATED, ShipmentStatus.PICKUP_SCHEDULED, ShipmentStatus.CANCELLED],
    [ShipmentStatus.LABEL_CREATED]: [ShipmentStatus.PICKUP_SCHEDULED, ShipmentStatus.PICKED_UP, ShipmentStatus.CANCELLED],
    [ShipmentStatus.PICKUP_SCHEDULED]: [ShipmentStatus.PICKED_UP, ShipmentStatus.CANCELLED],
    [ShipmentStatus.PICKED_UP]: [ShipmentStatus.IN_TRANSIT, ShipmentStatus.LOST, ShipmentStatus.DAMAGED],
    [ShipmentStatus.IN_TRANSIT]: [ShipmentStatus.OUT_FOR_DELIVERY, ShipmentStatus.DELIVERY_FAILED, ShipmentStatus.LOST, ShipmentStatus.DAMAGED],
    [ShipmentStatus.OUT_FOR_DELIVERY]: [ShipmentStatus.DELIVERED, ShipmentStatus.DELIVERY_FAILED, ShipmentStatus.LOST, ShipmentStatus.DAMAGED],
    [ShipmentStatus.DELIVERY_FAILED]: [ShipmentStatus.OUT_FOR_DELIVERY, ShipmentStatus.RTO_INITIATED, ShipmentStatus.LOST, ShipmentStatus.DAMAGED],
    [ShipmentStatus.RTO_INITIATED]: [ShipmentStatus.RTO_IN_TRANSIT, ShipmentStatus.LOST, ShipmentStatus.DAMAGED],
    [ShipmentStatus.RTO_IN_TRANSIT]: [ShipmentStatus.RTO_DELIVERED, ShipmentStatus.LOST, ShipmentStatus.DAMAGED],
    [ShipmentStatus.DELIVERED]: [],
    [ShipmentStatus.RTO_DELIVERED]: [],
    [ShipmentStatus.CANCELLED]: [],
    [ShipmentStatus.LOST]: [],
    [ShipmentStatus.DAMAGED]: []
  };

  static canTransition(current: ShipmentStatus, next: ShipmentStatus): boolean {
    if (current === next) return true;
    const allowed = this.allowedTransitions[current] || [];
    return allowed.includes(next);
  }

  static validateTransition(current: ShipmentStatus, next: ShipmentStatus): void {
    if (!this.canTransition(current, next)) {
      throw new Error(`Invalid shipment status transition from ${current} to ${next}`);
    }
  }
}

export class ReturnStateMachine {
  private static allowedTransitions: Record<CustomerReturnStatus, CustomerReturnStatus[]> = {
    [CustomerReturnStatus.REQUESTED]: [CustomerReturnStatus.PENDING_REVIEW, CustomerReturnStatus.APPROVED, CustomerReturnStatus.REJECTED, CustomerReturnStatus.CANCELLED],
    [CustomerReturnStatus.PENDING_REVIEW]: [CustomerReturnStatus.APPROVED, CustomerReturnStatus.REJECTED, CustomerReturnStatus.CANCELLED],
    [CustomerReturnStatus.APPROVED]: [CustomerReturnStatus.PICKUP_SCHEDULED, CustomerReturnStatus.IN_TRANSIT, CustomerReturnStatus.RECEIVED, CustomerReturnStatus.APPROVED_FOR_REFUND, CustomerReturnStatus.CANCELLED],
    [CustomerReturnStatus.PICKUP_SCHEDULED]: [CustomerReturnStatus.IN_TRANSIT, CustomerReturnStatus.RECEIVED, CustomerReturnStatus.CANCELLED],
    [CustomerReturnStatus.IN_TRANSIT]: [CustomerReturnStatus.RECEIVED, CustomerReturnStatus.CANCELLED],
    [CustomerReturnStatus.RECEIVED]: [CustomerReturnStatus.INSPECTING, CustomerReturnStatus.APPROVED_FOR_REFUND, CustomerReturnStatus.REJECTED],
    [CustomerReturnStatus.INSPECTING]: [CustomerReturnStatus.APPROVED_FOR_REFUND, CustomerReturnStatus.REJECTED, CustomerReturnStatus.REPLACEMENT],
    [CustomerReturnStatus.APPROVED_FOR_REFUND]: [CustomerReturnStatus.REFUNDED, CustomerReturnStatus.CLOSED],
    [CustomerReturnStatus.REFUNDED]: [CustomerReturnStatus.CLOSED],
    [CustomerReturnStatus.REPLACEMENT]: [CustomerReturnStatus.CLOSED],
    [CustomerReturnStatus.REJECTED]: [CustomerReturnStatus.CLOSED],
    [CustomerReturnStatus.CLOSED]: [],
    [CustomerReturnStatus.CANCELLED]: []
  };

  static canTransition(current: CustomerReturnStatus, next: CustomerReturnStatus): boolean {
    if (current === next) return true;
    const allowed = this.allowedTransitions[current] || [];
    return allowed.includes(next);
  }

  static validateTransition(current: CustomerReturnStatus, next: CustomerReturnStatus): void {
    if (!this.canTransition(current, next)) {
      throw new Error(`Invalid customer return status transition from ${current} to ${next}`);
    }
  }
}

export class RTOStateMachine {
  private static allowedTransitions: Record<RTOStatus, RTOStatus[]> = {
    [RTOStatus.INITIATED]: [RTOStatus.IN_TRANSIT, RTOStatus.LOST, RTOStatus.DAMAGED, RTOStatus.CANCELLED],
    [RTOStatus.IN_TRANSIT]: [RTOStatus.DELIVERED, RTOStatus.LOST, RTOStatus.DAMAGED, RTOStatus.CANCELLED],
    [RTOStatus.DELIVERED]: [],
    [RTOStatus.LOST]: [],
    [RTOStatus.DAMAGED]: [],
    [RTOStatus.CANCELLED]: []
  };

  static canTransition(current: RTOStatus, next: RTOStatus): boolean {
    if (current === next) return true;
    const allowed = this.allowedTransitions[current] || [];
    return allowed.includes(next);
  }

  static validateTransition(current: RTOStatus, next: RTOStatus): void {
    if (!this.canTransition(current, next)) {
      throw new Error(`Invalid RTO status transition from ${current} to ${next}`);
    }
  }
}
