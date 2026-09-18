import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from api folder
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { TenantModel } from '../apps/api/src/models/Tenant';
import { UserModel } from '../apps/api/src/models/User';
import { StoreModel } from '../apps/api/src/models/Store';
import { ProductModel } from '../apps/api/src/models/Product';
import { CustomerModel } from '../apps/api/src/models/Customer';
import { WarehouseModel } from '../apps/api/src/models/Warehouse';
import { RoleModel } from '../apps/api/src/models/Role';
import { SessionModel } from '../apps/api/src/models/Session';
import { TenantMembershipModel } from '../apps/api/src/models/TenantMembership';
import { OrderModel } from '../apps/api/src/models/Order';
import { InventoryReservationModel } from '../apps/api/src/models/InventoryReservation';
import { AuthService } from '../apps/api/src/services/auth.service';

async function seedE2E() {
  const uri = process.env.MONGO_URI?.includes('localhost') || process.env.MONGO_URI?.includes('127.0.0.1') ? process.env.MONGO_URI : 'mongodb://127.0.0.1:27017/sellzy_dev';
  console.log(`Connecting to MongoDB at ${uri}...`);
  await mongoose.connect(uri);
  console.log('Connected.');

  try {
    const slug = 'e2e-test';
    const email = 'e2e-test@sellzy.local';
    
    console.log('Checking for existing E2E tenant...');
    const existingTenant = await TenantModel.findOne({ slug });

    if (existingTenant) {
      const tenantId = existingTenant.tenantId;
      console.log(`Cleaning up existing E2E tenant data (tenantId: ${tenantId})...`);
      
      // Clean up EVERYTHING associated with this tenant to ensure a clean state
      await Promise.all([
        TenantModel.deleteMany({ tenantId }),
        UserModel.deleteMany({ tenantId }),
        StoreModel.deleteMany({ tenantId }),
        ProductModel.deleteMany({ tenantId }),
        CustomerModel.deleteMany({ tenantId }),
        WarehouseModel.deleteMany({ tenantId }),
        RoleModel.deleteMany({ tenantId }),
        SessionModel.deleteMany({ tenantId }),
        TenantMembershipModel.deleteMany({ tenantId }),
        OrderModel.deleteMany({ tenantId }),
        InventoryReservationModel.deleteMany({ tenantId })
      ]);
      console.log('Cleanup complete.');
    }

    console.log('Registering fresh E2E tenant and admin user...');
    // We use the actual AuthService to ensure all side-effects (Roles, memberships, audit logs) run properly
    const authResult = await AuthService.registerTenant({
      adminName: 'E2E Admin',
      adminEmail: email,
      password: 'TestPassword123!',
      businessName: 'E2E Test Business',
      slug
    });

    const tenantId = authResult.tenant.tenantId;
    console.log(`Tenant created: ${tenantId}`);

    console.log('Provisioning E2E Store...');
    const store = await StoreModel.create({
      storeId: `st_${Date.now()}`,
      tenantId,
      name: 'E2E Main Store',
      slug: 'e2e-main-store',
      type: 'B2C',
      status: 'ACTIVE'
    });

    console.log('Provisioning E2E Warehouse...');
    const warehouse = await WarehouseModel.create({
      warehouseId: `wh_${Date.now()}`,
      tenantId,
      storeId: store.storeId,
      name: 'E2E Main Warehouse',
      code: 'E2E-WH',
      normalizedCode: 'E2E-WH',
      location: 'Test Location',
      status: 'ACTIVE'
    });

    console.log('Provisioning E2E Product...');
    await ProductModel.create({
      tenantId,
      storeId: store.storeId,
      name: 'E2E Test Product',
      slug: 'e2e-test-product',
      sku: 'E2E-PROD-001',
      normalizedSKU: 'E2E-PROD-001',
      type: 'SIMPLE',
      costPrice: 2000,
      sellingPrice: 5000,
      status: 'ACTIVE'
    });

    console.log('=============================================');
    console.log('E2E SEEDING COMPLETE');
    console.log('=============================================');
    console.log(`Login URL:      http://localhost:3002/login`);
    console.log(`Tenant Slug:    ${slug}`);
    console.log(`Email:          ${email}`);
    console.log(`Password:       TestPassword123!`);
    console.log('=============================================');

  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

seedE2E();
