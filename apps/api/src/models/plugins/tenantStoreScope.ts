import mongoose, { Schema, Document } from 'mongoose';
import { getContext } from '../../utils/context';

export function tenantStoreScopePlugin(schema: Schema) {
  const isTenantScoped = !!schema.path('tenantId');
  const isStoreScoped = !!schema.path('storeId');

  if (!isTenantScoped && !isStoreScoped) {
    return;
  }

  // Hook into read queries
  const readHooks = ['find', 'findOne', 'countDocuments', 'estimatedDocumentCount', 'distinct', 'findOneAndUpdate', 'findOneAndRemove', 'findOneAndDelete'];
  
  readHooks.forEach((hook: any) => {
    schema.pre(hook, function(this: mongoose.Query<any, any>) {
      const context = getContext();
      // If we are in an operation bypassing scope (e.g. initial setup, root admin), we skip
      if (this.getOptions().bypassScope) {
        return;
      }

      if (context) {
        const query = this.getQuery() as any;
        
        if (isTenantScoped && context.tenantId) {
          query.tenantId = context.tenantId;
        }

        if (isStoreScoped && context.storeId) {
          query.storeId = context.storeId;
        }
      } else {
        // Enforce safe-by-default: If a scoped model is queried without context, it should fail
        // Unless bypassScope: true is passed explicitly
        throw new Error(`Attempted to query scoped model ${(this as any).model.modelName} without active execution context or bypassScope option.`);
      }
    });
  });

  // Hook into aggregate queries
  schema.pre('aggregate', function(this: mongoose.Aggregate<any>) {
    const context = getContext();
    if ((this.options as any).bypassScope) {
      return;
    }

    if (context) {
      const matchStage: any = {};
      if (isTenantScoped && context.tenantId) {
        matchStage.tenantId = context.tenantId;
      }
      if (isStoreScoped && context.storeId) {
        matchStage.storeId = context.storeId;
      }
      
      this.pipeline().unshift({ $match: matchStage });
    } else {
      throw new Error(`Attempted to aggregate scoped model without active execution context or bypassScope option.`);
    }
  });

  // Hook into validate operations to inject before required checks
  schema.pre('validate', function(this: any, next) {
    const context = getContext();
    
    // Ignore if not a new document (already scoped on creation)
    if (!this.isNew) {
      return next();
    }

    if (this.$__?.options?.bypassScope) {
      return next();
    }

    if (context) {
      if (isTenantScoped && !this.tenantId && context.tenantId) {
        this.tenantId = context.tenantId;
      }
      if (isStoreScoped && !this.storeId && context.storeId) {
        this.storeId = context.storeId;
      }
    } else {
      throw new Error(`Attempted to save scoped document without active execution context or bypassScope option.`);
    }
    
    next();
  });
}
