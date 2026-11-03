import React from 'react';
import { Building2, Shield, Heart, Zap, CheckCircle2, ArrowRight } from 'lucide-react';

interface AboutPageProps {
  setCurrentTab: (tab: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ setCurrentTab }) => {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4 border border-blue-200">
            About RentEase
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Built To Bring Simplicity To Property Operations
          </h1>
          <p className="mt-4 text-base text-slate-600 max-w-2xl mx-auto">
            Traditional property management tools are bloated, expensive, and frustrating for both landlords and tenants.
            RentEase was engineered from the ground up to be lightweight, straightforward, and augmented by intelligent AI assistance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl w-fit mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Zero Over-Engineering</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Clean REST APIs, straightforward MongoDB schemas, and an intuitive UI so you can manage your rentals in minutes, not hours.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl w-fit mb-4">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Role-Based Security</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Rigid isolation ensures landlords only see their properties, and tenants only access their specific tenancy and lease records.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl w-fit mb-4">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Tenant-Centric Design</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Tenants love the clean interface for reporting maintenance requests, checking payment due dates, and viewing agreements.
            </p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Technology Architecture</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <p className="font-bold text-slate-900 text-sm mb-1">Frontend Layer</p>
              <p>React 19 with Vite, Tailwind CSS 4, Lucide React icons, and Recharts financial dashboards.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <p className="font-bold text-slate-900 text-sm mb-1">Backend & Persistence</p>
              <p>Node.js & Express.js, MongoDB Atlas with Mongoose schemas, JWT role-based auth, and Multer file storage.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <p className="font-bold text-slate-900 text-sm mb-1">AI Assistant Layer</p>
              <p>Powered by the Google GenAI SDK and Gemini 3.8 Flash with structured JSON schemas and offline fallback logic.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <p className="font-bold text-slate-900 text-sm mb-1">Safety & Graceful Fallbacks</p>
              <p>Runs smoothly with or without external database connection or API keys through intelligent in-memory persistence.</p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setCurrentTab('landing')}
              className="text-xs font-bold text-slate-600 hover:text-slate-900"
            >
              ← Back to Home
            </button>
            <button
              onClick={() => setCurrentTab('register')}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors flex items-center gap-1.5"
            >
              Create Account <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
