import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Calendar,
  DollarSign,
  Download,
  AlertCircle,
  Building,
} from 'lucide-react';
import { api } from '../services/api.js';
import { IPayment, ITenant } from '../types/index.js';
import { StatusBadge } from '../components/StatusBadge.js';
import { Modal } from '../components/Modal.js';

export const RentManagementPage: React.FC = () => {
  const [payments, setPayments] = useState<IPayment[]>([]);
  const [tenants, setTenants] = useState<ITenant[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [monthFilter, setMonthFilter] = useState('all');

  // Modals & Notifications
  const [isRecordOpen, setIsRecordOpen] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    tenantId: '',
    amount: '',
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'Bank Transfer' as 'Bank Transfer' | 'Credit Card' | 'Cash' | 'Cheque' | 'Online Portal',
    status: 'Paid' as 'Paid' | 'Pending' | 'Overdue',
    month: 'November 2026',
    notes: '',
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (statusFilter !== 'all') queryParams.append('status', statusFilter);
      if (monthFilter !== 'all') queryParams.append('month', monthFilter);

      const [payRes, tenantsRes] = await Promise.all([
        api.get<{ success: boolean; data: IPayment[] }>(`/payments?${queryParams.toString()}`),
        api.get<{ success: boolean; data: ITenant[] }>('/tenants'),
      ]);

      if (payRes.success) setPayments(payRes.data);
      if (tenantsRes.success) {
        setTenants(tenantsRes.data);
        if (!formData.tenantId && tenantsRes.data.length > 0) {
          setFormData((prev) => ({
            ...prev,
            tenantId: tenantsRes.data[0]._id,
            amount: String(tenantsRes.data[0].monthlyRent),
          }));
        }
      }
    } catch (err: any) {
      console.error('Error fetching payments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter, monthFilter]);

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3500);
  };

  const handleTenantSelect = (tenantId: string) => {
    const t = tenants.find((item) => item._id === tenantId);
    setFormData((prev) => ({
      ...prev,
      tenantId,
      amount: t ? String(t.monthlyRent) : prev.amount,
    }));
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/payments', {
        ...formData,
        amount: Number(formData.amount),
      });
      setIsRecordOpen(false);
      showNotification('Payment record logged successfully!');
      loadData();
    } catch (err: any) {
      showNotification(err.message || 'Failed to record payment', 'error');
    }
  };

  const handleQuickStatusUpdate = async (id: string, newStatus: 'Paid' | 'Pending' | 'Overdue') => {
    try {
      await api.put(`/payments/${id}`, { status: newStatus });
      showNotification(`Payment status changed to ${newStatus}`);
      loadData();
    } catch (err: any) {
      showNotification(err.message || 'Failed to update payment status', 'error');
    }
  };

  // Compute live summary stats
  const totalCollected = payments
    .filter((p) => p.status === 'Paid')
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const totalPending = payments
    .filter((p) => p.status === 'Pending')
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const totalOverdue = payments
    .filter((p) => p.status === 'Overdue')
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const distinctMonths = Array.from(
    new Set([
      'November 2026',
      'October 2026',
      'September 2026',
      'August 2026',
      ...payments.map((p) => p.month),
    ])
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Rent Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track rental collections, manual payment receipts, and balance statuses across tenants.
          </p>
        </div>
        <button
          onClick={() => setIsRecordOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Record Payment Receipt
        </button>
      </div>

      {message && (
        <div
          className={`p-3.5 rounded-xl border text-xs font-bold flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600" />
          )}
          {message.text}
        </div>
      )}

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Collected</span>
            <p className="text-2xl font-extrabold text-emerald-600 mt-1">${totalCollected.toLocaleString()}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Verified receipts</p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Pending Collections</span>
            <p className="text-2xl font-extrabold text-amber-600 mt-1">${totalPending.toLocaleString()}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Awaiting processing</p>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Overdue Rent</span>
            <p className="text-2xl font-extrabold text-rose-600 mt-1">${totalOverdue.toLocaleString()}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Past due date</p>
          </div>
          <div className="p-3 rounded-xl bg-rose-50 text-rose-600">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5 mr-1">
            <Filter className="w-3.5 h-3.5" /> Filter by:
          </span>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-1.5 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
          >
            <option value="all">All Payment Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Overdue">Overdue</option>
          </select>

          <select
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            className="py-1.5 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
          >
            <option value="all">All Months</option>
            {distinctMonths.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <span className="text-xs text-slate-500 font-medium">
          Showing {payments.length} payment records
        </span>
      </div>

      {/* Payments Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-16 text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-500 font-medium">Loading rent ledger...</p>
          </div>
        ) : payments.length === 0 ? (
          <div className="py-12 text-center">
            <CreditCard className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">No payment records found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Adjust your filters or record a new rent payment receipt.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                  <th className="py-3 px-4">Resident & Property</th>
                  <th className="py-3 px-4">Month</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Payment Date</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900">{p.tenantName || 'Tenant'}</p>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Building className="w-3 h-3 text-slate-400" /> {p.propertyName || 'Property'}
                      </p>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-700">{p.month}</td>

                    <td className="py-3.5 px-4 font-extrabold text-slate-900">
                      ${p.amount.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{p.paymentDate}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {p.paymentMethod}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge status={p.status} type="payment" />
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {p.status !== 'Paid' ? (
                        <button
                          onClick={() => handleQuickStatusUpdate(p._id, 'Paid')}
                          className="px-3 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs border border-emerald-200 transition-colors"
                        >
                          Mark as Paid
                        </button>
                      ) : (
                        <button
                          onClick={() => handleQuickStatusUpdate(p._id, 'Pending')}
                          title="Revert status to Pending"
                          className="text-[11px] text-slate-400 hover:text-slate-600 font-medium"
                        >
                          Mark Pending
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Record Payment Modal */}
      <Modal isOpen={isRecordOpen} onClose={() => setIsRecordOpen(false)} title="Record Manual Rent Payment" maxWidth="md">
        <form onSubmit={handleRecordPayment} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Select Tenant *</label>
            <select
              required
              value={formData.tenantId}
              onChange={(e) => handleTenantSelect(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200"
            >
              {tenants.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name} ({t.propertyName || 'Property'}) - ${t.monthlyRent}/mo
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Payment Amount ($) *</label>
              <input
                type="number"
                required
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Billing Month *</label>
              <select
                value={formData.month}
                onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200"
              >
                <option value="November 2026">November 2026</option>
                <option value="December 2026">December 2026</option>
                <option value="October 2026">October 2026</option>
                <option value="September 2026">September 2026</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Payment Date *</label>
              <input
                type="date"
                required
                value={formData.paymentDate}
                onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Payment Method</label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as any })}
                className="w-full p-2.5 rounded-xl border border-slate-200"
              >
                <option value="Bank Transfer">Bank Transfer (ACH)</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Online Portal">Online Portal</option>
                <option value="Cheque">Cheque</option>
                <option value="Cash">Cash</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Payment Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full p-2.5 rounded-xl border border-slate-200"
            >
              <option value="Paid">Paid (Verified Receipt)</option>
              <option value="Pending">Pending (Processing)</option>
              <option value="Overdue">Overdue (Past Due)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Internal Reference / Notes</label>
            <input
              type="text"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="e.g. Check #4029 deposited or bank transaction code"
              className="w-full p-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsRecordOpen(false)}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 shadow-sm"
            >
              Save Payment
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
