import { ShipmentCounterModel } from '../models/ShipmentCounter';
import { CustomerReturnCounterModel } from '../models/CustomerReturnCounter';
import { RTOCounterModel } from '../models/RTOCounter';

export class ShipmentNumberService {
  static async generateShipmentNumber(tenantId: string): Promise<string> {
    const year = new Date().getFullYear();
    const incObj = { seq: 1 };
    const counter = await ShipmentCounterModel.findOneAndUpdate(
      { tenantId, year },
      { $inc: incObj },
      { new: true, upsert: true }
    );
    const seqStr = String(counter.seq).padStart(6, '0');
    return `SHP-${year}-${seqStr}`;
  }

  static async generateReturnNumber(tenantId: string): Promise<string> {
    const year = new Date().getFullYear();
    const incObj = { seq: 1 };
    const counter = await CustomerReturnCounterModel.findOneAndUpdate(
      { tenantId, year },
      { $inc: incObj },
      { new: true, upsert: true }
    );
    const seqStr = String(counter.seq).padStart(6, '0');
    return `RET-${year}-${seqStr}`;
  }

  static async generateRTONumber(tenantId: string): Promise<string> {
    const year = new Date().getFullYear();
    const incObj = { seq: 1 };
    const counter = await RTOCounterModel.findOneAndUpdate(
      { tenantId, year },
      { $inc: incObj },
      { new: true, upsert: true }
    );
    const seqStr = String(counter.seq).padStart(6, '0');
    return `RTO-${year}-${seqStr}`;
  }
}
