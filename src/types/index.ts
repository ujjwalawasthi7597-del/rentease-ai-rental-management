export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  phone: string;
  role: 'landlord' | 'tenant';
  avatar?: string;
  createdAt: string;
}

export interface IProperty {
  _id: string;
  landlordId: string;
  propertyName: string;
  propertyType: 'Apartment' | 'House' | 'Room' | 'Commercial';
  address: string;
  city: string;
  monthlyRent: number;
  bedrooms: number;
  bathrooms: number;
  description: string;
  image: string;
  availabilityStatus: 'Available' | 'Occupied' | 'Under Maintenance';
  amenities?: string[];
  createdAt: string;
}

export interface ITenant {
  _id: string;
  landlordId: string;
  userId?: string;
  propertyId: string;
  propertyName?: string;
  name: string;
  email: string;
  phone: string;
  monthlyRent: number;
  securityDeposit: number;
  leaseStartDate: string;
  leaseEndDate: string;
  status?: 'Active' | 'Pending' | 'Ended';
  createdAt: string;
}

export interface IPayment {
  _id: string;
  landlordId: string;
  tenantId: string;
  tenantName?: string;
  propertyId: string;
  propertyName?: string;
  amount: number;
  paymentDate: string;
  paymentMethod: 'Bank Transfer' | 'Credit Card' | 'Cash' | 'Cheque' | 'Online Portal';
  status: 'Paid' | 'Pending' | 'Overdue';
  month: string; // e.g. "October 2026"
  notes?: string;
  createdAt: string;
}

export interface IMaintenanceRequest {
  _id: string;
  tenantId: string;
  tenantName?: string;
  propertyId: string;
  propertyName?: string;
  landlordId?: string;
  title: string;
  category: 'Plumbing' | 'Electrical' | 'Cleaning' | 'Furniture' | 'Appliance' | 'Other';
  description: string;
  image?: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Submitted' | 'In Progress' | 'Resolved';
  landlordResponse?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ILeaseAgreement {
  _id: string;
  landlordId: string;
  tenantId: string;
  tenantName?: string;
  propertyId: string;
  propertyName?: string;
  fileName: string;
  fileUrl: string;
  fileSize?: string;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Expiring Soon' | 'Expired';
  rentAmount?: number;
  depositAmount?: number;
  notes?: string;
  uploadedAt: string;
}
