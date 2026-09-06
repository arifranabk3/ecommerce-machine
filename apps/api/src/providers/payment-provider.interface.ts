import { PaymentStatus, RefundStatus } from '@sellzy/shared';

export interface ICreatePaymentResult {
  providerPaymentId: string;
  providerTransactionId?: string;
  redirectUrl?: string;
  status: PaymentStatus;
  metadata?: Record<string, unknown>;
}

export interface IVerifyPaymentResult {
  verified: boolean;
  providerPaymentId: string;
  amountMinor: number;
  currency: string;
  status: PaymentStatus;
  failureCode?: string;
  failureReason?: string;
}

export interface ICapturePaymentResult {
  captured: boolean;
  providerTransactionId: string;
  capturedAmountMinor: number;
  feeMinor?: number;
  taxMinor?: number;
  status: PaymentStatus;
}

export interface IRefundPaymentResult {
  providerRefundId: string;
  refundedAmountMinor: number;
  status: RefundStatus;
}

export interface IVerifyWebhookResult {
  isValid: boolean;
  providerEventId: string;
  eventType: string;
  tenantId?: string;
  paymentId?: string;
  orderId?: string;
  amountMinor?: number;
  currency?: string;
  status?: PaymentStatus;
  payload?: any;
}

export interface IPaymentProvider {
  name: string;

  createPayment(params: {
    tenantId: string;
    paymentId: string;
    paymentNumber: string;
    orderId: string;
    amountMinor: number;
    currency: string;
    metadata?: Record<string, unknown>;
  }): Promise<ICreatePaymentResult>;

  verifyPayment(providerPaymentId: string): Promise<IVerifyPaymentResult>;

  capturePayment(params: {
    providerPaymentId: string;
    amountMinor: number;
    currency: string;
  }): Promise<ICapturePaymentResult>;

  refundPayment(params: {
    providerPaymentId: string;
    amountMinor: number;
    currency: string;
    reason: string;
  }): Promise<IRefundPaymentResult>;

  verifyWebhook(headers: Record<string, string>, rawBody: string | Buffer): Promise<IVerifyWebhookResult>;

  getPaymentStatus(providerPaymentId: string): Promise<PaymentStatus>;
}
