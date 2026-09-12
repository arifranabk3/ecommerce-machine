import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../apps/api/.env') });

import { TenantModel } from '../apps/api/src/models/Tenant';
import { StoreModel } from '../apps/api/src/models/Store';
import { ProductModel } from '../apps/api/src/models/Product';
import { OrderModel } from '../apps/api/src/models/Order';
import { CustomerModel } from '../apps/api/src/models/Customer';

async function migrate() {
  const isDryRun = !process.argv.includes('--execute');
  
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is required');
    process.exit(1);
  }

  console.log(`Starting Store Scope Migration... Mode: ${isDryRun ? 'DRY-RUN' : 'EXECUTE'}`);
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB.');

  const report = {
    totalRecords: 0,
    alreadyScoped: 0,
    automaticallyAssignable: 0,
    ambiguousRecords: 0,
    invalidRelationships: 0,
    requiresManualIntervention: 0
  };

  try {
    const tenants = await TenantModel.find({});
    
    for (const tenant of tenants) {
      console.log(`\nAnalyzing Tenant: ${tenant.tenantId}`);
      
      const stores = await StoreModel.find({ tenantId: tenant.tenantId });
      
      const collections = [
        { name: 'Products', model: ProductModel },
        { name: 'Orders', model: OrderModel },
        { name: 'Customers', model: CustomerModel }
      ];

      for (const col of collections) {
        const unscopedRecords = await col.model.find({ tenantId: tenant.tenantId, storeId: { $exists: false } });
        const scopedRecordsCount = await col.model.countDocuments({ tenantId: tenant.tenantId, storeId: { $exists: true } });
        
        report.totalRecords += (unscopedRecords.length + scopedRecordsCount);
        report.alreadyScoped += scopedRecordsCount;

        if (unscopedRecords.length === 0) continue;

        if (stores.length === 1) {
          const storeId = stores[0].storeId;
          console.log(`  [${col.name}] Assigning ${unscopedRecords.length} records to single valid store: ${storeId}`);
          report.automaticallyAssignable += unscopedRecords.length;
          
          if (!isDryRun) {
            await col.model.updateMany(
              { tenantId: tenant.tenantId, storeId: { $exists: false } },
              { $set: { storeId } }
            );
          }
        } else if (stores.length > 1) {
          console.log(`  [${col.name}] AMBIGUOUS: Tenant has ${stores.length} stores. Cannot auto-assign ${unscopedRecords.length} records.`);
          report.ambiguousRecords += unscopedRecords.length;
          report.requiresManualIntervention += unscopedRecords.length;
        } else {
          console.log(`  [${col.name}] INVALID: Tenant has 0 stores. Cannot auto-assign ${unscopedRecords.length} records.`);
          report.invalidRelationships += unscopedRecords.length;
          report.requiresManualIntervention += unscopedRecords.length;
        }
      }
    }

    console.log('\n========================================');
    console.log(`MIGRATION REPORT (${isDryRun ? 'DRY-RUN' : 'EXECUTED'})`);
    console.log('========================================');
    console.log(`Total Records Evaluated:      ${report.totalRecords}`);
    console.log(`Already Scoped:               ${report.alreadyScoped}`);
    console.log(`Automatically Assignable:     ${report.automaticallyAssignable}`);
    console.log(`Ambiguous Records:            ${report.ambiguousRecords}`);
    console.log(`Invalid Relationships:        ${report.invalidRelationships}`);
    console.log(`Requires Manual Intervention: ${report.requiresManualIntervention}`);
    console.log('========================================');
    
    if (isDryRun && report.requiresManualIntervention > 0) {
      console.log('\nWARNING: Please review ambiguous and invalid relationships before running without --dry-run');
    }

  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

migrate();
