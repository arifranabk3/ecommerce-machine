import { RefundModel, IRefundDocument } from '../models/Refund';
import { PaymentModel } from '../models/Payment';
import { PaymentNumberService } from './payment-number.service';
import { PaymentStateMachine } from './payment-state-machine';
import { FinanceService } from './finance.service';
import { MockPaymentProvider } from '../providers/mock-payment.provider';
import {
  RefundStatus,
  PaymentStatus,
  FinancialTransactionType,
  FinancialTransactionDirection
} from '@sellzy/shared';

export interface ICreateRefundParams {
  tenantId: string;
  paymentId: string;
  amountMinor: number;
  reason: string;
  idempotencyKey?: string;
  createdBy?: string;
  approvedBy?: string;
}

export class RefundService {
  private static provider = new MockPaymentProvider();

  /**
   * Calculates total already refunded amount for a payment.
   */
  static async getRefundedTotalMinor(tenantId: string, paymentId: string): Promise<number> {
    const refunds = await RefundModel.find({
      tenantId,
      paymentId,
      status: { $in: [RefundStatus.SUCCEEDED, RefundStatus.PROCESSING, RefundStatus.PENDING] }
    });
    return refunds.reduce((acc, r) => acc + r.amountMinor, 0);
  }

  /**
   * Requests a new refund enforcing remaining refundable math and idempotency.
   */
  static async requestRefund(params: ICreateRefundParams): Promise<IRefundDocument> {
    const { tenantId, paymentId, amountMinor, reason, idempotencyKey, createdBy, approvedBy } = params;

    if (!Number.isInteger(amountMinor) || amountMinor <= 0 || isNaN(amountMinor) || !isFinite(amountMinor)) {
      throw new Error('Invalid refund amount. Amount must be a positive integer minor unit.');
    }

    // Check Idempotency Key
    if (idempotencyKey) {
      const existing = await RefundModel.findOne({ tenantId, idempotencyKey });
      if (existing) {
        return existing;
      }
    }

    // Fetch Payment
    const payment = await PaymentModel.findOne({ _id: paymentId, tenantId });
    if (!payment) {
      throw new Error(`Payment not found for ID ${paymentId}`);
    }

    if (payment.status !== PaymentStatus.CAPTURED && payment.status !== PaymentStatus.PARTIALLY_REFUNDED) {
      throw new Error(`Payment ${paymentId} is not in a refundable state (status: ${payment.status}).`);
    }

    // Remaining Refundable Calculation
    const alreadyRefundedMinor = await this.getRefundedTotalMinor(tenantId, paymentId);
    const remainingRefundableMinor = payment.amountMinor - alreadyRefundedMinor;

    if (amountMinor > remainingRefundableMinor) {
      throw new Error(
        `Refund amount (${amountMinor}) exceeds remaining refundable amount (${remainingRefundableMinor}). Total captured: ${payment.amountMinor}, Already refunded: ${alreadyRefundedMinor}.`
      );
    }

    const refundNumber = await PaymentNumberService.generateRefundNumber(tenantId);

    const refund = new RefundModel({
      tenantId,
      refundNumber,
      paymentId,
      orderId: payment.orderId,
      amountMinor,
      currency: payment.currency,
      status: RefundStatus.REQUESTED,
      reason,
      idempotencyKey,
      createdBy,
      approvedBy
    });

    await refund.save();
    return refund;
  }

  /**
   * Approves and processes a refund through the provider.
   */
  static async processRefund(tenantId: string, refundId: string, approvedBy?: string): Promise<IRefundDocument> {
    const refund = await RefundModel.findOne({ _id: refundId, tenantId });
    if (!refund) {
      throw new Error(`Refund not found for ID ${refundId}`);
    }

    if (refund.status === RefundStatus.SUCCEEDED) {
      return refund; // Idempotent return
    }

    PaymentStateMachine.validateRefundTransition(refund.status, RefundStatus.SUCCEEDED);

    const payment = await PaymentModel.findOne({ _id: refund.paymentId, tenantId });
    if (!payment) {
      throw new Error(`Associated payment not found for refund ID ${refundId}`);
    }

    // Execute provider refund
    const providerRes = await this.provider.refundPayment({
      providerPaymentId: payment.providerPaymentId || payment._id.toString(),
      amountMinor: refund.amountMinor,
      currency: refund.currency,
      reason: refund.reason
    });

    refund.status = providerRes.status;
    refund.providerRefundId = providerRes.providerRefundId;
    refund.approvedBy = approvedBy || refund.approvedBy;
    refund.processedAt = new Date();
    await refund.save();

    // Post Financial Transaction for Refund
    await FinanceService.postTransaction({
      tenantId,
      type: FinancialTransactionType.REFUND,
      direction: FinancialTransactionDirection.DEBIT,
      amountMinor: refund.amountMinor,
      currency: refund.currency,
      sourceType: 'REFUND',
      sourceId: refund._id.toString()
    });

    // Recalculate total refunded for Payment state update
    const totalRefundedMinor = await this.getRefundedTotalMinor(tenantId, payment._id.toString());
    const isFullyRefunded = totalRefundedMinor >= payment.amountMinor;

    payment.status = isFullyRefunded ? PaymentStatus.REFUNDED : PaymentStatus.PARTIALLY_REFUNDED;
    await payment.save();

    return refund;
  }
}
