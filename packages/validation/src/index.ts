import { z } from 'zod';

export const updateTenantSettingsSchema = z.object({
  businessName: z.string().min(2).max(100).optional(),
  legalName: z.string().max(100).optional(),
  timezone: z.string().optional(),
  currency: z.string().length(3).optional(), // ISO code
  country: z.string().length(2).optional(),
  locale: z.string().optional(),
  logo: z.string().url().optional()
});

export const inviteMemberSchema = z.object({
  email: z.string().email('Invalid email address'),
  role: z.string().min(1, 'Role is required')
});

export const acceptInvitationSchema = z.object({
  token: z.string().min(1, 'Invitation token is required'),
  name: z.string().min(2, 'Name is required'),
  password: z.string().min(8, 'Password must be at least 8 characters').regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and numbers')
});

export const switchTenantSchema = z.object({
  targetTenantId: z.string().min(1, 'Target tenant ID is required')
});

export const updateSubscriptionPlanSchema = z.object({
  planId: z.string().min(1, 'Plan ID is required'),
  billingInterval: z.enum(['MONTHLY', 'YEARLY']).default('MONTHLY')
});

export const createRoleSchema = z.object({
  name: z.string().min(2, 'Role name must be at least 2 characters').max(50),
  description: z.string().max(200).optional(),
  permissions: z.array(z.string()).min(1, 'At least one permission is required')
});

export const updateRoleSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  description: z.string().max(200).optional(),
  permissions: z.array(z.string()).min(1).optional()
});

export const assignUserRolesSchema = z.object({
  roles: z.array(z.string()).min(1, 'At least one role must be specified')
});

export const updateUserStatusSchema = z.object({
  status: z.enum(['ACTIVE', 'SUSPENDED', 'REMOVED'], {
    errorMap: () => ({ message: 'Invalid membership status' })
  })
});

export const transferOwnershipSchema = z.object({
  newOwnerUserId: z.string().min(1, 'New owner user ID is required'),
  password: z.string().min(1, 'Password is required for step-up verification')
});

export const registerTenantSchema = z.object({
  businessName: z.string().min(2, 'Business name must be at least 2 characters').max(100),
  slug: z.string().min(2).max(50).regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase alphanumeric characters and hyphens'),
  adminName: z.string().min(2, 'Admin name must be at least 2 characters'),
  adminEmail: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters').regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and numbers'),
  timezone: z.string().default('UTC'),
  currency: z.string().default('USD')
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  tenantSlug: z.string().min(1, 'Tenant slug is required'),
  mfaCode: z.string().optional()
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
  tenantSlug: z.string().min(1, 'Tenant slug is required')
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters').regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and numbers')
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters').regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and numbers')
});

export const mfaVerifySchema = z.object({
  token: z.string().min(6).max(6, 'TOTP token must be 6 digits')
});

export const createCategorySchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters').max(100),
  description: z.string().max(500).optional(),
  parentId: z.string().nullable().optional(),
  sortOrder: z.number().int().min(0).default(0)
});

export const updateCategorySchema = z.object({
  name: z.string().min(2).max(100).optional(),
  description: z.string().max(500).optional(),
  parentId: z.string().nullable().optional(),
  sortOrder: z.number().int().min(0).optional()
});

export const createLocationSchema = z.object({
  name: z.string().min(2, 'Location name must be at least 2 characters').max(100),
  code: z.string().min(2, 'Location code must be at least 2 characters').max(20),
  type: z.enum(['WAREHOUSE', 'STORE', 'FULFILLMENT_CENTER', 'OTHER']).default('WAREHOUSE'),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().optional()
  }).optional()
});

export const updateLocationSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  code: z.string().min(2).max(20).optional(),
  type: z.enum(['WAREHOUSE', 'STORE', 'FULFILLMENT_CENTER', 'OTHER']).optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().optional()
  }).optional()
});

