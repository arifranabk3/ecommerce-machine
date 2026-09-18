import { StoreModel } from '../models/Store';
import { AppError } from '../middleware/error';

interface CreateStoreInput {
  tenantId: string;
  name: string;
  slug: string;
  country?: string;
  currency?: string;
  themeId?: string;
}

export class StoreService {
  static async createStore(input: CreateStoreInput) {
    // Validate slug uniqueness globally across all tenants
    const existingStore = await StoreModel.findOne({ slug: input.slug });
    if (existingStore) {
      throw new AppError('Store URL slug is already taken', 400, 'SLUG_EXISTS');
    }

    const storeId = `st_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const store = await StoreModel.create({
      storeId,
      tenantId: input.tenantId,
      name: input.name,
      slug: input.slug,
      country: input.country || 'PK',
      currency: input.currency || 'PKR',
      themeId: input.themeId,
      status: 'ACTIVE'
    });

    return store;
  }
}
