import { CustomerModel, ICustomerDocument } from '../models/Customer';
import { CustomerAddressModel } from '../models/CustomerAddress';
import { CustomerNoteModel } from '../models/CustomerNote';
import { CustomerActivityModel } from '../models/CustomerActivity';
import { OrderModel } from '../models/Order';
import { CustomerNumberService } from './customer-number.service';
import { SecurityService } from './security.service';
import { CacheService } from './cache.service';
import { emitTenantEvent } from '../events/emitter';
import { AppError } from '../middleware/error';
import {
  CustomerStatus,
  CustomerLifecycleStage,
  CustomerSource,
  CustomerAddressType,
  SystemEvents,
} from '@sellzy/shared';

export class CustomerService {
  /**
   * Helper identity normalizers
   */
  static normalizeEmail(email?: string): string | undefined {
    if (!email || !email.trim()) return undefined;
    return email.trim().toLowerCase();
  }

  static normalizePhone(phone?: string): string | undefined {
    if (!phone || !phone.trim()) return undefined;
    // Strip space, hyphens, and brackets; retain + and digits
    return phone.trim().replace(/[^\d+]/g, '');
  }

  /**
   * Create Customer profile
   */
  static async createCustomer(
    tenantId: string,
    data: {
      firstName: string;
      lastName: string;
      email?: string;
      phone?: string;
      alternatePhone?: string;
      companyName?: string;
      source?: CustomerSource;
      tags?: string[];
      notesSummary?: string;
      marketingConsent?: boolean;
      marketingConsentSource?: string;
      address?: any;
      createdBy?: string;
    }
  ): Promise<ICustomerDocument> {
    const customerNumber = await CustomerNumberService.getNextCustomerNumber(tenantId);
    const displayName = `${data.firstName.trim()} ${data.lastName.trim()}`;
    const normEmail = this.normalizeEmail(data.email);
    const normPhone = this.normalizePhone(data.phone);

    const customer = await CustomerModel.create({
      tenantId,
      customerNumber,
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      displayName,
      email: data.email?.trim(),
      normalizedEmail: normEmail,
      phone: data.phone?.trim(),
      normalizedPhone: normPhone,
      alternatePhone: data.alternatePhone?.trim(),
      companyName: data.companyName?.trim(),
      status: CustomerStatus.ACTIVE,
      lifecycleStage: CustomerLifecycleStage.NEW,
      source: data.source || CustomerSource.MANUAL,
      tags: data.tags || [],
      notesSummary: data.notesSummary?.trim(),
      marketingConsent: !!data.marketingConsent,
      marketingConsentAt: data.marketingConsent ? new Date() : undefined,
      marketingConsentSource: data.marketingConsent ? (data.marketingConsentSource || 'MANUAL') : undefined,
      createdBy: data.createdBy,
    });

    // Create initial address if provided
    if (data.address && data.address.addressLine1 && data.address.city && data.address.country) {
      const addr = await CustomerAddressModel.create({
        tenantId,
        customerId: customer._id.toString(),
        type: data.address.type || CustomerAddressType.SHIPPING,
        label: data.address.label,
        fullName: data.address.fullName || displayName,
        companyName: data.address.companyName || data.companyName,
        addressLine1: data.address.addressLine1,
        addressLine2: data.address.addressLine2,
        city: data.address.city,
        state: data.address.state,
        postalCode: data.address.postalCode,
        country: data.address.country,
        phone: data.address.phone || data.phone,
        isDefault: true,
      });

      customer.defaultShippingAddressId = addr._id.toString();
      await customer.save();
    }

    // Log Activity & Audit
    await CustomerActivityModel.create({
      tenantId,
      customerId: customer._id.toString(),
      eventType: SystemEvents.CUSTOMER_CREATED,
      actorId: data.createdBy,
      source: 'API',
      metadata: { customerNumber, displayName },
    });

    await SecurityService.logSecurityEvent({
      tenantId,
      actorUserId: data.createdBy || 'SYSTEM',
      action: SystemEvents.CUSTOMER_CREATED,
      resourceType: 'customer',
      resourceId: customer._id.toString(),
      result: 'SUCCESS',
      source: 'API',
      metadata: { customerNumber, displayName },
    });

    // Real-time broadcast
    emitTenantEvent(tenantId, SystemEvents.CUSTOMER_CREATED, {
      customerId: customer._id.toString(),
      customerNumber,
      displayName,
    });

    return customer;
  }