export const createProductSchema = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters').max(200),
  description: z.string().optional(),
  brand: z.string().optional(),
  categoryId: z.string().nullable().optional(),
  subcategoryId: z.string().nullable().optional(),
  productType: z.enum(['SIMPLE', 'VARIABLE', 'BUNDLE', 'SERVICE']).default('SIMPLE'),
  status: z.enum(['ACTIVE', 'DRAFT', 'ARCHIVED']).default('ACTIVE'),
  sku: z.string().min(1, 'SKU is required').max(50),
  barcode: z.string().max(50).optional(),
  images: z.array(z.string().url()).optional(),
  tags: z.array(z.string()).optional(),
  attributes: z.record(z.any()).optional(),
  costPrice: z.number().int().min(0, 'Cost price must be non-negative integer in minor units'),
  sellingPrice: z.number().int().min(0, 'Selling price must be non-negative integer in minor units'),
  compareAtPrice: z.number().int().min(0).optional(),
  currency: z.string().length(3).default('USD'),
  trackInventory: z.boolean().default(true),
  allowBackorder: z.boolean().default(false),
  lowStockThreshold: z.number().int().min(0).default(5),
  weight: z.number().min(0).optional(),
  dimensions: z.object({
    length: z.number().min(0).optional(),
    width: z.number().min(0).optional(),
    height: z.number().min(0).optional(),
    unit: z.string().default('cm')
  }).optional(),
  vendorIds: z.array(z.string()).optional(),
  primaryVendorId: z.string().optional(),
  metadata: z.record(z.any()).optional()
});

export const updateProductSchema = createProductSchema.partial().extend({
  sku: z.string().min(1).max(50).optional()
});

export const createVariantSchema = z.object({
  name: z.string().min(1, 'Variant name is required').max(100),
  sku: z.string().min(1, 'Variant SKU is required').max(50),
  barcode: z.string().max(50).optional(),
  attributes: z.record(z.string()),
  costPrice: z.number().int().min(0).optional(),
  sellingPrice: z.number().int().min(0).optional(),
  compareAtPrice: z.number().int().min(0).optional(),
  weight: z.number().min(0).optional(),
  dimensions: z.object({
    length: z.number().min(0).optional(),
    width: z.number().min(0).optional(),
    height: z.number().min(0).optional(),
    unit: z.string().default('cm')
  }).optional(),
  trackInventory: z.boolean().default(true)
});

export const updateVariantSchema = createVariantSchema.partial();

export const stockAdjustmentSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  variantId: z.string().nullable().optional(),
  locationId: z.string().min(1, 'Location ID is required'),
  quantityDelta: z.number().int('Quantity delta must be an integer'),
  type: z.enum([
    'STOCK_RECEIVED',
    'STOCK_ADJUSTED',
    'STOCK_RESERVED',
    'STOCK_RELEASED',
    'STOCK_SOLD',
    'STOCK_RETURNED',
    'STOCK_DAMAGED',
    'STOCK_RECOUNTED'
  ]).default('STOCK_ADJUSTED'),
  reason: z.string().min(2, 'Reason is required').max(200),
  referenceType: z.string().optional(),
  referenceId: z.string().optional(),
  idempotencyKey: z.string().optional()
});

export const stockTransferSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  variantId: z.string().nullable().optional(),
  fromLocationId: z.string().min(1, 'Source location is required'),
  toLocationId: z.string().min(1, 'Destination location is required'),
  quantity: z.number().int().positive('Transfer quantity must be positive'),
  reason: z.string().max(200).optional(),
  idempotencyKey: z.string().optional()
});

export const inventoryReservationSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  variantId: z.string().nullable().optional(),
  locationId: z.string().min(1, 'Location ID is required'),
  quantity: z.number().int().positive('Reservation quantity must be positive'),
  referenceType: z.string().min(1, 'Reference type is required'),
  referenceId: z.string().min(1, 'Reference ID is required'),
  ttlSeconds: z.number().int().positive().default(900), // Default 15 minutes
  idempotencyKey: z.string().optional()
});

export const supplierMappingSchema = z.object({
  vendorId: z.string().min(1, 'Vendor ID is required'),
  supplierProductId: z.string().optional(),
  supplierSKU: z.string().optional(),
  supplierCost: z.number().int().min(0, 'Supplier cost must be non-negative integer in minor units'),
  leadTimeDays: z.number().int().min(0).optional(),
  priority: z.number().int().min(1).default(1),
  isPrimary: z.boolean().default(false)
});

export const orderItemInputSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  variantId: z.string().nullable().optional(),
  quantity: z.number().int().positive('Quantity must be positive integer'),
  unitPriceMinor: z.number().int().min(0, 'Unit price must be non-negative integer in minor units').optional(),
  discountMinor: z.number().int().min(0).optional(),
  taxMinor: z.number().int().min(0).optional()
});

export const customerSnapshotSchema = z.object({
  name: z.string().min(1, 'Customer name is required').max(100),
  email: z.string().email('Invalid customer email').optional().or(z.literal('')),
  phone: z.string().max(30).optional()
});

export const addressSnapshotSchema = z.object({
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional()
});

