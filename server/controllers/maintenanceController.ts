import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { dbStore } from '../models/store.js';

export const getMaintenanceRequests = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    const { status, category } = req.query;
    let requests: any[] = [];

    if (user.role === 'landlord') {
      const filter: any = { landlordId: user._id };
      if (status && status !== 'all') filter.status = status;
      if (category && category !== 'all') filter.category = category;
      requests = await dbStore.maintenance.find(filter);
    } else {
      const tenant =
        (await dbStore.tenants.findOne({ email: user.email })) ||
        (await dbStore.tenants.findOne({ userId: user._id }));
      if (tenant) {
        const filter: any = { tenantId: tenant._id };
        if (status && status !== 'all') filter.status = status;
        if (category && category !== 'all') filter.category = category;
        requests = await dbStore.maintenance.find(filter);
      }
    }

    res.json({ success: true, count: requests.length, data: requests });
  } catch (err: any) {
    console.error('Error fetching maintenance requests:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve maintenance requests.' });
  }
};

export const getMaintenanceRequestById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const request = await dbStore.maintenance.findById(id);

    if (!request) {
      res.status(404).json({ success: false, message: 'Maintenance request not found.' });
      return;
    }

    res.json({ success: true, data: request });
  } catch (err: any) {
    console.error('Error fetching maintenance request:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve request details.' });
  }
};

export const createMaintenanceRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    const { title, category, description, propertyId, image, priority } = req.body;

    if (!title || !category || !description) {
      res.status(400).json({
        success: false,
        message: 'Title, category, and issue description are required.',
      });
      return;
    }

    let tenantId = '';
    let tenantName = user.name;
    let propId = propertyId;
    let landlordId = '';

    if (user.role === 'tenant') {
      const tenant =
        (await dbStore.tenants.findOne({ email: user.email })) ||
        (await dbStore.tenants.findOne({ userId: user._id }));
      if (tenant) {
        tenantId = tenant._id;
        tenantName = tenant.name;
        propId = tenant.propertyId;
        landlordId = tenant.landlordId;
      }
    } else {
      // Landlord logging an issue directly on behalf of a property
      landlordId = user._id;
      const tenant = await dbStore.tenants.findOne({ propertyId: propId });
      if (tenant) {
        tenantId = tenant._id;
        tenantName = tenant.name;
      }
    }

    const property = propId ? await dbStore.properties.findById(propId) : null;
    if (property && !landlordId) {
      landlordId = property.landlordId;
    }

    const newRequest = await dbStore.maintenance.create({
      tenantId: tenantId || 'general',
      tenantName: tenantName || 'Tenant',
      propertyId: propId || '',
      propertyName: property?.propertyName || 'Property',
      landlordId: landlordId || user._id,
      title: title.trim(),
      category,
      description: description.trim(),
      image: image || '',
      priority: priority || 'Medium',
      status: 'Submitted',
      landlordResponse: '',
    });

    res.status(201).json({
      success: true,
      message: 'Maintenance request submitted successfully!',
      data: newRequest,
    });
  } catch (err: any) {
    console.error('Error creating maintenance request:', err);
    res.status(500).json({ success: false, message: 'Failed to submit maintenance request.' });
  }
};

export const updateMaintenanceRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const request = await dbStore.maintenance.findById(id);

    if (!request) {
      res.status(404).json({ success: false, message: 'Maintenance request not found.' });
      return;
    }

    const { status, landlordResponse, priority, category } = req.body;
    const updates: any = {};

    if (status) updates.status = status;
    if (landlordResponse !== undefined) updates.landlordResponse = landlordResponse;
    if (priority) updates.priority = priority;
    if (category) updates.category = category;

    const updated = await dbStore.maintenance.findByIdAndUpdate(id, updates);

    res.json({
      success: true,
      message: 'Maintenance ticket updated successfully!',
      data: updated,
    });
  } catch (err: any) {
    console.error('Error updating maintenance request:', err);
    res.status(500).json({ success: false, message: 'Failed to update maintenance ticket.' });
  }
};
