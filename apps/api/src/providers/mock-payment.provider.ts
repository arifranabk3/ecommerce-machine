import crypto from 'crypto';
import { PaymentStatus, RefundStatus } from '@sellzy/shared';
import {
  IPaymentProvider,
  ICreatePaymentResult,
  IVerifyPaymentResult,
  ICapturePaymentResult,
  IRefundPaymentResult,
  IVerifyWebhookResult
} from './payment-provider.interface';

export class MockPaymentProvider implements IPaymentProvider {
  name = 'MOCK';
  private webhookSecret = 'mock_webhook_secret_key_sellzy_2026';

  async createPayment(params: {
    tenantId: string;
    paymentId: string;
    paymentNumber: string;
    orderId: string;
    amountMinor: number;
    currency: string;
    metadata?: Record<string, unknown>;
  }): Promise<ICreatePaymentResult> {
    const providerPaymentId = `mock_pay_${params.paymentId}`;
    return {
      providerPaymentId,
      providerTransactionId: `mock_tx_${Date.now()}`,
      redirectUrl: `https://checkout.sellzy.mock/pay/${providerPaymentId}`,
      status: PaymentStatus.PENDING,
      metadata: params.metadata
    };
  }

  async verifyPayment(providerPaymentId: string): Promise<IVerifyPaymentResult> {
    return {
      verified: true,
      providerPaymentId,
      amountMinor: 10000,
      currency: 'PKR',
      status: PaymentStatus.CAPTURED
    };
  }

  async capturePayment(params: {
    providerPaymentId: string;
    amountMinor: number;
    currency: string;
  }): Promise<ICapturePaymentResult> {
    const feeMinor = Math.round(params.amountMinor * 0.025); // 2.5% fee
    const taxMinor = Math.round(feeMinor * 0.16); // 16% tax on fee
    return {
      captured: true,
      providerTransactionId: `mock_cap_${Date.now()}`,
      capturedAmountMinor: params.amountMinor,
      feeMinor,
      taxMinor,
      status: PaymentStatus.CAPTURED
    };
  }

  async refundPayment(params: {
    providerPaymentId: string;
    amountMinor: number;
    currency: string;
    reason: string;
  }): Promise<IRefundPaymentResult> {
    return {
      providerRefundId: `mock_ref_${Date.now()}`,
      refundedAmountMinor: params.amountMinor,
      status: RefundStatus.SUCCEEDED
    };
  }

  async verifyWebhook(headers: Record<string, string>, rawBody: string | Buffer): Promise<IVerifyWebhookResult> {
    const signature = headers['x-sellzy-signature'] || headers['X-Sellzy-Signature'];
    const bodyStr = typeof rawBody === 'string' ? rawBody : rawBody.toString('utf8');

    if (!signature) {
      return { isValid: false, providerEventId: '', eventType: '' };
    }

    const expectedSignature = crypto
      .createHmac('sha256', this.webhookSecret)
      .update(bodyStr)
      .digest('hex');

    const isValid = signature === expectedSignature || signature === 'valid_mock_signature';

    let payload: any = {};
    try {
      payload = JSON.parse(bodyStr);
    } catch {
      payload = {};
    }

    return {
      isValid,
      providerEventId: payload.eventId || `evt_${Date.now()}`,
      eventType: payload.eventType || 'payment.captured',
      tenantId: payload.tenantId,
      paymentId: payload.paymentId,
      orderId: payload.orderId,
      amountMinor: payload.amountMinor,
      currency: payload.currency,
      status: payload.status || PaymentStatus.CAPTURED,
      payload
    };
  }

  async getPaymentStatus(providerPaymentId: string): Promise<PaymentStatus> {
    return PaymentStatus.CAPTURED;
  }

  /**
   * Helper to generate a valid webhook signature for test suites.
   */
  generateTestSignature(payload: any): string {
    const bodyStr = JSON.stringify(payload);
    return crypto.createHmac('sha256', this.webhookSecret).update(bodyStr).digest('hex');
  }
}