export const createOrderSchema = z.object({
  source: z.enum(['WEBSITE', 'MANUAL', 'IMPORT', 'API', 'WHATSAPP', 'FACEBOOK', 'INSTAGRAM', 'MARKETPLACE', 'OTHER']).optional().default('MANUAL'),
  channel: z.string().optional(),
  paymentMethod: z.enum(['PREPAID', 'COD', 'OTHER']).optional().default('COD'),
  externalOrderId: z.string().optional(),
  customerId: z.string().optional(),
  customerSnapshot: customerSnapshotSchema,
  billingAddressSnapshot: addressSnapshotSchema.optional(),
  shippingAddressSnapshot: addressSnapshotSchema.optional(),
  locationId: z.string().min(1, 'Fulfillment location ID is required for stock reservation'),
  currency: z.string().length(3).optional().default('USD'),
  items: z.array(orderItemInputSchema).min(1, 'Order must contain at least one line item'),
  discountMinor: z.number().int().min(0).optional().default(0),
  shippingMinor: z.number().int().min(0).optional().default(0),
  taxMinor: z.number().int().min(0).optional().default(0),
  notes: z.string().max(1000).optional(),
  metadata: z.record(z.any()).optional(),
  idempotencyKey: z.string().optional()
});

export const updateOrderSchema = z.object({
  customerSnapshot: customerSnapshotSchema.optional(),
  billingAddressSnapshot: addressSnapshotSchema.optional(),
  shippingAddressSnapshot: addressSnapshotSchema.optional(),
  notes: z.string().max(1000).optional(),
  metadata: z.record(z.any()).optional()
});

export const orderTransitionSchema = z.object({
  targetStatus: z.enum([
    'PENDING',
    'CONFIRMED',
    'PROCESSING',
    'READY_TO_FULFILL',
    'FULFILLING',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED',
    'FAILED',
    'ON_HOLD'
  ]),
  reason: z.string().max(500).optional()
});

export const createOrderNoteSchema = z.object({
  content: z.string().min(1, 'Note content is required').max(1000)
});

export const updateFulfillmentSchema = z.object({
  status: z.enum(['PENDING', 'READY', 'PROCESSING', 'PACKED', 'SHIPPED', 'DELIVERED', 'FAILED']),
  locationId: z.string().optional(),
  trackingNumber: z.string().max(100).optional(),
  carrierCode: z.string().max(50).optional()
});

export const createFulfillmentSchema = z.object({
  locationId: z.string().min(1, 'Location ID is required'),
  trackingNumber: z.string().optional(),
  carrierCode: z.string().optional()
});

// ====================================================
// Customer & CRM Schemas
// ====================================================

export const createCustomerSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().max(30).optional().or(z.literal('')),
  alternatePhone: z.string().max(30).optional().or(z.literal('')),
  companyName: z.string().max(100).optional(),
  source: z.enum([
    'WEBSITE', 'MANUAL', 'IMPORT', 'API', 'WHATSAPP', 'FACEBOOK', 'INSTAGRAM', 'MARKETPLACE', 'OTHER'
  ]).default('MANUAL'),
  tags: z.array(z.string()).optional(),
  notesSummary: z.string().max(500).optional(),
  marketingConsent: z.boolean().default(false),
  marketingConsentSource: z.string().optional(),
  address: z.object({
    type: z.enum(['SHIPPING', 'BILLING', 'OTHER']).default('SHIPPING'),
    label: z.string().optional(),
    fullName: z.string().optional(),
    companyName: z.string().optional(),
    addressLine1: z.string().min(1, 'Address line 1 is required'),
    addressLine2: z.string().optional(),
    city: z.string().min(1, 'City is required'),
    state: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().min(1, 'Country is required'),
    phone: z.string().optional(),
    isDefault: z.boolean().default(true)
  }).optional()
});

export const updateCustomerSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().max(30).optional().or(z.literal('')),
  alternatePhone: z.string().max(30).optional().or(z.literal('')),
  companyName: z.string().max(100).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'BLOCKED', 'ARCHIVED']).optional(),
  lifecycleStage: z.enum(['NEW', 'ACTIVE', 'REPEAT', 'VIP', 'AT_RISK', 'DORMANT', 'LOST']).optional(),
  source: z.enum(['WEBSITE', 'MANUAL', 'IMPORT', 'API', 'WHATSAPP', 'FACEBOOK', 'INSTAGRAM', 'MARKETPLACE', 'OTHER']).optional(),
  tags: z.array(z.string()).optional(),
  notesSummary: z.string().max(500).optional()
});

