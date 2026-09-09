import React from 'react';
import {
  User,
  GraduationCap,
  Flame,
  Award,
  Zap,
  BookOpen,
  CheckCircle2,
  Calendar,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { StudentProfileData } from '../../types';

interface MuridProfilProps {
  profile: StudentProfileData;
  onLogout: () => void;
}

export const MuridProfil: React.FC<MuridProfilProps> = ({ profile, onLogout }) => {
  const { user, className, xp, level, completedMissionsCount, streakDays } = profile;

  const badges = [
    { title: 'Pioneer MIPA', desc: 'Menyelesaikan Misi Pahami Konsep', icon: '🌟', date: 'Sept 2026' },
    { title: 'Virtuoso Lab', desc: 'Mengumpulkan Data Sensor Eksperimen Kalor', icon: '🔬', date: 'Sept 2026' },
    { title: 'Mindful Thinker', desc: 'Menuliskan 3 Refleksi Pembelajaran Bermakna', icon: '🧠', date: 'Sept 2026' },
    { title: 'Konsistensi 7 Hari', desc: 'Login dan belajar sains 7 hari berturut-turut', icon: '🔥', date: 'Sept 2026' },
  ];

  const learningObjectives = [
    { code: 'TP-MAT-01', text: 'Menganalisis data bivariat menggunakan diagram pencar dan garis regresi linear.', progress: 100 },
    { code: 'TP-FIS-01', text: 'Melakukan penyelidikan ilmiah perpindahan kalor dan mengukur laju perubahan temperatur.', progress: 100 },
    { code: 'TP-FIS-02', text: 'Mengevaluasi efisiensi energi terbarukan pada konteks instalasi surya.', progress: 40 },
    { code: 'TP-KIM-01', text: 'Menerapkan asas kesetimbangan kimia pada proses sintesis ramah lingkungan.', progress: 20 },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Profile Card Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center font-display font-extrabold text-3xl shadow-lg ring-4 ring-purple-100 shrink-0">
            {user.name ? user.name[0] : 'M'}
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
                Murid MIPA Fase F
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                Kelas {className}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-800">
              {user.name}
            </h1>
            <p className="text-xs text-slate-500 font-mono">
              Username / NISN: @{user.username} • SMA MIPA Indonesia
            </p>

            {/* Level & XP bar */}
            <div className="pt-2 max-w-md">
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-purple-700">Level {level} Explorer MIPA</span>
                <span className="text-slate-500 font-mono">{xp} XP Total</span>
              </div>
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full"
                  style={{ width: `${Math.min(100, (xp % 300) / 3)}%` }}
                />
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                {(xp % 300)} / 300 XP menuju Level {level + 1}
              </div>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="px-4 py-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center gap-1.5 transition-colors border border-rose-200 shrink-0 self-center sm:self-start"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar Akun</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Flame className="w-5 h-5 fill-amber-500" />
          </div>
          <div>
            <div className="text-lg font-display font-extrabold text-slate-800">{streakDays} Hari</div>
            <div className="text-[11px] text-slate-400 font-medium">Streak Belajar</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-display font-extrabold text-slate-800">{completedMissionsCount} Misi</div>
            <div className="text-[11px] text-slate-400 font-medium">Misi Tuntas</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5 fill-purple-500" />
          </div>
          <div>
            <div className="text-lg font-display font-extrabold text-slate-800">{xp} XP</div>
            <div className="text-[11px] text-slate-400 font-medium">Poin Capaian</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-display font-extrabold text-slate-800">{badges.length} Lencana</div>
            <div className="text-[11px] text-slate-400 font-medium">Prestasi Diraik</div>
          </div>
        </div>
      </div>

      {/* Badges Section */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-display font-bold text-slate-800 text-sm flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-500" />
          Lencana Penghargaan Belajar
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {badges.map((b, i) => (
            <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 text-center sm:text-left">
              <div className="text-2xl mb-1">{b.icon}</div>
              <div className="text-xs font-bold text-slate-800">{b.title}</div>
              <div className="text-[11px] text-slate-500 leading-tight">{b.desc}</div>
              <div className="text-[10px] text-slate-400 font-mono mt-1">{b.date}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Learning Objectives Progress (Ketercapaian TP) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-display font-bold text-slate-800 text-sm flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-indigo-600" />
          Ketercapaian Tujuan Pembelajaran (TP) MIPA Fase F
        </h3>

        <div className="space-y-3">
          {learningObjectives.map((tp, idx) => (
            <div key={idx} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-start justify-between gap-3 text-xs">
                <div>
                  <span className="font-mono font-bold text-indigo-700 mr-2">{tp.code}</span>
                  <span className="text-slate-700">{tp.text}</span>
                </div>
                <span className="font-mono font-bold text-slate-700 shrink-0">{tp.progress}%</span>
              </div>

              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    tp.progress === 100
                      ? 'bg-emerald-600'
                      : tp.progress > 0
                      ? 'bg-indigo-600'
                      : 'bg-slate-300'
                  }`}
                  style={{ width: `${tp.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
