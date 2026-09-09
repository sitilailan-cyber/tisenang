import React, { useState } from 'react';
import {
  Rocket,
  GraduationCap,
  BookOpen,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../common/Modal';

interface WelcomePageProps {
  onOpenAdminLogin?: () => void;
  onSelectRoleLogin: (role: 'guru' | 'murid') => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({
  onSelectRoleLogin,
}) => {
  const { login } = useAuth();
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showQuickLoginInfo, setShowQuickLoginInfo] = useState(false);

  const handleQuickDemoLogin = (username: string, pass: string, role: 'guru' | 'murid') => {
    login(username, pass, role);
    setShowRoleModal(false);
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between overflow-hidden bg-gradient-to-b from-slate-50 via-white to-blue-50/30">
      {/* Background Ambient Accents */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-pink-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 max-w-4xl mx-auto z-10 py-10 sm:py-14">
        {/* LOGO TI SENANG */}
        <div id="front-page-logo-container" className="relative mb-6 group">
          <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 via-pink-500 to-amber-400 rounded-3xl blur-xl opacity-35 group-hover:opacity-60 transition duration-500 pointer-events-none" />
          <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl p-3 sm:p-4 shadow-xl border border-slate-100 flex items-center justify-center">
            <img
              id="front-page-logo-img"
              src="/logo-ti-senang.jpg"
              alt="Logo Resmi TI SENANG"
              className="w-44 h-44 sm:w-56 sm:h-56 md:w-64 md:h-64 object-contain rounded-2xl transition-transform duration-300 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* LOGO: TI SENANG */}
        <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 mb-4 leading-none">
          TI{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-pink-500 to-amber-500">
            SENANG
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-2xl font-bold text-slate-800 max-w-2xl mx-auto mb-10 tracking-tight leading-snug">
          Teknologi Inovatif untuk Sistem Pembelajaran Adaptif dan Menggembirakan
        </p>

        {/* Primary Action Button: 🚀 MULAI */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
          <button
            id="btn-mulai"
            onClick={() => setShowRoleModal(true)}
            className="w-full sm:w-auto min-w-[200px] h-13 px-8 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-pink-500 hover:from-blue-700 hover:to-pink-600 text-white font-display font-bold text-base tracking-wide shadow-md hover:shadow-lg transition-all transform active:scale-98 flex items-center justify-center gap-3 cursor-pointer"
          >
            <Rocket className="w-5 h-5 animate-bounce" />
            <span>MULAI</span>
          </button>

          <button
            id="btn-info-akun-demo"
            onClick={() => setShowQuickLoginInfo(!showQuickLoginInfo)}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 underline underline-offset-4 py-2 cursor-pointer"
          >
            Lihat Akun Demo Pengujian
          </button>
        </div>

        {/* Prototype Quick Info Accordion */}
        {showQuickLoginInfo && (
          <div className="w-full max-w-xl mt-6 p-4 rounded-2xl bg-white/90 border border-slate-200 text-left text-xs shadow-xs animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 font-bold text-slate-800">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                Daftar Akun Pengujian Prototipe
              </span>
              <button
                onClick={() => setShowQuickLoginInfo(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-600">
              <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/50">
                <p className="font-bold text-amber-900">⚙️ Admin</p>
                <p>User: <span className="font-mono font-semibold text-slate-900">inov</span></p>
                <p>Pass: <span className="font-mono font-semibold text-slate-900">ttchm289</span></p>
              </div>
              <div className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-200/50">
                <p className="font-bold text-blue-900">👩‍🏫 Guru</p>
                <p>User: <span className="font-mono font-semibold text-slate-900">budi</span></p>
                <p>Pass: <span className="font-mono font-semibold text-slate-900">guru123</span></p>
              </div>
              <div className="p-2.5 rounded-xl bg-pink-50/60 border border-pink-200/50">
                <p className="font-bold text-pink-900">👨‍🎓 Murid</p>
                <p>User: <span className="font-mono font-semibold text-slate-900">aisyah</span></p>
                <p>Pass: <span className="font-mono font-semibold text-slate-900">siswa123</span></p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Role Selection Modal (Triggered by 🚀 MULAI) */}
      <Modal
        isOpen={showRoleModal}
        onClose={() => setShowRoleModal(false)}
        title="Pilih Peran Masuk"
        subtitle="Masuk sesuai peran Anda"
        maxWidth="md"
      >
        <div className="space-y-4">
          {/* Murid Option */}
          <div
            id="card-select-murid"
            onClick={() => {
              setShowRoleModal(false);
              onSelectRoleLogin('murid');
            }}
            className="group cursor-pointer p-4.5 rounded-2xl border border-slate-200 hover:border-pink-300 bg-white hover:bg-pink-50/30 transition-all flex items-center justify-between shadow-xs hover:shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900 group-hover:text-pink-600 transition-colors">
                  👨‍🎓 Murid
                </h4>
                <p className="text-xs text-slate-500">
                  Akses misi pembelajaran, progres capaian, XP, dan portofolio kelas
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-pink-600 transition-colors" />
          </div>

          {/* Guru Option */}
          <div
            id="card-select-guru"
            onClick={() => {
              setShowRoleModal(false);
              onSelectRoleLogin('guru');
            }}
            className="group cursor-pointer p-4.5 rounded-2xl border border-slate-200 hover:border-blue-300 bg-white hover:bg-blue-50/30 transition-all flex items-center justify-between shadow-xs hover:shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  👩‍🏫 Guru
                </h4>
                <p className="text-xs text-slate-500">
                  Kelola mata pelajaran, pilih kelas ajar, pantau rombel otomatis
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
          </div>

          {/* Quick Demo Instant Logins */}
          <div className="pt-3 border-t border-slate-100">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Uji Coba Langsung (1-Klik Prototipe):
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                id="btn-quick-login-murid"
                onClick={() => handleQuickDemoLogin('aisyah', 'siswa123', 'murid')}
                className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-pink-100 hover:text-pink-900 text-slate-700 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Masuk Aisyah (XII-1)</span>
              </button>
              <button
                id="btn-quick-login-guru"
                onClick={() => handleQuickDemoLogin('budi', 'guru123', 'guru')}
                className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-blue-100 hover:text-blue-900 text-slate-700 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Masuk Pak Budi (Guru)</span>
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