export const createAddressSchema = z.object({
  type: z.enum(['SHIPPING', 'BILLING', 'OTHER']).default('SHIPPING'),
  label: z.string().optional(),
  fullName: z.string().min(1, 'Full name is required'),
  companyName: z.string().optional(),
  addressLine1: z.string().min(1, 'Address line 1 is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().min(1, 'Country is required'),
  phone: z.string().optional(),
  isDefault: z.boolean().default(false)
});

export const updateAddressSchema = createAddressSchema.partial();

export const createCustomerNoteSchema = z.object({
  content: z.string().min(1, 'Note content is required').max(2000)
});

export const addCustomerTagSchema = z.object({
  tag: z.string().min(1, 'Tag cannot be empty').max(50)
});

export const updateConsentSchema = z.object({
  marketingConsent: z.boolean(),
  marketingConsentSource: z.string().default('MANUAL')
});

export const mergeCustomersSchema = z.object({
  primaryCustomerId: z.string().min(1, 'Primary customer ID is required'),
  secondaryCustomerId: z.string().min(1, 'Secondary customer ID is required'),
  reason: z.string().min(1, 'Reason for merge is required').max(200)
});

export const segmentConditionSchema = z.object({
  field: z.enum(['totalSpentMinor', 'totalOrders', 'averageOrderValueMinor', 'lifecycleStage', 'status', 'source', 'tags', 'country']),
  operator: z.enum(['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'in', 'contains']),
  value: z.any()
});

export const createSegmentSchema = z.object({
  name: z.string().min(2, 'Segment name must be at least 2 characters').max(100),
  description: z.string().max(500).optional(),
  conditions: z.array(segmentConditionSchema).min(1, 'At least one condition is required')
});

// ====================================================
// Vendor & Procurement Schemas (Phase 08)
// ====================================================

export const createVendorSchema = z.object({
  name: z.string().min(2, 'Vendor name is required').max(100),
  companyName: z.string().max(100).optional(),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().max(30).optional().or(z.literal('')),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  taxId: z.string().max(50).optional(),
  type: z.enum(['MANUFACTURER', 'DISTRIBUTOR', 'WHOLESALER', 'IMPORTER', 'SERVICE_PROVIDER', 'OTHER']).default('DISTRIBUTOR'),
  paymentTerms: z.enum(['NET_15', 'NET_30', 'NET_45', 'NET_60', 'DUE_ON_RECEIPT', 'ADVANCE']).default('NET_30'),
  currency: z.string().length(3).default('USD'),
  minimumOrderQuantity: z.number().int().min(0).default(1),
  minimumOrderValueMinor: z.number().int().min(0).default(0),
  leadTimeDays: z.number().int().min(0).default(7),
  autoOrderEnabled: z.boolean().default(false),
  autoOrderThresholdMinor: z.number().int().min(0).default(100000),
  rating: z.number().min(0).max(5).default(5),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().optional()
  }).optional(),
  contacts: z.array(z.object({
    name: z.string().min(1, 'Contact name is required'),
    title: z.string().optional(),
    email: z.string().email('Invalid contact email').optional().or(z.literal('')),
    phone: z.string().optional(),
    isPrimary: z.boolean().default(false)
  })).optional(),
  notes: z.string().max(1000).optional()
});

export const updateVendorSchema = createVendorSchema.partial().extend({
  status: z.enum(['ACTIVE', 'INACTIVE', 'ARCHIVED', 'BLOCKED']).optional()
});

export const createVendorProductSchema = z.object({
  vendorId: z.string().min(1, 'Vendor ID is required'),
  productId: z.string().min(1, 'Product ID is required'),
  variantId: z.string().nullable().optional(),
  supplierSKU: z.string().min(1, 'Supplier SKU is required').max(50),
  supplierProductName: z.string().max(200).optional(),
  costPriceMinor: z.number().int().min(0, 'Cost price must be non-negative integer in minor units'),
  currency: z.string().length(3).default('USD'),
  minimumOrderQuantity: z.number().int().min(1).default(1),
  leadTimeDays: z.number().int().min(0).default(7),
  priority: z.number().int().min(1).default(1),
  isPrimary: z.boolean().default(false),
  availability: z.enum(['IN_STOCK', 'OUT_OF_STOCK', 'DISCONTINUED', 'BACKORDER']).default('IN_STOCK')
});

export const updateVendorProductSchema = createVendorProductSchema.partial();

export const purchaseOrderItemInputSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  variantId: z.string().nullable().optional(),
  supplierSKU: z.string().optional(),
  quantity: z.number().int().positive('Quantity must be positive integer'),
  unitCostMinor: z.number().int().min(0, 'Unit cost must be non-negative integer in minor units')
});

