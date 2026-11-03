import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import {
  UserModel,
  PropertyModel,
  TenantModel,
  PaymentModel,
  MaintenanceModel,
  LeaseAgreementModel,
} from './schemas.js';

const isAtlasActive = () => mongoose.connection.readyState === 1;

// Realistic Seed Data
const DEFAULT_SALT = bcrypt.genSaltSync(10);
const DEMO_PASSWORD_HASH = bcrypt.hashSync('password123', DEFAULT_SALT);

let inMemoryUsers: any[] = [
  {
    _id: 'usr_landlord_1',
    name: 'Alexander Wright',
    email: 'landlord@rentease.com',
    password: DEMO_PASSWORD_HASH,
    phone: '+1 (555) 234-8901',
    role: 'landlord',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    createdAt: '2026-01-15T09:00:00.000Z',
  },
  {
    _id: 'usr_tenant_1',
    name: 'Sophia Martinez',
    email: 'tenant@rentease.com',
    password: DEMO_PASSWORD_HASH,
    phone: '+1 (555) 872-3104',
    role: 'tenant',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
    createdAt: '2026-02-01T10:00:00.000Z',
  },
  {
    _id: 'usr_tenant_2',
    name: 'David Chen',
    email: 'david.chen@example.com',
    password: DEMO_PASSWORD_HASH,
    phone: '+1 (555) 439-8812',
    role: 'tenant',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    createdAt: '2026-02-10T11:00:00.000Z',
  },
  {
    _id: 'usr_tenant_3',
    name: 'Emma Johnson',
    email: 'emma.j@example.com',
    password: DEMO_PASSWORD_HASH,
    phone: '+1 (555) 612-9903',
    role: 'tenant',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80',
    createdAt: '2026-03-01T12:00:00.000Z',
  },
];

let inMemoryProperties: any[] = [
  {
    _id: 'prop_1',
    landlordId: 'usr_landlord_1',
    propertyName: 'The Grandview Penthouse & Suites',
    propertyType: 'Apartment',
    address: '742 Evergreen Terrace, Unit 4B',
    city: 'Seattle, WA',
    monthlyRent: 2850,
    bedrooms: 3,
    bathrooms: 2,
    description: 'Luxurious high-floor corner residence featuring panoramic views, floor-to-ceiling windows, quartz countertops, central HVAC, and private balcony.',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    availabilityStatus: 'Occupied',
    amenities: ['Elevator', 'Gym Access', 'Underground Parking', 'Smart Lock', 'Pet Friendly'],
    createdAt: '2026-01-16T10:00:00.000Z',
  },
  {
    _id: 'prop_2',
    landlordId: 'usr_landlord_1',
    propertyName: 'Oakridge Modern Townhouse',
    propertyType: 'House',
    address: '1204 Pine Ridge Way',
    city: 'Austin, TX',
    monthlyRent: 2200,
    bedrooms: 2,
    bathrooms: 2.5,
    description: 'Contemporary two-story townhouse with open-concept living, attached garage, private fenced patio, and energy-efficient stainless appliances.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    availabilityStatus: 'Occupied',
    amenities: ['Private Garage', 'Backyard', 'In-unit Laundry', 'Solar Panels'],
    createdAt: '2026-01-20T11:00:00.000Z',
  },
  {
    _id: 'prop_3',
    landlordId: 'usr_landlord_1',
    propertyName: 'Harbor Breeze Luxury Studio',
    propertyType: 'Apartment',
    address: '88 Marina Boulevard, Suite 12',
    city: 'San Francisco, CA',
    monthlyRent: 1950,
    bedrooms: 1,
    bathrooms: 1,
    description: 'Sunlit designer studio overlooking the marina. Polished hardwood floors, chef kitchen, custom walk-in closet, and concierge service.',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
    availabilityStatus: 'Occupied',
    amenities: ['Doorman', 'Rooftop Terrace', 'Bicycle Storage', 'High-Speed Fiber'],
    createdAt: '2026-02-05T09:30:00.000Z',
  },
  {
    _id: 'prop_4',
    landlordId: 'usr_landlord_1',
    propertyName: 'Sunset Valley Executive Villa',
    propertyType: 'House',
    address: '450 Sunset Blvd',
    city: 'Denver, CO',
    monthlyRent: 3400,
    bedrooms: 4,
    bathrooms: 3,
    description: 'Spacious multi-level home with mountain views, finished basement, gourmet kitchen, 3-car garage, and landscaped garden with fire pit.',
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
    availabilityStatus: 'Available',
    amenities: ['Fireplace', 'Heated Driveway', 'EV Charger', 'Basement Suite'],
    createdAt: '2026-02-15T14:00:00.000Z',
  },
  {
    _id: 'prop_5',
    landlordId: 'usr_landlord_1',
    propertyName: 'Beacon Hill Classic Flat',
    propertyType: 'Apartment',
    address: '210 Commonwealth Ave',
    city: 'Boston, MA',
    monthlyRent: 2600,
    bedrooms: 2,
    bathrooms: 1,
    description: 'Historic brownstone charm blended with updated modern bathroom and kitchen. Exposed brick walls and decorative fireplace.',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
    availabilityStatus: 'Under Maintenance',
    amenities: ['Exposed Brick', 'Storage Locker', 'Dishwasher'],
    createdAt: '2026-03-01T08:00:00.000Z',
  },
];

