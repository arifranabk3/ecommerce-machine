import { LocationModel, ILocationDocument } from '../models/Location';
import { InventoryModel } from '../models/Inventory';
import { AppError } from '../middleware/error';
import { SecurityService } from './security.service';
import { SystemEvents, LocationType } from '@sellzy/shared';

export interface ICreateLocationInput {
  name: string;
  code: string;
  type?: LocationType | 'WAREHOUSE' | 'STORE' | 'FULFILLMENT_CENTER' | 'OTHER';
  address?: {
    street?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  isDefault?: boolean;
}

export interface IUpdateLocationInput {
  name?: string;
  code?: string;
  type?: LocationType | 'WAREHOUSE' | 'STORE' | 'FULFILLMENT_CENTER' | 'OTHER';
  address?: {
    street?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  isDefault?: boolean;
  isActive?: boolean;
}

export class LocationService {
  static async createLocation(tenantId: string, input: ICreateLocationInput, actorUserId?: string): Promise<ILocationDocument> {
    const code = input.code.trim().toUpperCase();
    const normalizedCode = code;

    const existingCode = await LocationModel.findOne({ tenantId, normalizedCode, isArchived: false });
    if (existingCode) {
      throw new AppError('Location with this code already exists', 400, 'LOCATION_CODE_EXISTS');
    }

    const count = await LocationModel.countDocuments({ tenantId, isArchived: false });
    let isDefault = input.isDefault ?? false;
    if (count === 0) {
      isDefault = true;
    }

    if (isDefault) {
      await LocationModel.updateMany({ tenantId }, { $set: { isDefault: false } });
    }

    const formattedAddress = input.address ? {
      addressLine1: input.address.addressLine1 || input.address.street,
      addressLine2: input.address.addressLine2,
      city: input.address.city,
      state: input.address.state,
      postalCode: input.address.postalCode,
      country: input.address.country
    } : undefined;

    const location = await LocationModel.create({
      tenantId,
      name: input.name.trim(),
      code,
      normalizedCode,
      type: (input.type as LocationType) || LocationType.WAREHOUSE,
      address: formattedAddress,
      isDefault,
      isActive: true,
      isArchived: false
    });

    if (actorUserId) {
      await SecurityService.logSecurityEvent({
        tenantId,
        actorUserId,
        action: SystemEvents.LOCATION_CREATED,
        resourceType: 'LOCATION',
        resourceId: location._id.toString(),
        metadata: { name: location.name, code: location.code, isDefault: location.isDefault }
      });
    }

    return location;
  }

  static async updateLocation(tenantId: string, locationId: string, input: IUpdateLocationInput, actorUserId?: string): Promise<ILocationDocument> {
    const location = await LocationModel.findOne({ _id: locationId, tenantId, isArchived: false });
    if (!location) {
      throw new AppError('Location not found', 404, 'LOCATION_NOT_FOUND');
    }

    if (input.code !== undefined) {
      const code = input.code.trim().toUpperCase();
      const existingCode = await LocationModel.findOne({ tenantId, normalizedCode: code, _id: { $ne: location._id }, isArchived: false });
      if (existingCode) {
        throw new AppError('Location code already in use', 400, 'LOCATION_CODE_EXISTS');
      }
      location.code = code;
      location.normalizedCode = code;
    }

    if (input.name !== undefined) {
      location.name = input.name.trim();
    }
    if (input.type !== undefined) {
      location.type = input.type as LocationType;
    }
    if (input.address !== undefined) {
      location.address = {
        addressLine1: input.address.addressLine1 || input.address.street,
        addressLine2: input.address.addressLine2,
        city: input.address.city,
        state: input.address.state,
        postalCode: input.address.postalCode,
        country: input.address.country
      };
    }
    if (input.isActive !== undefined) {
      if (!input.isActive && location.isDefault) {
        throw new AppError('Cannot deactivate the default location', 400, 'CANNOT_DEACTIVATE_DEFAULT');
      }
      location.isActive = input.isActive;
    }

    if (input.isDefault !== undefined && input.isDefault !== location.isDefault) {
      if (input.isDefault) {
        await LocationModel.updateMany({ tenantId }, { $set: { isDefault: false } });
        location.isDefault = true;
      } else {
        throw new AppError('Cannot unset default location directly. Mark another location as default instead.', 400, 'DEFAULT_LOCATION_REQUIRED');
      }
    }

    await location.save();

    if (actorUserId) {
      await SecurityService.logSecurityEvent({
        tenantId,
        actorUserId,
        action: SystemEvents.LOCATION_UPDATED,
        resourceType: 'LOCATION',
        resourceId: location._id.toString(),
        metadata: { name: location.name, code: location.code, isDefault: location.isDefault }
      });
    }

    return location;
  }

  static async archiveLocation(tenantId: string, locationId: string, actorUserId?: string): Promise<ILocationDocument> {
    const location = await LocationModel.findOne({ _id: locationId, tenantId, isArchived: false });
    if (!location) {
      throw new AppError('Location not found', 404, 'LOCATION_NOT_FOUND');
    }

    if (location.isDefault) {
      throw new AppError('Cannot archive default location', 400, 'CANNOT_ARCHIVE_DEFAULT');
    }

    const existingStock = await InventoryModel.findOne({ tenantId, locationId, quantityOnHand: { $gt: 0 } });
    if (existingStock) {
      throw new AppError('Cannot archive location with active inventory. Transfer or adjust stock to 0 first.', 400, 'LOCATION_HAS_STOCK');
    }

    location.isArchived = true;
    location.archivedAt = new Date();
    location.isActive = false;
    await location.save();

    if (actorUserId) {
      await SecurityService.logSecurityEvent({
        tenantId,
        actorUserId,
        action: SystemEvents.LOCATION_ARCHIVED,
        resourceType: 'LOCATION',
        resourceId: location._id.toString(),
        metadata: { code: location.code }
      });
    }

    return location;
  }

  static async getLocations(tenantId: string, includeArchived = false): Promise<ILocationDocument[]> {
    const query: Record<string, unknown> = { tenantId };
    if (!includeArchived) {
      query.isArchived = false;
    }
    return LocationModel.find(query).sort({ isDefault: -1, name: 1 });
  }

  static async getLocationById(tenantId: string, locationId: string): Promise<ILocationDocument> {
    const location = await LocationModel.findOne({ _id: locationId, tenantId });
    if (!location) {
      throw new AppError('Location not found', 404, 'LOCATION_NOT_FOUND');
    }
    return location;
  }
}
