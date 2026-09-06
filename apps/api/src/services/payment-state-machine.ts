import { PaymentStatus, RefundStatus } from '@sellzy/shared';

export class PaymentStateMachine {
  private static allowedPaymentTransitions: Record<PaymentStatus, PaymentStatus[]> = {
    [PaymentStatus.INITIATED]: [PaymentStatus.PENDING, PaymentStatus.FAILED, PaymentStatus.CANCELLED],
    [PaymentStatus.PENDING]: [
      PaymentStatus.AUTHORIZED,
      PaymentStatus.CAPTURED,
      PaymentStatus.FAILED,
      PaymentStatus.CANCELLED,
      PaymentStatus.EXPIRED
    ],
    [PaymentStatus.AUTHORIZED]: [PaymentStatus.CAPTURED, PaymentStatus.CANCELLED, PaymentStatus.FAILED],
    [PaymentStatus.CAPTURED]: [PaymentStatus.PARTIALLY_REFUNDED, PaymentStatus.REFUNDED],
    [PaymentStatus.PARTIALLY_REFUNDED]: [PaymentStatus.REFUNDED, PaymentStatus.PARTIALLY_REFUNDED],
    [PaymentStatus.REFUNDED]: [],
    [PaymentStatus.FAILED]: [],
    [PaymentStatus.CANCELLED]: [],
    [PaymentStatus.EXPIRED]: [],
    [PaymentStatus.UNPAID]: [PaymentStatus.PENDING, PaymentStatus.CAPTURED, PaymentStatus.AUTHORIZED],
    [PaymentStatus.PAID]: [PaymentStatus.REFUNDED, PaymentStatus.PARTIALLY_REFUNDED],
    [PaymentStatus.PARTIALLY_PAID]: [PaymentStatus.PAID, PaymentStatus.REFUNDED]
  };

  private static allowedRefundTransitions: Record<RefundStatus, RefundStatus[]> = {
    [RefundStatus.REQUESTED]: [RefundStatus.PENDING, RefundStatus.PROCESSING, RefundStatus.SUCCEEDED, RefundStatus.CANCELLED, RefundStatus.FAILED],
    [RefundStatus.PENDING]: [RefundStatus.PROCESSING, RefundStatus.SUCCEEDED, RefundStatus.FAILED, RefundStatus.CANCELLED],
    [RefundStatus.PROCESSING]: [RefundStatus.SUCCEEDED, RefundStatus.FAILED, RefundStatus.CANCELLED],
    [RefundStatus.SUCCEEDED]: [],
    [RefundStatus.FAILED]: [],
    [RefundStatus.CANCELLED]: []
  };

  static validatePaymentTransition(current: PaymentStatus, target: PaymentStatus): void {
    if (current === target) return;
    const allowed = this.allowedPaymentTransitions[current] || [];
    if (!allowed.includes(target)) {
      throw new Error(`Invalid payment status transition from ${current} to ${target}.`);
    }
  }

  static validateRefundTransition(current: RefundStatus, target: RefundStatus): void {
    if (current === target) return;
    const allowed = this.allowedRefundTransitions[current] || [];
    if (!allowed.includes(target)) {
      throw new Error(`Invalid refund status transition from ${current} to ${target}.`);
    }
  }
}