let inMemoryTenants: any[] = [
  {
    _id: 'tnt_1',
    landlordId: 'usr_landlord_1',
    userId: 'usr_tenant_1',
    propertyId: 'prop_1',
    propertyName: 'The Grandview Penthouse & Suites',
    name: 'Sophia Martinez',
    email: 'tenant@rentease.com',
    phone: '+1 (555) 872-3104',
    monthlyRent: 2850,
    securityDeposit: 2850,
    leaseStartDate: '2026-02-01',
    leaseEndDate: '2027-01-31',
    status: 'Active',
    createdAt: '2026-02-01T10:00:00.000Z',
  },
  {
    _id: 'tnt_2',
    landlordId: 'usr_landlord_1',
    userId: 'usr_tenant_2',
    propertyId: 'prop_2',
    propertyName: 'Oakridge Modern Townhouse',
    name: 'David Chen',
    email: 'david.chen@example.com',
    phone: '+1 (555) 439-8812',
    monthlyRent: 2200,
    securityDeposit: 2200,
    leaseStartDate: '2026-02-15',
    leaseEndDate: '2027-02-14',
    status: 'Active',
    createdAt: '2026-02-10T11:00:00.000Z',
  },
  {
    _id: 'tnt_3',
    landlordId: 'usr_landlord_1',
    userId: 'usr_tenant_3',
    propertyId: 'prop_3',
    propertyName: 'Harbor Breeze Luxury Studio',
    name: 'Emma Johnson',
    email: 'emma.j@example.com',
    phone: '+1 (555) 612-9903',
    monthlyRent: 1950,
    securityDeposit: 1950,
    leaseStartDate: '2026-03-01',
    leaseEndDate: '2027-02-28',
    status: 'Active',
    createdAt: '2026-03-01T12:00:00.000Z',
  },
];

