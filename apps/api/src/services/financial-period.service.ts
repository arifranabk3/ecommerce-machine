import { FinancialPeriodModel } from '../models/FinancialPeriod';
import { FinancialPeriodStatus, IFinancialPeriod } from '@sellzy/shared';

export class FinancialPeriodService {
  /**
   * Verifies whether an entry date falls into a locked financial period for the tenant.
   * Throws Error if period is locked.
   */
  static async checkPeriodNotLocked(tenantId: string, date: Date = new Date()): Promise<void> {
    const period = await FinancialPeriodModel.findOne({
      tenantId,
      periodStart: { $lte: date },
      periodEnd: { $gte: date },
      status: FinancialPeriodStatus.LOCKED
    });

    if (period) {
      throw new Error(`Financial period covering ${date.toISOString()} is locked. Backdated postings are rejected.`);
    }
  }

  /**
   * Locks a financial period.
   */
  static async lockPeriod(
    tenantId: string,
    periodStart: Date,
    periodEnd: Date,
    lockedBy: string
  ): Promise<IFinancialPeriod> {
    const existing = await FinancialPeriodModel.findOne({ tenantId, periodStart, periodEnd });

    if (existing) {
      existing.status = FinancialPeriodStatus.LOCKED;
      existing.lockedBy = lockedBy;
      existing.lockedAt = new Date();
      await existing.save();
      const obj = existing.toObject();
      return { ...obj, id: existing._id.toString() } as IFinancialPeriod;
    }

    const created = await FinancialPeriodModel.create({
      tenantId,
      periodStart,
      periodEnd,
      status: FinancialPeriodStatus.LOCKED,
      lockedBy,
      lockedAt: new Date()
    });

    const obj = created.toObject();
    return { ...obj, id: created._id.toString() } as IFinancialPeriod;
  }

  /**
   * Lists financial periods for a tenant.
   */
  static async listPeriods(tenantId: string): Promise<IFinancialPeriod[]> {
    const periods = await FinancialPeriodModel.find({ tenantId }).sort({ periodStart: -1 });
    return periods.map((p) => ({ ...p.toObject(), id: p._id.toString() } as IFinancialPeriod));
  }
}