export const createPurchaseOrderSchema = z.object({
  vendorId: z.string().min(1, 'Vendor ID is required'),
  destinationLocationId: z.string().min(1, 'Destination location ID is required'),
  source: z.enum(['MANUAL', 'AUTO_REORDER', 'ORDER_SPLIT', 'LOW_STOCK', 'IMPORT', 'API']).default('MANUAL'),
  salesOrderId: z.string().optional(),
  currency: z.string().length(3).default('USD'),
  items: z.array(purchaseOrderItemInputSchema).min(1, 'Purchase order must contain at least one line item'),
  shippingCostMinor: z.number().int().min(0).optional().default(0),
  taxCostMinor: z.number().int().min(0).optional().default(0),
  expectedDeliveryDate: z.string().datetime().optional().or(z.string().regex(/^\d{4}-\d{2}-\d{2}/).optional()),
  notes: z.string().max(1000).optional(),
  idempotencyKey: z.string().optional()
});

export const updatePurchaseOrderSchema = z.object({
  destinationLocationId: z.string().optional(),
  items: z.array(purchaseOrderItemInputSchema).optional(),
  shippingCostMinor: z.number().int().min(0).optional(),
  taxCostMinor: z.number().int().min(0).optional(),
  expectedDeliveryDate: z.string().optional(),
  notes: z.string().max(1000).optional()
});

export const poTransitionSchema = z.object({
  targetStatus: z.enum([
    'DRAFT',
    'PENDING_APPROVAL',
    'APPROVED',
    'SUBMITTED',
    'ACKNOWLEDGED',
    'PARTIALLY_FULFILLED',
    'FULFILLING',
    'FULFILLED',
    'CANCELLED',
    'ON_HOLD'
  ]),
  reason: z.string().max(500).optional()
});

export const createVendorNoteSchema = z.object({
  content: z.string().min(1, 'Note content is required').max(2000)
});

export const autoProcurementSchema = z.object({
  mode: z.enum(['LOW_STOCK', 'ORDER_SPLIT']),
  salesOrderId: z.string().optional(),
  locationId: z.string().optional()
});

export type RegisterTenantInput = z.infer<typeof registerTenantSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type MfaVerifyInput = z.infer<typeof mfaVerifySchema>;
export type UpdateTenantSettingsInput = z.infer<typeof updateTenantSettingsSchema>;
export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;
export type AcceptInvitationInput = z.infer<typeof acceptInvitationSchema>;
export type SwitchTenantInput = z.infer<typeof switchTenantSchema>;
export type UpdateSubscriptionPlanInput = z.infer<typeof updateSubscriptionPlanSchema>;
export type CreateRoleInput = z.infer<typeof createRoleSchema>;
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
export type AssignUserRolesInput = z.infer<typeof assignUserRolesSchema>;
export type UpdateUserStatusInput = z.infer<typeof updateUserStatusSchema>;
export type TransferOwnershipInput = z.infer<typeof transferOwnershipSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type CreateLocationInput = z.infer<typeof createLocationSchema>;
export type UpdateLocationInput = z.infer<typeof updateLocationSchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type CreateVariantInput = z.infer<typeof createVariantSchema>;
export type UpdateVariantInput = z.infer<typeof updateVariantSchema>;
export type StockAdjustmentInput = z.infer<typeof stockAdjustmentSchema>;
export type StockTransferInput = z.infer<typeof stockTransferSchema>;
export type InventoryReservationInput = z.infer<typeof inventoryReservationSchema>;
export type SupplierMappingInput = z.infer<typeof supplierMappingSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;
export type OrderTransitionInput = z.infer<typeof orderTransitionSchema>;
export type CreateOrderNoteInput = z.infer<typeof createOrderNoteSchema>;
export type UpdateFulfillmentInput = z.infer<typeof updateFulfillmentSchema>;
export type CreateVendorInput = z.infer<typeof createVendorSchema>;
export type UpdateVendorInput = z.infer<typeof updateVendorSchema>;
export type CreateVendorProductInput = z.infer<typeof createVendorProductSchema>;
export type UpdateVendorProductInput = z.infer<typeof updateVendorProductSchema>;
export type CreatePurchaseOrderInput = z.infer<typeof createPurchaseOrderSchema>;
export type UpdatePurchaseOrderInput = z.infer<typeof updatePurchaseOrderSchema>;
export type PoTransitionInput = z.infer<typeof poTransitionSchema>;
export type CreateVendorNoteInput = z.infer<typeof createVendorNoteSchema>;
export type AutoProcurementInput = z.infer<typeof autoProcurementSchema>;