let inMemoryPayments: any[] = [
  {
    _id: 'pay_1',
    landlordId: 'usr_landlord_1',
    tenantId: 'tnt_1',
    tenantName: 'Sophia Martinez',
    propertyId: 'prop_1',
    propertyName: 'The Grandview Penthouse & Suites',
    amount: 2850,
    paymentDate: '2026-10-01',
    paymentMethod: 'Bank Transfer',
    status: 'Paid',
    month: 'October 2026',
    notes: 'Paid via automated ACH transfer',
    createdAt: '2026-10-01T14:30:00.000Z',
  },
  {
    _id: 'pay_2',
    landlordId: 'usr_landlord_1',
    tenantId: 'tnt_2',
    tenantName: 'David Chen',
    propertyId: 'prop_2',
    propertyName: 'Oakridge Modern Townhouse',
    amount: 2200,
    paymentDate: '2026-10-03',
    paymentMethod: 'Credit Card',
    status: 'Paid',
    month: 'October 2026',
    notes: 'On-time card transaction',
    createdAt: '2026-10-03T09:15:00.000Z',
  },
  {
    _id: 'pay_3',
    landlordId: 'usr_landlord_1',
    tenantId: 'tnt_3',
    tenantName: 'Emma Johnson',
    propertyId: 'prop_3',
    propertyName: 'Harbor Breeze Luxury Studio',
    amount: 1950,
    paymentDate: '2026-10-05',
    paymentMethod: 'Online Portal',
    status: 'Paid',
    month: 'October 2026',
    notes: 'Portal payment verified',
    createdAt: '2026-10-05T11:45:00.000Z',
  },
  {
    _id: 'pay_4',
    landlordId: 'usr_landlord_1',
    tenantId: 'tnt_1',
    tenantName: 'Sophia Martinez',
    propertyId: 'prop_1',
    propertyName: 'The Grandview Penthouse & Suites',
    amount: 2850,
    paymentDate: '2026-11-01',
    paymentMethod: 'Bank Transfer',
    status: 'Paid',
    month: 'November 2026',
    notes: 'November rent collected',
    createdAt: '2026-11-01T08:00:00.000Z',
  },
  {
    _id: 'pay_5',
    landlordId: 'usr_landlord_1',
    tenantId: 'tnt_2',
    tenantName: 'David Chen',
    propertyId: 'prop_2',
    propertyName: 'Oakridge Modern Townhouse',
    amount: 2200,
    paymentDate: '2026-11-02',
    paymentMethod: 'Online Portal',
    status: 'Pending',
    month: 'November 2026',
    notes: 'Awaiting tenant confirmation',
    createdAt: '2026-11-01T00:00:00.000Z',
  },
  {
    _id: 'pay_6',
    landlordId: 'usr_landlord_1',
    tenantId: 'tnt_3',
    tenantName: 'Emma Johnson',
    propertyId: 'prop_3',
    propertyName: 'Harbor Breeze Luxury Studio',
    amount: 1950,
    paymentDate: '2026-10-28',
    paymentMethod: 'Cash',
    status: 'Overdue',
    month: 'September 2026',
    notes: 'Late fee pending discussion',
    createdAt: '2026-09-05T00:00:00.000Z',
  },
];

let inMemoryMaintenance: any[] = [
  {
    _id: 'maint_1',
    tenantId: 'tnt_1',
    tenantName: 'Sophia Martinez',
    propertyId: 'prop_1',
    propertyName: 'The Grandview Penthouse & Suites',
    landlordId: 'usr_landlord_1',
    title: 'Kitchen Sink Drain Leaking Under Cabinet',
    category: 'Plumbing',
    description: 'Noticeable water dripping from the PVC trap underneath the double sink. Placed a bucket for now, but requires pipe sealant or washer replacement.',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    priority: 'High',
    status: 'In Progress',
    landlordResponse: 'Plumber scheduled for tomorrow between 2:00 PM and 4:00 PM. Please ensure the cabinet underneath is clear.',
    createdAt: '2026-10-30T16:20:00.000Z',
    updatedAt: '2026-10-31T09:00:00.000Z',
  },
  {
    _id: 'maint_2',
    tenantId: 'tnt_2',
    tenantName: 'David Chen',
    propertyId: 'prop_2',
    propertyName: 'Oakridge Modern Townhouse',
    landlordId: 'usr_landlord_1',
    title: 'HVAC Air Filter Replacement & Fan Squeak',
    category: 'Appliance',
    description: 'The heating blower produces a slight chirping squeak when starting up. Requesting 90-day filter change and blower lubrication.',
    image: '',
    priority: 'Medium',
    status: 'Submitted',
    landlordResponse: '',
    createdAt: '2026-11-01T11:10:00.000Z',
    updatedAt: '2026-11-01T11:10:00.000Z',
  },
  {
    _id: 'maint_3',
    tenantId: 'tnt_3',
    tenantName: 'Emma Johnson',
    propertyId: 'prop_3',
    propertyName: 'Harbor Breeze Luxury Studio',
    landlordId: 'usr_landlord_1',
    title: 'Dimmer Switch Buzzing in Bedroom',
    category: 'Electrical',
    description: 'The recessed light dimmer switch makes a soft electrical buzzing noise when set below 50% brightness.',
    image: '',
    priority: 'Low',
    status: 'Resolved',
    landlordResponse: 'Electrician installed an LED-compatible Lutron dimmer switch. Tested noise-free at all illumination levels.',
    createdAt: '2026-10-18T14:00:00.000Z',
    updatedAt: '2026-10-20T17:30:00.000Z',
  },
];

