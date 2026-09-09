import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, BookOpen, GraduationCap, Settings } from 'lucide-react';

interface NavbarProps {
  onOpenAdminLogin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAdminLogin }) => {
  const { currentUser, currentRole, logout } = useAuth();

  const getRoleBadge = () => {
    if (!currentRole) return null;
    switch (currentRole) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300">
            <Settings className="w-3.5 h-3.5 text-amber-700" />
            ADMIN
          </span>
        );
      case 'guru':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-900 border border-blue-300">
            <BookOpen className="w-3.5 h-3.5 text-blue-700" />
            GURU
          </span>
        );
      case 'murid':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-pink-100 text-pink-900 border border-pink-300">
            <GraduationCap className="w-3.5 h-3.5 text-pink-700" />
            MURID
          </span>
        );
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-500 to-pink-500 p-0.5 shadow-sm flex items-center justify-center shrink-0">
            <img
              id="navbar-brand-logo"
              src="/logo-ti-senang.jpg"
              alt="Logo TI SENANG"
              className="w-full h-full object-cover rounded-[10px]"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-black text-xl tracking-tight text-slate-900">
                TI SENANG
              </span>
            </div>
          </div>
        </div>

        {/* Right Side Navigation / Actions */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-3">
              {getRoleBadge()}
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-bold text-slate-800 leading-tight">
                  {currentUser.fullName}
                </span>
                <span className="text-[11px] text-slate-500">@{currentUser.username}</span>
              </div>
              <button
                id="btn-logout"
                onClick={logout}
                title="Keluar dari sesi"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-slate-200"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {onOpenAdminLogin && (
                <button
                  id="btn-nav-admin-login"
                  onClick={onOpenAdminLogin}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
                  title="Masuk sebagai Administrator"
                >
                  <Settings className="w-4 h-4 text-slate-700" />
                  <span className="hidden sm:inline">ADMIN</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
