import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  Home,
  Database,
  Sparkles,
  Server,
  LogOut,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { api } from '../services/api.js';

interface ProfilePageProps {
  setCurrentTab: (tab: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ setCurrentTab }) => {
  const { user, logout, loginDemo } = useAuth();
  const [healthData, setHealthData] = useState<any>(null);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const res = await api.get('/health');
        setHealthData(res);
      } catch (err) {
        console.warn('Health check failed:', err);
      }
    };
    fetchHealth();
  }, []);

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Account Profile</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          View your session identity, permission role, and platform diagnostics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center text-center">
          <img
            src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
            alt={user.name}
            className="w-20 h-20 rounded-full border-2 border-slate-200 shadow-xs object-cover mb-4"
          />
          <h2 className="text-lg font-extrabold text-slate-900">{user.name}</h2>
          <p className="text-xs text-slate-500">{user.email}</p>

          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
            {user.role === 'landlord' ? (
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            ) : (
              <Home className="w-3.5 h-3.5 text-emerald-600" />
            )}
            {user.role} Role
          </div>

          <button
            onClick={() => {
              logout();
              setCurrentTab('landing');
            }}
            className="mt-6 w-full py-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>

        {/* Account Details & Role Switcher */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900">Personal & Contact Info</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400">Full Name</span>
                <p className="font-semibold text-slate-800 text-xs mt-0.5">{user.name}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400">Email Address</span>
                <p className="font-semibold text-slate-800 text-xs mt-0.5">{user.email}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400">Phone Number</span>
                <p className="font-semibold text-slate-800 text-xs mt-0.5">{user.phone || 'Not configured'}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400">Member Since</span>
                <p className="font-semibold text-slate-800 text-xs mt-0.5">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Active Member'}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Role Switcher for Test Drive */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Quick Persona Switcher</h3>
            <p className="text-xs text-slate-500">
              Easily toggle between the Landlord view and Tenant view to test both experiences.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={async () => {
                  await loginDemo('landlord');
                  setCurrentTab('landlord-dashboard');
                }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  user.role === 'landlord'
                    ? 'border-blue-500 bg-blue-50/50 text-blue-900 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs mb-1">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  Alexander Wright
                </div>
                <p className="text-[11px] text-slate-500">Landlord Portfolio & Operations</p>
              </button>

              <button
                type="button"
                onClick={async () => {
                  await loginDemo('tenant');
                  setCurrentTab('tenant-dashboard');
                }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  user.role === 'tenant'
                    ? 'border-emerald-500 bg-emerald-50/50 text-emerald-900 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs mb-1">
                  <Home className="w-4 h-4 text-emerald-600" />
                  Sophia Martinez
                </div>
                <p className="text-[11px] text-slate-500">Tenant Resident Portal & Requests</p>
              </button>
            </div>
          </div>

          {/* System Diagnostics */}
          <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xs space-y-3 text-xs">
            <div className="flex items-center gap-2 text-slate-300 font-bold uppercase tracking-wider text-[11px]">
              <Server className="w-4 h-4 text-sky-400" />
              <span>Platform & Database Health</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80">
                <span className="text-[10px] uppercase font-bold text-slate-400">Database Engine</span>
                <p className="font-bold text-emerald-400 text-xs mt-0.5">
                  {healthData?.database?.databaseType || 'RentEase Engine (Mongoose ready)'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80">
                <span className="text-[10px] uppercase font-bold text-slate-400">Gemini 3.8 Flash</span>
                <p className="font-bold text-sky-400 text-xs mt-0.5">
                  {healthData?.hasGeminiKey ? 'API Key Active (Cloud)' : 'Fallback / Rules Engine Active'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