  /**
   * Get Customer by ID
   */
  static async getCustomerById(tenantId: string, customerId: string): Promise<ICustomerDocument> {
    const customer = await CustomerModel.findOne({ _id: customerId, tenantId });
    if (!customer) {
      throw new AppError('Customer not found', 404, 'CUSTOMER_NOT_FOUND');
    }
    return customer;
  }

  /**
   * List Customers with pagination, text search & filters
   */
  static async listCustomers(
    tenantId: string,
    query: {
      search?: string;
      status?: string;
      lifecycleStage?: string;
      source?: string;
      tag?: string;
      minSpent?: number;
      maxSpent?: number;
      page?: number;
      limit?: number;
    }
  ) {
    const filter: any = { tenantId };

    if (query.status) {
      filter.status = query.status;
    }
    if (query.lifecycleStage) {
      filter.lifecycleStage = query.lifecycleStage;
    }
    if (query.source) {
      filter.source = query.source;
    }
    if (query.tag) {
      filter.tags = query.tag;
    }
    if (query.minSpent !== undefined || query.maxSpent !== undefined) {
      filter.totalSpentMinor = {};
      if (query.minSpent !== undefined) filter.totalSpentMinor.$gte = query.minSpent;
      if (query.maxSpent !== undefined) filter.totalSpentMinor.$lte = query.maxSpent;
    }

    if (query.search && query.search.trim()) {
      const searchRegex = new RegExp(query.search.trim(), 'i');
      const normSearch = query.search.trim().toLowerCase();

      filter.$or = [
        { displayName: searchRegex },
        { customerNumber: searchRegex },
        { normalizedEmail: normSearch },
        { normalizedPhone: normSearch },
        { companyName: searchRegex },
      ];
    }

    const page = Math.max(1, query.page || 1);
    const limit = Math.min(100, Math.max(1, query.limit || 20));
    const skip = (page - 1) * limit;

    const [customers, total] = await Promise.all([
      CustomerModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      CustomerModel.countDocuments(filter),
    ]);

    return {
      customers,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Update Customer Profile
   */
  static async updateCustomer(
    tenantId: string,
    customerId: string,
    data: {
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
      alternatePhone?: string;
      companyName?: string;
      status?: CustomerStatus;
      lifecycleStage?: CustomerLifecycleStage;
      source?: CustomerSource;
      tags?: string[];
      notesSummary?: string;
      updatedBy?: string;
    }
  ): Promise<ICustomerDocument> {
    const customer = await this.getCustomerById(tenantId, customerId);
    const before = typeof customer.toObject === 'function' ? customer.toObject() : customer;

    if (data.firstName || data.lastName) {
      const fn = data.firstName !== undefined ? data.firstName.trim() : customer.firstName;
      const ln = data.lastName !== undefined ? data.lastName.trim() : customer.lastName;
      customer.firstName = fn;
      customer.lastName = ln;
      customer.displayName = `${fn} ${ln}`;
    }

    if (data.email !== undefined) {
      customer.email = data.email.trim();
      customer.normalizedEmail = this.normalizeEmail(data.email);
    }

    if (data.phone !== undefined) {
      customer.phone = data.phone.trim();
      customer.normalizedPhone = this.normalizePhone(data.phone);
    }

    if (data.alternatePhone !== undefined) customer.alternatePhone = data.alternatePhone.trim();
    if (data.companyName !== undefined) customer.companyName = data.companyName.trim();
    if (data.status) customer.status = data.status;
    if (data.lifecycleStage) customer.lifecycleStage = data.lifecycleStage;
    if (data.source) customer.source = data.source;
    if (data.tags) customer.tags = data.tags;
    if (data.notesSummary !== undefined) customer.notesSummary = data.notesSummary.trim();
    customer.updatedBy = data.updatedBy;

    await customer.save();

    await CustomerActivityModel.create({
      tenantId,
      customerId,
      eventType: SystemEvents.CUSTOMER_UPDATED,
      actorId: data.updatedBy,
      source: 'API',
      metadata: { displayName: customer.displayName },
    });

    await SecurityService.logSecurityEvent({
      tenantId,
      actorUserId: data.updatedBy || 'SYSTEM',
      action: SystemEvents.CUSTOMER_UPDATED,
      resourceType: 'customer',
      resourceId: customerId,
      result: 'SUCCESS',
      source: 'API',
      before: { displayName: before.displayName, status: before.status },
      after: { displayName: customer.displayName, status: customer.status },
    });

    emitTenantEvent(tenantId, SystemEvents.CUSTOMER_UPDATED, {
      customerId,
      displayName: customer.displayName,
    });

    return customer;
  }

  /**
   * Archive Customer (Soft deletion preserving historical integrity)
   */
  static async archiveCustomer(tenantId: string, customerId: string, actorId?: string): Promise<ICustomerDocument> {
    const customer = await this.getCustomerById(tenantId, customerId);
    customer.status = CustomerStatus.ARCHIVED;
    customer.updatedBy = actorId;
    await customer.save();

    await CustomerActivityModel.create({
      tenantId,
      customerId,
      eventType: SystemEvents.CUSTOMER_ARCHIVED,
      actorId,
      source: 'API',
    });

    await SecurityService.logSecurityEvent({
      tenantId,
      actorUserId: actorId || 'SYSTEM',
      action: SystemEvents.CUSTOMER_ARCHIVED,
      resourceType: 'customer',
      resourceId: customerId,
      result: 'SUCCESS',
      source: 'API',
    });

    emitTenantEvent(tenantId, SystemEvents.CUSTOMER_ARCHIVED, { customerId });
    return customer;
  }

  /**
   * Duplicate Detection Engine
   */
  static async detectDuplicates(tenantId: string, email?: string, phone?: string, displayName?: string) {
    const normEmail = this.normalizeEmail(email);
    const normPhone = this.normalizePhone(phone);
    const matches: Array<{ customer: ICustomerDocument; confidence: number; matchingFields: string[] }> = [];

    const queryConditions: any[] = [];
    if (normEmail) queryConditions.push({ normalizedEmail: normEmail });
    if (normPhone) queryConditions.push({ normalizedPhone: normPhone });

    if (queryConditions.length === 0) return matches;

    const candidates = await CustomerModel.find({
      tenantId,
      status: { $ne: CustomerStatus.ARCHIVED },
      $or: queryConditions,
    });

    for (const cand of candidates) {
      const matchingFields: string[] = [];
      let confidence = 0;

      if (normEmail && cand.normalizedEmail === normEmail) {
        matchingFields.push('email');
        confidence += 60;
      }
      if (normPhone && cand.normalizedPhone === normPhone) {
        matchingFields.push('phone');
        confidence += 40;
      }

      if (confidence > 0) {
        matches.push({ customer: cand, confidence: Math.min(100, confidence), matchingFields });
      }
    }

    return matches.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Atomic Customer Merge Workflow
   */
  static async mergeCustomers(
    tenantId: string,
    primaryCustomerId: string,
    secondaryCustomerId: string,
    reason: string,
    actorId?: string
  ): Promise<ICustomerDocument> {
    if (primaryCustomerId === secondaryCustomerId) {
      throw new Error('Cannot merge customer into self');
    }

    const primary = await this.getCustomerById(tenantId, primaryCustomerId);
    const secondary = await this.getCustomerById(tenantId, secondaryCustomerId);

    if (primary.status === CustomerStatus.ARCHIVED || secondary.status === CustomerStatus.ARCHIVED) {
      throw new Error('Cannot merge archived customer profile');
    }

    // 1. Move addresses
    await CustomerAddressModel.updateMany(
      { tenantId, customerId: secondaryCustomerId },
      { customerId: primaryCustomerId }
    );

    // 2. Move notes
    await CustomerNoteModel.updateMany(
      { tenantId, customerId: secondaryCustomerId },
      { customerId: primaryCustomerId }
    );

    // 3. Move activity history
    await CustomerActivityModel.updateMany(
      { tenantId, customerId: secondaryCustomerId },
      { customerId: primaryCustomerId }
    );

    // 4. Move Order references
    await OrderModel.updateMany(
      { tenantId, customerId: secondaryCustomerId },
      { customerId: primaryCustomerId }
    );

    // 5. Merge tags & metadata
    const pTags = Array.isArray(primary.tags) ? primary.tags : [];
    const sTags = Array.isArray(secondary.tags) ? secondary.tags : [];
    const combinedTags = Array.from(new Set([...pTags, ...sTags]));
    primary.tags = combinedTags;

    // 6. Recalculate metrics safely
    await this.recalculateMetrics(tenantId, primaryCustomerId);

    // 7. Mark secondary archived & merged
    secondary.status = CustomerStatus.ARCHIVED;
    secondary.mergedIntoCustomerId = primaryCustomerId;
    secondary.updatedBy = actorId;
    await secondary.save();

    // 8. Log activities & security audit
    await CustomerActivityModel.create({
      tenantId,
      customerId: primaryCustomerId,
      eventType: SystemEvents.CUSTOMER_MERGED,
      actorId,
      source: 'API',
      metadata: { secondaryCustomerId, reason },
    });

    await SecurityService.logSecurityEvent({
      tenantId,
      actorUserId: actorId || 'SYSTEM',
      action: SystemEvents.CUSTOMER_MERGED,
      resourceType: 'customer',
      resourceId: primaryCustomerId,
      result: 'SUCCESS',
      source: 'API',
      metadata: { secondaryCustomerId, reason },
    });

    emitTenantEvent(tenantId, SystemEvents.CUSTOMER_MERGED, {
      primaryCustomerId,
      secondaryCustomerId,
    });

    return primary;
  }

  /**
   * Recalculate Customer Metrics & Lifecycle State
   */
  static async recalculateMetrics(tenantId: string, customerId: string): Promise<ICustomerDocument> {
    const customer = await this.getCustomerById(tenantId, customerId);

    const orders = await OrderModel.find({
      tenantId,
      customerId,
      status: { $ne: 'CANCELLED' },
    }).sort({ createdAt: 1 });

    const totalOrders = orders.length;
    const totalSpentMinor = orders.reduce((sum, o) => sum + (o.totalMinor || 0), 0);
    const averageOrderValueMinor = totalOrders > 0 ? Math.round(totalSpentMinor / totalOrders) : 0;
    const firstOrderAt = orders.length > 0 ? orders[0].createdAt : undefined;
    const lastOrderAt = orders.length > 0 ? orders[orders.length - 1].createdAt : undefined;

    customer.totalOrders = totalOrders;
    customer.totalSpentMinor = totalSpentMinor;
    customer.averageOrderValueMinor = averageOrderValueMinor;
    customer.firstOrderAt = firstOrderAt;
    customer.lastOrderAt = lastOrderAt;

    // Deterministic Lifecycle Logic
    if (totalOrders === 0) {
      customer.lifecycleStage = CustomerLifecycleStage.NEW;
    } else if (totalSpentMinor >= 500000 || totalOrders >= 10) {
      // e.g., $5,000 spend or 10+ orders = VIP
      customer.lifecycleStage = CustomerLifecycleStage.VIP;
    } else if (totalOrders > 1) {
      customer.lifecycleStage = CustomerLifecycleStage.REPEAT;
    } else {
      customer.lifecycleStage = CustomerLifecycleStage.ACTIVE;
    }

    await customer.save();
    return customer;
  }

  /**
   * Address Management
   */
  static async addAddress(tenantId: string, customerId: string, addressData: any) {
    await this.getCustomerById(tenantId, customerId);

    if (addressData.isDefault) {
      await CustomerAddressModel.updateMany({ tenantId, customerId }, { isDefault: false });
    }

    const address = await CustomerAddressModel.create({
      tenantId,
      customerId,
      type: addressData.type || CustomerAddressType.SHIPPING,
      label: addressData.label,
      fullName: addressData.fullName,
      companyName: addressData.companyName,
      addressLine1: addressData.addressLine1,
      addressLine2: addressData.addressLine2,
      city: addressData.city,
      state: addressData.state,
      postalCode: addressData.postalCode,
      country: addressData.country,
      phone: addressData.phone,
      isDefault: !!addressData.isDefault,
    });

    if (address.isDefault) {
      const updateObj = address.type === CustomerAddressType.BILLING
        ? { defaultBillingAddressId: address._id.toString() }
        : { defaultShippingAddressId: address._id.toString() };
      await CustomerModel.updateOne({ _id: customerId, tenantId }, updateObj);
    }

    return address;
  }

  static async listAddresses(tenantId: string, customerId: string) {
    await this.getCustomerById(tenantId, customerId);
    return CustomerAddressModel.find({ tenantId, customerId }).sort({ isDefault: -1, createdAt: -1 });
  }

  static async removeAddress(tenantId: string, customerId: string, addressId: string) {
    await this.getCustomerById(tenantId, customerId);
    const result = await CustomerAddressModel.deleteOne({ _id: addressId, tenantId, customerId });
    if (result.deletedCount === 0) {
      throw new Error('Address not found');
    }
    return { success: true };
  }

  /**
   * Notes Management
   */
  static async addNote(tenantId: string, customerId: string, authorUserId: string, content: string) {
    await this.getCustomerById(tenantId, customerId);
    const note = await CustomerNoteModel.create({
      tenantId,
      customerId,
      authorUserId,
      content: content.trim(),
    });

    await CustomerActivityModel.create({
      tenantId,
      customerId,
      eventType: SystemEvents.CUSTOMER_NOTE_CREATED,
      actorId: authorUserId,
      source: 'API',
    });

    return note;
  }

  static async listNotes(tenantId: string, customerId: string) {
    await this.getCustomerById(tenantId, customerId);
    return CustomerNoteModel.find({ tenantId, customerId }).sort({ createdAt: -1 });
  }

  /**
   * Tag Management
   */
  static async addTag(tenantId: string, customerId: string, tag: string, actorId?: string) {
    const customer = await this.getCustomerById(tenantId, customerId);
    const cleanTag = tag.trim();
    if (!customer.tags.includes(cleanTag)) {
      customer.tags.push(cleanTag);
      await customer.save();

      await CustomerActivityModel.create({
        tenantId,
        customerId,
        eventType: SystemEvents.CUSTOMER_TAG_ADDED,
        actorId,
        source: 'API',
        metadata: { tag: cleanTag },
      });
    }
    return customer;
  }

  static async removeTag(tenantId: string, customerId: string, tag: string, actorId?: string) {
    const customer = await this.getCustomerById(tenantId, customerId);
    const cleanTag = tag.trim();
    if (customer.tags.includes(cleanTag)) {
      customer.tags = customer.tags.filter((t) => t !== cleanTag);
      await customer.save();

      await CustomerActivityModel.create({
        tenantId,
        customerId,
        eventType: SystemEvents.CUSTOMER_TAG_REMOVED,
        actorId,
        source: 'API',
        metadata: { tag: cleanTag },
      });
    }
    return customer;
  }

  /**
   * Marketing Consent Management
   */
  static async updateConsent(tenantId: string, customerId: string, consent: boolean, source: string, actorId?: string) {
    const customer = await this.getCustomerById(tenantId, customerId);
    customer.marketingConsent = consent;
    customer.marketingConsentAt = new Date();
    customer.marketingConsentSource = source;
    await customer.save();

    await CustomerActivityModel.create({
      tenantId,
      customerId,
      eventType: SystemEvents.CUSTOMER_CONSENT_CHANGED,
      actorId,
      source,
      metadata: { marketingConsent: consent },
    });

    await SecurityService.logSecurityEvent({
      tenantId,
      actorUserId: actorId || 'SYSTEM',
      action: SystemEvents.CUSTOMER_CONSENT_CHANGED,
      resourceType: 'customer',
      resourceId: customerId,
      result: 'SUCCESS',
      source,
      metadata: { marketingConsent: consent },
    });

    return customer;
  }

  /**
   * Customer Orders History
   */
  static async getCustomerOrders(tenantId: string, customerId: string, page = 1, limit = 20) {
    await this.getCustomerById(tenantId, customerId);
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      OrderModel.find({ tenantId, customerId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
      OrderModel.countDocuments({ tenantId, customerId }),
    ]);

    return { orders, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  /**
   * Customer Activity Timeline
   */
  static async getCustomerActivity(tenantId: string, customerId: string) {
    await this.getCustomerById(tenantId, customerId);
    return CustomerActivityModel.find({ tenantId, customerId }).sort({ createdAt: -1 });
  }
}
