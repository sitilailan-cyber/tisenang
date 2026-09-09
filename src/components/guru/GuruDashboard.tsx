import React, { useState, useEffect } from 'react';
import {
  Users,
  Compass,
  BookOpen,
  Target,
  BarChart3,
  Award,
  Sparkles,
  ChevronRight,
  Filter,
  CheckCircle2,
  Clock,
  LogOut,
  UserCheck,
  FolderOpen,
  HelpCircle,
  GraduationCap,
} from 'lucide-react';
import { User, TeacherProfileData, ClassRoom, Subject, Mission, Student, PortfolioItem } from '../../types';
import { storage } from '../../services/storage';
import { GuruBottomNav, GuruTabType } from './GuruBottomNav';
import { GuruBeranda } from './GuruBeranda';
import { GuruMisiManager } from './GuruMisiManager';

interface GuruDashboardProps {
  user: User;
  onLogout: () => void;
}

export const GuruDashboard: React.FC<GuruDashboardProps> = ({ user, onLogout }) => {
  const [activeBottomTab, setActiveBottomTab] = useState<GuruTabType>('navigasi');

  // Load teacher profile from storage
  const [profileData, setProfileData] = useState<TeacherProfileData | null>(() =>
    storage.getTeacherProfile(user.id),
  );

  const teacher = profileData?.teacher;
  const subjects = profileData?.subjects || [];
  const classes = profileData?.classes || [];

  // Cascading Selection: Mata Pelajaran ↓ Kelas
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    subjects[0]?.id || 'sbj-fisika',
  );
  const [selectedClassId, setSelectedClassId] = useState<string>(
    classes[0]?.id || 'cls-xii-1',
  );

  // Sub-navigation view under "Navigasi Guru"
  const [navSubTab, setNavSubTab] = useState<'murid' | 'misi' | 'tp' | 'asesmen'>('murid');

  // Data states
  const [classStudents, setClassStudents] = useState<Student[]>([]);
  const [classMissions, setClassMissions] = useState<Mission[]>([]);
  const [classPortfolios, setClassPortfolios] = useState<PortfolioItem[]>([]);

  const refreshData = () => {
    const updatedProfile = storage.getTeacherProfile(user.id);
    setProfileData(updatedProfile);

    // Otomatis ambil data murid berdasarkan classId yang dipilih
    const students = storage.getStudentsByClass(selectedClassId);
    setClassStudents(students);

    // Misi kelas
    const missions = storage.getMissionsByClass(selectedClassId);
    setClassMissions(missions);

    // Portofolio semua kelas binaan untuk Beranda
    const allPortfolios = storage.getAllPortfolios();
    const teacherClassIds = classes.map((c) => c.id);
    const relevantPortfolios = allPortfolios.filter(
      (p) => p.classId && teacherClassIds.includes(p.classId),
    );
    setClassPortfolios(relevantPortfolios);
  };

  useEffect(() => {
    refreshData();
  }, [selectedClassId, user.id]);

  const currentSubject = subjects.find((s) => s.id === selectedSubjectId) || subjects[0];
  const currentClass = classes.find((c) => c.id === selectedClassId) || classes[0];

  // Active missions count
  const activeMissionsCount = classMissions.filter((m) => m.status === 'PUBLISHED').length;

  // Average completion
  const averageProgress = 76; // aggregate metric for current class

  return (
    <div
      style={{
        height: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
      className="bg-slate-50 text-slate-800"
    >
      {/* Top Application Bar */}
      <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between shadow-xs shrink-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-display font-extrabold text-sm shadow-sm">
            TS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-sm tracking-tight text-slate-900">
                TI SENANG
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                Akun Guru
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Sistem Pembelajaran Adaptif & Menggembirakan
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-bold text-slate-800">{user.name}</div>
            <div className="text-[11px] text-slate-400 font-medium">
              @{user.username}
            </div>
          </div>

          <button
            onClick={() => setActiveBottomTab('profil')}
            className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 hover:bg-indigo-200 flex items-center justify-center font-display font-bold text-xs transition-colors border border-indigo-200"
            title="Buka Profil Guru"
          >
            {user.name ? user.name[0] : 'G'}
          </button>
        </div>
      </header>

      {/* Main Scrollable Content Area */}
      <main
        style={{
          flex: 1,
          overflowY: 'auto',
          paddingBottom: '90px', // space for fixed bottom nav
        }}
        className="p-4 sm:p-6 lg:p-8"
      >
        {/* ====================================================== */}
        {/* TAB 1: BERANDA (Student Uploaded Portfolios) */}
        {/* ====================================================== */}
        {activeBottomTab === 'beranda' && (
          <GuruBeranda portfolios={classPortfolios} classes={classes} />
        )}

        {/* ====================================================== */}
        {/* TAB 2: NAVIGASI GURU (TP, Misi, Asesmen, Murid) */}
        {/* ====================================================== */}
        {activeBottomTab === 'navigasi' && (
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Greeting & Header Stats Banner */}
            <div className="bg-gradient-to-r from-indigo-700 via-blue-700 to-purple-800 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                <div className="space-y-1">
                  <h1 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight">
                    Selamat datang, {user.name} 👋
                  </h1>
                  <p className="text-indigo-100 text-xs sm:text-sm max-w-xl leading-relaxed">
                    Pantau kemajuan murid, rilis misi terarah, dan kelola asesmen saintifik secara otomatis tanpa input manual yang melelahkan.
                  </p>
                </div>

                {/* Cascading Selector: Mata Pelajaran ↓ Kelas */}
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 space-y-2.5 min-w-[260px] shrink-0">
                  <div className="text-[11px] font-bold text-indigo-200 uppercase tracking-wider">
                    Pilih Konteks Mengajar:
                  </div>

                  {/* Mata Pelajaran Dropdown */}
                  <div>
                    <label className="text-[10px] text-indigo-200 font-semibold block mb-0.5">
                      1. Mata Pelajaran
                    </label>
                    <select
                      value={selectedSubjectId}
                      onChange={(e) => setSelectedSubjectId(e.target.value)}
                      className="w-full h-9 px-3 rounded-xl bg-white text-slate-800 text-xs font-bold shadow-xs cursor-pointer"
                    >
                      {subjects.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Kelas Dropdown */}
                  <div>
                    <label className="text-[10px] text-indigo-200 font-semibold block mb-0.5">
                      2. Kelas yang Diajar
                    </label>
                    <select
                      value={selectedClassId}
                      onChange={(e) => setSelectedClassId(e.target.value)}
                      className="w-full h-9 px-3 rounded-xl bg-white text-slate-800 text-xs font-bold shadow-xs cursor-pointer"
                    >
                      {classes.map((c) => (
                        <option key={c.id} value={c.id}>
                          Kelas {c.className} ({c.academicYear})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* 5 Indicator Stats Bar */}
              <div className="mt-6 pt-5 border-t border-white/20 grid grid-cols-2 sm:grid-cols-5 gap-3 text-white">
                <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-xs">
                  <div className="text-[10px] text-indigo-200 font-semibold uppercase">Mata Pelajaran</div>
                  <div className="text-xs sm:text-sm font-bold truncate mt-0.5">{currentSubject?.name}</div>
                </div>

                <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-xs">
                  <div className="text-[10px] text-indigo-200 font-semibold uppercase">Kelas Aktif</div>
                  <div className="text-xs sm:text-sm font-bold truncate mt-0.5">Kelas {currentClass?.className}</div>
                </div>

                <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-xs">
                  <div className="text-[10px] text-indigo-200 font-semibold uppercase">Jumlah Murid</div>
                  <div className="text-xs sm:text-sm font-bold font-mono mt-0.5">{classStudents.length} Siswa</div>
                </div>

                <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-xs">
                  <div className="text-[10px] text-indigo-200 font-semibold uppercase">Misi Aktif</div>
                  <div className="text-xs sm:text-sm font-bold font-mono mt-0.5">{activeMissionsCount} Misi Rilis</div>
                </div>

                <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-xs col-span-2 sm:col-span-1">
                  <div className="text-[10px] text-indigo-200 font-semibold uppercase">Progress Belajar</div>
                  <div className="text-xs sm:text-sm font-bold font-mono mt-0.5 text-emerald-300">{averageProgress}% Tuntas</div>
                </div>
              </div>
            </div>

            {/* Sub-Navigation Tabs: Daftar Murid, Misi, TP, Asesmen */}
            <div className="flex items-center gap-2 p-1.5 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
              <button
                type="button"
                onClick={() => setNavSubTab('murid')}
                className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  navSubTab === 'murid'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Daftar Murid ({classStudents.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setNavSubTab('misi')}
                className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  navSubTab === 'misi'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Target className="w-4 h-4" />
                <span>Kelola Misi ({classMissions.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setNavSubTab('tp')}
                className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  navSubTab === 'tp'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Tujuan Pembelajaran (TP)</span>
              </button>

              <button
                type="button"
                onClick={() => setNavSubTab('asesmen')}
                className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  navSubTab === 'asesmen'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Rekap Asesmen</span>
              </button>
            </div>

            {/* SUB-VIEW 1: DAFTAR MURID OTOMATIS */}
            {navSubTab === 'murid' && (
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="font-display font-bold text-slate-800 text-base flex items-center gap-2">
                      <UserCheck className="w-5 h-5 text-indigo-600" />
                      Daftar Murid Otomatis Kelas {currentClass?.className}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Daftar murid dimuat secara otomatis dari database sistem berdasarkan <code>classId: {selectedClassId}</code>. Guru tidak perlu mengetik nama murid secara manual.
                    </p>
                  </div>

                  <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100 self-start sm:self-auto">
                    {classStudents.length} Siswa Terdaftar
                  </span>
                </div>

                {classStudents.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400">
                    Belum ada data murid terdaftar di kelas {currentClass?.className}.
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-2xl border border-slate-200">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                        <tr>
                          <th className="py-3 px-4">Murid</th>
                          <th className="py-3 px-4">NISN</th>
                          <th className="py-3 px-4">Misi Aktif Terakhir</th>
                          <th className="py-3 px-4 text-center">XP Capaian</th>
                          <th className="py-3 px-4 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {classStudents.map((std, idx) => (
                          <tr key={std.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center font-display font-bold text-xs">
                                  {std.name[0]}
                                </div>
                                <div>
                                  <div className="font-bold text-slate-800">{std.name}</div>
                                  <div className="text-[10px] text-slate-400">{std.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 font-mono text-slate-600">
                              {std.nisn}
                            </td>
                            <td className="py-3 px-4">
                              <span className="font-semibold text-slate-700">
                                Misi {idx % 2 === 0 ? '2: Eksplorasi Lab' : '1: Regresi Linear'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center font-mono font-bold text-purple-700">
                              {450 + idx * 80} XP
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                                <CheckCircle2 className="w-3 h-3" />
                                Aktif
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* SUB-VIEW 2: KELOLA MISI */}
            {navSubTab === 'misi' && (
              <GuruMisiManager
                missions={classMissions}
                classes={classes}
                subjects={subjects}
                selectedClassId={selectedClassId}
                onRefresh={refreshData}
              />
            )}

            {/* SUB-VIEW 3: TUJUAN PEMBELAJARAN (TP) */}
            {navSubTab === 'tp' && (
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="font-display font-bold text-slate-800 text-base flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-600" />
                    Tujuan Pembelajaran (TP) & Indikator Ketercapaian
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Mata Pelajaran: {currentSubject?.name} • Fase F (Kelas XII)
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      code: 'TP-FIS-01',
                      title: 'Penyelidikan Fenomena Suhu dan Kalor Virtual Lab',
                      desc: 'Murid mampu merancang eksperimen laju perubahan suhu zat cair menggunakan sensor radiasi panas dan menyajikan data grafik bivariat.',
                      achieved: 88,
                      status: 'Optimal',
                    },
                    {
                      code: 'TP-MAT-01',
                      title: 'Pemodelan Garis Regresi Linear Data Kuantitatif',
                      desc: 'Murid mampu menghitung gradien, intersep, dan membuat estimasi interpolasi nilai y berdasarkan variabel x.',
                      achieved: 92,
                      status: 'Optimal',
                    },
                    {
                      code: 'TP-FIS-02',
                      title: 'Analisis Efisiensi Termodinamika & Energi Terbarukan',
                      desc: 'Murid mampu mengevaluasi faktor-faktor yang mempengaruhi penyerapan energi pada kolektor surya dan sistem pendingin.',
                      achieved: 64,
                      status: 'Cukup',
                    },
                  ].map((tp) => (
                    <div key={tp.code} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                              {tp.code}
                            </span>
                            <h4 className="font-bold text-xs text-slate-800">{tp.title}</h4>
                          </div>
                          <p className="text-xs text-slate-600 mt-1">{tp.desc}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="font-mono font-bold text-xs text-slate-800">{tp.achieved}%</span>
                          <div className="text-[10px] text-emerald-600 font-semibold">{tp.status}</div>
                        </div>
                      </div>

                      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-600 rounded-full"
                          style={{ width: `${tp.achieved}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUB-VIEW 4: ASESMEN */}
            {navSubTab === 'asesmen' && (
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
                <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-display font-bold text-slate-800 text-base flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-indigo-600" />
                      Rekapitulasi Asesmen Formatif & Sumatif
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Hasil kuis pemahaman konsep, akurasi prediksi regresi linear, dan uji pemahaman termal siswa.
                    </p>
                  </div>
                  <span className="font-mono text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Rata-rata Kelas: 89.4 / 100
                  </span>
                </div>

                {/* Score breakdown metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 text-center">
                    <div className="text-2xl font-display font-extrabold text-indigo-700">92%</div>
                    <div className="text-xs font-bold text-slate-700 mt-1">Ketuntasan Misi 1</div>
                    <div className="text-[11px] text-slate-500">Paham Konsep Regresi Linear</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-center">
                    <div className="text-2xl font-display font-extrabold text-emerald-700">85%</div>
                    <div className="text-xs font-bold text-slate-700 mt-1">Ketuntasan Misi 2</div>
                    <div className="text-[11px] text-slate-500">Eksplorasi Kalor Sensor Lab</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-purple-50 border border-purple-100 text-center">
                    <div className="text-2xl font-display font-extrabold text-purple-700">100%</div>
                    <div className="text-xs font-bold text-slate-700 mt-1">Tingkat Joyful & Mindful</div>
                    <div className="text-[11px] text-slate-500">Refleksi Otentik Murid Terkumpul</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ====================================================== */}
        {/* TAB 3: PROFIL GURU (Info, Mapel, Kelas, TP Progress) */}
        {/* ====================================================== */}
        {activeBottomTab === 'profil' && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-display font-extrabold text-3xl shadow-lg ring-4 ring-indigo-100 shrink-0">
                  {user.name ? user.name[0] : 'G'}
                </div>

                <div className="flex-1 space-y-1">
                  <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-800">
                    {user.name}
                  </h1>
                  <p className="text-sm font-semibold text-indigo-600">
                    @{user.username}
                  </p>
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

            {/* Mapel & Kelas Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
                <h3 className="font-display font-bold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  Mata Pelajaran yang Diampu:
                </h3>
                <div className="space-y-2">
                  {subjects.map((s) => (
                    <div key={s.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs font-bold text-slate-700">
                      {s.name} ({s.code})
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
                <h3 className="font-display font-bold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-600" />
                  Daftar Kelas yang Diajar:
                </h3>
                <div className="space-y-2">
                  {classes.map((c) => (
                    <div key={c.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs flex justify-between items-center">
                      <span className="font-bold text-slate-800">Kelas {c.className}</span>
                      <span className="font-mono text-slate-500">{c.academicYear}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Progress Ketercapaian TP Global */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-display font-bold text-slate-800 text-sm flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-indigo-600" />
                Progress Ketercapaian Tujuan Pembelajaran (TP)
              </h3>

              <div className="space-y-3">
                {[
                  { name: 'TP 1: Pemodelan Regresi Linear & Bivariat', value: 92 },
                  { name: 'TP 2: Eksperimen Termal & Sensor Radiasi Panas', value: 85 },
                  { name: 'TP 3: Solusi Kontekstual Masalah Energi Surya', value: 68 },
                  { name: 'TP 4: Evaluasi Sumatif & Refleksi Sains', value: 45 },
                ].map((item, i) => (
                  <div key={i} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-700">{item.name}</span>
                      <span className="font-mono text-indigo-700">{item.value}%</span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Fixed Bottom Navigation */}
      <GuruBottomNav activeTab={activeBottomTab} onTabChange={setActiveBottomTab} />
    </div>
  );
};
