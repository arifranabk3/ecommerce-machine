// System Enums & Types for Sellzy Platform

export enum TenantStatus {
  ACTIVE = 'ACTIVE',
  TRIAL = 'TRIAL',
  SUSPENDED = 'SUSPENDED',
  DISABLED = 'DISABLED',
  PENDING = 'PENDING',
  CANCELLED = 'CANCELLED'
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
  INACTIVE = 'INACTIVE',
  INVITED = 'INVITED',
  SUSPENDED = 'SUSPENDED',
  LOCKED = 'LOCKED',
  DISABLED = 'DISABLED'
}

export enum MembershipStatus {
  INVITED = 'INVITED',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  REMOVED = 'REMOVED'
}

export enum SubscriptionStatus {
  TRIALING = 'TRIALING',
  ACTIVE = 'ACTIVE',
  PAST_DUE = 'PAST_DUE',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
  PAUSED = 'PAUSED'
}

export enum InvitationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  EXPIRED = 'EXPIRED',
  REVOKED = 'REVOKED'
}

export enum SystemEvents {
  // Tenant & Membership Events
  TENANT_CREATED = 'TENANT_CREATED',
  TENANT_UPDATED = 'TENANT_UPDATED',
  TENANT_SUSPENDED = 'TENANT_SUSPENDED',
  TENANT_REACTIVATED = 'TENANT_REACTIVATED',
  TENANT_SWITCHED = 'TENANT_SWITCHED',
  MEMBER_INVITED = 'MEMBER_INVITED',
  MEMBER_JOINED = 'MEMBER_JOINED',
  MEMBER_REMOVED = 'MEMBER_REMOVED',
  PLAN_CHANGED = 'PLAN_CHANGED',
  SUBSCRIPTION_CHANGED = 'SUBSCRIPTION_CHANGED',
  USAGE_LIMIT_REACHED = 'USAGE_LIMIT_REACHED',

  // Authentication & Security Events
  USER_REGISTERED = 'USER_REGISTERED',
  USER_VERIFIED = 'USER_VERIFIED',
  USER_LOGGED_IN = 'USER_LOGGED_IN',
  USER_LOGGED_OUT = 'USER_LOGGED_OUT',
  USER_LOGGED_OUT_ALL = 'USER_LOGGED_OUT_ALL',
  FAILED_LOGIN_ATTEMPT = 'FAILED_LOGIN_ATTEMPT',
  PASSWORD_RESET_REQUESTED = 'PASSWORD_RESET_REQUESTED',
  PASSWORD_RESET_COMPLETED = 'PASSWORD_RESET_COMPLETED',
  PASSWORD_CHANGED = 'PASSWORD_CHANGED',
  MFA_SETUP_INITIATED = 'MFA_SETUP_INITIATED',
  MFA_ENABLED = 'MFA_ENABLED',
  MFA_DISABLED = 'MFA_DISABLED',
  MFA_FAILED = 'MFA_FAILED',
  RECOVERY_CODES_REGENERATED = 'RECOVERY_CODES_REGENERATED',
  SESSION_REVOKED = 'SESSION_REVOKED',
  STEP_UP_COMPLETED = 'STEP_UP_COMPLETED',
  SUSPICIOUS_LOGIN_DETECTED = 'SUSPICIOUS_LOGIN_DETECTED',
  ROLE_CREATED = 'ROLE_CREATED',
  ROLE_UPDATED = 'ROLE_UPDATED',
  ROLE_ARCHIVED = 'ROLE_ARCHIVED',
  ROLE_DUPLICATED = 'ROLE_DUPLICATED',
  ROLE_ASSIGNED = 'ROLE_ASSIGNED',
  ROLE_REMOVED = 'ROLE_REMOVED',
  USER_SUSPENDED = 'USER_SUSPENDED',
  USER_ACTIVATED = 'USER_ACTIVATED',
  USER_REMOVED = 'USER_REMOVED',
  USER_RESTORED = 'USER_RESTORED',
  OWNERSHIP_TRANSFERRED = 'OWNERSHIP_TRANSFERRED',
  UNAUTHORIZED_ROLE_ASSIGNMENT_ATTEMPT = 'UNAUTHORIZED_ROLE_ASSIGNMENT_ATTEMPT',
  PRIVILEGE_ESCALATION_BLOCKED = 'PRIVILEGE_ESCALATION_BLOCKED',

  // Product & Inventory Events
  PRODUCT_CREATED = 'PRODUCT_CREATED',
  PRODUCT_UPDATED = 'PRODUCT_UPDATED',
  PRODUCT_ARCHIVED = 'PRODUCT_ARCHIVED',
  VARIANT_CREATED = 'VARIANT_CREATED',
  VARIANT_UPDATED = 'VARIANT_UPDATED',
  VARIANT_ARCHIVED = 'VARIANT_ARCHIVED',
  CATEGORY_CREATED = 'CATEGORY_CREATED',
  CATEGORY_UPDATED = 'CATEGORY_UPDATED',
  CATEGORY_ARCHIVED = 'CATEGORY_ARCHIVED',
  LOCATION_CREATED = 'LOCATION_CREATED',
  LOCATION_UPDATED = 'LOCATION_UPDATED',
  LOCATION_ARCHIVED = 'LOCATION_ARCHIVED',
  STOCK_ADJUSTED = 'STOCK_ADJUSTED',
  STOCK_RESERVED = 'STOCK_RESERVED',
  STOCK_RELEASED = 'STOCK_RELEASED',
  STOCK_TRANSFERRED = 'STOCK_TRANSFERRED',
  LOW_STOCK_DETECTED = 'LOW_STOCK_DETECTED',
  OUT_OF_STOCK_DETECTED = 'OUT_OF_STOCK_DETECTED',

  // Order & Fulfillment Events
  ORDER_CREATED = 'ORDER_CREATED',
  ORDER_UPDATED = 'ORDER_UPDATED',
  ORDER_STATUS_CHANGED = 'ORDER_STATUS_CHANGED',
  ORDER_ON_HOLD = 'ORDER_ON_HOLD',
  ORDER_CANCELLED = 'ORDER_CANCELLED',
  FULFILLMENT_UPDATED = 'FULFILLMENT_UPDATED',
  PAYMENT_STATUS_CHANGED = 'PAYMENT_STATUS_CHANGED',

