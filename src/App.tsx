import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { WelcomePage } from './components/welcome/WelcomePage';
import { AdminLoginModal } from './components/auth/AdminLoginModal';
import { UserLoginModal } from './components/auth/UserLoginModal';
import { AdminCenter } from './components/admin/AdminCenter';
import { GuruDashboard } from './components/guru/GuruDashboard';
import { MuridDashboard } from './components/murid/MuridDashboard';
import { UnauthorizedView } from './components/common/UnauthorizedView';
import { ShieldAlert, RefreshCw, KeyRound } from 'lucide-react';
import { UserRole } from './types';

const MainContent: React.FC = () => {
  const { currentUser, currentRole, logout, login } = useAuth();

  // Login modals state
  const [adminLoginOpen, setAdminLoginOpen] = useState(false);
  const [userLoginOpen, setUserLoginOpen] = useState(false);
  const [userLoginRole, setUserLoginRole] = useState<'guru' | 'murid'>('murid');

  // Simulated unauthorized route attempt state (to verify strict authorization)
  const [forcedRoleView, setForcedRoleView] = useState<UserRole | null>(null);

  const handleOpenUserLogin = (role: 'guru' | 'murid') => {
    setUserLoginRole(role);
    setUserLoginOpen(true);
  };

  // If user is not authenticated, show Welcome Page with modals
  if (!currentUser) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
        <Navbar onOpenAdminLogin={() => setAdminLoginOpen(true)} />
        <WelcomePage
          onOpenAdminLogin={() => setAdminLoginOpen(true)}
          onSelectRoleLogin={handleOpenUserLogin}
        />

        {/* Modals */}
        <AdminLoginModal
          isOpen={adminLoginOpen}
          onClose={() => setAdminLoginOpen(false)}
          onSuccess={() => setAdminLoginOpen(false)}
        />
        <UserLoginModal
          isOpen={userLoginOpen}
          onClose={() => setUserLoginOpen(false)}
          defaultRole={userLoginRole}
          onSuccess={() => setUserLoginOpen(false)}
        />
      </div>
    );
  }

  // Determine active view to render
  const targetViewRole = forcedRoleView || currentRole;

  // STRICT AUTHORIZATION CHECK
  // If the target view doesn't match the authenticated user's role, show UnauthorizedView
  const isAuthorized = targetViewRole === currentRole;

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
        <Navbar />
        {/* Quick Test Role-Switch Bar */}
        <aside aria-label="Testing bar" className="bg-slate-900 text-slate-300 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            <span className="font-semibold text-slate-200">
              Mencoba Mengakses: <span className="text-white capitalize">{targetViewRole}</span> (Role Anda: {currentRole})
            </span>
          </div>
          <button
            onClick={() => setForcedRoleView(null)}
            className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs"
          >
            Kembali ke Dashboard Saya
          </button>
        </aside>
        <main className="flex-1">
          <UnauthorizedView
            requiredRole={targetViewRole as UserRole}
            onRedirectToOwnDashboard={() => setForcedRoleView(null)}
          />
        </main>
      </div>
    );
  }

  // GURU VIEW
  if (currentRole === 'guru') {
    return (
      <div className="h-[100dvh] flex flex-col overflow-hidden bg-slate-50">
        <GuruDashboard user={currentUser} onLogout={logout} />
      </div>
    );
  }

  // MURID VIEW
  if (currentRole === 'murid') {
    return (
      <div className="h-[100dvh] flex flex-col overflow-hidden bg-slate-50">
        <MuridDashboard user={currentUser} onLogout={logout} />
      </div>
    );
  }

  // ADMIN VIEW
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />

      {/* Quick Test Role-Switch Bar */}
      <aside aria-label="Testing bar" className="bg-slate-900 text-slate-300 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="font-semibold text-slate-200">
            Sesi Aktif: <span className="text-white capitalize">{currentRole}</span> ({currentUser.fullName})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400 hidden sm:inline">Uji Pembatasan Otorisasi:</span>
          <button
            onClick={() => setForcedRoleView('guru')}
            className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-300"
            title="Coba akses Dashboard Guru"
          >
            Akses Dashboard Guru
          </button>
          <button
            onClick={() => setForcedRoleView('murid')}
            className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-300"
            title="Coba akses Dashboard Murid"
          >
            Akses Dashboard Murid
          </button>
        </div>
      </aside>

      <main className="flex-1">
        <AdminCenter />
      </main>

      <footer className="py-4 px-6 border-t border-slate-200 text-center text-xs text-slate-500 bg-white">
        <p>
          TI SENANG • Teknologi Inovatif untuk Sistem Pembelajaran Adaptif dan Menggembirakan
        </p>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}
