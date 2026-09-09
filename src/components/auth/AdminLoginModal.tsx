import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../common/Modal';
import { Settings, Lock, AlertCircle, Sparkles } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { login } = useAuth();
  const [username, setUsername] = useState('inov');
  const [password, setPassword] = useState('ttchm289');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const result = login(username, password, 'admin');
      if (result.success) {
        onSuccess();
        onClose();
      } else {
        setError(result.error || 'Autentikasi admin gagal.');
      }
    } catch {
      setError('Terjadi kesalahan saat masuk.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillPrototype = () => {
    setUsername('inov');
    setPassword('ttchm289');
    setError(null);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Login Administrator"
      subtitle="Akses khusus Admin Center (Pengelolaan Akun & Kelas)"
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Important note from spec */}
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
          <Settings className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Akses Terbatas: Admin Center</p>
            <p className="text-[11px] text-amber-800">
              Admin hanya mengelola Akun Guru, Akun Murid, dan Daftar Kelas.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Username
          </label>
          <input
            id="admin-username-input"
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username admin"
            className="w-full h-11 px-3.5 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 text-sm font-medium outline-hidden transition-all bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              id="admin-password-input"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-11 px-3.5 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 text-sm font-medium outline-hidden transition-all bg-white"
            />
            <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
          </div>
        </div>

        <div className="pt-2">
          <button
            id="btn-admin-submit"
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white text-sm font-bold shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
          >
            <Settings className="w-4 h-4" />
            <span>Masuk ke Admin Center</span>
          </button>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">Akun prototype: inov / ttchm289</span>
          <button
            type="button"
            onClick={handleFillPrototype}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 hover:text-amber-800"
          >
            <Sparkles className="w-3 h-3" />
            Isi Otomatis
          </button>
        </div>
      </form>
    </Modal>
  );
};
