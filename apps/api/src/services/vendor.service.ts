import { VendorModel } from '../models/Vendor';
import { VendorContactModel } from '../models/VendorContact';
import { VendorProductModel } from '../models/VendorProduct';
import { VendorNoteModel } from '../models/VendorNote';
import { VendorDocumentModel } from '../models/VendorDocument';
import { ProductModel } from '../models/Product';
import { ProductVariantModel } from '../models/ProductVariant';
import { VendorNumberService } from './vendor-number.service';
import { CreateVendorInput, UpdateVendorInput, CreateVendorProductInput, UpdateVendorProductInput } from '@sellzy/validation';
import { VendorStatus, SystemEvents } from '@sellzy/shared';

export class VendorService {
  static async createVendor(tenantId: string, input: CreateVendorInput, actorUserId: string) {
    const { vendorNumber, normalizedVendorNumber } = await VendorNumberService.generateVendorNumber(tenantId);

    const vendor = await VendorModel.create({
      tenantId,
      vendorNumber,
      normalizedVendorNumber,
      name: input.name,
      companyName: input.companyName,
      email: input.email || undefined,
      phone: input.phone || undefined,
      website: input.website || undefined,
      taxId: input.taxId,
      type: input.type,
      paymentTerms: input.paymentTerms,
      currency: input.currency,
      minimumOrderQuantity: input.minimumOrderQuantity,
      minimumOrderValueMinor: input.minimumOrderValueMinor,
      leadTimeDays: input.leadTimeDays,
      autoOrderEnabled: input.autoOrderEnabled,
      autoOrderThresholdMinor: input.autoOrderThresholdMinor,
      rating: input.rating,
      address: input.address,
      createdBy: actorUserId,
      updatedBy: actorUserId
    });

    if (input.contacts && input.contacts.length > 0) {
      const contactsToCreate = input.contacts.map(c => ({
        tenantId,
        vendorId: vendor._id.toString(),
        name: c.name,
        title: c.title,
        email: c.email || undefined,
        phone: c.phone,
        isPrimary: c.isPrimary
      }));
      await VendorContactModel.insertMany(contactsToCreate);
    }

    if (input.notes) {
      await VendorNoteModel.create({
        tenantId,
        vendorId: vendor._id.toString(),
        authorUserId: actorUserId,
        authorName: 'System Staff',
        content: input.notes
      });
    }

    return vendor;
  }

  static async getVendors(tenantId: string, queryParams: any) {
    const { search, status, type, page = 1, limit = 50 } = queryParams;
    const filter: any = { tenantId };

    if (status) filter.status = status;
    if (type) filter.type = type;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } },
        { vendorNumber: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [vendors, total] = await Promise.all([
      VendorModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).exec(),
      VendorModel.countDocuments(filter)
    ]);

    return {
      vendors,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    };
  }

  static async getVendorById(tenantId: string, vendorId: string) {
    const vendor = await VendorModel.findOne({ tenantId, _id: vendorId }).exec();
    if (!vendor) return null;

    const [contacts, products, notes, documents] = await Promise.all([
      VendorContactModel.find({ tenantId, vendorId }).exec(),
      VendorProductModel.find({ tenantId, vendorId }).exec(),
      VendorNoteModel.find({ tenantId, vendorId }).sort({ createdAt: -1 }).exec(),
      VendorDocumentModel.find({ tenantId, vendorId }).sort({ createdAt: -1 }).exec()
    ]);

    return {
      vendor,
      contacts,
      products,
      notes,
      documents
    };
  }

  static async updateVendor(tenantId: string, vendorId: string, input: UpdateVendorInput, actorUserId: string) {
    const vendor = await VendorModel.findOne({ tenantId, _id: vendorId }).exec();
    if (!vendor) return null;

    Object.assign(vendor, input, { updatedBy: actorUserId });
    await vendor.save();
    return vendor;
  }

  static async archiveVendor(tenantId: string, vendorId: string, actorUserId: string) {
    const vendor = await VendorModel.findOne({ tenantId, _id: vendorId }).exec();
    if (!vendor) return null;

    vendor.status = VendorStatus.ARCHIVED;
    vendor.updatedBy = actorUserId;
    await vendor.save();
    return vendor;
  }

  // --- Vendor Products ---
  static async upsertVendorProduct(tenantId: string, input: CreateVendorProductInput) {
    const product = await ProductModel.findOne({ tenantId, _id: input.productId }).exec();
    if (!product) throw new Error('Product not found in store catalog');

    let variantName = '';
    if (input.variantId) {
      const variant = await ProductVariantModel.findOne({ tenantId, _id: input.variantId, productId: input.productId }).exec();
      if (!variant) throw new Error('Variant not found for product');
      variantName = variant.name;
    }

    const filter: any = {
      tenantId,
      vendorId: input.vendorId,
      productId: input.productId,
      variantId: input.variantId || null
    };

    const update = {
      tenantId,
      vendorId: input.vendorId,
      productId: input.productId,
      variantId: input.variantId || undefined,
      supplierSKU: input.supplierSKU,
      supplierProductName: input.supplierProductName || product.name,
      costPriceMinor: input.costPriceMinor,
      currency: input.currency,
      minimumOrderQuantity: input.minimumOrderQuantity,
      leadTimeDays: input.leadTimeDays,
      priority: input.priority,
      isPrimary: input.isPrimary,
      availability: input.availability
    };

    const vendorProduct = await VendorProductModel.findOneAndUpdate(filter, update, { upsert: true, new: true }).exec();
    return vendorProduct;
  }

  static async removeVendorProduct(tenantId: string, vendorProductId: string) {
    return await VendorProductModel.findOneAndDelete({ tenantId, _id: vendorProductId }).exec();
  }

  // --- Notes & Documents ---
  static async addNote(tenantId: string, vendorId: string, authorUserId: string, authorName: string, content: string) {
    return await VendorNoteModel.create({
      tenantId,
      vendorId,
      authorUserId,
      authorName,
      content
    });
  }

  static async addDocument(tenantId: string, vendorId: string, uploadedBy: string, title: string, fileUrl: string, fileType?: string, fileSize?: number) {
    return await VendorDocumentModel.create({
      tenantId,
      vendorId,
      uploadedBy,
      title,
      fileUrl,
      fileType,
      fileSize
    });
  }
}
