import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldX, ArrowLeft, LogOut } from 'lucide-react';

interface UnauthorizedViewProps {
  requiredRole: 'admin' | 'guru' | 'murid';
  onRedirectToOwnDashboard: () => void;
}

export const UnauthorizedView: React.FC<UnauthorizedViewProps> = ({
  requiredRole,
  onRedirectToOwnDashboard,
}) => {
  const { currentUser, logout } = useAuth();

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Admin Center';
      case 'guru':
        return 'Dashboard Guru';
      case 'murid':
        return 'Dashboard Murid';
      default:
        return role;
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-red-200 shadow-sm text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center mx-auto mb-5">
          <ShieldX className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold font-display text-slate-900 mb-2">
          Akses Tidak Diizinkan
        </h2>
        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          Halaman ini khusus untuk peran <span className="font-semibold text-slate-900">{getRoleLabel(requiredRole)}</span>.
          {currentUser && (
            <span>
              {' '}Anda sedang masuk sebagai <span className="font-semibold text-blue-700 capitalize">{currentUser.role}</span>.
            </span>
          )}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            id="btn-unauth-back"
            onClick={onRedirectToOwnDashboard}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Dashboard Saya
          </button>
          <button
            id="btn-unauth-logout"
            onClick={logout}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Keluar
          </button>
        </div>
      </div>
    </div>
  );
};
