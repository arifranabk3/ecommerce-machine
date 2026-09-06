import { OrderStatus } from '@sellzy/shared';
import { AppError } from '../middleware/error';

export class OrderStateMachine {
  private static readonly ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
    [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED, OrderStatus.ON_HOLD, OrderStatus.FAILED],
    [OrderStatus.CONFIRMED]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED, OrderStatus.ON_HOLD],
    [OrderStatus.PROCESSING]: [OrderStatus.READY_TO_FULFILL, OrderStatus.CANCELLED, OrderStatus.ON_HOLD],
    [OrderStatus.READY_TO_FULFILL]: [OrderStatus.FULFILLING, OrderStatus.ON_HOLD, OrderStatus.CANCELLED],
    [OrderStatus.FULFILLING]: [OrderStatus.SHIPPED, OrderStatus.ON_HOLD, OrderStatus.CANCELLED],
    [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
    [OrderStatus.DELIVERED]: [], // Terminal state - no normal transitions allowed
    [OrderStatus.CANCELLED]: [], // Terminal state
    [OrderStatus.FAILED]: [OrderStatus.CANCELLED],
    [OrderStatus.ON_HOLD]: [OrderStatus.PENDING, OrderStatus.CONFIRMED, OrderStatus.PROCESSING, OrderStatus.CANCELLED]
  };

  /**
   * Validates whether a state transition from currentStatus to targetStatus is allowed.
   */
  static validateTransition(currentStatus: OrderStatus, targetStatus: OrderStatus): void {
    if (currentStatus === targetStatus) {
      return; // No-op, allowed safely
    }

    const allowed = this.ALLOWED_TRANSITIONS[currentStatus] || [];
    if (!allowed.includes(targetStatus)) {
      throw new AppError(
        `Invalid status transition from ${currentStatus} to ${targetStatus}`,
        400,
        'INVALID_ORDER_TRANSITION'
      );
    }
  }

  /**
   * Checks if cancellation is allowed from the current state.
   */
  static canCancel(currentStatus: OrderStatus): boolean {
    return currentStatus !== OrderStatus.DELIVERED && currentStatus !== OrderStatus.CANCELLED;
  }
}
