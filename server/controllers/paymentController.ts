import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { dbStore } from '../models/store.js';

export const getPayments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    const { status, month } = req.query;
    let payments: any[] = [];

    if (user.role === 'landlord') {
      const filter: any = { landlordId: user._id };
      if (status && status !== 'all') filter.status = status;
      if (month && month !== 'all') filter.month = month;
      payments = await dbStore.payments.find(filter);
    } else {
      const tenant =
        (await dbStore.tenants.findOne({ email: user.email })) ||
        (await dbStore.tenants.findOne({ userId: user._id }));
      if (tenant) {
        const filter: any = { tenantId: tenant._id };
        if (status && status !== 'all') filter.status = status;
        if (month && month !== 'all') filter.month = month;
        payments = await dbStore.payments.find(filter);
      }
    }

    res.json({ success: true, count: payments.length, data: payments });
  } catch (err: any) {
    console.error('Error fetching payments:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve payments.' });
  }
};

export const createPayment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    const { tenantId, propertyId, amount, paymentDate, paymentMethod, status, month, notes } = req.body;

    if (!tenantId || amount === undefined || !paymentDate || !month) {
      res.status(400).json({
        success: false,
        message: 'Tenant, amount, payment date, and month are required.',
      });
      return;
    }

    const tenant = await dbStore.tenants.findById(tenantId);
    if (!tenant) {
      res.status(404).json({ success: false, message: 'Tenant not found.' });
      return;
    }

    const propId = propertyId || tenant.propertyId;
    const property = await dbStore.properties.findById(propId);

    const newPayment = await dbStore.payments.create({
      landlordId: user.role === 'landlord' ? user._id : tenant.landlordId,
      tenantId,
      tenantName: tenant.name,
      propertyId: propId,
      propertyName: property?.propertyName || tenant.propertyName || 'Property',
      amount: Number(amount),
      paymentDate,
      paymentMethod: paymentMethod || 'Bank Transfer',
      status: status || 'Paid',
      month,
      notes: notes || '',
    });

    res.status(201).json({
      success: true,
      message: 'Payment record recorded successfully!',
      data: newPayment,
    });
  } catch (err: any) {
    console.error('Error recording payment:', err);
    res.status(500).json({ success: false, message: 'Failed to record payment.' });
  }
};

export const updatePayment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const payment = await dbStore.payments.findById(id);

    if (!payment) {
      res.status(404).json({ success: false, message: 'Payment record not found.' });
      return;
    }

    // Landlord can edit any field; tenant can only record
    if (req.user!.role === 'landlord' && payment.landlordId !== req.user!._id) {
      res.status(403).json({ success: false, message: 'Unauthorized to update this payment.' });
      return;
    }

    const { status, paymentMethod, paymentDate, amount, notes, month } = req.body;

    const updates: any = {};
    if (status) updates.status = status;
    if (paymentMethod) updates.paymentMethod = paymentMethod;
    if (paymentDate) updates.paymentDate = paymentDate;
    if (amount !== undefined) updates.amount = Number(amount);
    if (notes !== undefined) updates.notes = notes;
    if (month) updates.month = month;

    const updated = await dbStore.payments.findByIdAndUpdate(id, updates);

    res.json({
      success: true,
      message: 'Payment status updated successfully!',
      data: updated,
    });
  } catch (err: any) {
    console.error('Error updating payment:', err);
    res.status(500).json({ success: false, message: 'Failed to update payment record.' });
  }
};

export const getPaymentHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    let filter: any = {};

    if (user.role === 'landlord') {
      filter.landlordId = user._id;
    } else {
      const tenant =
        (await dbStore.tenants.findOne({ email: user.email })) ||
        (await dbStore.tenants.findOne({ userId: user._id }));
      if (tenant) filter.tenantId = tenant._id;
    }

    const allPayments = await dbStore.payments.find(filter);

    // Group by month
    const monthlyMap: Record<string, { collected: number; pending: number; overdue: number; count: number }> = {};
    allPayments.forEach((p) => {
      const m = p.month || 'Other';
      if (!monthlyMap[m]) {
        monthlyMap[m] = { collected: 0, pending: 0, overdue: 0, count: 0 };
      }
      monthlyMap[m].count++;
      if (p.status === 'Paid') {
        monthlyMap[m].collected += Number(p.amount);
      } else if (p.status === 'Pending') {
        monthlyMap[m].pending += Number(p.amount);
      } else if (p.status === 'Overdue') {
        monthlyMap[m].overdue += Number(p.amount);
      }
    });

    const summary = Object.keys(monthlyMap).map((m) => ({
      month: m,
      ...monthlyMap[m],
    }));

    res.json({ success: true, data: summary });
  } catch (err: any) {
    console.error('Error fetching payment history:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve payment history.' });
  }
};
