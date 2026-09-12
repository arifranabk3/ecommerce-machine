import mongoose from 'mongoose';
import { tenantStoreScopePlugin } from '../src/models/plugins/tenantStoreScope';

mongoose.plugin(tenantStoreScopePlugin);
