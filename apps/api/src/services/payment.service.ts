import mongoose from 'mongoose';
import { PaymentModel, IPaymentDocument } from '../models/Payment';
import { OrderModel } from '../models/Order';
import { PaymentFeeModel } from '../models/PaymentFee';
import { PaymentNumberService } from './payment-number.service';
import { PaymentStateMachine } from './payment-state-machine';
import { FinanceService } from './finance.service';
import { MockPaymentProvider } from '../providers/mock-payment.provider';
import {
  PaymentStatus,
  PaymentMethod,
  FinancialTransactionType,
  FinancialTransactionDirection,
  SystemEvents
} from '@sellzy/shared';

export interface IInitiatePaymentParams {
  tenantId: string;
  orderId: string;
  customerId?: string;
  method: PaymentMethod;
  provider?: string;
  parentPaymentId?: string;
  metadata?: Record<string, unknown>;
  createdBy?: string;
}

export class PaymentService {
  private static provider = new MockPaymentProvider();

  /**
   * Initiates a new payment attempt.
   * Calculates the authoritative amount from the order database.
   */
  static async initiatePayment(params: IInitiatePaymentParams): Promise<IPaymentDocument> {
    const { tenantId, orderId, customerId, method, provider = 'MOCK', parentPaymentId, metadata = {} } = params;

    // Server-authoritative order lookup
    const order = await OrderModel.findOne({ _id: orderId, tenantId });
    if (!order) {
      throw new Error(`Order not found or tenant mismatch for order ID ${orderId}`);
    }

    const amountMinor = (order as any).totalMinor || 0;
    const currency = (order.currency || 'PKR').toUpperCase();

    if (!Number.isInteger(amountMinor) || amountMinor <= 0) {
      throw new Error('Invalid order total. Amount must be a positive integer minor unit.');
    }

    // Check if order already has an active CAPTURED payment
    const existingCaptured = await PaymentModel.findOne({
      tenantId,
      orderId,
      status: PaymentStatus.CAPTURED
    });

    if (existingCaptured) {
      throw new Error(`Order ${orderId} has already been paid and captured.`);
    }

    // Generate unique payment number
    const paymentNumber = await PaymentNumberService.generatePaymentNumber(tenantId);

    const payment = new PaymentModel({
      tenantId,
      paymentNumber,
      orderId,
      customerId: customerId || order.customerId,
      provider,
      amountMinor,
      currency,
      status: PaymentStatus.INITIATED,
      method,
      parentPaymentId,
      metadata
    });

    await payment.save();

    // Call provider integration
    if (method !== PaymentMethod.COD) {
      const providerRes = await this.provider.createPayment({
        tenantId,
        paymentId: payment._id.toString(),
        paymentNumber,
        orderId,
        amountMinor,
        currency,
        metadata
      });

      payment.providerPaymentId = providerRes.providerPaymentId;
      payment.providerTransactionId = providerRes.providerTransactionId;
      payment.status = providerRes.status;
      await payment.save();
    } else {
      // COD stays in PENDING until collection
      payment.status = PaymentStatus.PENDING;
      await payment.save();
    }

    return payment;
  }

