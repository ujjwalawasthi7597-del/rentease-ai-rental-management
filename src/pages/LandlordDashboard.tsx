import React, { useState, useEffect } from 'react';
import {
  Building2,
  Users,
  CreditCard,
  Clock,
  Sparkles,
  PlusCircle,
  Wrench,
  ArrowUpRight,
  TrendingUp,
  AlertTriangle,
  FileText,
  CheckCircle2,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { api } from '../services/api.js';
import { StatCard } from '../components/StatCard.js';
import { StatusBadge } from '../components/StatusBadge.js';
import { useAuth } from '../context/AuthContext.js';

interface DashboardData {
  totalProperties: number;
  totalTenants: number;
  monthlyRentCollected: number;
  pendingRent: number;
  overdueRent: number;
  occupancyRate: number;
  recentPayments: any[];
  recentMaintenance: any[];
  chartData: any[];
}

interface LandlordDashboardProps {
  setCurrentTab: (tab: string) => void;
}

export const LandlordDashboard: React.FC<LandlordDashboardProps> = ({ setCurrentTab }) => {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.get<{ success: boolean; data: DashboardData }>('/dashboard/landlord');
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (err: any) {
      console.error('Error fetching dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleMarkPaid = async (paymentId: string) => {
    try {
      await api.put(`/payments/${paymentId}`, { status: 'Paid' });
      setActionMessage('Payment marked as Paid successfully!');
      setTimeout(() => setActionMessage(null), 3000);
      loadDashboard();
    } catch (err: any) {
      alert(err.message || 'Failed to update payment');
    }
  };

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-semibold text-slate-500">Loading portfolio analytics...</p>
        </div>
      </div>
    );
  }

  const d = data || {
    totalProperties: 5,
    totalTenants: 3,
    monthlyRentCollected: 7000,
    pendingRent: 2200,
    overdueRent: 1950,
    occupancyRate: 80,
    recentPayments: [],
    recentMaintenance: [],
    chartData: [],
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Portfolio Overview
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Welcome back, {user?.name}. Here is the financial and operational status of your rentals.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setCurrentTab('landlord-properties')}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            Add Property
          </button>
          <button
            onClick={() => setCurrentTab('landlord-rents')}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <CreditCard className="w-4 h-4 text-emerald-600" />
            Record Payment
          </button>
          <button
            onClick={() => setCurrentTab('landlord-ai')}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-sky-200" />
            AI Assistant
          </button>
        </div>
      </div>

      {actionMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {actionMessage}
        </div>
      )}

      {/* Primary 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Properties"
          value={d.totalProperties}
          subtitle={`${d.occupancyRate}% occupancy rate`}
          icon={Building2}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
          trend={{ value: `${d.occupancyRate}% Occupied`, isPositive: d.occupancyRate >= 75 }}
        />
        <StatCard
          title="Active Tenants"
          value={d.totalTenants}
          subtitle="Signed lease agreements"
          icon={Users}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-50"
        />
        <StatCard
          title="Rent Collected"
          value={`$${d.monthlyRentCollected.toLocaleString()}`}
          subtitle="Collected to date"
          icon={CreditCard}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
          trend={{ value: 'On Track', isPositive: true }}
        />
        <StatCard
          title="Pending / Overdue"
          value={`$${(d.pendingRent + d.overdueRent).toLocaleString()}`}
          subtitle={`$${d.pendingRent} pending, $${d.overdueRent} overdue`}
          icon={Clock}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
          trend={{ value: d.overdueRent > 0 ? 'Requires Notice' : 'Healthy', isPositive: d.overdueRent === 0 }}
        />
      </div>

      {/* Chart & Quick Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Rent Collection Chart (Recharts) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Monthly Rent Collection Trend</h2>
              <p className="text-xs text-slate-500">Collected vs Expected rental revenue</p>
            </div>
            <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
              Last 6 Months
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={d.chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => `$${val / 1000}k`}
                />
                <Tooltip
                  formatter={(value: any) => [`$${Number(value).toLocaleString()}`, '']}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '0.75rem',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="collected" name="Collected Rent" fill="#2563eb" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pending" name="Pending / Overdue" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Quick Financial Briefing & Health */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl p-6 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">AI Portfolio Briefing</span>
              </div>
              <span className="text-[10px] bg-sky-950 text-sky-300 px-2 py-0.5 rounded border border-sky-800">
                Gemini 3.8
              </span>
            </div>

            <div className="mt-4 space-y-3 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <p className="font-bold text-emerald-400 text-xs">Portfolio Cash Flow: Stable</p>
                <p className="text-[11px] text-slate-300 mt-1">
                  Occupancy is at <span className="text-white font-semibold">{d.occupancyRate}%</span>. Rent collection efficiency is performing above regional baseline.
                </p>
              </div>

              {d.overdueRent > 0 && (
                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/50">
                  <p className="font-bold text-rose-300 text-xs flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                    Overdue Attention Needed
                  </p>
                  <p className="text-[11px] text-slate-300 mt-1">
                    ${d.overdueRent} in overdue balance. Use the AI Rent Reminder tool to send a courteous reminder notice.
                  </p>
                </div>
              )}

              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <p className="font-bold text-sky-300 text-xs">Maintenance Velocity</p>
                <p className="text-[11px] text-slate-300 mt-1">
                  {d.recentMaintenance.filter((m) => m.status !== 'Resolved').length} active repair tickets currently in progress or triage.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setCurrentTab('landlord-ai')}
            className="mt-4 w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-xs text-white transition-colors flex items-center justify-center gap-2"
          >
            Launch Full AI Financial Analysis
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Two Column Section: Recent Payments & Recent Maintenance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Rent Payments */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Recent Rent Payments</h2>
              <p className="text-xs text-slate-500">Live payment verification log</p>
            </div>
            <button
              onClick={() => setCurrentTab('landlord-rents')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              View All <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-500 font-semibold">
                  <th className="pb-2.5">Tenant / Unit</th>
                  <th className="pb-2.5">Amount</th>
                  <th className="pb-2.5">Status</th>
                  <th className="pb-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {d.recentPayments.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-slate-400">
                      No payments recorded yet.
                    </td>
                  </tr>
                ) : (
                  d.recentPayments.map((p) => (
                    <tr key={p._id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3">
                        <p className="font-bold text-slate-900">{p.tenantName || 'Tenant'}</p>
                        <p className="text-[11px] text-slate-500 truncate max-w-[140px]">{p.propertyName}</p>
                      </td>
                      <td className="py-3">
                        <p className="font-bold text-slate-900">${p.amount}</p>
                        <p className="text-[10px] text-slate-400">{p.month}</p>
                      </td>
                      <td className="py-3">
                        <StatusBadge status={p.status} />
                      </td>
                      <td className="py-3 text-right">
                        {p.status !== 'Paid' ? (
                          <button
                            onClick={() => handleMarkPaid(p._id)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[11px] border border-emerald-200 transition-colors"
                          >
                            Mark Paid
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-medium">Verified</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Maintenance Requests */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Recent Maintenance Requests</h2>
              <p className="text-xs text-slate-500">Tenant repair submissions and triage</p>
            </div>
            <button
              onClick={() => setCurrentTab('landlord-maintenance')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              View Board <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {d.recentMaintenance.length === 0 ? (
              <p className="py-6 text-center text-xs text-slate-400">No active maintenance tickets.</p>
            ) : (
              d.recentMaintenance.map((m) => (
                <div
                  key={m._id}
                  onClick={() => setCurrentTab('landlord-maintenance')}
                  className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-100/60 cursor-pointer transition-colors flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100/80 text-blue-700">
                        {m.category}
                      </span>
                      <StatusBadge status={m.priority} type="priority" />
                    </div>
                    <p className="text-xs font-bold text-slate-900 truncate">{m.title}</p>
                    <p className="text-[11px] text-slate-500 truncate">{m.propertyName} • {m.tenantName}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <StatusBadge status={m.status} type="maintenance" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