  // Customer & CRM Events
  CUSTOMER_CREATED = 'CUSTOMER_CREATED',
  CUSTOMER_UPDATED = 'CUSTOMER_UPDATED',
  CUSTOMER_ARCHIVED = 'CUSTOMER_ARCHIVED',
  CUSTOMER_MERGED = 'CUSTOMER_MERGED',
  CUSTOMER_ACTIVITY_ADDED = 'CUSTOMER_ACTIVITY_ADDED',
  CUSTOMER_CONSENT_CHANGED = 'CUSTOMER_CONSENT_CHANGED',
  CUSTOMER_TAG_ADDED = 'CUSTOMER_TAG_ADDED',
  CUSTOMER_TAG_REMOVED = 'CUSTOMER_TAG_REMOVED',
  CUSTOMER_NOTE_CREATED = 'CUSTOMER_NOTE_CREATED',
  CUSTOMER_ADDRESS_CREATED = 'CUSTOMER_ADDRESS_CREATED',
  CUSTOMER_ADDRESS_UPDATED = 'CUSTOMER_ADDRESS_UPDATED',
  CUSTOMER_ADDRESS_REMOVED = 'CUSTOMER_ADDRESS_REMOVED',

  // Vendor & Procurement Events
  VENDOR_CREATED = 'VENDOR_CREATED',
  VENDOR_UPDATED = 'VENDOR_UPDATED',
  VENDOR_ARCHIVED = 'VENDOR_ARCHIVED',
  VENDOR_PRODUCT_UPDATED = 'VENDOR_PRODUCT_UPDATED',
  PO_CREATED = 'PO_CREATED',
  PO_UPDATED = 'PO_UPDATED',
  PO_APPROVED = 'PO_APPROVED',
  PO_SUBMITTED = 'PO_SUBMITTED',
  PO_ACKNOWLEDGED = 'PO_ACKNOWLEDGED',
  PO_FAILED = 'PO_FAILED',
  PO_CANCELLED = 'PO_CANCELLED',
  PROCUREMENT_EXCEPTION_CREATED = 'PROCUREMENT_EXCEPTION_CREATED',
  PROCUREMENT_EXCEPTION_RESOLVED = 'PROCUREMENT_EXCEPTION_RESOLVED',

  // Phase 09 Vendor Ledger & Settlement Events
  LEDGER_POSTED = 'LEDGER_POSTED',
  LEDGER_REVERSED = 'LEDGER_REVERSED',
  LEDGER_ADJUSTED = 'LEDGER_ADJUSTED',
  SETTLEMENT_CREATED = 'SETTLEMENT_CREATED',
  SETTLEMENT_CALCULATED = 'SETTLEMENT_CALCULATED',
  SETTLEMENT_APPROVED = 'SETTLEMENT_APPROVED',
  SETTLEMENT_CANCELLED = 'SETTLEMENT_CANCELLED',
  PAYMENT_CREATED = 'PAYMENT_CREATED',
  PAYMENT_RECORDED = 'PAYMENT_RECORDED',
  RECONCILIATION_MATCHED = 'RECONCILIATION_MATCHED',
  RECONCILIATION_MISMATCH = 'RECONCILIATION_MISMATCH',
  PERIOD_LOCKED = 'PERIOD_LOCKED',

  // Phase 10 Payment & Finance Events
  PAYMENT_INITIATED = 'PAYMENT_INITIATED',
  PAYMENT_AUTHORIZED = 'PAYMENT_AUTHORIZED',
  PAYMENT_CAPTURED = 'PAYMENT_CAPTURED',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  PAYMENT_CANCELLED = 'PAYMENT_CANCELLED',
  REFUND_REQUESTED = 'REFUND_REQUESTED',
  REFUND_SUCCEEDED = 'REFUND_SUCCEEDED',
  REFUND_FAILED = 'REFUND_FAILED',
  PAYMENT_RETRY_INITIATED = 'PAYMENT_RETRY_INITIATED',
  COD_COLLECTED = 'COD_COLLECTED',
  FINANCIAL_TRANSACTION_POSTED = 'FINANCIAL_TRANSACTION_POSTED'
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  READY_TO_FULFILL = 'READY_TO_FULFILL',
  FULFILLING = 'FULFILLING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  FAILED = 'FAILED',
  ON_HOLD = 'ON_HOLD'
}

export enum PaymentStatus {
  INITIATED = 'INITIATED',
  UNPAID = 'UNPAID',
  PENDING = 'PENDING',
  AUTHORIZED = 'AUTHORIZED',
  CAPTURED = 'CAPTURED',
  PAID = 'PAID',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  PARTIALLY_REFUNDED = 'PARTIALLY_REFUNDED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED'
}

export enum FulfillmentStatus {
  PENDING = 'PENDING',
  READY = 'READY',
  PROCESSING = 'PROCESSING',
  PACKED = 'PACKED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED'
}

export enum OrderSource {
  WEBSITE = 'WEBSITE',
  MANUAL = 'MANUAL',
  IMPORT = 'IMPORT',
  API = 'API',
  WHATSAPP = 'WHATSAPP',
  FACEBOOK = 'FACEBOOK',
  INSTAGRAM = 'INSTAGRAM',
  MARKETPLACE = 'MARKETPLACE',
  OTHER = 'OTHER'
}

export enum PaymentMethod {
  CARD = 'CARD',
  BANK_TRANSFER = 'BANK_TRANSFER',
  WALLET = 'WALLET',
  PREPAID = 'PREPAID',
  COD = 'COD',
  OTHER = 'OTHER'
}

export enum ProductType {
  SIMPLE = 'SIMPLE',
  VARIABLE = 'VARIABLE',
  BUNDLE = 'BUNDLE',
  SERVICE = 'SERVICE'
}

export enum ProductStatus {
  ACTIVE = 'ACTIVE',
  DRAFT = 'DRAFT',
  ARCHIVED = 'ARCHIVED'
}

export enum LocationType {
  WAREHOUSE = 'WAREHOUSE',
  STORE = 'STORE',
  FULFILLMENT_CENTER = 'FULFILLMENT_CENTER',
  OTHER = 'OTHER'
}

export enum InventoryMovementType {
  STOCK_RECEIVED = 'STOCK_RECEIVED',
  STOCK_ADJUSTED = 'STOCK_ADJUSTED',
  STOCK_RESERVED = 'STOCK_RESERVED',
  STOCK_RELEASED = 'STOCK_RELEASED',
  STOCK_SOLD = 'STOCK_SOLD',
  STOCK_RETURNED = 'STOCK_RETURNED',
  STOCK_DAMAGED = 'STOCK_DAMAGED',
  STOCK_TRANSFERRED_IN = 'STOCK_TRANSFERRED_IN',
  STOCK_TRANSFERRED_OUT = 'STOCK_TRANSFERRED_OUT',
  STOCK_RECOUNTED = 'STOCK_RECOUNTED'
}

export enum ReservationStatus {
  ACTIVE = 'ACTIVE',
  RELEASED = 'RELEASED',
  CONSUMED = 'CONSUMED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED'
}

export enum StockStatus {
  IN_STOCK = 'IN_STOCK',
  LOW_STOCK = 'LOW_STOCK',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  OVERSTOCKED = 'OVERSTOCKED'
}