  /**
   * Verifies and atomically captures a payment.
   * Posts gross payment and fee financial transactions.
   */
  static async capturePayment(
    tenantId: string,
    paymentId: string,
    providerPaymentIdOverride?: string
  ): Promise<IPaymentDocument> {
    const payment = await PaymentModel.findOne({ _id: paymentId, tenantId });
    if (!payment) {
      throw new Error(`Payment not found for ID ${paymentId}`);
    }

    if (payment.status === PaymentStatus.CAPTURED) {
      return payment; // Idempotent return
    }

    PaymentStateMachine.validatePaymentTransition(payment.status, PaymentStatus.CAPTURED);

    let feeMinor = 0;
    let taxMinor = 0;
    let providerTxId = payment.providerTransactionId || `tx_${Date.now()}`;

    if (payment.method !== PaymentMethod.COD) {
      const capRes = await this.provider.capturePayment({
        providerPaymentId: providerPaymentIdOverride || payment.providerPaymentId || payment._id.toString(),
        amountMinor: payment.amountMinor,
        currency: payment.currency
      });

      if (!capRes.captured) {
        payment.status = PaymentStatus.FAILED;
        payment.failureReason = 'Provider capture failed';
        payment.failedAt = new Date();
        await payment.save();
        throw new Error('Provider payment capture failed');
      }

      feeMinor = capRes.feeMinor || 0;
      taxMinor = capRes.taxMinor || 0;
      providerTxId = capRes.providerTransactionId;
    }

    // State transition
    payment.status = PaymentStatus.CAPTURED;
    payment.capturedAt = new Date();
    payment.providerTransactionId = providerTxId;
    await payment.save();

    // Record Provider Fee if applicable
    if (feeMinor > 0) {
      await PaymentFeeModel.create({
        tenantId,
        paymentId: payment._id.toString(),
        provider: payment.provider,
        feeMinor,
        taxMinor,
        currency: payment.currency,
        source: 'PROVIDER'
      });

      await FinanceService.postTransaction({
        tenantId,
        type: FinancialTransactionType.PAYMENT_FEE,
        direction: FinancialTransactionDirection.DEBIT,
        amountMinor: feeMinor + taxMinor,
        currency: payment.currency,
        sourceType: 'PAYMENT_FEE',
        sourceId: payment._id.toString()
      });
    }

    // Post Gross Payment Financial Transaction
    await FinanceService.postTransaction({
      tenantId,
      type: FinancialTransactionType.PAYMENT,
      direction: FinancialTransactionDirection.CREDIT,
      amountMinor: payment.amountMinor,
      currency: payment.currency,
      sourceType: 'PAYMENT',
      sourceId: payment._id.toString()
    });

    // Update order payment status
    await OrderModel.updateOne(
      { _id: payment.orderId, tenantId },
      { $set: { paymentStatus: 'PAID', isPaid: true } }
    );

    return payment;
  }

  /**
   * Collects a COD payment upon physical delivery.
   */
  static async collectCOD(tenantId: string, paymentId: string, collectedBy?: string): Promise<IPaymentDocument> {
    const payment = await PaymentModel.findOne({ _id: paymentId, tenantId, method: PaymentMethod.COD });
    if (!payment) {
      throw new Error(`COD payment not found for ID ${paymentId}`);
    }

    if (payment.status === PaymentStatus.CAPTURED) {
      return payment;
    }

    payment.status = PaymentStatus.CAPTURED;
    payment.capturedAt = new Date();
    await payment.save();

    // Post Financial Transaction for COD Collection
    await FinanceService.postTransaction({
      tenantId,
      type: FinancialTransactionType.COD_COLLECTION,
      direction: FinancialTransactionDirection.CREDIT,
      amountMinor: payment.amountMinor,
      currency: payment.currency,
      sourceType: 'COD_COLLECTION',
      sourceId: payment._id.toString()
    });

    await OrderModel.updateOne(
      { _id: payment.orderId, tenantId },
      { $set: { paymentStatus: 'PAID', isPaid: true } }
    );

    return payment;
  }

  /**
   * Cancels an uncaptured payment.
   */
  static async cancelPayment(tenantId: string, paymentId: string, reason?: string): Promise<IPaymentDocument> {
    const payment = await PaymentModel.findOne({ _id: paymentId, tenantId });
    if (!payment) {
      throw new Error(`Payment not found for ID ${paymentId}`);
    }

    PaymentStateMachine.validatePaymentTransition(payment.status, PaymentStatus.CANCELLED);

    payment.status = PaymentStatus.CANCELLED;
    payment.failureReason = reason || 'User cancelled';
    payment.cancelledAt = new Date();
    await payment.save();

    return payment;
  }
}
