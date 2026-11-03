import React from 'react';
import {
  Building2,
  Users,
  CreditCard,
  Wrench,
  FileText,
  Sparkles,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';

interface FeaturesPageProps {
  setCurrentTab: (tab: string) => void;
}

export const FeaturesPage: React.FC<FeaturesPageProps> = ({ setCurrentTab }) => {
  const featureList = [
    {
      icon: Building2,
      title: 'Property Management',
      color: 'blue',
      items: [
        'Add, edit, view, and delete properties with full photo previews',
        'Support for Apartments, Houses, Rooms, and Commercial buildings',
        'Track bedroom, bathroom, address, city, and amenities',
        'Dynamic occupancy status (Available, Occupied, Under Maintenance)',
      ],
    },
    {
      icon: Users,
      title: 'Tenant Directory & Assignments',
      color: 'emerald',
      items: [
        'Assign tenants to specific rental units with lease dates',
        'Record monthly rent obligations and security deposit amounts',
        'Direct link to tenant user accounts with private data isolation',
        'Instant status updates as leases start or conclude',
      ],
    },
    {
      icon: CreditCard,
      title: 'Rent Tracking & Manual Receipts',
      color: 'amber',
      items: [
        'Manual payment recording for Bank Transfer, Card, Cash, Cheque, and Portal',
        'Payment status flags (Paid, Pending, Overdue) with single-click status updates',
        'Historical monthly filter for tax and audit preparation',
        'Interactive monthly rent collection trend chart using Recharts',
      ],
    },
    {
      icon: Wrench,
      title: 'Maintenance Workflow & Triage',
      color: 'rose',
      items: [
        'Tenants submit tickets with categories (Plumbing, Electrical, Appliance, Cleaning)',
        'Priority tagging (Low, Medium, High) with photo attachment capability',
        'Landlord resolution updates and direct comment responses',
        'Status lifecycle: Submitted → In Progress → Resolved',
      ],
    },
    {
      icon: FileText,
      title: 'Digital Lease Agreements',
      color: 'indigo',
      items: [
        'Multer-powered document upload for PDF lease files',
        'Automatic expiration countdown and Expiring Soon flags',
        'Tenants can view and download their assigned agreements anytime',
        'Structured lease metadata storage for fast lookup',
      ],
    },
    {
      icon: Sparkles,
      title: 'Gemini 3.8 Flash AI Assistant',
      color: 'purple',
      items: [
        'Rental Agreement Analyzer: extracts rent, deposit, dates, notice, and risks',
        'Maintenance Categorization: detects issue type, priority, and safety tips',
        'Rent Reminder Generator: creates personalized, polite or firm reminder messages',
        'Portfolio Financial Summary: analyzes real database cash flows and health',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4 border border-blue-200">
            Platform Capabilities
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Comprehensive Rental Management Tools
          </h1>
          <p className="mt-4 text-base text-slate-600 max-w-2xl mx-auto">
            Explore every feature designed to streamline interactions between landlords, property managers, and residents.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {featureList.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="bg-white p-7 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-blue-600 mb-5">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-3">{feat.title}</h3>
                  <ul className="space-y-2 text-xs text-slate-600">
                    {feat.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 text-center max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold">Ready to simplify your property operations?</h2>
          <p className="mt-3 text-slate-300 text-xs sm:text-sm">
            Join RentEase today. No credit card required. Includes instant access to both landlord and tenant dashboards.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={() => setCurrentTab('register')}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-xs text-white transition-colors"
            >
              Get Started Free
            </button>
            <button
              onClick={() => setCurrentTab('login')}
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold text-xs text-slate-200 transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
