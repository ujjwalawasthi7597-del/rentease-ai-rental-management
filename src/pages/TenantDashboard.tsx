import React, { useState, useEffect } from 'react';
import {
  Home,
  CreditCard,
  Wrench,
  FileText,
  Calendar,
  Sparkles,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Download,
  PlusCircle,
  Building,
} from 'lucide-react';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.js';
import { StatusBadge } from '../components/StatusBadge.js';

interface TenantDashboardProps {
  setCurrentTab: (tab: string) => void;
}

export const TenantDashboard: React.FC<TenantDashboardProps> = ({ setCurrentTab }) => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadTenantData = async () => {
    try {
      setLoading(true);
      const res = await api.get<{ success: boolean; data: any }>('/dashboard/tenant');
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (err: any) {
      console.error('Failed to load tenant dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTenantData();
  }, []);

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-semibold text-slate-500">Loading resident portal...</p>
        </div>
      </div>
    );
  }

  const prop = data?.property;
  const tenant = data?.tenant;
  const recentPayments = data?.recentPayments || [];
  const recentMaintenance = data?.recentMaintenance || [];
  const agreement = data?.agreement;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-800">
            Resident Portal
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight mt-2">
            Welcome Home, {user?.name}
          </h1>
          <p className="text-xs text-slate-300 mt-1 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-blue-400" />
            {prop ? `${prop.propertyName} — ${prop.address}, ${prop.city}` : 'No property assigned yet'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setCurrentTab('tenant-maintenance')}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/20 flex items-center gap-1.5"
          >
            <Wrench className="w-4 h-4 text-amber-300" />
            Report Issue
          </button>
          <button
            onClick={() => setCurrentTab('tenant-payments')}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs transition-all shadow-xs flex items-center gap-1.5"
          >
            <CreditCard className="w-4 h-4 text-slate-950" />
            View Payments
          </button>
        </div>
      </div>

      {/* Primary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Monthly Rent</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">${data?.monthlyRent || 0}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Due on 1st of each month</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Next Rent Due Date</span>
          <p className="text-2xl font-extrabold text-blue-600 mt-1">{data?.nextDueDate || 'Dec 1, 2026'}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Upcoming billing period</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Payment Status</span>
          <div className="mt-2">
            <StatusBadge status={data?.paymentStatus || 'Paid'} type="payment" size="md" />
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Current account standing</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Security Deposit</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">${data?.securityDeposit || 0}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Held in escrow account</p>
        </div>
      </div>

      {/* Property Showcase & Lease Document Strip */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assigned Property Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="relative h-48 bg-slate-100">
            <img
              src={prop?.image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'}
              alt={prop?.propertyName || 'Rental Property'}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3">
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-slate-900/80 backdrop-blur-md text-white">
                {prop?.propertyType || 'Apartment'}
              </span>
            </div>
            <div className="absolute top-3 right-3">
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-emerald-600 text-white">
                Active Tenancy
              </span>
            </div>
          </div>

          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">{prop?.propertyName || 'My Assigned Residence'}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{prop?.address}, {prop?.city}</p>
              </div>
              <p className="text-xl font-extrabold text-blue-600">${prop?.monthlyRent || data?.monthlyRent} /mo</p>
            </div>

            <div className="mt-4 flex items-center gap-6 text-xs text-slate-600 border-y border-slate-100 py-3">
              <span>{prop?.bedrooms || 3} Bedrooms</span>
              <span>•</span>
              <span>{prop?.bathrooms || 2} Bathrooms</span>
              <span>•</span>
              <span>Lease: {tenant?.leaseStartDate || '2026-02-01'} to {tenant?.leaseEndDate || '2027-01-31'}</span>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <p className="text-xs text-slate-500 line-clamp-1">
                {prop?.description || 'Maintained with full 24/7 emergency repair support by RentEase.'}
              </p>
              <button
                onClick={() => setCurrentTab('tenant-property')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 shrink-0 ml-4"
              >
                View Full Details →
              </button>
            </div>
          </div>
        </div>

        {/* Lease Agreement & Support Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Rental Agreement</h3>
              <StatusBadge status={agreement ? agreement.status : 'Active'} type="lease" />
            </div>

            <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <span className="font-bold text-slate-900 truncate">
                  {agreement?.fileName || 'Standard_Residential_Lease.pdf'}
                </span>
              </div>
              <p className="text-slate-500 text-[11px]">
                Valid through: {agreement?.endDate || tenant?.leaseEndDate || 'January 31, 2027'}
              </p>
              <a
                href={agreement?.fileUrl || '/uploads/sample_agreement_grandview.pdf'}
                target="_blank"
                rel="noreferrer"
                download
                className="mt-2 w-full py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Download Agreement (PDF)
              </a>
            </div>

            <div className="mt-4 p-3.5 rounded-xl bg-purple-50 border border-purple-100 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-purple-900 mb-1">
                <Sparkles className="w-4 h-4 text-purple-600" />
                Gemini Lease Assistant
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Need clarification on notice periods, pet rules, or repair responsibilities? Ask the AI assistant!
              </p>
              <button
                onClick={() => setCurrentTab('tenant-ai')}
                className="mt-2 text-xs font-bold text-purple-700 hover:text-purple-800"
              >
                Analyze My Lease →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Payment History & Maintenance Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Payment History */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Recent Payment History</h3>
              <p className="text-xs text-slate-500">Your past rent transactions</p>
            </div>
            <button
              onClick={() => setCurrentTab('tenant-payments')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700"
            >
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-500 font-semibold">
                  <th className="pb-2.5">Month</th>
                  <th className="pb-2.5">Amount</th>
                  <th className="pb-2.5">Date</th>
                  <th className="pb-2.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentPayments.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-slate-400">
                      No payments on file.
                    </td>
                  </tr>
                ) : (
                  recentPayments.map((p: any) => (
                    <tr key={p._id}>
                      <td className="py-3 font-bold text-slate-900">{p.month}</td>
                      <td className="py-3 font-semibold text-slate-800">${p.amount}</td>
                      <td className="py-3 text-slate-500">{p.paymentDate}</td>
                      <td className="py-3 text-right">
                        <StatusBadge status={p.status} type="payment" />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Maintenance Request Status */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Maintenance Requests</h3>
              <p className="text-xs text-slate-500">Service tickets and landlord updates</p>
            </div>
            <button
              onClick={() => setCurrentTab('tenant-maintenance')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700"
            >
              Report New Issue
            </button>
          </div>

          <div className="space-y-3">
            {recentMaintenance.length === 0 ? (
              <p className="py-6 text-center text-xs text-slate-400">No active maintenance tickets.</p>
            ) : (
              recentMaintenance.map((m: any) => (
                <div key={m._id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                      {m.category}
                    </span>
                    <StatusBadge status={m.status} type="maintenance" />
                  </div>
                  <p className="text-xs font-bold text-slate-900">{m.title}</p>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{m.description}</p>
                  {m.landlordResponse && (
                    <div className="mt-2 p-2 rounded-lg bg-blue-50 text-[11px] text-blue-800 border border-blue-100">
                      <strong>Landlord:</strong> {m.landlordResponse}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
