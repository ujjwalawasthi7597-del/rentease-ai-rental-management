import mongoose, { Schema } from 'mongoose';

// User Schema
export const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    phone: { type: String, default: '' },
    role: { type: String, enum: ['landlord', 'tenant'], required: true },
    avatar: { type: String, default: '' },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Property Schema
export const PropertySchema = new Schema(
  {
    landlordId: { type: String, required: true, ref: 'User' },
    propertyName: { type: String, required: true },
    propertyType: {
      type: String,
      enum: ['Apartment', 'House', 'Room', 'Commercial'],
      required: true,
      default: 'Apartment',
    },
    address: { type: String, required: true },
    city: { type: String, required: true },
    monthlyRent: { type: Number, required: true },
    bedrooms: { type: Number, required: true, default: 1 },
    bathrooms: { type: Number, required: true, default: 1 },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    availabilityStatus: {
      type: String,
      enum: ['Available', 'Occupied', 'Under Maintenance'],
      default: 'Available',
    },
    amenities: { type: [String], default: [] },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Tenant Schema
export const TenantSchema = new Schema(
  {
    landlordId: { type: String, required: true, ref: 'User' },
    userId: { type: String, ref: 'User' },
    propertyId: { type: String, required: true, ref: 'Property' },
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String, required: true },
    monthlyRent: { type: Number, required: true },
    securityDeposit: { type: Number, default: 0 },
    leaseStartDate: { type: String, required: true },
    leaseEndDate: { type: String, required: true },
    status: { type: String, enum: ['Active', 'Pending', 'Ended'], default: 'Active' },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Payment Schema
export const PaymentSchema = new Schema(
  {
    landlordId: { type: String, required: true, ref: 'User' },
    tenantId: { type: String, required: true, ref: 'Tenant' },
    propertyId: { type: String, required: true, ref: 'Property' },
    amount: { type: Number, required: true },
    paymentDate: { type: String, required: true },
    paymentMethod: {
      type: String,
      enum: ['Bank Transfer', 'Credit Card', 'Cash', 'Cheque', 'Online Portal'],
      default: 'Bank Transfer',
    },
    status: {
      type: String,
      enum: ['Paid', 'Pending', 'Overdue'],
      default: 'Paid',
    },
    month: { type: String, required: true },
    notes: { type: String, default: '' },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// MaintenanceRequest Schema
export const MaintenanceRequestSchema = new Schema(
  {
    tenantId: { type: String, required: true, ref: 'Tenant' },
    propertyId: { type: String, required: true, ref: 'Property' },
    landlordId: { type: String, ref: 'User' },
    title: { type: String, required: true },
    category: {
      type: String,
      enum: ['Plumbing', 'Electrical', 'Cleaning', 'Furniture', 'Appliance', 'Other'],
      required: true,
    },
    description: { type: String, required: true },
    image: { type: String, default: '' },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['Submitted', 'In Progress', 'Resolved'],
      default: 'Submitted',
    },
    landlordResponse: { type: String, default: '' },
  },
  { timestamps: true }
);

// LeaseAgreement Schema
export const LeaseAgreementSchema = new Schema(
  {
    landlordId: { type: String, required: true, ref: 'User' },
    tenantId: { type: String, required: true, ref: 'Tenant' },
    propertyId: { type: String, required: true, ref: 'Property' },
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    fileSize: { type: String, default: '1.2 MB' },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    status: {
      type: String,
      enum: ['Active', 'Expiring Soon', 'Expired'],
      default: 'Active',
    },
    rentAmount: { type: Number },
    depositAmount: { type: Number },
    notes: { type: String, default: '' },
  },
  { timestamps: { createdAt: 'uploadedAt', updatedAt: false } }
);

export const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);
export const PropertyModel = mongoose.models.Property || mongoose.model('Property', PropertySchema);
export const TenantModel = mongoose.models.Tenant || mongoose.model('Tenant', TenantSchema);
export const PaymentModel = mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);
export const MaintenanceModel = mongoose.models.MaintenanceRequest || mongoose.model('MaintenanceRequest', MaintenanceRequestSchema);
export const LeaseAgreementModel = mongoose.models.LeaseAgreement || mongoose.model('LeaseAgreement', LeaseAgreementSchema);
