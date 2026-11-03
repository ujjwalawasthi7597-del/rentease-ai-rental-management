import React from 'react';
import {
  LayoutDashboard,
  Building,
  Users,
  CreditCard,
  Wrench,
  FileText,
  Sparkles,
  User,
  LogOut,
  Home,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  isOpen,
  setIsOpen,
}) => {
  const { user, logout } = useAuth();
  if (!user) return null;

  const isLandlord = user.role === 'landlord';

  const landlordLinks = [
    { id: 'landlord-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'landlord-properties', label: 'My Properties', icon: Building },
    { id: 'landlord-tenants', label: 'Tenants', icon: Users },
    { id: 'landlord-rents', label: 'Rent Management', icon: CreditCard },
    { id: 'landlord-maintenance', label: 'Maintenance Requests', icon: Wrench },
    { id: 'landlord-agreements', label: 'Lease Agreements', icon: FileText },
    { id: 'landlord-ai', label: 'AI Assistant', icon: Sparkles, badge: 'Gemini' },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const tenantLinks = [
    { id: 'tenant-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tenant-property', label: 'My Property', icon: Home },
    { id: 'tenant-payments', label: 'Rent & Payments', icon: CreditCard },
    { id: 'tenant-maintenance', label: 'Maintenance Requests', icon: Wrench },
    { id: 'tenant-lease', label: 'Lease Agreement', icon: FileText },
    { id: 'tenant-ai', label: 'AI Assistant', icon: Sparkles, badge: 'Gemini' },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const links = isLandlord ? landlordLinks : tenantLinks;

  const handleNavClick = (tabId: string) => {
    setCurrentTab(tabId);
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-16 z-30 h-[calc(100vh-4rem)] w-64 bg-slate-900 text-slate-300 flex flex-col justify-between transition-transform duration-200 ease-in-out border-r border-slate-800 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Navigation list */}
        <div className="p-4 space-y-1.5 overflow-y-auto">
          <div className="px-3 py-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {isLandlord ? 'Landlord Portal' : 'Resident Portal'}
            </span>
          </div>

          {links.map((link) => {
            const Icon = link.icon;
            const isActive = currentTab === link.id;

            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                </div>
                {link.badge && (
                  <span
                    className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                      isActive ? 'bg-white/20 text-white' : 'bg-blue-900/60 text-blue-300 border border-blue-700/50'
                    }`}
                  >
                    {link.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom User summary & Logout */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center gap-3 px-2 py-1">
            <img
              src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
              alt={user.name}
              className="w-8 h-8 rounded-full border border-slate-700 object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{user.name}</p>
              <p className="text-[10px] text-slate-400 capitalize truncate">{user.role} Account</p>
            </div>
            <button
              onClick={() => {
                logout();
                setCurrentTab('landing');
              }}
              title="Sign Out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