let inMemoryAgreements: any[] = [
  {
    _id: 'agr_1',
    landlordId: 'usr_landlord_1',
    tenantId: 'tnt_1',
    tenantName: 'Sophia Martinez',
    propertyId: 'prop_1',
    propertyName: 'The Grandview Penthouse & Suites',
    fileName: 'Residential_Lease_Grandview_Unit4B.pdf',
    fileUrl: '/uploads/sample_agreement_grandview.pdf',
    fileSize: '1.4 MB',
    startDate: '2026-02-01',
    endDate: '2027-01-31',
    status: 'Active',
    rentAmount: 2850,
    depositAmount: 2850,
    notes: '12-month standard fixed lease with 60-day notice requirement for renewal.',
    uploadedAt: '2026-02-01T09:00:00.000Z',
  },
  {
    _id: 'agr_2',
    landlordId: 'usr_landlord_1',
    tenantId: 'tnt_2',
    tenantName: 'David Chen',
    propertyId: 'prop_2',
    propertyName: 'Oakridge Modern Townhouse',
    fileName: 'Townhouse_Lease_Agreement_Chen.pdf',
    fileUrl: '/uploads/sample_agreement_oakridge.pdf',
    fileSize: '1.8 MB',
    startDate: '2026-02-15',
    endDate: '2027-02-14',
    status: 'Active',
    rentAmount: 2200,
    depositAmount: 2200,
    notes: 'Includes garage parking clause and patio maintenance agreement.',
    uploadedAt: '2026-02-15T10:00:00.000Z',
  },
  {
    _id: 'agr_3',
    landlordId: 'usr_landlord_1',
    tenantId: 'tnt_3',
    tenantName: 'Emma Johnson',
    propertyId: 'prop_3',
    propertyName: 'Harbor Breeze Luxury Studio',
    fileName: 'Harbor_Breeze_Studio_Lease_2026.pdf',
    fileUrl: '/uploads/sample_agreement_harbor.pdf',
    fileSize: '950 KB',
    startDate: '2026-03-01',
    endDate: '2026-12-31',
    status: 'Expiring Soon',
    rentAmount: 1950,
    depositAmount: 1950,
    notes: 'Expiring end of year; tenant expressed interest in extending 6 months.',
    uploadedAt: '2026-03-01T11:00:00.000Z',
  },
];

// Seed Atlas if connected and empty
export const seedAtlasIfEmpty = async () => {
  if (!isAtlasActive()) return;
  try {
    const userCount = await UserModel.countDocuments();
    if (userCount === 0) {
      console.log('🌱 [RentEase DB] Seeding initial data into MongoDB Atlas...');
      await UserModel.insertMany(inMemoryUsers);
      await PropertyModel.insertMany(inMemoryProperties);
      await TenantModel.insertMany(inMemoryTenants);
      await PaymentModel.insertMany(inMemoryPayments);
      await MaintenanceModel.insertMany(inMemoryMaintenance);
      await LeaseAgreementModel.insertMany(inMemoryAgreements);
      console.log('✅ [RentEase DB] Atlas database seeded successfully!');
    }
  } catch (err: any) {
    console.warn('⚠️ [RentEase DB] Could not check or seed Atlas:', err.message);
  }
};

