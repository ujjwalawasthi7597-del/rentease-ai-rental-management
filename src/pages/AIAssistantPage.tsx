import React, { useState } from 'react';
import {
  Sparkles,
  FileSearch,
  Wrench,
  BellRing,
  PieChart,
  Copy,
  Check,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Cpu,
  Shield,
  Layers,
} from 'lucide-react';
import { api } from '../services/api.js';

export const AIAssistantPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'analyzer' | 'triage' | 'reminder' | 'expenses'>('analyzer');

  // Tool 1: Agreement Analyzer State
  const [agreementText, setAgreementText] = useState('');
  const [analyzerLoading, setAnalyzerLoading] = useState(false);
  const [analyzerResult, setAnalyzerResult] = useState<any>(null);
  const [analyzerSource, setAnalyzerSource] = useState<string>('');

  // Tool 2: Maintenance Triage State
  const [triageTitle, setTriageTitle] = useState('');
  const [triageDesc, setTriageDesc] = useState('');
  const [triageLoading, setTriageLoading] = useState(false);
  const [triageResult, setTriageResult] = useState<any>(null);
  const [triageSource, setTriageSource] = useState<string>('');

  // Tool 3: Rent Reminder State
  const [reminderTenant, setReminderTenant] = useState('Sophia Martinez');
  const [reminderProp, setReminderProp] = useState('The Grandview Penthouse & Suites');
  const [reminderAmount, setReminderAmount] = useState('2850');
  const [reminderDue, setReminderDue] = useState('November 1, 2026');
  const [reminderTone, setReminderTone] = useState('Friendly & Professional');
  const [reminderLoading, setReminderLoading] = useState(false);
  const [reminderResult, setReminderResult] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Tool 4: Expense Summary State
  const [expenseLoading, setExpenseLoading] = useState(false);
  const [expenseResult, setExpenseResult] = useState<any>(null);

  // Sample lease loader
  const loadSampleLease = () => {
    setAgreementText(
      `RESIDENTIAL LEASE AGREEMENT\n\n` +
      `This Lease Agreement is entered into on February 1, 2026, by and between Alexander Wright ("Landlord") and Sophia Martinez ("Tenant").\n\n` +
      `1. PREMISES: Landlord leases to Tenant the premises located at 742 Evergreen Terrace, Unit 4B, Seattle, WA.\n` +
      `2. TERM: The term of this lease begins on February 1, 2026, and concludes on January 31, 2027.\n` +
      `3. RENT: Tenant agrees to pay monthly rent in the amount of $2,850.00, payable on the first day of each calendar month via ACH or electronic transfer.\n` +
      `4. SECURITY DEPOSIT: Tenant shall deposit with Landlord the sum of $2,850.00 as security for faithful performance of all terms.\n` +
      `5. NOTICE FOR RENEWAL OR TERMINATION: Either party must provide at least 60 calendar days written notice prior to lease expiration.\n` +
      `6. MAINTENANCE & REPAIRS: Landlord shall be responsible for maintenance of major structural components, roof, central heating/AC systems, and primary plumbing lines. Tenant shall be responsible for keeping the interior clean and sanitary, replacing lightbulbs and furnace air filters every 90 days, and reimbursing repairs caused by tenant negligence.\n` +
      `7. SUBLETTING: No assignment or subletting of premises without express written landlord approval.`
    );
  };

  const handleAnalyzeAgreement = async () => {
    if (!agreementText || agreementText.trim().length < 20) {
      alert('Please enter or paste at least 20 characters of lease agreement text.');
      return;
    }
    try {
      setAnalyzerLoading(true);
      setAnalyzerResult(null);
      const res = await api.post<{ success: boolean; data: any; source: string; fallbackNotice?: string }>(
        '/ai/analyze-agreement',
        { agreementText }
      );
      if (res.success && res.data) {
        setAnalyzerResult(res.data);
        setAnalyzerSource(res.source || 'Gemini 3.8 Flash');
      }
    } catch (err: any) {
      alert(err.message || 'Analysis failed');
    } finally {
      setAnalyzerLoading(false);
    }
  };

  const handleTriageMaintenance = async () => {
    if (!triageTitle && !triageDesc) {
      alert('Please provide an issue title or description to triage.');
      return;
    }
    try {
      setTriageLoading(true);
      setTriageResult(null);
      const res = await api.post<{ success: boolean; data: any; source: string }>(
        '/ai/categorize-maintenance',
        { title: triageTitle, description: triageDesc }
      );
      if (res.success && res.data) {
        setTriageResult(res.data);
        setTriageSource(res.source || 'Gemini 3.8 Flash');
      }
    } catch (err: any) {
      alert(err.message || 'Triage failed');
    } finally {
      setTriageLoading(false);
    }
  };

  const handleGenerateReminder = async () => {
    try {
      setReminderLoading(true);
      setReminderResult('');
      const res = await api.post<{ success: boolean; data: { message: string } }>('/ai/generate-reminder', {
        tenantName: reminderTenant,
        propertyName: reminderProp,
        rentAmount: reminderAmount,
        dueDate: reminderDue,
        tone: reminderTone,
      });
      if (res.success && res.data) {
        setReminderResult(res.data.message);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to generate reminder');
    } finally {
      setReminderLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleGenerateExpenseSummary = async () => {
    try {
      setExpenseLoading(true);
      setExpenseResult(null);
      const res = await api.post<{ success: boolean; data: { summary: string }; metrics: any; source: string }>(
        '/ai/expense-summary'
      );
      if (res.success && res.data) {
        setExpenseResult(res);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to generate financial summary');
    } finally {
      setExpenseLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2 border border-blue-200">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Google Gemini 3.8 Flash Integration</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">AI Assistant Hub</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Intelligent real estate tools designed specifically for rental agreements, maintenance triage, and portfolio cash flows.
        </p>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
        <button
          onClick={() => setActiveTab('analyzer')}
          className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
            activeTab === 'analyzer'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <FileSearch className="w-4 h-4 text-blue-600" />
          Agreement Analyzer
        </button>

        <button
          onClick={() => setActiveTab('triage')}
          className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
            activeTab === 'triage'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Wrench className="w-4 h-4 text-emerald-600" />
          Maintenance Triage
        </button>

        <button
          onClick={() => setActiveTab('reminder')}
          className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
            activeTab === 'reminder'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <BellRing className="w-4 h-4 text-amber-600" />
          Rent Reminders
        </button>

        <button
          onClick={() => {
            setActiveTab('expenses');
            if (!expenseResult && !expenseLoading) {
              handleGenerateExpenseSummary();
            }
          }}
          className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
            activeTab === 'expenses'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <PieChart className="w-4 h-4 text-indigo-600" />
          Financial Summary
        </button>
      </div>

      {/* Tab 1: Rental Agreement Analyzer */}
      {activeTab === 'analyzer' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Lease Agreement Text</h3>
                <p className="text-xs text-slate-500">Paste agreement text or load verified sample lease</p>
              </div>
              <button
                type="button"
                onClick={loadSampleLease}
                className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs transition-colors"
              >
                Load Sample Lease
              </button>
            </div>

            <textarea
              rows={12}
              value={agreementText}
              onChange={(e) => setAgreementText(e.target.value)}
              placeholder="Paste clauses, lease text, or click 'Load Sample Lease' above..."
              className="w-full p-3 rounded-xl border border-slate-200 text-xs font-mono leading-relaxed focus:ring-2 focus:ring-blue-500"
            />

            <button
              onClick={handleAnalyzeAgreement}
              disabled={analyzerLoading}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {analyzerLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Analyzing Lease Clauses with Gemini...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-sky-300" />
                  Extract Key Information
                </>
              )}
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">Extracted Information</h3>
                {analyzerSource && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                    Source: {analyzerSource}
                  </span>
                )}
              </div>

              {!analyzerResult ? (
                <div className="py-16 text-center text-slate-400 text-xs">
                  <FileSearch className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p>Click "Extract Key Information" to parse monthly rent, deposits, dates, and responsibilities.</p>
                </div>
              ) : (
                <div className="mt-4 space-y-3.5 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Monthly Rent</span>
                      <p className="text-sm font-bold text-slate-900 mt-0.5">
                        {analyzerResult.monthlyRent || 'N/A'}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Security Deposit</span>
                      <p className="text-sm font-bold text-slate-900 mt-0.5">
                        {analyzerResult.securityDeposit || 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Lease Dates</span>
                      <p className="text-xs font-semibold text-slate-800 mt-0.5">
                        {analyzerResult.leaseStartDate || 'Start'} to {analyzerResult.leaseEndDate || 'End'}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Notice Period</span>
                      <p className="text-xs font-semibold text-slate-800 mt-0.5">
                        {analyzerResult.noticePeriod || 'Standard notice'}
                      </p>
                    </div>
                  </div>

                  {analyzerResult.maintenanceResponsibilities && (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                      <span className="text-[10px] uppercase font-bold text-slate-500">
                        Maintenance Responsibilities
                      </span>
                      <div className="text-[11px] text-slate-700">
                        <p className="font-bold text-blue-700">Landlord:</p>
                        <p>{Array.isArray(analyzerResult.maintenanceResponsibilities.landlord)
                          ? analyzerResult.maintenanceResponsibilities.landlord.join('; ')
                          : String(analyzerResult.maintenanceResponsibilities.landlord)}</p>
                      </div>
                      <div className="text-[11px] text-slate-700 pt-1">
                        <p className="font-bold text-emerald-700">Tenant:</p>
                        <p>{Array.isArray(analyzerResult.maintenanceResponsibilities.tenant)
                          ? analyzerResult.maintenanceResponsibilities.tenant.join('; ')
                          : String(analyzerResult.maintenanceResponsibilities.tenant)}</p>
                      </div>
                    </div>
                  )}

                  {analyzerResult.summary && (
                    <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 text-xs text-slate-700 leading-relaxed">
                      <p className="font-bold text-blue-900 mb-1">Executive Summary:</p>
                      <p>{analyzerResult.summary}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Maintenance Categorization & Triage */}
      {activeTab === 'triage' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Maintenance Issue Input</h3>
              <p className="text-xs text-slate-500">
                Let Gemini determine category, priority level, and troubleshooting safety steps
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Issue Title</label>
              <input
                type="text"
                value={triageTitle}
                onChange={(e) => setTriageTitle(e.target.value)}
                placeholder="e.g. Water dripping under bathroom vanity"
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Description</label>
              <textarea
                rows={5}
                value={triageDesc}
                onChange={(e) => setTriageDesc(e.target.value)}
                placeholder="Describe what happened, where the issue is, and if there is active water, sparking, or unusual noise..."
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs leading-relaxed"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setTriageTitle('Water leaking fast from kitchen pipe');
                  setTriageDesc('There is continuous water spraying from the cold water valve behind the dishwasher. Water is spreading across the hardwood floor.');
                }}
                className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100"
              >
                Try Urgent Leak Sample
              </button>
              <button
                type="button"
                onClick={() => {
                  setTriageTitle('Living room dimmer switch buzzing');
                  setTriageDesc('When turning the dial down low, a small hum is heard from the wall plate.');
                }}
                className="text-[11px] font-semibold text-purple-600 bg-purple-50 px-3 py-1.5 rounded-lg hover:bg-purple-100"
              >
                Try Electrical Sample
              </button>
            </div>

            <button
              onClick={handleTriageMaintenance}
              disabled={triageLoading}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {triageLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Triaging with Gemini...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-sky-300" />
                  Classify Category & Priority
                </>
              )}
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Triage Classification</h3>
              {triageSource && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                  {triageSource}
                </span>
              )}
            </div>

            {!triageResult ? (
              <div className="py-16 text-center text-slate-400 text-xs">
                <Wrench className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p>Input an issue description and click classify to see AI categorization and priority urgency.</p>
              </div>
            ) : (
              <div className="mt-5 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Suggested Category</span>
                    <p className="text-base font-extrabold text-blue-700 mt-1">{triageResult.category}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Assigned Priority</span>
                    <p
                      className={`text-base font-extrabold mt-1 ${
                        triageResult.priority === 'High'
                          ? 'text-rose-600'
                          : triageResult.priority === 'Medium'
                          ? 'text-amber-600'
                          : 'text-slate-700'
                      }`}
                    >
                      {triageResult.priority}
                    </p>
                  </div>
                </div>

                {triageResult.suggestedAction && (
                  <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200">
                    <p className="font-bold text-blue-900 mb-1">Landlord Dispatch Action:</p>
                    <p className="text-slate-700 leading-relaxed">{triageResult.suggestedAction}</p>
                  </div>
                )}

                {triageResult.tenantAdvice && (
                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200">
                    <p className="font-bold text-amber-900 mb-1">Tenant Safety / Mitigation Advice:</p>
                    <p className="text-slate-700 leading-relaxed">{triageResult.tenantAdvice}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Rent Reminder Generator */}
      {activeTab === 'reminder' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Rent Reminder Details</h3>
              <p className="text-xs text-slate-500">Configure parameters to generate a polished reminder</p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tenant Name</label>
                <input
                  type="text"
                  value={reminderTenant}
                  onChange={(e) => setReminderTenant(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Rent Amount ($)</label>
                <input
                  type="number"
                  value={reminderAmount}
                  onChange={(e) => setReminderAmount(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Due Date</label>
                <input
                  type="text"
                  value={reminderDue}
                  onChange={(e) => setReminderDue(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Message Tone</label>
                <select
                  value={reminderTone}
                  onChange={(e) => setReminderTone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                >
                  <option value="Friendly & Professional">Friendly & Courteous</option>
                  <option value="Formal Notice">Formal Business Notice</option>
                  <option value="Firm & Urgent">Firm & Urgent (Past Due)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Rental Property Name</label>
              <input
                type="text"
                value={reminderProp}
                onChange={(e) => setReminderProp(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            <button
              onClick={handleGenerateReminder}
              disabled={reminderLoading}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {reminderLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Generating Reminder Message...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-sky-300" />
                  Generate Rent Reminder
                </>
              )}
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">Generated Reminder Message</h3>
                {reminderResult && (
                  <button
                    onClick={() => copyToClipboard(reminderResult)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied!' : 'Copy to Clipboard'}
                  </button>
                )}
              </div>

              {!reminderResult ? (
                <div className="py-16 text-center text-slate-400 text-xs">
                  <BellRing className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p>Click "Generate Rent Reminder" to compose a message ready to send via email or SMS.</p>
                </div>
              ) : (
                <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-sans whitespace-pre-wrap leading-relaxed">
                  {reminderResult}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Monthly Expense & Portfolio Summary */}
      {activeTab === 'expenses' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Portfolio Financial & Operational Report</h3>
              <p className="text-xs text-slate-500">
                Gemini processes actual database figures (revenue collected, pending rent, open repair tickets).
              </p>
            </div>
            <button
              onClick={handleGenerateExpenseSummary}
              disabled={expenseLoading}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${expenseLoading ? 'animate-spin' : ''}`} />
              Re-generate Executive Analysis
            </button>
          </div>

          {expenseResult?.metrics && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 bg-white rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400">Total Collected</span>
                <p className="text-lg font-extrabold text-emerald-600 mt-0.5">{expenseResult.metrics.totalCollected}</p>
              </div>
              <div className="p-3.5 bg-white rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400">Pending Rent</span>
                <p className="text-lg font-extrabold text-amber-600 mt-0.5">{expenseResult.metrics.pendingRent}</p>
              </div>
              <div className="p-3.5 bg-white rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400">Occupancy</span>
                <p className="text-lg font-extrabold text-blue-600 mt-0.5">{expenseResult.metrics.occupancyRate}</p>
              </div>
              <div className="p-3.5 bg-white rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400">Open Tickets</span>
                <p className="text-lg font-extrabold text-slate-800 mt-0.5">{expenseResult.metrics.openMaintenanceTickets}</p>
              </div>
            </div>
          )}

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            {expenseLoading ? (
              <div className="py-16 text-center">
                <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
                <p className="text-xs text-slate-500 font-medium">Synthesizing database totals into financial report...</p>
              </div>
            ) : !expenseResult ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                <PieChart className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p>Click "Re-generate Executive Analysis" to produce an executive portfolio review.</p>
              </div>
            ) : (
              <div className="prose prose-slate max-w-none text-xs leading-relaxed text-slate-800 whitespace-pre-wrap">
                {expenseResult.data.summary}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
