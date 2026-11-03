import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { dbStore } from '../models/store.js';

export const getAgreements = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    let agreements: any[] = [];

    if (user.role === 'landlord') {
      agreements = await dbStore.agreements.find({ landlordId: user._id });
    } else {
      const tenant =
        (await dbStore.tenants.findOne({ email: user.email })) ||
        (await dbStore.tenants.findOne({ userId: user._id }));
      if (tenant) {
        agreements = await dbStore.agreements.find({ tenantId: tenant._id });
      }
    }

    res.json({ success: true, count: agreements.length, data: agreements });
  } catch (err: any) {
    console.error('Error fetching agreements:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve lease agreements.' });
  }
};

export const createAgreement = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    const {
      tenantId,
      propertyId,
      fileName,
      fileUrl,
      fileSize,
      startDate,
      endDate,
      rentAmount,
      depositAmount,
      notes,
    } = req.body;

    if (!tenantId || !startDate || !endDate) {
      res.status(400).json({
        success: false,
        message: 'Tenant, lease start date, and lease end date are required.',
      });
      return;
    }

    const tenant = await dbStore.tenants.findById(tenantId);
    if (!tenant) {
      res.status(404).json({ success: false, message: 'Tenant record not found.' });
      return;
    }

    const propId = propertyId || tenant.propertyId;
    const property = await dbStore.properties.findById(propId);

    // Compute status based on end date
    const end = new Date(endDate);
    const now = new Date();
    const diffDays = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    let status: 'Active' | 'Expiring Soon' | 'Expired' = 'Active';
    if (diffDays < 0) {
      status = 'Expired';
    } else if (diffDays <= 45) {
      status = 'Expiring Soon';
    }

    const newAgreement = await dbStore.agreements.create({
      landlordId: user._id,
      tenantId: tenant._id,
      tenantName: tenant.name,
      propertyId: propId,
      propertyName: property?.propertyName || tenant.propertyName || 'Property',
      fileName: fileName || `${tenant.name.replace(/\s+/g, '_')}_Lease_Agreement.pdf`,
      fileUrl: fileUrl || '/uploads/sample_agreement_standard.pdf',
      fileSize: fileSize || '1.5 MB',
      startDate,
      endDate,
      status,
      rentAmount: rentAmount !== undefined ? Number(rentAmount) : tenant.monthlyRent,
      depositAmount: depositAmount !== undefined ? Number(depositAmount) : tenant.securityDeposit,
      notes: notes || '',
    });

    res.status(201).json({
      success: true,
      message: 'Lease agreement uploaded and recorded successfully!',
      data: newAgreement,
    });
  } catch (err: any) {
    console.error('Error creating agreement:', err);
    res.status(500).json({ success: false, message: 'Failed to record lease agreement.' });
  }
};

export const deleteAgreement = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const agreement = await dbStore.agreements.findById(id);

    if (!agreement) {
      res.status(404).json({ success: false, message: 'Lease agreement not found.' });
      return;
    }

    if (agreement.landlordId !== req.user!._id) {
      res.status(403).json({ success: false, message: 'Unauthorized to delete this agreement.' });
      return;
    }

    await dbStore.agreements.findByIdAndDelete(id);

    res.json({ success: true, message: 'Lease agreement deleted successfully.' });
  } catch (err: any) {
    console.error('Error deleting agreement:', err);
    res.status(500).json({ success: false, message: 'Failed to delete lease agreement.' });
  }
};