// Unified Data Store API
export const dbStore = {
  // Users
  users: {
    find: async (filter: any = {}) => {
      if (isAtlasActive()) {
        const docs = await UserModel.find(filter).lean();
        return docs.map((d: any) => ({ ...d, _id: d._id.toString() }));
      }
      return inMemoryUsers.filter((u) => {
        for (const k in filter) {
          if (filter[k] !== undefined && u[k] !== filter[k]) return false;
        }
        return true;
      });
    },
    findById: async (id: string) => {
      if (isAtlasActive()) {
        const doc = await UserModel.findById(id).lean();
        return doc ? { ...doc, _id: (doc as any)._id.toString() } : null;
      }
      return inMemoryUsers.find((u) => u._id === id) || null;
    },
    findOne: async (filter: any) => {
      if (isAtlasActive()) {
        const doc = await UserModel.findOne(filter).lean();
        return doc ? { ...doc, _id: (doc as any)._id.toString() } : null;
      }
      return inMemoryUsers.find((u) => {
        for (const k in filter) {
          if (filter[k] !== undefined && u[k]?.toLowerCase?.() !== filter[k]?.toLowerCase?.() && u[k] !== filter[k]) {
            return false;
          }
        }
        return true;
      }) || null;
    },
    create: async (data: any) => {
      if (isAtlasActive()) {
        const doc = await UserModel.create(data);
        return { ...doc.toObject(), _id: doc._id.toString() };
      }
      const newUser = {
        _id: 'usr_' + Date.now() + Math.random().toString(36).substring(2, 6),
        ...data,
        createdAt: new Date().toISOString(),
      };
      inMemoryUsers.push(newUser);
      return newUser;
    },
  },

  // Properties
  properties: {
    find: async (filter: any = {}) => {
      if (isAtlasActive()) {
        const docs = await PropertyModel.find(filter).lean();
        return docs.map((d: any) => ({ ...d, _id: d._id.toString() }));
      }
      return inMemoryProperties.filter((p) => {
        for (const k in filter) {
          if (filter[k] !== undefined && p[k] !== filter[k]) return false;
        }
        return true;
      });
    },
    findById: async (id: string) => {
      if (isAtlasActive()) {
        const doc = await PropertyModel.findById(id).lean();
        return doc ? { ...doc, _id: (doc as any)._id.toString() } : null;
      }
      return inMemoryProperties.find((p) => p._id === id) || null;
    },
    create: async (data: any) => {
      if (isAtlasActive()) {
        const doc = await PropertyModel.create(data);
        return { ...doc.toObject(), _id: doc._id.toString() };
      }
      const newProp = {
        _id: 'prop_' + Date.now() + Math.random().toString(36).substring(2, 6),
        ...data,
        createdAt: new Date().toISOString(),
      };
      inMemoryProperties.push(newProp);
      return newProp;
    },
    findByIdAndUpdate: async (id: string, updates: any) => {
      if (isAtlasActive()) {
        const doc = await PropertyModel.findByIdAndUpdate(id, updates, { new: true }).lean();
        return doc ? { ...doc, _id: (doc as any)._id.toString() } : null;
      }
      const idx = inMemoryProperties.findIndex((p) => p._id === id);
      if (idx === -1) return null;
      inMemoryProperties[idx] = { ...inMemoryProperties[idx], ...updates };
      return inMemoryProperties[idx];
    },
    findByIdAndDelete: async (id: string) => {
      if (isAtlasActive()) {
        await PropertyModel.findByIdAndDelete(id);
        return true;
      }
      const idx = inMemoryProperties.findIndex((p) => p._id === id);
      if (idx === -1) return false;
      inMemoryProperties.splice(idx, 1);
      return true;
    },
  },

  // Tenants
  tenants: {
    find: async (filter: any = {}) => {
      if (isAtlasActive()) {
        const docs = await TenantModel.find(filter).lean();
        return docs.map((d: any) => ({ ...d, _id: d._id.toString() }));
      }
      return inMemoryTenants.filter((t) => {
        for (const k in filter) {
          if (filter[k] !== undefined && t[k] !== filter[k]) return false;
        }
        return true;
      });
    },
    findById: async (id: string) => {
      if (isAtlasActive()) {
        const doc = await TenantModel.findById(id).lean();
        return doc ? { ...doc, _id: (doc as any)._id.toString() } : null;
      }
      return inMemoryTenants.find((t) => t._id === id) || null;
    },
    findOne: async (filter: any) => {
      if (isAtlasActive()) {
        const doc = await TenantModel.findOne(filter).lean();
        return doc ? { ...doc, _id: (doc as any)._id.toString() } : null;
      }
      return inMemoryTenants.find((t) => {
        for (const k in filter) {
          if (filter[k] !== undefined && t[k] !== filter[k]) return false;
        }
        return true;
      }) || null;
    },
    create: async (data: any) => {
      if (isAtlasActive()) {
        const doc = await TenantModel.create(data);
        return { ...doc.toObject(), _id: doc._id.toString() };
      }
      const newTenant = {
        _id: 'tnt_' + Date.now() + Math.random().toString(36).substring(2, 6),
        status: 'Active',
        ...data,
        createdAt: new Date().toISOString(),
      };
      inMemoryTenants.push(newTenant);
      return newTenant;
    },
    findByIdAndUpdate: async (id: string, updates: any) => {
      if (isAtlasActive()) {
        const doc = await TenantModel.findByIdAndUpdate(id, updates, { new: true }).lean();
        return doc ? { ...doc, _id: (doc as any)._id.toString() } : null;
      }
      const idx = inMemoryTenants.findIndex((t) => t._id === id);
      if (idx === -1) return null;
      inMemoryTenants[idx] = { ...inMemoryTenants[idx], ...updates };
      return inMemoryTenants[idx];
    },
    findByIdAndDelete: async (id: string) => {
      if (isAtlasActive()) {
        await TenantModel.findByIdAndDelete(id);
        return true;
      }
      const idx = inMemoryTenants.findIndex((t) => t._id === id);
      if (idx === -1) return false;
      inMemoryTenants.splice(idx, 1);
      return true;
    },
  },

  // Payments
  payments: {
    find: async (filter: any = {}) => {
      if (isAtlasActive()) {
        const docs = await PaymentModel.find(filter).sort({ createdAt: -1 }).lean();
        return docs.map((d: any) => ({ ...d, _id: d._id.toString() }));
      }
      return inMemoryPayments
        .filter((p) => {
          for (const k in filter) {
            if (filter[k] !== undefined && p[k] !== filter[k]) return false;
          }
          return true;
        })
        .sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime());
    },
    findById: async (id: string) => {
      if (isAtlasActive()) {
        const doc = await PaymentModel.findById(id).lean();
        return doc ? { ...doc, _id: (doc as any)._id.toString() } : null;
      }
      return inMemoryPayments.find((p) => p._id === id) || null;
    },
    create: async (data: any) => {
      if (isAtlasActive()) {
        const doc = await PaymentModel.create(data);
        return { ...doc.toObject(), _id: doc._id.toString() };
      }
      const newPay = {
        _id: 'pay_' + Date.now() + Math.random().toString(36).substring(2, 6),
        ...data,
        createdAt: new Date().toISOString(),
      };
      inMemoryPayments.unshift(newPay);
      return newPay;
    },
    findByIdAndUpdate: async (id: string, updates: any) => {
      if (isAtlasActive()) {
        const doc = await PaymentModel.findByIdAndUpdate(id, updates, { new: true }).lean();
        return doc ? { ...doc, _id: (doc as any)._id.toString() } : null;
      }
      const idx = inMemoryPayments.findIndex((p) => p._id === id);
      if (idx === -1) return null;
      inMemoryPayments[idx] = { ...inMemoryPayments[idx], ...updates };
      return inMemoryPayments[idx];
    },
  },

  // Maintenance Requests
  maintenance: {
    find: async (filter: any = {}) => {
      if (isAtlasActive()) {
        const docs = await MaintenanceModel.find(filter).sort({ createdAt: -1 }).lean();
        return docs.map((d: any) => ({ ...d, _id: d._id.toString() }));
      }
      return inMemoryMaintenance
        .filter((m) => {
          for (const k in filter) {
            if (filter[k] !== undefined && m[k] !== filter[k]) return false;
          }
          return true;
        })
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },
    findById: async (id: string) => {
      if (isAtlasActive()) {
        const doc = await MaintenanceModel.findById(id).lean();
        return doc ? { ...doc, _id: (doc as any)._id.toString() } : null;
      }
      return inMemoryMaintenance.find((m) => m._id === id) || null;
    },
    create: async (data: any) => {
      if (isAtlasActive()) {
        const doc = await MaintenanceModel.create(data);
        return { ...doc.toObject(), _id: doc._id.toString() };
      }
      const newReq = {
        _id: 'maint_' + Date.now() + Math.random().toString(36).substring(2, 6),
        status: 'Submitted',
        landlordResponse: '',
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      inMemoryMaintenance.unshift(newReq);
      return newReq;
    },
    findByIdAndUpdate: async (id: string, updates: any) => {
      if (isAtlasActive()) {
        const doc = await MaintenanceModel.findByIdAndUpdate(
          id,
          { ...updates, updatedAt: new Date().toISOString() },
          { new: true }
        ).lean();
        return doc ? { ...doc, _id: (doc as any)._id.toString() } : null;
      }
      const idx = inMemoryMaintenance.findIndex((m) => m._id === id);
      if (idx === -1) return null;
      inMemoryMaintenance[idx] = {
        ...inMemoryMaintenance[idx],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      return inMemoryMaintenance[idx];
    },
  },

  // Lease Agreements
  agreements: {
    find: async (filter: any = {}) => {
      if (isAtlasActive()) {
        const docs = await LeaseAgreementModel.find(filter).sort({ uploadedAt: -1 }).lean();
        return docs.map((d: any) => ({ ...d, _id: d._id.toString() }));
      }
      return inMemoryAgreements
        .filter((a) => {
          for (const k in filter) {
            if (filter[k] !== undefined && a[k] !== filter[k]) return false;
          }
          return true;
        })
        .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
    },
    findById: async (id: string) => {
      if (isAtlasActive()) {
        const doc = await LeaseAgreementModel.findById(id).lean();
        return doc ? { ...doc, _id: (doc as any)._id.toString() } : null;
      }
      return inMemoryAgreements.find((a) => a._id === id) || null;
    },
    create: async (data: any) => {
      if (isAtlasActive()) {
        const doc = await LeaseAgreementModel.create(data);
        return { ...doc.toObject(), _id: doc._id.toString() };
      }
      const newAgr = {
        _id: 'agr_' + Date.now() + Math.random().toString(36).substring(2, 6),
        status: 'Active',
        ...data,
        uploadedAt: new Date().toISOString(),
      };
      inMemoryAgreements.unshift(newAgr);
      return newAgr;
    },
    findByIdAndDelete: async (id: string) => {
      if (isAtlasActive()) {
        await LeaseAgreementModel.findByIdAndDelete(id);
        return true;
      }
      const idx = inMemoryAgreements.findIndex((a) => a._id === id);
      if (idx === -1) return false;
      inMemoryAgreements.splice(idx, 1);
      return true;
    },
  },
};