export enum PermissionRiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum PermissionClassification {
  READ = 'READ',
  WRITE = 'WRITE',
  ACTION = 'ACTION'
}

export interface IPermissionDefinition {
  key: string;
  label: string;
  description: string;
  group: string;
  riskLevel: PermissionRiskLevel;
  classification: PermissionClassification;
  isHighRisk?: boolean;
}

export interface IPermissionGroup {
  id: string;
  name: string;
  description: string;
  permissions: IPermissionDefinition[];
}

export interface ITenant {
  id: string;
  tenantId: string;
  businessName: string;
  legalName?: string;
  slug: string;
  status: TenantStatus;
  ownerUserId: string;
  planId: string;
  subscriptionStatus: SubscriptionStatus;
  timezone: string;
  currency: string; // ISO Code e.g. PKR, USD
  country: string;
  locale: string;
  logo?: string;
  settings: Record<string, unknown>;
  featureConfig: Record<string, boolean>;
  createdAt: Date;
  updatedAt: Date;
  suspendedAt?: Date;
  deletedAt?: Date;
}

export interface ITenantMembership {
  id: string;
  tenantId: string;
  userId: string;
  roles: string[];
  status: MembershipStatus;
  isOwner: boolean;
  joinedAt: Date;
  invitedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPlan {
  id: string;
  planId: string;
  name: string;
  billingInterval: 'MONTHLY' | 'YEARLY';
  priceInCents: number; // Integer minor units to prevent float precision issues
  currency: string;
  limits: {
    maxUsers: number;
    maxOrdersPerMonth: number;
    maxProducts: number;
    maxVendors: number;
  };
  features: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ISubscription {
  id: string;
  tenantId: string;
  planId: string;
  status: SubscriptionStatus;
  billingInterval: 'MONTHLY' | 'YEARLY';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  trialStart?: Date;
  trialEnd?: Date;
  cancellationAt?: Date;
  provider: string;
  providerCustomerId?: string;
  providerSubscriptionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IInvitation {
  id: string;
  tenantId: string;
  email: string;
  role: string;
  tokenHash: string;
  status: InvitationStatus;
  expiresAt: Date;
  invitedBy: string;
  acceptedAt?: Date;
  createdAt: Date;
}

export interface IUsageTracker {
  id: string;
  tenantId: string;
  metric: string;
  period: string; // YYYY-MM
  currentUsage: number;
  limit: number;
  updatedAt: Date;
}

export interface IUser {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  phone?: string;
  status: UserStatus;
  roles: string[];
  mfaEnabled: boolean;
  emailVerified: boolean;
  isOwner?: boolean;
  isPlatformAdmin?: boolean;
  lastLoginAt?: Date;
  lastLoginIp?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRole {
  id: string;
  tenantId: string;
  name: string;
  normalizedName?: string;
  description?: string;
  permissions: string[];
  systemRole: boolean;
  protected?: boolean;
  createdBy?: string;
  updatedBy?: string;
  archivedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISession {
  id: string;
  sessionId: string;
  tenantId: string;
  userId: string;
  userAgent?: string;
  ipAddress?: string;
  lastActivityAt: Date;
  expiresAt: Date;
  revokedAt?: Date;
  revokeReason?: string;
  isCurrent?: boolean;
  createdAt: Date;
}

export interface IAuditLog {
  id: string;
  tenantId: string;
  actorUserId: string;
  action: string;
  resourceType: string;
  resourceId: string;
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
  source: string;
  metadata?: Record<string, unknown>;
  result: 'SUCCESS' | 'FAILURE';
  timestamp: Date;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    requestId?: string;
    details?: unknown;
  };
}

export interface ICustomerSnapshot {
  name: string;
  email?: string;
  phone?: string;
}

export interface IAddressSnapshot {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface IOrder {
  id: string;
  tenantId: string;
  orderNumber: string;
  normalizedOrderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  source: OrderSource;
  channel?: string;
  paymentMethod: PaymentMethod;
  externalOrderId?: string;
  customerId?: string;
  customerSnapshot: ICustomerSnapshot;
  billingAddressSnapshot?: IAddressSnapshot;
  shippingAddressSnapshot?: IAddressSnapshot;
  currency: string;
  subtotalMinor: number;
  discountMinor: number;
  shippingMinor: number;
  taxMinor: number;
  totalMinor: number;
  amountPaidMinor: number;
  amountDueMinor: number;
  itemCount: number;
  notes?: string;
  metadata?: Record<string, unknown>;
  createdBy?: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
  cancelledAt?: Date;
  completedAt?: Date;
}

export interface IOrderItem {
  id: string;
  orderId: string;
  tenantId: string;
  productId: string;
  variantId?: string;
  productNameSnapshot: string;
  variantNameSnapshot?: string;
  skuSnapshot: string;
  barcodeSnapshot?: string;
  quantity: number;
  unitPriceMinor: number;
  unitCostMinor: number;
  discountMinor: number;
  taxMinor: number;
  lineSubtotalMinor: number;
  lineTotalMinor: number;
  createdAt: Date;
}

export interface IOrderTimeline {
  id: string;
  tenantId: string;
  orderId: string;
  event: string;
  actorUserId?: string;
  source: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

export interface IOrderNote {
  id: string;
  tenantId: string;
  orderId: string;
  authorUserId: string;
  content: string;
  createdAt: Date;
}

export interface IFulfillment {
  id: string;
  tenantId: string;
  orderId: string;
  status: FulfillmentStatus;
  locationId: string;
  trackingNumber?: string;
  carrierCode?: string;
  packedAt?: Date;
  shippedAt?: Date;
  deliveredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum CustomerStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BLOCKED = 'BLOCKED',
  ARCHIVED = 'ARCHIVED'
}

export enum CustomerLifecycleStage {
  NEW = 'NEW',
  ACTIVE = 'ACTIVE',
  REPEAT = 'REPEAT',
  VIP = 'VIP',
  AT_RISK = 'AT_RISK',
  DORMANT = 'DORMANT',
  LOST = 'LOST'
}

export enum CustomerSource {
  WEBSITE = 'WEBSITE',
  MANUAL = 'MANUAL',
  IMPORT = 'IMPORT',
  API = 'API',
  WHATSAPP = 'WHATSAPP',
  FACEBOOK = 'FACEBOOK',
  INSTAGRAM = 'INSTAGRAM',
  MARKETPLACE = 'MARKETPLACE',
  OTHER = 'OTHER'
}

export enum CustomerAddressType {
  SHIPPING = 'SHIPPING',
  BILLING = 'BILLING',
  OTHER = 'OTHER'
}

export interface ICustomer {
  id: string;
  tenantId: string;
  customerNumber: string;
  firstName: string;
  lastName: string;
  displayName: string;
  email?: string;
  normalizedEmail?: string;
  phone?: string;
  normalizedPhone?: string;
  alternatePhone?: string;
  dateOfBirth?: Date;
  companyName?: string;
  status: CustomerStatus;
  lifecycleStage: CustomerLifecycleStage;
  source: CustomerSource;
  tags: string[];
  notesSummary?: string;
  defaultShippingAddressId?: string;
  defaultBillingAddressId?: string;
  marketingConsent: boolean;
  marketingConsentAt?: Date;
  marketingConsentSource?: string;
  totalOrders: number;
  totalSpentMinor: number;
  averageOrderValueMinor: number;
  firstOrderAt?: Date;
  lastOrderAt?: Date;
  mergedIntoCustomerId?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICustomerAddress {
  id: string;
  tenantId: string;
  customerId: string;
  type: CustomerAddressType;
  label?: string;
  fullName: string;
  companyName?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
  phone?: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICustomerNote {
  id: string;
  tenantId: string;
  customerId: string;
  authorUserId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICustomerActivity {
  id: string;
  tenantId: string;
  customerId: string;
  eventType: string;
  actorId?: string;
  source: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

export interface ISegmentCondition {
  field: string;
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'contains';
  value: any;
}

export interface ICustomerSegment {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  conditions: ISegmentCondition[];
  isSystem?: boolean;
  status: 'ACTIVE' | 'ARCHIVED';
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ====================================================
// Vendor & Procurement Types & Enums
// ====================================================

export enum VendorStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BLOCKED = 'BLOCKED',
  ARCHIVED = 'ARCHIVED'
}

export enum VendorType {
  MANUFACTURER = 'MANUFACTURER',
  DISTRIBUTOR = 'DISTRIBUTOR',
  WHOLESALER = 'WHOLESALER',
  IMPORTER = 'IMPORTER',
  SERVICE_PROVIDER = 'SERVICE_PROVIDER',
  OTHER = 'OTHER'
}

export enum PaymentTerms {
  NET_15 = 'NET_15',
  NET_30 = 'NET_30',
  NET_45 = 'NET_45',
  NET_60 = 'NET_60',
  DUE_ON_RECEIPT = 'DUE_ON_RECEIPT',
  ADVANCE = 'ADVANCE'
}

export enum VendorProductAvailability {
  IN_STOCK = 'IN_STOCK',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  DISCONTINUED = 'DISCONTINUED',
  BACKORDER = 'BACKORDER'
}

export enum PurchaseOrderStatus {
  DRAFT = 'DRAFT',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  SUBMITTED = 'SUBMITTED',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  PARTIALLY_FULFILLED = 'PARTIALLY_FULFILLED',
  FULFILLED = 'FULFILLED',
  CANCELLED = 'CANCELLED',
  ON_HOLD = 'ON_HOLD'
}

export enum PurchaseOrderSource {
  MANUAL = 'MANUAL',
  AUTO_REORDER = 'AUTO_REORDER',
  ORDER_SPLIT = 'ORDER_SPLIT',
  LOW_STOCK = 'LOW_STOCK',
  IMPORT = 'IMPORT',
  API = 'API'
}

export enum ProcurementExceptionReason {
  NO_SUPPLIER_FOUND = 'NO_SUPPLIER_FOUND',
  VENDOR_INACTIVE = 'VENDOR_INACTIVE',
  MOQ_NOT_MET = 'MOQ_NOT_MET',
  AUTO_ORDER_DISABLED = 'AUTO_ORDER_DISABLED',
  MARGIN_TOO_LOW = 'MARGIN_TOO_LOW',
  SUBMISSION_FAILED = 'SUBMISSION_FAILED'
}

export interface IVendor {
  id: string;
  tenantId: string;
  vendorNumber: string;
  normalizedVendorNumber: string;
  name: string;
  companyName?: string;
  email?: string;
  phone?: string;
  website?: string;
  taxId?: string;
  status: VendorStatus;
  type: VendorType;
  paymentTerms: PaymentTerms;
  currency: string;
  minimumOrderQuantity: number;
  minimumOrderValueMinor: number;
  leadTimeDays: number;
  autoOrderEnabled: boolean;
  autoOrderThresholdMinor: number;
  rating: number;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  createdBy?: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IVendorContact {
  id: string;
  tenantId: string;
  vendorId: string;
  name: string;
  title?: string;
  email?: string;
  phone?: string;
  isPrimary: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IVendorProduct {
  id: string;
  tenantId: string;
  vendorId: string;
  productId: string;
  variantId?: string;
  supplierSKU: string;
  supplierProductName?: string;
  costPriceMinor: number;
  currency: string;
  minimumOrderQuantity: number;
  leadTimeDays: number;
  priority: number;
  isPrimary: boolean;
  availability: VendorProductAvailability;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPurchaseOrder {
  id: string;
  tenantId: string;
  poNumber: string;
  normalizedPoNumber: string;
  vendorId: string;
  vendorNameSnapshot: string;
  destinationLocationId: string;
  status: PurchaseOrderStatus;
  source: PurchaseOrderSource;
  salesOrderId?: string;
  currency: string;
  subtotalMinor: number;
  taxCostMinor: number;
  shippingCostMinor: number;
  totalMinor: number;
  itemCount: number;
  expectedDeliveryDate?: Date;
  notes?: string;
  approvedBy?: string;
  approvedAt?: Date;
  submittedAt?: Date;
  acknowledgedAt?: Date;
  fulfilledAt?: Date;
  cancelledAt?: Date;
  createdBy?: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPurchaseOrderItem {
  id: string;
  tenantId: string;
  purchaseOrderId: string;
  productId: string;
  variantId?: string;
  productNameSnapshot: string;
  variantNameSnapshot?: string;
  skuSnapshot: string;
  supplierSKUSnapshot: string;
  orderedQuantity: number;
  receivedQuantity: number;
  unitCostMinor: number;
  totalCostMinor: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProcurementTimeline {
  id: string;
  tenantId: string;
  purchaseOrderId: string;
  action: string;
  actorUserId: string;
  actorName: string;
  fromStatus?: string;
  toStatus?: string;
  reason?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

export interface IProcurementException {
  id: string;
  tenantId: string;
  purchaseOrderId?: string;
  salesOrderId?: string;
  vendorId?: string;
  productId?: string;
  variantId?: string;
  reason: ProcurementExceptionReason;
  message: string;
  resolved: boolean;
  resolvedBy?: string;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICustomerSegment {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  conditions: ISegmentCondition[];
  isSystem?: boolean;
  status: 'ACTIVE' | 'ARCHIVED';
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Phase 09 Financial Ledger & Settlement Enums & Interfaces

export enum VendorLedgerEntryType {
  ORDER_PAYABLE = 'ORDER_PAYABLE',
  RETURN_ADJUSTMENT = 'RETURN_ADJUSTMENT',
  RTO_ADJUSTMENT = 'RTO_ADJUSTMENT',
  DEDUCTION = 'DEDUCTION',
  MANUAL_ADJUSTMENT = 'MANUAL_ADJUSTMENT',
  SETTLEMENT = 'SETTLEMENT',
  REVERSAL = 'REVERSAL',
  REFUND_ADJUSTMENT = 'REFUND_ADJUSTMENT',
  OTHER = 'OTHER'
}

export enum VendorLedgerDirection {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT'
}

export enum VendorLedgerStatus {
  POSTED = 'POSTED',
  REVERSED = 'REVERSED',
  VOID = 'VOID'
}

export enum VendorSettlementStatus {
  DRAFT = 'DRAFT',
  CALCULATING = 'CALCULATING',
  PENDING_REVIEW = 'PENDING_REVIEW',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  PROCESSING = 'PROCESSING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  RECONCILIATION_REQUIRED = 'RECONCILIATION_REQUIRED'
}

export enum SettlementBatchStatus {
  DRAFT = 'DRAFT',
  REVIEW = 'REVIEW',
  APPROVED = 'APPROVED',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export enum VendorPaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED'
}

export enum ReconciliationStatus {
  MATCHED = 'MATCHED',
  MISMATCH = 'MISMATCH',
  PENDING = 'PENDING'
}

export enum FinancialPeriodStatus {
  OPEN = 'OPEN',
  LOCKED = 'LOCKED'
}

export enum VendorDeductionType {
  RETURN = 'RETURN',
  RTO = 'RTO',
  DAMAGE = 'DAMAGE',
  SHORTAGE = 'SHORTAGE',
  PENALTY = 'PENALTY',
  MANUAL_ADJUSTMENT = 'MANUAL_ADJUSTMENT',
  OTHER = 'OTHER'
}

export interface IVendorLedgerEntry {
  id: string;
  tenantId: string;
  vendorId: string;
  entryNumber: string;
  entryType: VendorLedgerEntryType;
  direction: VendorLedgerDirection;
  amountMinor: number;
  currency: string;
  sourceType: string;
  sourceId: string;
  orderId?: string;
  purchaseOrderId?: string;
  settlementId?: string;
  description: string;
  reference?: string;
  status: VendorLedgerStatus;
  reversalOfEntryId?: string;
  metadata?: Record<string, unknown>;
  createdBy?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface IVendorSettlement {
  id: string;
  tenantId: string;
  vendorId: string;
  settlementNumber: string;
  status: VendorSettlementStatus;
  periodStart: Date;
  periodEnd: Date;
  currency: string;
  grossPayableMinor: number;
  returnAdjustmentsMinor: number;
  rtoAdjustmentsMinor: number;
  deductionsMinor: number;
  previousSettlementsMinor: number;
  manualAdjustmentsMinor: number;
  netPayableMinor: number;
  eligibleEntryCount: number;
  approvedBy?: string;
  approvedAt?: Date;
  paidAt?: Date;
  paymentReference?: string;
  notes?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISettlementBatch {
  id: string;
  tenantId: string;
  batchNumber: string;
  periodStart: Date;
  periodEnd: Date;
  status: SettlementBatchStatus;
  settlementIds: string[];
  totalAmountMinor: number;
  currency: string;
  createdBy?: string;
  approvedBy?: string;
  createdAt: Date;
  approvedAt?: Date;
  completedAt?: Date;
}

export interface IVendorPayment {
  id: string;
  tenantId: string;
  vendorId: string;
  settlementId: string;
  paymentReference: string;
  amountMinor: number;
  currency: string;
  status: VendorPaymentStatus;
  provider?: string;
  providerTransactionId?: string;
  paidAt?: Date;
  createdBy?: string;
  createdAt: Date;
}

export interface ISettlementReconciliation {
  id: string;
  tenantId: string;
  settlementId: string;
  vendorId: string;
  paymentId?: string;
  expectedAmountMinor: number;
  actualAmountMinor: number;
  differenceMinor: number;
  status: ReconciliationStatus;
  notes?: string;
  resolvedBy?: string;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IFinancialPeriod {
  id: string;
  tenantId: string;
  periodStart: Date;
  periodEnd: Date;
  status: FinancialPeriodStatus;
  lockedBy?: string;
  lockedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ==========================================
// PHASE 10: PAYMENTS & FINANCE CORE TYPES
// ==========================================

export enum RefundStatus {
  REQUESTED = 'REQUESTED',
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED'
}

export enum PaymentReconciliationStatus {
  MATCHED = 'MATCHED',
  MISMATCH = 'MISMATCH',
  MISSING_PROVIDER = 'MISSING_PROVIDER',
  MISSING_INTERNAL = 'MISSING_INTERNAL',
  PENDING = 'PENDING'
}

export enum FinancialTransactionType {
  PAYMENT = 'PAYMENT',
  REFUND = 'REFUND',
  PAYMENT_FEE = 'PAYMENT_FEE',
  ADJUSTMENT = 'ADJUSTMENT',
  CHARGEBACK = 'CHARGEBACK',
  COD_COLLECTION = 'COD_COLLECTION',
  OTHER = 'OTHER'
}

export enum FinancialTransactionDirection {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT'
}

export interface IPayment {
  id: string;
  tenantId: string;
  paymentNumber: string;
  orderId: string;
  customerId?: string;
  provider: string;
  providerPaymentId?: string;
  providerTransactionId?: string;
  amountMinor: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod;
  failureCode?: string;
  failureReason?: string;
  parentPaymentId?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
  capturedAt?: Date;
  failedAt?: Date;
  cancelledAt?: Date;
}

export interface IRefund {
  id: string;
  tenantId: string;
  refundNumber: string;
  paymentId: string;
  orderId: string;
  amountMinor: number;
  currency: string;
  status: RefundStatus;
  providerRefundId?: string;
  reason: string;
  idempotencyKey?: string;
  createdBy?: string;
  approvedBy?: string;
  createdAt: Date;
  processedAt?: Date;
}

export interface IPaymentWebhookEvent {
  id: string;
  tenantId: string;
  provider: string;
  providerEventId: string;
  eventType: string;
  paymentId?: string;
  receivedAt: Date;
  processedAt?: Date;
  status: 'PENDING' | 'PROCESSED' | 'FAILED' | 'IGNORED';
  payloadHash?: string;
}

export interface IPaymentFee {
  id: string;
  tenantId: string;
  paymentId: string;
  provider: string;
  feeMinor: number;
  taxMinor: number;
  currency: string;
  source: string;
  createdAt: Date;
}

export interface IFinancialTransaction {
  id: string;
  tenantId: string;
  transactionNumber: string;
  type: FinancialTransactionType;
  direction: FinancialTransactionDirection;
  amountMinor: number;
  currency: string;
  sourceType: string;
  sourceId: string;
  status: 'POSTED' | 'REVERSED';
  createdAt: Date;
}

export interface IPaymentReconciliationRecord {
  id: string;
  tenantId: string;
  paymentId: string;
  orderId: string;
  internalAmountMinor: number;
  providerAmountMinor: number;
  internalCurrency: string;
  providerCurrency: string;
  internalStatus: PaymentStatus;
  providerStatus: string;
  status: PaymentReconciliationStatus;
  differenceMinor: number;
  notes?: string;
  resolvedBy?: string;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ====================================================
// Shipping, Returns & RTO Types & Enums (Phase 11)
// ====================================================

export enum ShipmentStatus {
  DRAFT = 'DRAFT',
  READY = 'READY',
  LABEL_CREATED = 'LABEL_CREATED',
  PICKUP_SCHEDULED = 'PICKUP_SCHEDULED',
  PICKED_UP = 'PICKED_UP',
  IN_TRANSIT = 'IN_TRANSIT',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  DELIVERY_FAILED = 'DELIVERY_FAILED',
  RTO_INITIATED = 'RTO_INITIATED',
  RTO_IN_TRANSIT = 'RTO_IN_TRANSIT',
  RTO_DELIVERED = 'RTO_DELIVERED',
  CANCELLED = 'CANCELLED',
  LOST = 'LOST',
  DAMAGED = 'DAMAGED'
}

export enum CustomerReturnStatus {
  REQUESTED = 'REQUESTED',
  PENDING_REVIEW = 'PENDING_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  PICKUP_SCHEDULED = 'PICKUP_SCHEDULED',
  IN_TRANSIT = 'IN_TRANSIT',
  RECEIVED = 'RECEIVED',
  INSPECTING = 'INSPECTING',
  APPROVED_FOR_REFUND = 'APPROVED_FOR_REFUND',
  REFUNDED = 'REFUNDED',
  REPLACEMENT = 'REPLACEMENT',
  CLOSED = 'CLOSED',
  CANCELLED = 'CANCELLED'
}

export enum RTOStatus {
  INITIATED = 'INITIATED',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  LOST = 'LOST',
  DAMAGED = 'DAMAGED',
  CANCELLED = 'CANCELLED'
}

export enum CourierType {
  API = 'API',
  MANUAL = 'MANUAL',
  CSV = 'CSV'
}

export enum CourierStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export enum ReturnItemCondition {
  SEALED = 'SEALED',
  OPENED = 'OPENED',
  USED = 'USED',
  DAMAGED = 'DAMAGED',
  DEFECTIVE = 'DEFECTIVE',
  WRONG_ITEM = 'WRONG_ITEM',
  MISSING_PARTS = 'MISSING_PARTS',
  OTHER = 'OTHER'
}

export enum ReturnItemDecision {
  ACCEPT = 'ACCEPT',
  PARTIAL_ACCEPT = 'PARTIAL_ACCEPT',
  REJECT = 'REJECT'
}

export enum ShipmentExceptionType {
  ADDRESS_INVALID = 'ADDRESS_INVALID',
  PHONE_INVALID = 'PHONE_INVALID',
  CUSTOMER_UNAVAILABLE = 'CUSTOMER_UNAVAILABLE',
  COURIER_DELAY = 'COURIER_DELAY',
  WEATHER = 'WEATHER',
  DAMAGED = 'DAMAGED',
  LOST = 'LOST',
  PAYMENT_ISSUE = 'PAYMENT_ISSUE',
  RTO = 'RTO',
  OTHER = 'OTHER'
}

export interface IShipmentItem {
  id?: string;
  tenantId: string;
  shipmentId: string;
  orderId: string;
  orderItemId: string;
  productId: string;
  variantId?: string;
  quantity: number;
  unitPriceMinor: number;
  vendorCostMinor: number;
  currency: string;
}

export interface IShipment {
  id: string;
  tenantId: string;
  shipmentNumber: string;
  orderId: string;
  fulfillmentId?: string;
  customerId?: string;
  vendorId?: string;
  courierId: string;
  courierName: string;
  trackingNumber?: string;
  trackingUrl?: string;
  status: ShipmentStatus;
  carrierStatus?: string;
  serviceType?: string;
  shippingMethod?: string;
  packageCount: number;
  weightGrams?: number;
  dimensions?: {
    lengthCm: number;
    widthCm: number;
    heightCm: number;
  };
  codAmountMinor: number;
  currency: string;
  shippingCostMinor: number;
  rtoCostMinor: number;
  labelUrl?: string;
  pickupScheduledAt?: Date;
  pickedUpAt?: Date;
  inTransitAt?: Date;
  outForDeliveryAt?: Date;
  deliveredAt?: Date;
  failedAt?: Date;
  returnedAt?: Date;
  estimatedDeliveryAt?: Date;
  exceptionCode?: string;
  exceptionReason?: string;
  metadata?: Record<string, unknown>;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICourier {
  id: string;
  tenantId: string;
  courierCode: string;
  name: string;
  type: CourierType;
  status: CourierStatus;
  credentialsReference?: string;
  webhookSecretReference?: string;
  configuration?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IShippingWebhookEvent {
  id: string;
  tenantId: string;
  courier: string;
  providerEventId: string;
  eventType: string;
  shipmentId?: string;
  payloadHash?: string;
  receivedAt: Date;
  processedAt?: Date;
  status: 'PENDING' | 'PROCESSED' | 'FAILED' | 'IGNORED';
}

export interface IShipmentTrackingEvent {
  id: string;
  tenantId: string;
  shipmentId: string;
  eventId: string;
  eventType: string;
  status: ShipmentStatus;
  carrierStatus?: string;
  location?: string;
  description?: string;
  eventAt: Date;
  receivedAt: Date;
  source: 'COURIER' | 'SYSTEM' | 'MANUAL';
  metadata?: Record<string, unknown>;
}

export interface IReturnToOrigin {
  id: string;
  tenantId: string;
  rtoNumber: string;
  shipmentId: string;
  orderId: string;
  vendorId?: string;
  reason: string;
  attemptCount: number;
  status: RTOStatus;
  rtoCostMinor: number;
  currency: string;
  initiatedAt: Date;
  deliveredAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICustomerReturnItem {
  id?: string;
  returnId: string;
  orderItemId: string;
  productId: string;
  variantId?: string;
  requestedQuantity: number;
  receivedQuantity: number;
  approvedQuantity: number;
  rejectedQuantity: number;
  reason: string;
  condition?: ReturnItemCondition;
  resolution?: 'REFUND' | 'REPLACEMENT' | 'STORE_CREDIT' | 'REJECT';
}

export interface ICustomerReturn {
  id: string;
  tenantId: string;
  returnNumber: string;
  orderId: string;
  customerId: string;
  status: CustomerReturnStatus;
  reason: string;
  customerNotes?: string;
  requestedAt: Date;
  approvedAt?: Date;
  receivedAt?: Date;
  closedAt?: Date;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IReturnInspection {
  id: string;
  tenantId: string;
  returnId: string;
  itemId: string;
  condition: ReturnItemCondition;
  decision: ReturnItemDecision;
  notes?: string;
  inspectedBy: string;
  inspectedAt: Date;
}

export interface IShipmentException {
  id: string;
  tenantId: string;
  shipmentId: string;
  type: ShipmentExceptionType;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CANCELLED';
  description: string;
  resolvedAt?: Date;
  resolvedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ==========================================
// PHASE 12: MARKETING & COMMUNICATION TYPES
// ==========================================

export enum CommunicationChannel {
  WHATSAPP = 'WHATSAPP',
  EMAIL = 'EMAIL',
  SMS = 'SMS'
}

export enum ConversationStatus {
  OPEN = 'OPEN',
  PENDING = 'PENDING',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED'
}

export enum MessageDirection {
  INBOUND = 'INBOUND',
  OUTBOUND = 'OUTBOUND'
}

export enum MessageStatus {
  PENDING = 'PENDING',
  QUEUED = 'QUEUED',
  PROCESSING = 'PROCESSING',
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  READ = 'READ',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED'
}

export enum MessageTemplateCategory {
  TRANSACTIONAL = 'TRANSACTIONAL',
  MARKETING = 'MARKETING',
  UTILITY = 'UTILITY',
  AUTHENTICATION = 'AUTHENTICATION'
}

export enum MessageTemplateStatus {
  DRAFT = 'DRAFT',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  ARCHIVED = 'ARCHIVED'
}

export enum CampaignStatus {
  DRAFT = 'DRAFT',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  SCHEDULED = 'SCHEDULED',
  PROCESSING = 'PROCESSING',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  FAILED = 'FAILED'
}

export enum CampaignRecipientStatus {
  PENDING = 'PENDING',
  QUEUED = 'QUEUED',
  PROCESSING = 'PROCESSING',
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  READ = 'READ',
  FAILED = 'FAILED',
  SKIPPED_CONSENT = 'SKIPPED_CONSENT'
}

export enum NotificationSeverity {
  INFO = 'INFO',
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL'
}

export interface IConversation {
  id: string;
  tenantId: string;
  customerId: string;
  channel: CommunicationChannel;
  channelConversationId?: string;
  status: ConversationStatus;
  assignedUserId?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  lastMessageAt?: Date;
  unreadCount: number;
  tags?: string[];
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMessage {
  id: string;
  tenantId: string;
  conversationId: string;
  customerId: string;
  channel: CommunicationChannel;
  direction: MessageDirection;
  messageType: 'TEXT' | 'TEMPLATE' | 'MEDIA' | 'INTERACTIVE';
  providerMessageId?: string;
  idempotencyKey?: string;
  templateId?: string;
  campaignId?: string;
  body: string;
  mediaUrl?: string;
  status: MessageStatus;
  errorCode?: string;
  errorMessage?: string;
  sentAt?: Date;
  deliveredAt?: Date;
  readAt?: Date;
  failedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMessageTemplate {
  id: string;
  tenantId: string;
  name: string;
  channel: CommunicationChannel;
  providerTemplateId?: string;
  language: string;
  category: MessageTemplateCategory;
  status: MessageTemplateStatus;
  body: string;
  variables?: string[];
  buttons?: Array<{ type: string; text: string; url?: string; phone?: string }>;
  version: number;
  active: boolean;
  createdBy: string;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICampaign {
  id: string;
  tenantId: string;
  name: string;
  channel: CommunicationChannel;
  audienceFilter?: Record<string, unknown>;
  templateId: string;
  status: CampaignStatus;
  scheduledAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
  cancelledAt?: Date;
  createdBy: string;
  approvedBy?: string;
  statistics?: {
    totalRecipients: number;
    sentCount: number;
    deliveredCount: number;
    readCount: number;
    failedCount: number;
  };
  idempotencyKey?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICampaignRecipient {
  id: string;
  tenantId: string;
  campaignId: string;
  customerId: string;
  destination: string;
  personalizationSnapshot?: Record<string, unknown>;
  status: CampaignRecipientStatus;
  messageId?: string;
  providerMessageId?: string;
  error?: string;
  sentAt?: Date;
  deliveredAt?: Date;
  readAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICommunicationPreference {
  id: string;
  tenantId: string;
  customerId: string;
  whatsapp: boolean;
  email: boolean;
  sms: boolean;
  marketingAllowed: boolean;
  transactionalAllowed: boolean;
  optInSource?: string;
  optInAt?: Date;
  optOutAt?: Date;
  unsubscribeReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface INotification {
  id: string;
  tenantId: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  severity: NotificationSeverity;
  entityType?: string;
  entityId?: string;
  readAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICommunicationWebhookEvent {
  id: string;
  tenantId?: string;
  channel: CommunicationChannel;
  provider: string;
  providerEventId: string;
  eventType: string;
  payloadHash?: string;
  processed: boolean;
  processedAt?: Date;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ==========================================
// PHASE 13: AUTOMATION, AI & APPROVAL TYPES
// ==========================================

export enum AutomationWorkflowStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  DISABLED = 'DISABLED',
  ARCHIVED = 'ARCHIVED'
}

export enum AutomationMode {
  AUTO = 'AUTO',
  APPROVAL = 'APPROVAL',
  ESCALATION = 'ESCALATION'
}

export enum AutomationRunStatus {
  QUEUED = 'QUEUED',
  RUNNING = 'RUNNING',
  WAITING_APPROVAL = 'WAITING_APPROVAL',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  ESCALATED = 'ESCALATED'
}

export enum ApprovalRequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED'
}

export enum AutomationExceptionSeverity {
  INFO = 'INFO',
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum AutomationExceptionStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  IGNORED = 'IGNORED',
  ESCALATED = 'ESCALATED'
}

export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface IAutomationRule {
  field: string;
  operator: 'equals' | 'notEquals' | 'greaterThan' | 'greaterThanOrEqual' | 'lessThan' | 'lessThanOrEqual' | 'in' | 'notIn' | 'contains' | 'exists' | 'between';
  value: unknown;
  logic?: 'AND' | 'OR';
  rules?: IAutomationRule[];
  not?: boolean;
}

export interface IAutomationActionConfig {
  actionType: string;
  params: Record<string, unknown>;
  mode?: AutomationMode;
}

export interface IAutomationWorkflow {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  status: AutomationWorkflowStatus;
  trigger: string;
  conditions: IAutomationRule[];
  actions: IAutomationActionConfig[];
  mode: AutomationMode;
  priority: number;
  enabled: boolean;
  maxExecutions?: number;
  rateLimit?: number;
  cooldownSeconds?: number;
  effectiveFrom?: Date;
  effectiveUntil?: Date;
  createdBy: string;
  updatedBy?: string;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAutomationRun {
  id: string;
  tenantId: string;
  workflowId: string;
  workflowVersion: number;
  triggerEventId: string;
  status: AutomationRunStatus;
  startedAt: Date;
  completedAt?: Date;
  currentStep?: number;
  decision?: Record<string, unknown>;
  actionResults?: Array<Record<string, unknown>>;
  error?: string;
  correlationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IApprovalRequest {
  id: string;
  tenantId: string;
  workflowRunId?: string;
  actionType: string;
  resourceType: string;
  resourceId: string;
  requestedBy: string;
  riskLevel: RiskLevel;
  reason: string;
  proposedAction: Record<string, unknown>;
  status: ApprovalRequestStatus;
  approvedBy?: string;
  approvedAt?: Date;
  rejectedBy?: string;
  rejectedAt?: Date;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAutomationException {
  id: string;
  tenantId: string;
  workflowRunId?: string;
  severity: AutomationExceptionSeverity;
  category: string;
  title: string;
  description: string;
  resourceType?: string;
  resourceId?: string;
  recommendedAction?: string;
  status: AutomationExceptionStatus;
  assignedTo?: string;
  resolvedBy?: string;
  resolvedAt?: Date;
  resolution?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum AnalyticsReportType {
  SALES = 'SALES',
  ORDERS = 'ORDERS',
  PROFIT = 'PROFIT',
  PRODUCTS = 'PRODUCTS',
  INVENTORY = 'INVENTORY',
  CUSTOMERS = 'CUSTOMERS',
  VENDORS = 'VENDORS',
  PROCUREMENT = 'PROCUREMENT',
  PAYMENTS = 'PAYMENTS',
  SHIPPING = 'SHIPPING',
  RETURNS = 'RETURNS',
  MARKETING = 'MARKETING',
  AUTOMATION = 'AUTOMATION',
  EXCEPTIONS = 'EXCEPTIONS'
}

export enum AnalyticsExportFormat {
  CSV = 'CSV',
  XLSX = 'XLSX',
  PDF = 'PDF'
}

export enum AnalyticsExportStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export interface IMetricDefinition {
  metricName: string;
  description: string;
  sourceCollection: string;
  calculationType: 'SUM' | 'COUNT' | 'AVERAGE' | 'RATIO' | 'DERIVED';
  isMinorUnit: boolean;
  currencyAware: boolean;
  permissionRequired: string;
}

export interface ISavedReport {
  id: string;
  tenantId: string;
  name: string;
  reportType: AnalyticsReportType;
  metrics: string[];
  dimensions?: string[];
  filters?: Record<string, unknown>;
  createdBy: string;
  isScheduled?: boolean;
  scheduleConfig?: {
    frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
    recipients: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IAnalyticsExportJob {
  id: string;
  tenantId: string;
  reportType: AnalyticsReportType;
  format: AnalyticsExportFormat;
  status: AnalyticsExportStatus;
  downloadUrl?: string;
  rowCount?: number;
  error?: string;
  requestedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAnalyticsAlert {
  id: string;
  tenantId: string;
  metric: string;
  condition: 'GREATER_THAN' | 'LESS_THAN' | 'EQUALS' | 'CHANGE_PERCENT';
  threshold: number;
  frequency: string;
  enabled: boolean;
  recipients: string[];
  cooldownSeconds: number;
  lastTriggeredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// --------------------------------------------------------------------------
// PHASE 15: SAAS ADMIN, SUBSCRIPTIONS, API KEYS, WEBHOOKS & INTEGRATIONS
// --------------------------------------------------------------------------

export enum SaaSPlanSlug {
  FREE = 'FREE',
  STARTER = 'STARTER',
  PRO = 'PRO',
  ENTERPRISE = 'ENTERPRISE'
}

export enum SaaSSubscriptionStatus {
  TRIALING = 'TRIALING',
  ACTIVE = 'ACTIVE',
  PAST_DUE = 'PAST_DUE',
  PAUSED = 'PAUSED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED'
}

export interface ISaaSPlanLimits {
  productsMax: number;
  usersMax: number;
  ordersMonthly: number;
  customersMax: number;
  vendorsMax: number;
  locationsMax: number;
  automationMax: number;
  messagesMonthly: number;
  campaignsMax: number;
  storageMaxMb: number;
  apiRequestsMonthly: number;
  exportsMonthly: number;
  scheduledReportsMax: number;
}

export interface ISaaSPlan {
  id: string;
  name: string;
  slug: SaaSPlanSlug | string;
  description: string;
  active: boolean;
  monthlyPriceMinor: number;
  yearlyPriceMinor: number;
  currency: string;
  limits: ISaaSPlanLimits;
  features: string[];
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISaaSSubscription {
  id: string;
  tenantId: string;
  planId: string;
  status: SaaSSubscriptionStatus;
  billingCycle: 'MONTHLY' | 'YEARLY';
  currency: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  trialStart?: Date;
  trialEnd?: Date;
  provider: string;
  providerCustomerId?: string;
  providerSubscriptionId?: string;
  cancelAtPeriodEnd: boolean;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IApiKey {
  id: string;
  tenantId: string;
  name: string;
  keyPrefix: string;
  keyHash: string;
  scopes: string[];
  createdAt: Date;
  expiresAt?: Date;
  lastUsedAt?: Date;
  revokedAt?: Date;
}

export interface IWebhookEndpoint {
  id: string;
  tenantId: string;
  url: string;
  events: string[];
  active: boolean;
  signingSecret: string;
  retryPolicy?: {
    maxRetries: number;
    backoffFactor: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IWebhookDeliveryLog {
  id: string;
  tenantId: string;
  endpointId: string;
  eventId: string;
  eventType: string;
  attempt: number;
  status: 'DELIVERED' | 'FAILED';
  httpStatus?: number;
  latencyMs?: number;
  error?: string;
  createdAt: Date;
}

export interface IFeatureFlag {
  id: string;
  key: string;
  description: string;
  enabled: boolean;
  global: boolean;
  tenantIds?: string[];
  rolloutPercentage?: number;
  environment?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPlatformSettings {
  defaultCurrency: string;
  defaultTimezone: string;
  rateLimitPerMinute: number;
  webhookMaxRetries: number;
  maintenanceMode: boolean;
  maintenanceMessage?: string;
  allowedRolesInMaintenance?: string[];
}







