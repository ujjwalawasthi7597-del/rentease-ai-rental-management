import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { Navbar } from './components/Navbar.js';
import { Sidebar } from './components/Sidebar.js';

// Public Pages
import { LandingPage } from './pages/LandingPage.js';
import { AboutPage } from './pages/AboutPage.js';
import { FeaturesPage } from './pages/FeaturesPage.js';
import { LoginPage } from './pages/LoginPage.js';
import { RegisterPage } from './pages/RegisterPage.js';

// Landlord Pages
import { LandlordDashboard } from './pages/LandlordDashboard.js';
import { PropertiesPage } from './pages/PropertiesPage.js';
import { TenantsPage } from './pages/TenantsPage.js';
import { RentManagementPage } from './pages/RentManagementPage.js';
import { MaintenancePage } from './pages/MaintenancePage.js';
import { LeaseAgreementsPage } from './pages/LeaseAgreementsPage.js';
import { AIAssistantPage } from './pages/AIAssistantPage.js';

// Tenant Pages
import { TenantDashboard } from './pages/TenantDashboard.js';
import { TenantPropertyPage } from './pages/TenantPropertyPage.js';
import { TenantPaymentsPage } from './pages/TenantPaymentsPage.js';
import { TenantMaintenancePage } from './pages/TenantMaintenancePage.js';
import { TenantLeasePage } from './pages/TenantLeasePage.js';
import { TenantAIPage } from './pages/TenantAIPage.js';

// Shared Pages
import { ProfilePage } from './pages/ProfilePage.js';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Sync tab with user login status
  useEffect(() => {
    if (!loading) {
      if (user) {
        if (
          currentTab === 'landing' ||
          currentTab === 'login' ||
          currentTab === 'register' ||
          currentTab === 'features' ||
          currentTab === 'about'
        ) {
          setCurrentTab(user.role === 'landlord' ? 'landlord-dashboard' : 'tenant-dashboard');
        } else if (user.role === 'landlord' && currentTab.startsWith('tenant-')) {
          setCurrentTab('landlord-dashboard');
        } else if (user.role === 'tenant' && currentTab.startsWith('landlord-')) {
          setCurrentTab('tenant-dashboard');
        }
      } else {
        if (currentTab !== 'login' && currentTab !== 'register' && currentTab !== 'features' && currentTab !== 'about') {
          setCurrentTab('landing');
        }
      }
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-semibold text-slate-500">Initializing RentEase...</p>
        </div>
      </div>
    );
  }

  // Public routing without sidebar
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />
        <main className="flex-1">
          {currentTab === 'landing' && <LandingPage setCurrentTab={setCurrentTab} />}
          {currentTab === 'about' && <AboutPage setCurrentTab={setCurrentTab} />}
          {currentTab === 'features' && <FeaturesPage setCurrentTab={setCurrentTab} />}
          {currentTab === 'login' && <LoginPage setCurrentTab={setCurrentTab} />}
          {currentTab === 'register' && <RegisterPage setCurrentTab={setCurrentTab} />}
        </main>
      </div>
    );
  }

  // Authenticated Portal Layout (Sidebar + Top Navbar + Content)
  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {/* Landlord Views */}
          {user.role === 'landlord' && (
            <>
              {currentTab === 'landlord-dashboard' && <LandlordDashboard setCurrentTab={setCurrentTab} />}
              {currentTab === 'landlord-properties' && <PropertiesPage />}
              {currentTab === 'landlord-tenants' && <TenantsPage />}
              {currentTab === 'landlord-rents' && <RentManagementPage />}
              {currentTab === 'landlord-maintenance' && <MaintenancePage />}
              {currentTab === 'landlord-agreements' && (
                <LeaseAgreementsPage setCurrentTab={setCurrentTab} />
              )}
              {currentTab === 'landlord-ai' && <AIAssistantPage />}
            </>
          )}

          {/* Tenant Views */}
          {user.role === 'tenant' && (
            <>
              {currentTab === 'tenant-dashboard' && <TenantDashboard setCurrentTab={setCurrentTab} />}
              {currentTab === 'tenant-property' && <TenantPropertyPage />}
              {currentTab === 'tenant-payments' && <TenantPaymentsPage />}
              {currentTab === 'tenant-maintenance' && <TenantMaintenancePage />}
              {currentTab === 'tenant-lease' && <TenantLeasePage setCurrentTab={setCurrentTab} />}
              {currentTab === 'tenant-ai' && <TenantAIPage />}
            </>
          )}

          {/* Shared Profile View */}
          {currentTab === 'profile' && <ProfilePage setCurrentTab={setCurrentTab} />}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
