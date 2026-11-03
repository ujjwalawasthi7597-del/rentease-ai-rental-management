import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  DollarSign,
  AlertCircle,
  Building,
} from 'lucide-react';
import { api } from '../services/api.js';
import { IPayment } from '../types/index.js';
import { StatusBadge } from '../components/StatusBadge.js';
import { Modal } from '../components/Modal.js';

export const TenantPaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<IPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [tenantInfo, setTenantInfo] = useState<any>(null);

  // Pay / Record Modal
  const [isPayOpen, setIsPayOpen] = useState(false);
  const [amountInput, setAmountInput] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Bank Transfer' | 'Credit Card' | 'Online Portal' | 'Cheque'>('Online Portal');
  const [monthInput, setMonthInput] = useState('November 2026');
  const [notesInput, setNotesInput] = useState('');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const [payRes, dashRes] = await Promise.all([
        api.get<{ success: boolean; data: IPayment[] }>('/payments'),
        api.get<{ success: boolean; data: any }>('/dashboard/tenant'),
      ]);

      if (payRes.success) setPayments(payRes.data);
      if (dashRes.success && dashRes.data) {
        setTenantInfo(dashRes.data);
        setAmountInput(String(dashRes.data.monthlyRent || '2850'));
      }
    } catch (err: any) {
      console.error('Error fetching payments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3500);
  };

  const handleMakePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenantInfo?.tenant) {
      showNotification('No active lease found to attach payment to.', 'error');
      return;
    }
    try {
      await api.post('/payments', {
        tenantId: tenantInfo.tenant._id,
        propertyId: tenantInfo.tenant.propertyId,
        amount: Number(amountInput),
        paymentDate: new Date().toISOString().split('T')[0],
        paymentMethod,
        status: 'Paid',
        month: monthInput,
        notes: notesInput || 'Submitted via Resident Portal',
      });
      setIsPayOpen(false);
      showNotification('Payment successfully submitted and recorded!');
      loadPayments();
    } catch (err: any) {
      showNotification(err.message || 'Failed to submit payment', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Rent & Payments</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            View your upcoming rent schedule, historical receipts, and submit rent payments.
          </p>
        </div>
        <button
          onClick={() => setIsPayOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2 self-start sm:self-auto"
        >
          <CreditCard className="w-4 h-4 text-emerald-400" />
          Submit Rent Payment
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

      {/* Due Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-blue-200">
            Next Payment Billing Cycle
          </span>
          <p className="text-3xl font-extrabold mt-1">${tenantInfo?.monthlyRent || 0}</p>
          <p className="text-xs text-blue-200 mt-1">Due on: {tenantInfo?.nextDueDate || 'December 1, 2026'}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] text-blue-200 block uppercase font-bold">Status</span>
            <StatusBadge status={tenantInfo?.paymentStatus || 'Paid'} type="payment" />
          </div>
          <button
            onClick={() => setIsPayOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-blue-50 font-extrabold text-xs transition-colors shadow-sm"
          >
            Pay Now
          </button>
        </div>
      </div>

      {/* Payment History Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Payment History & Receipts</h3>
          <span className="text-xs text-slate-500 font-medium">{payments.length} transactions</span>
        </div>

        {loading ? (
          <div className="py-16 text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-500 font-medium">Loading payments...</p>
          </div>
        ) : payments.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            <CreditCard className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p>No past payment records found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                  <th className="py-3 px-4">Billing Month</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Date Processed</th>
                  <th className="py-3 px-4">Method</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{p.month}</td>
                    <td className="py-3.5 px-4 font-extrabold text-slate-900">${p.amount.toLocaleString()}</td>
                    <td className="py-3.5 px-4 text-slate-600">{p.paymentDate}</td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                        {p.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={p.status} type="payment" />
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-500 text-[11px] font-mono">
                      {p.notes || `TXN-${p._id.slice(-6).toUpperCase()}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Submit Payment Modal */}
      <Modal isOpen={isPayOpen} onClose={() => setIsPayOpen(false)} title="Submit Rent Payment" maxWidth="md">
        <form onSubmit={handleMakePayment} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Payment Amount ($) *</label>
            <input
              type="number"
              required
              value={amountInput}
              onChange={(e) => setAmountInput(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-sm"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Billing Month *</label>
            <select
              value={monthInput}
              onChange={(e) => setMonthInput(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200"
            >
              <option value="November 2026">November 2026</option>
              <option value="December 2026">December 2026</option>
              <option value="January 2027">January 2027</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as any)}
              className="w-full p-2.5 rounded-xl border border-slate-200"
            >
              <option value="Online Portal">Online Portal (Instant Confirmation)</option>
              <option value="Bank Transfer">Bank Transfer (ACH)</option>
              <option value="Credit Card">Credit / Debit Card</option>
              <option value="Cheque">Physical Cheque</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Transaction Note (Optional)</label>
            <input
              type="text"
              value={notesInput}
              onChange={(e) => setNotesInput(e.target.value)}
              placeholder="e.g. November rent from checking account"
              className="w-full p-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsPayOpen(false)}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 shadow-sm"
            >
              Confirm Payment Record
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
