import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { dbStore } from '../models/store.js';

export const getTenants = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    let tenants: any[] = [];

    if (user.role === 'landlord') {
      tenants = await dbStore.tenants.find({ landlordId: user._id });
    } else {
      const tenant =
        (await dbStore.tenants.findOne({ email: user.email })) ||
        (await dbStore.tenants.findOne({ userId: user._id }));
      if (tenant) tenants = [tenant];
    }

    // Enrich with current property names
    const enriched = await Promise.all(
      tenants.map(async (t) => {
        if (t.propertyId && !t.propertyName) {
          const prop = await dbStore.properties.findById(t.propertyId);
          return { ...t, propertyName: prop?.propertyName || 'Unassigned' };
        }
        return t;
      })
    );

    res.json({ success: true, count: enriched.length, data: enriched });
  } catch (err: any) {
    console.error('Error fetching tenants:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve tenants.' });
  }
};

export const getTenantById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const tenant = await dbStore.tenants.findById(id);

    if (!tenant) {
      res.status(404).json({ success: false, message: 'Tenant record not found.' });
      return;
    }

    if (req.user!.role === 'landlord' && tenant.landlordId !== req.user!._id) {
      res.status(403).json({ success: false, message: 'Access denied.' });
      return;
    }

    if (req.user!.role === 'tenant' && tenant.email !== req.user!.email && tenant.userId !== req.user!._id) {
      res.status(403).json({ success: false, message: 'Access denied.' });
      return;
    }

    const prop = tenant.propertyId ? await dbStore.properties.findById(tenant.propertyId) : null;
    res.json({ success: true, data: { ...tenant, property: prop } });
  } catch (err: any) {
    console.error('Error fetching tenant:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve tenant details.' });
  }
};

export const createTenant = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    const {
      name,
      email,
      phone,
      propertyId,
      monthlyRent,
      securityDeposit,
      leaseStartDate,
      leaseEndDate,
      status,
    } = req.body;

    if (!name || !email || !phone || !propertyId || monthlyRent === undefined || !leaseStartDate || !leaseEndDate) {
      res.status(400).json({
        success: false,
        message: 'Name, email, phone, property, rent, and lease start/end dates are required.',
      });
      return;
    }

    const property = await dbStore.properties.findById(propertyId);
    if (!property) {
      res.status(404).json({ success: false, message: 'Selected property was not found.' });
      return;
    }

    // Check if an existing registered user matches this email
    const registeredUser = await dbStore.users.findOne({ email: email.trim().toLowerCase() });

    const newTenant = await dbStore.tenants.create({
      landlordId: user._id,
      userId: registeredUser ? registeredUser._id : undefined,
      propertyId,
      propertyName: property.propertyName,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      monthlyRent: Number(monthlyRent),
      securityDeposit: Number(securityDeposit) || 0,
      leaseStartDate,
      leaseEndDate,
      status: status || 'Active',
    });

    // Automatically update property status to Occupied
    await dbStore.properties.findByIdAndUpdate(propertyId, { availabilityStatus: 'Occupied' });

    res.status(201).json({
      success: true,
      message: 'Tenant added and assigned to property successfully!',
      data: newTenant,
    });
  } catch (err: any) {
    console.error('Error creating tenant:', err);
    res.status(500).json({ success: false, message: 'Failed to create tenant.' });
  }
};

export const updateTenant = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const tenant = await dbStore.tenants.findById(id);

    if (!tenant) {
      res.status(404).json({ success: false, message: 'Tenant not found.' });
      return;
    }

    if (tenant.landlordId !== req.user!._id) {
      res.status(403).json({ success: false, message: 'Unauthorized to update this tenant.' });
      return;
    }

    const {
      name,
      email,
      phone,
      propertyId,
      monthlyRent,
      securityDeposit,
      leaseStartDate,
      leaseEndDate,
      status,
    } = req.body;

    const updates: any = {};
    if (name) updates.name = name.trim();
    if (email) updates.email = email.trim().toLowerCase();
    if (phone) updates.phone = phone.trim();
    if (propertyId) {
      updates.propertyId = propertyId;
      const prop = await dbStore.properties.findById(propertyId);
      if (prop) updates.propertyName = prop.propertyName;
    }
    if (monthlyRent !== undefined) updates.monthlyRent = Number(monthlyRent);
    if (securityDeposit !== undefined) updates.securityDeposit = Number(securityDeposit);
    if (leaseStartDate) updates.leaseStartDate = leaseStartDate;
    if (leaseEndDate) updates.leaseEndDate = leaseEndDate;
    if (status) updates.status = status;

    const updated = await dbStore.tenants.findByIdAndUpdate(id, updates);

    res.json({
      success: true,
      message: 'Tenant details updated successfully!',
      data: updated,
    });
  } catch (err: any) {
    console.error('Error updating tenant:', err);
    res.status(500).json({ success: false, message: 'Failed to update tenant.' });
  }
};

export const deleteTenant = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const tenant = await dbStore.tenants.findById(id);

    if (!tenant) {
      res.status(404).json({ success: false, message: 'Tenant not found.' });
      return;
    }

    if (tenant.landlordId !== req.user!._id) {
      res.status(403).json({ success: false, message: 'Unauthorized.' });
      return;
    }

    await dbStore.tenants.findByIdAndDelete(id);

    // Check if property has any other active tenants, if not set Available
    const otherTenants = await dbStore.tenants.find({ propertyId: tenant.propertyId });
    if (otherTenants.length === 0) {
      await dbStore.properties.findByIdAndUpdate(tenant.propertyId, { availabilityStatus: 'Available' });
    }

    res.json({ success: true, message: 'Tenant removed successfully.' });
  } catch (err: any) {
    console.error('Error deleting tenant:', err);
    res.status(500).json({ success: false, message: 'Failed to delete tenant.' });
  }
};
