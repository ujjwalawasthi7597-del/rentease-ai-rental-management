import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Calendar,
  Building,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { api } from '../services/api.js';
import { ILeaseAgreement } from '../types/index.js';
import { StatusBadge } from '../components/StatusBadge.js';

interface TenantLeasePageProps {
  setCurrentTab?: (tab: string) => void;
}

export const TenantLeasePage: React.FC<TenantLeasePageProps> = ({ setCurrentTab }) => {
  const [agreements, setAgreements] = useState<ILeaseAgreement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLease = async () => {
      try {
        setLoading(true);
        const res = await api.get<{ success: boolean; data: ILeaseAgreement[] }>('/agreements');
        if (res.success && res.data) {
          setAgreements(res.data);
        }
      } catch (err: any) {
        console.error('Failed to load agreements:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLease();
  }, []);

  if (loading) {
    return (
      <div className="py-16 text-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-xs text-slate-500 font-medium">Loading lease agreement documents...</p>
      </div>
    );
  }

  const primaryAgreement = agreements[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Lease Agreement</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Official digital tenancy documentation, covenants, and dates.
          </p>
        </div>
        {setCurrentTab && (
          <button
            onClick={() => setCurrentTab('tenant-ai')}
            className="px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold transition-all border border-purple-200 flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Sparkles className="w-4 h-4 text-purple-600" />
            Analyze Agreement with AI
          </button>
        )}
      </div>

      {!primaryAgreement ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No Lease Document Attached</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Your landlord has not yet uploaded a signed digital PDF for your account. Contact your property manager to upload a copy.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">{primaryAgreement.fileName}</h3>
                  <p className="text-xs text-slate-500">{primaryAgreement.propertyName}</p>
                </div>
              </div>
              <StatusBadge status={primaryAgreement.status} type="lease" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-slate-400">Monthly Rent</span>
                <p className="text-sm font-extrabold text-slate-900 mt-0.5">
                  ${primaryAgreement.rentAmount || 2850}
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-slate-400">Security Deposit</span>
                <p className="text-sm font-extrabold text-slate-900 mt-0.5">
                  ${primaryAgreement.depositAmount || 2850}
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-slate-400">Commencement</span>
                <p className="text-xs font-bold text-slate-800 mt-0.5">{primaryAgreement.startDate}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-slate-400">Expiration</span>
                <p className="text-xs font-bold text-slate-800 mt-0.5">{primaryAgreement.endDate}</p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Key Tenancy Clauses</h4>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>Rent due promptly on the 1st day of every month through the RentEase portal or bank transfer.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>Written notice of at least 60 calendar days required prior to renewal or vacation.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>Landlord covers central heating, plumbing, roof repairs, and building exterior maintenance.</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">File size: {primaryAgreement.fileSize || '1.4 MB'}</span>
              <a
                href={primaryAgreement.fileUrl}
                download={primaryAgreement.fileName}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 transition-colors shadow-xs"
              >
                <Download className="w-4 h-4" />
                Download Agreement (PDF)
              </a>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white p-6 rounded-2xl shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                <Sparkles className="w-4 h-4 text-sky-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">AI Lease Assistant</h3>
              </div>
              <p className="mt-4 text-xs text-slate-300 leading-relaxed">
                Have questions about your rental rights, security deposit return timeline, or pet policies?
                Our Gemini-powered legal assistant can extract and explain the exact terms in plain English.
              </p>
            </div>
            {setCurrentTab && (
              <button
                onClick={() => setCurrentTab('tenant-ai')}
                className="mt-6 w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-xs text-white transition-colors text-center"
              >
                Open AI Lease Analyzer
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
