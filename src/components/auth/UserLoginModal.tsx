import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../common/Modal';
import { BookOpen, GraduationCap, Lock, AlertCircle, Sparkles } from 'lucide-react';

interface UserLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: 'guru' | 'murid';
  onSuccess: () => void;
}

export const UserLoginModal: React.FC<UserLoginModalProps> = ({
  isOpen,
  onClose,
  defaultRole = 'murid',
  onSuccess,
}) => {
  const { login } = useAuth();
  const [role, setRole] = useState<'guru' | 'murid'>(defaultRole);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (defaultRole) {
      setRole(defaultRole);
      if (defaultRole === 'murid') {
        setUsername('aisyah');
        setPassword('siswa123');
      } else {
        setUsername('budi');
        setPassword('guru123');
      }
      setError(null);
    }
  }, [defaultRole, isOpen]);

  const handleRoleChange = (newRole: 'guru' | 'murid') => {
    setRole(newRole);
    setError(null);
    if (newRole === 'murid') {
      setUsername('aisyah');
      setPassword('siswa123');
    } else {
      setUsername('budi');
      setPassword('guru123');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = login(username, password, role);
      if (res.success) {
        onSuccess();
        onClose();
      } else {
        setError(res.error || 'Login gagal.');
      }
    } catch {
      setError('Terjadi kesalahan saat masuk.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isMurid = role === 'murid';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="sm"
    >
      {/* Role Tabs */}
      <div className="flex rounded-xl bg-slate-100 p-1 mb-5">
        <button
          type="button"
          onClick={() => handleRoleChange('murid')}
          className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            isMurid
              ? 'bg-white text-pink-600 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Murid</span>
        </button>
        <button
          type="button"
          onClick={() => handleRoleChange('guru')}
          className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            !isMurid
              ? 'bg-white text-blue-600 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Guru</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
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
            id="user-username-input"
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={isMurid ? 'contoh: aisyah' : 'contoh: budi'}
            className="w-full h-11 px-3.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm font-medium outline-hidden transition-all bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              id="user-password-input"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-11 px-3.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm font-medium outline-hidden transition-all bg-white"
            />
            <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
          </div>
        </div>

        <div className="pt-2">
          <button
            id="btn-user-submit"
            type="submit"
            disabled={isSubmitting}
            className={`w-full h-11 rounded-xl text-white text-sm font-bold shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50 cursor-pointer ${
              isMurid
                ? 'bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600'
                : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600'
            }`}
          >
            <span>Masuk</span>
          </button>
        </div>

        {/* Quick Demo Helper */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            {isMurid ? 'Akun demo: aisyah / siswa123' : 'Akun demo: budi / guru123'}
          </span>
          <button
            type="button"
            onClick={() => {
              if (isMurid) {
                setUsername('aisyah');
                setPassword('siswa123');
              } else {
                setUsername('budi');
                setPassword('guru123');
              }
            }}
            className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Isi Demo
          </button>
        </div>
      </form>
    </Modal>
  );
};
