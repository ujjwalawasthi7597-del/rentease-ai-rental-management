import React, { useState } from 'react';
import {
  Building2,
  LogOut,
  User,
  Sparkles,
  ChevronDown,
  Menu,
  X,
  ShieldCheck,
  Home,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';

interface NavbarProps {
  currentTab?: string;
  setCurrentTab: (tab: string) => void;
  isSidebarOpen?: boolean;
  setIsSidebarOpen?: (open: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  isSidebarOpen,
  setIsSidebarOpen,
}) => {
  const { user, logout, loginDemo } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Mobile hamburger & Brand */}
          <div className="flex items-center gap-3">
            {user && setIsSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
                aria-label="Toggle navigation sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <button
              onClick={() => setCurrentTab(user ? (user.role === 'landlord' ? 'landlord-dashboard' : 'tenant-dashboard') : 'landing')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-900 via-blue-900 to-indigo-600 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-extrabold tracking-tight text-slate-900 flex items-center gap-1.5">
                  RentEase
                  <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    AI Platform
                  </span>
                </span>
              </div>
            </button>
          </div>

          {/* Center: Public Links if not logged in */}
          {!user && (
            <nav className="hidden md:flex items-center gap-6">
              <button
                onClick={() => setCurrentTab('landing')}
                className={`text-sm font-semibold transition-colors ${
                  currentTab === 'landing' ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => setCurrentTab('features')}
                className={`text-sm font-semibold transition-colors ${
                  currentTab === 'features' ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Features
              </button>
              <button
                onClick={() => setCurrentTab('about')}
                className={`text-sm font-semibold transition-colors ${
                  currentTab === 'about' ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                About Us
              </button>
            </nav>
          )}

          {/* Right: Quick Demo switch & Auth Actions */}
          <div className="flex items-center gap-3">
            {/* Quick Demo Access Buttons for instant evaluation */}
            <div className="hidden sm:flex items-center bg-slate-100/80 p-1 rounded-xl border border-slate-200/60 text-xs">
              <button
                onClick={() => loginDemo('landlord')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  user?.role === 'landlord'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
                title="Log in as Alexander Wright (Landlord)"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                Demo Landlord
              </button>
              <button
                onClick={() => loginDemo('tenant')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  user?.role === 'tenant'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
                title="Log in as Sophia Martinez (Tenant)"
              >
                <Home className="w-3.5 h-3.5 text-emerald-600" />
                Demo Tenant
              </button>
            </div>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
                >
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                    alt={user.name}
                    className="w-8 h-8 rounded-full border border-slate-200 object-cover"
                  />
                  <div className="hidden md:block text-left">
                    <p className="text-xs font-bold text-slate-900 leading-tight">{user.name}</p>
                    <p className="text-[10px] capitalize font-medium text-blue-600">{user.role}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {profileDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-2"
                    onMouseLeave={() => setProfileDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700">
                        {user.role} Account
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setCurrentTab('profile');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      Account Profile
                    </button>

                    <button
                      onClick={() => {
                        logout();
                        setProfileDropdownOpen(false);
                        setCurrentTab('landing');
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 border-t border-slate-100"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentTab('login')}
                  className="px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => setCurrentTab('register')}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
