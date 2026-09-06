import { CustomerSegmentModel, ICustomerSegmentDocument } from '../models/CustomerSegment';
import { CustomerModel } from '../models/Customer';
import { ISegmentCondition } from '@sellzy/shared';

export class CustomerSegmentService {
  /**
   * Create dynamic customer segment
   */
  static async createSegment(
    tenantId: string,
    data: { name: string; description?: string; conditions: ISegmentCondition[]; createdBy?: string }
  ): Promise<ICustomerSegmentDocument> {
    this.validateConditions(data.conditions);

    const segment = await CustomerSegmentModel.create({
      tenantId,
      name: data.name.trim(),
      description: data.description?.trim(),
      conditions: data.conditions,
      createdBy: data.createdBy,
      status: 'ACTIVE',
    });

    return segment;
  }

  /**
   * List segments
   */
  static async listSegments(tenantId: string) {
    return CustomerSegmentModel.find({ tenantId, status: 'ACTIVE' }).sort({ createdAt: -1 });
  }

  /**
   * Evaluate dynamic segment members with allowlisted condition translation (zero raw Mongo injection)
   */
  static async evaluateSegment(tenantId: string, segmentId: string, page = 1, limit = 50) {
    const segment = await CustomerSegmentModel.findOne({ _id: segmentId, tenantId, status: 'ACTIVE' });
    if (!segment) {
      throw new Error('Customer segment not found');
    }

    const mongoFilter: any = { tenantId, status: { $ne: 'ARCHIVED' } };

    for (const cond of segment.conditions) {
      this.applyConditionToFilter(mongoFilter, cond);
    }

    const skip = (page - 1) * limit;
    const [customers, total] = await Promise.all([
      CustomerModel.find(mongoFilter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      CustomerModel.countDocuments(mongoFilter),
    ]);

    return {
      segment,
      customers,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Strict validation of input conditions
   */
  private static validateConditions(conditions: ISegmentCondition[]) {
    const allowedFields = [
      'totalSpentMinor',
      'totalOrders',
      'averageOrderValueMinor',
      'lifecycleStage',
      'status',
      'source',
      'tags',
      'country',
    ];
    const allowedOps = ['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'in', 'contains'];

    for (const cond of conditions) {
      if (!allowedFields.includes(cond.field)) {
        throw new Error(`Invalid segment field: ${cond.field}`);
      }
      if (!allowedOps.includes(cond.operator)) {
        throw new Error(`Invalid segment operator: ${cond.operator}`);
      }
      if (cond.value === undefined || cond.value === null) {
        throw new Error(`Segment condition value required for field: ${cond.field}`);
      }
    }
  }

  /**
   * Safely translate condition to Mongoose filter
   */
  private static applyConditionToFilter(filter: any, cond: ISegmentCondition) {
    const field = cond.field;
    const val = cond.value;

    switch (cond.operator) {
      case 'eq':
        filter[field] = val;
        break;
      case 'neq':
        filter[field] = { $ne: val };
        break;
      case 'gt':
        filter[field] = { $gt: val };
        break;
      case 'gte':
        filter[field] = { $gte: val };
        break;
      case 'lt':
        filter[field] = { $lt: val };
        break;
      case 'lte':
        filter[field] = { $lte: val };
        break;
      case 'in':
        filter[field] = { $in: Array.isArray(val) ? val : [val] };
        break;
      case 'contains':
        filter[field] = new RegExp(String(val).trim(), 'i');
        break;
    }
  }
}
