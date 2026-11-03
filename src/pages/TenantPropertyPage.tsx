import React, { useState, useEffect } from 'react';
import {
  Building2,
  MapPin,
  Bed,
  Bath,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  Mail,
  Phone,
  Home,
  Sparkles,
} from 'lucide-react';
import { api } from '../services/api.js';

export const TenantPropertyPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProp = async () => {
      try {
        setLoading(true);
        const res = await api.get<{ success: boolean; data: any }>('/dashboard/tenant');
        if (res.success && res.data) {
          setData(res.data);
        }
      } catch (err: any) {
        console.error('Failed to load property details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProp();
  }, []);

  if (loading) {
    return (
      <div className="py-16 text-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-xs text-slate-500 font-medium">Loading property details...</p>
      </div>
    );
  }

  const prop = data?.property;
  const tenant = data?.tenant;

  if (!prop) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
        <Home className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-900">No Assigned Property</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
          Your resident account is not currently linked to an active rental property. Contact your landlord to link your lease.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{prop.propertyName}</h1>
        <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-slate-400" />
          {prop.address}, {prop.city}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-xs h-72">
            <img
              src={prop.image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'}
              alt={prop.propertyName}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Residence Overview</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {prop.description ||
                'Modern, energy-efficient rental home managed professionally by RentEase. Features high-end finishes, modern appliances, and complete dedicated maintenance support.'}
            </p>

            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-center">
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-xs font-bold text-slate-900">{prop.bedrooms} Bedrooms</p>
                <p className="text-[10px] text-slate-400">Master & Guest</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-xs font-bold text-slate-900">{prop.bathrooms} Bathrooms</p>
                <p className="text-[10px] text-slate-400">Full & Half</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-xs font-bold text-slate-900">{prop.propertyType}</p>
                <p className="text-[10px] text-slate-400">Building Type</p>
              </div>
            </div>

            {prop.amenities && prop.amenities.length > 0 && (
              <div className="pt-3 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 mb-2">Amenities & Inclusions</h4>
                <div className="flex flex-wrap gap-2">
                  {prop.amenities.map((item: string, i: number) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Lease & Landlord Contact Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Tenancy Summary</h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-slate-500">Monthly Rent</span>
                <span className="font-extrabold text-blue-600 text-sm">${prop.monthlyRent} /mo</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-slate-500">Security Deposit</span>
                <span className="font-semibold text-slate-800">${tenant?.securityDeposit || prop.monthlyRent}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-slate-500">Lease Start</span>
                <span className="font-semibold text-slate-800">{tenant?.leaseStartDate || '2026-02-01'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Lease End</span>
                <span className="font-semibold text-slate-800">{tenant?.leaseEndDate || '2027-01-31'}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Property Manager Contact</h3>
            </div>
            <div>
              <p className="text-sm font-bold text-white">Alexander Wright</p>
              <p className="text-xs text-slate-400">RentEase Portfolio Management</p>
            </div>
            <div className="pt-2 space-y-2 text-xs text-slate-300 border-t border-slate-800">
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-blue-400" /> landlord@rentease.com
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400" /> +1 (555) 234-8901
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
