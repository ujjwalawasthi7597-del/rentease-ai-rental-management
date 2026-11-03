import React, { useState } from 'react';
import {
  Sparkles,
  FileSearch,
  Wrench,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { api } from '../services/api.js';

export const TenantAIPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'analyzer' | 'triage'>('analyzer');

  // Lease Analyzer
  const [leaseText, setLeaseText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  // Triage
  const [issueTitle, setIssueTitle] = useState('');
  const [issueDesc, setIssueDesc] = useState('');
  const [triaging, setTriaging] = useState(false);
  const [triageData, setTriageData] = useState<any>(null);

  const loadTenantSample = () => {
    setLeaseText(
      `RESIDENTIAL LEASE AGREEMENT — SUMMARY OF KEY TERMS\n` +
      `Property: 742 Evergreen Terrace, Unit 4B, Seattle, WA\n` +
      `Tenant: Sophia Martinez\n` +
      `Monthly Rent: $2,850 payable on the 1st of each month via online resident portal.\n` +
      `Security Deposit: $2,850 held in escrow. Refundable within 21 days of move-out inspection.\n` +
      `Term: February 1, 2026 to January 31, 2027.\n` +
      `Notice: 60 days written notice required prior to lease expiration.\n` +
      `Maintenance: Landlord repairs structural, plumbing, heating, and appliances. Tenant maintains light bulbs, air filters, and reports leaks promptly.`
    );
  };

  const handleAnalyze = async () => {
    if (!leaseText || leaseText.trim().length < 20) {
      alert('Please enter or paste at least 20 characters of lease text.');
      return;
    }
    try {
      setAnalyzing(true);
      setAnalysis(null);
      const res = await api.post<{ success: boolean; data: any }>('/ai/analyze-agreement', {
        agreementText: leaseText,
      });
      if (res.success && res.data) {
        setAnalysis(res.data);
      }
    } catch (err: any) {
      alert(err.message || 'Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleTriage = async () => {
    if (!issueTitle && !issueDesc) {
      alert('Please enter a brief title or description of your maintenance problem.');
      return;
    }
    try {
      setTriaging(true);
      setTriageData(null);
      const res = await api.post<{ success: boolean; data: any }>('/ai/categorize-maintenance', {
        title: issueTitle,
        description: issueDesc,
      });
      if (res.success && res.data) {
        setTriageData(res.data);
      }
    } catch (err: any) {
      alert(err.message || 'Triage failed');
    } finally {
      setTriaging(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-200">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Tenant AI Resident Copilot</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Resident AI Assistant</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Ask questions about your lease covenants and get instant guidance on maintenance issues.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 max-w-md">
        <button
          onClick={() => setActiveTab('analyzer')}
          className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
            activeTab === 'analyzer' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileSearch className="w-4 h-4 text-blue-600" />
          Analyze My Lease
        </button>

        <button
          onClick={() => setActiveTab('triage')}
          className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
            activeTab === 'triage' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Wrench className="w-4 h-4 text-emerald-600" />
          Maintenance Helper
        </button>
      </div>

      {activeTab === 'analyzer' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Lease Text</h3>
              <button
                type="button"
                onClick={loadTenantSample}
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                Load My Current Lease Terms
              </button>
            </div>

            <textarea
              rows={10}
              value={leaseText}
              onChange={(e) => setLeaseText(e.target.value)}
              placeholder="Paste lease clauses or click 'Load My Current Lease Terms' above..."
              className="w-full p-3 rounded-xl border border-slate-200 text-xs font-mono leading-relaxed"
            />

            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {analyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Analyzing with Gemini...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-sky-300" />
                  Explain My Lease Terms
                </>
              )}
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
              Plain English Explanation
            </h3>

            {!analysis ? (
              <div className="py-16 text-center text-slate-400 text-xs">
                <FileSearch className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p>Click "Explain My Lease Terms" to get clear answers on rent, deposit return, and responsibilities.</p>
              </div>
            ) : (
              <div className="mt-4 space-y-3.5 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Monthly Rent</span>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">{analysis.monthlyRent || 'N/A'}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Security Deposit</span>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">{analysis.securityDeposit || 'N/A'}</p>
                  </div>
                </div>

                <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl">
                  <p className="font-bold text-blue-900 mb-1">Notice & Termination:</p>
                  <p className="text-slate-700">{analysis.noticePeriod || '60 days notice'}</p>
                </div>

                {analysis.summary && (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <p className="font-bold text-slate-900 mb-1">Summary Overview:</p>
                    <p className="text-slate-700 leading-relaxed">{analysis.summary}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'triage' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Describe Your Problem</h3>
              <p className="text-xs text-slate-500">
                Not sure how urgent an issue is or what safety steps to take? Gemini will evaluate it.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Problem Title</label>
              <input
                type="text"
                value={issueTitle}
                onChange={(e) => setIssueTitle(e.target.value)}
                placeholder="e.g. Water dripping under sink or stove burner not lighting"
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
              <textarea
                rows={4}
                value={issueDesc}
                onChange={(e) => setIssueDesc(e.target.value)}
                placeholder="Explain what is happening..."
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs leading-relaxed"
              />
            </div>

            <button
              onClick={handleTriage}
              disabled={triaging}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {triaging ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Triaging with Gemini...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-sky-300" />
                  Evaluate Severity & Get Safety Steps
                </>
              )}
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
              AI Evaluation & Advice
            </h3>

            {!triageData ? (
              <div className="py-16 text-center text-slate-400 text-xs">
                <Wrench className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p>Describe your issue on the left to see recommended urgency and safety tips.</p>
              </div>
            ) : (
              <div className="mt-4 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Category</span>
                    <p className="text-base font-bold text-blue-700 mt-0.5">{triageData.category}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Urgency</span>
                    <p className="text-base font-bold text-amber-700 mt-0.5">{triageData.priority}</p>
                  </div>
                </div>

                {triageData.tenantAdvice && (
                  <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl">
                    <p className="font-bold text-amber-900 mb-1">What you should do right now:</p>
                    <p className="text-slate-700 leading-relaxed">{triageData.tenantAdvice}</p>
                  </div>
                )}

                {triageData.suggestedAction && (
                  <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl">
                    <p className="font-bold text-blue-900 mb-1">Expected Landlord Action:</p>
                    <p className="text-slate-700 leading-relaxed">{triageData.suggestedAction}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
