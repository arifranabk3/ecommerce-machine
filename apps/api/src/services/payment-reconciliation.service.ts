import {
  PaymentReconciliationModel,
  IPaymentReconciliationDocument
} from '../models/PaymentReconciliation';
import { PaymentModel } from '../models/Payment';
import { PaymentStatus, PaymentReconciliationStatus } from '@sellzy/shared';

export interface IReconcilePaymentParams {
  tenantId: string;
  paymentId: string;
  providerAmountMinor: number;
  providerCurrency: string;
  providerStatus: string;
  notes?: string;
}

export class PaymentReconciliationService {
  /**
   * Performs an audit comparison between internal payment records and provider settlement data.
   */
  static async reconcilePayment(params: IReconcilePaymentParams): Promise<IPaymentReconciliationDocument> {
    const { tenantId, paymentId, providerAmountMinor, providerCurrency, providerStatus, notes } = params;

    const payment = await PaymentModel.findOne({ _id: paymentId, tenantId });
    if (!payment) {
      throw new Error(`Payment not found for ID ${paymentId}`);
    }

    const isAmountMatched = payment.amountMinor === providerAmountMinor;
    const isCurrencyMatched = payment.currency.toUpperCase() === providerCurrency.toUpperCase();
    const isStatusMatched = payment.status === providerStatus || (payment.status === PaymentStatus.CAPTURED && providerStatus === 'CAPTURED');

    let status: PaymentReconciliationStatus = PaymentReconciliationStatus.MATCHED;
    let differenceMinor = payment.amountMinor - providerAmountMinor;

    if (!isAmountMatched || !isCurrencyMatched || !isStatusMatched) {
      status = PaymentReconciliationStatus.MISMATCH;
    }

    const reconciliation = new PaymentReconciliationModel({
      tenantId,
      paymentId: payment._id.toString(),
      orderId: payment.orderId,
      internalAmountMinor: payment.amountMinor,
      providerAmountMinor,
      internalCurrency: payment.currency,
      providerCurrency: providerCurrency.toUpperCase(),
      internalStatus: payment.status,
      providerStatus,
      status,
      differenceMinor,
      notes
    });

    await reconciliation.save();
    return reconciliation;
  }

  /**
   * Resolves a reconciliation mismatch.
   */
  static async resolveMismatch(
    tenantId: string,
    reconciliationId: string,
    notes: string,
    resolvedBy?: string
  ): Promise<IPaymentReconciliationDocument> {
    const reconciliation = await PaymentReconciliationModel.findOne({ _id: reconciliationId, tenantId });
    if (!reconciliation) {
      throw new Error(`Reconciliation record not found for ID ${reconciliationId}`);
    }

    reconciliation.status = PaymentReconciliationStatus.MATCHED;
    reconciliation.notes = notes;
    reconciliation.resolvedBy = resolvedBy;
    reconciliation.resolvedAt = new Date();
    await reconciliation.save();

    return reconciliation;
  }
}
