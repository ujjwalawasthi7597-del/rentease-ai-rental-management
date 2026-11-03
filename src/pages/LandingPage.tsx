import React from 'react';
import {
  Building2,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Users,
  CreditCard,
  Wrench,
  FileText,
  ArrowRight,
  TrendingUp,
  Cpu,
  Layers,
  Star,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';

interface LandingPageProps {
  setCurrentTab: (tab: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ setCurrentTab }) => {
  const { loginDemo } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-200 bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-70" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-bold uppercase tracking-wider mb-6 animate-pulse">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Gen Property Operations with Gemini 3.8 Flash</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Manage Your Properties. <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-600 bg-clip-text text-transparent">
                Simplify Your Rentals.
              </span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              RentEase brings landlords and tenants together on one intuitive platform.
              Automate rent tracking, streamline maintenance requests, securely store lease agreements, and tap into AI-powered property insights.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => setCurrentTab('register')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => loginDemo('landlord')}
                  className="flex-1 sm:flex-initial px-4 py-3.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 text-xs font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <Building2 className="w-4 h-4 text-blue-600" />
                  Try Demo Landlord
                </button>
                <button
                  onClick={() => loginDemo('tenant')}
                  className="flex-1 sm:flex-initial px-4 py-3.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <Users className="w-4 h-4 text-emerald-600" />
                  Try Demo Tenant
                </button>
              </div>
            </div>

            {/* Trust badge */}
            <div className="mt-10 flex items-center justify-center gap-6 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Zero complex setup</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Dual Landlord & Tenant Portals</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>MongoDB & Gemini Ready</span>
              </div>
            </div>
          </div>

          {/* Interactive UI Preview Showcase */}
          <div className="mt-14 relative max-w-5xl mx-auto rounded-2xl p-2 bg-gradient-to-b from-slate-200 to-slate-300 shadow-2xl">
            <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 text-white p-6 sm:p-8">
              <div className="flex items-center justify-between pb-6 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-xs text-slate-400 font-mono ml-2">https://rentease.app/dashboard</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Live Portfolio Engine
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/60">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Properties Managed</span>
                  <p className="text-2xl font-extrabold text-white mt-1">5 Units</p>
                  <p className="text-xs text-emerald-400 font-medium mt-1">80% Occupancy</p>
                </div>
                <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/60">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Monthly Collected</span>
                  <p className="text-2xl font-extrabold text-emerald-400 mt-1">$7,000</p>
                  <p className="text-xs text-slate-400 font-medium mt-1">100% on-time rate</p>
                </div>
                <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/60">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Pending Rent</span>
                  <p className="text-2xl font-extrabold text-amber-400 mt-1">$2,200</p>
                  <p className="text-xs text-slate-400 font-medium mt-1">1 tenant processing</p>
                </div>
                <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/60">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">AI Assistant Status</span>
                  <p className="text-2xl font-extrabold text-sky-400 mt-1">Active</p>
                  <p className="text-xs text-slate-400 font-medium mt-1">Gemini 3.8 Flash</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest">Built For Real Landlords & Tenants</h2>
            <p className="text-3xl font-extrabold text-slate-900 mt-2">Everything You Need To Run Rental Properties</p>
            <p className="text-sm text-slate-600 mt-3">
              Streamline operations without the clutter of heavyweight enterprise software.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Property Portfolio Management</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Add, organize, and monitor apartments, townhouses, and single-family residences. Track rent rates, bedrooms, bathrooms, and availability status.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Tenant Assignments & Onboarding</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Assign tenants to units, track security deposits, lease terms, and provide dedicated resident portal accounts with private access.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-5">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Rent Ledger & Payment Tracking</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Log manual rent receipts, mark payments as Paid, Pending, or Overdue, and maintain full historical audit records filtered by month.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-5">
                <Wrench className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Maintenance Request Ticketing</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Tenants submit issues with photos and categories (Plumbing, Electrical, Appliance). Landlords update statuses and reply directly.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Lease Agreement Repository</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Store digital rental agreements, track expiration dates with automated alerts for expiring leases, and let tenants download copies anytime.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-5">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Gemini 3.8 AI Assistant</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Extract lease terms, automatically categorize repair requests, generate polite rent reminder messages, and produce portfolio financial summaries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest">Simple Workflow</h2>
            <p className="text-3xl font-extrabold text-slate-900 mt-2">How RentEase Works</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center mb-4">
                1
              </span>
              <h4 className="text-base font-bold text-slate-900">Add Your Properties & Tenants</h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Enter your rental units, specify rent amounts, assign tenants, and upload agreement documents in a few clicks.
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center mb-4">
                2
              </span>
              <h4 className="text-base font-bold text-slate-900">Collect & Track Rent Automatically</h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Tenants see upcoming due dates and payment methods in their portal. Landlords verify receipts and manage cash flow with visual charts.
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center mb-4">
                3
              </span>
              <h4 className="text-base font-bold text-slate-900">Leverage AI For Fast Resolution</h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Use Gemini to analyze agreement documents, triage maintenance requests by priority, and draft tenant reminders effortlessly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Assistant Spotlight Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-bold uppercase tracking-wider mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI-Powered Intelligence</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Supercharge Your Management With Gemini 3.8 Flash
              </h2>
              <p className="mt-4 text-slate-300 text-sm leading-relaxed">
                RentEase includes a purpose-built AI suite designed strictly for rental tasks. No confusing chat prompts or hallucinations—just targeted tools that solve real landlord headaches:
              </p>

              <div className="mt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">Lease Agreement Analyzer</h5>
                    <p className="text-[11px] text-slate-400">Extracts monthly rent, security deposits, lease terms, notice clauses, and highlights risk clauses.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">Maintenance Triage & Prioritization</h5>
                    <p className="text-[11px] text-slate-400">Classifies reported issues into Plumbing, Electrical, or Appliance with High/Medium/Low priority.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">Polite Rent Reminder Generator</h5>
                    <p className="text-[11px] text-slate-400">Generates customizable polite or urgent reminder messages ready to copy and send in seconds.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">Financial & Expense Summary</h5>
                    <p className="text-[11px] text-slate-400">Binds directly to live database totals to provide executive cash flow and operational health analysis.</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  onClick={() => setCurrentTab('register')}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors"
                >
                  Experience AI Assistant
                </button>
              </div>
            </div>

            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-sky-400" />
                  <span className="text-xs font-bold text-white">RentEase AI Intelligence Assistant</span>
                </div>
                <span className="text-[10px] bg-sky-950 text-sky-300 px-2 py-0.5 rounded border border-sky-800">
                  Model: gemini-3.8-flash
                </span>
              </div>

              <div className="mt-4 p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs font-mono text-slate-300 space-y-2">
                <p className="text-emerald-400">✓ Extracted Monthly Rent: $2,850.00 / month</p>
                <p className="text-emerald-400">✓ Extracted Security Deposit: $2,850.00 (1 Month)</p>
                <p className="text-emerald-400">✓ Notice Period: 60 Days prior to lease end</p>
                <p className="text-amber-400">⚡ Maintenance Rule: Landlord responsible for plumbing, HVAC, & roof; Tenant handles lightbulbs & filter maintenance.</p>
                <p className="text-sky-400">🛡️ AI Risk Assessment: Clean lease document. No unusual indemnity or penalties found.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            <span className="font-extrabold text-slate-900 text-base">RentEase</span>
            <span className="text-xs text-slate-500">© 2026 AI Rental Property Management Platform. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-slate-500">
            <button onClick={() => setCurrentTab('about')} className="hover:text-slate-900 transition-colors">
              About Us
            </button>
            <button onClick={() => setCurrentTab('features')} className="hover:text-slate-900 transition-colors">
              Features
            </button>
            <button onClick={() => setCurrentTab('login')} className="hover:text-slate-900 transition-colors">
              Sign In
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
