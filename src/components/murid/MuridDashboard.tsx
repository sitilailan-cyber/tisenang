import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  Bot,
  Zap,
  Flame,
  Award,
  BookOpen,
  ArrowRight,
  X,
  Target,
  FlaskConical,
  Gamepad2,
  GraduationCap,
  ChevronRight,
  Compass,
  Cpu,
} from 'lucide-react';
import { User, Mission, StudentProgress, PortfolioItem } from '../../types';
import { storage } from '../../services/storage';
import { MuridBottomNav, MuridTabType } from './MuridBottomNav';
import { MissionJourney } from './MissionJourney';
import { Misi1PahamiKonsep } from './Misi1PahamiKonsep';
import { Misi2Eksplorasi } from './Misi2Eksplorasi';
import { VirtualLab } from './VirtualLab';
import { DeviceCenter } from './DeviceCenter';
import { TemanBerpikirAI } from './TemanBerpikirAI';
import { MuridBeranda } from './MuridBeranda';
import { MuridPortofolio } from './MuridPortofolio';
import { MuridProfil } from './MuridProfil';
import { AlmeEngine } from '../../services/alme/almeEngine';
import { AlmeRecommendation } from '../../types';

interface MuridDashboardProps {
  user: User;
  onLogout: () => void;
}

export const MuridDashboard: React.FC<MuridDashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<MuridTabType>('misi');

  // Student Profile Data from Storage
  const [profileData, setProfileData] = useState(() => storage.getStudentProfile(user.id));
  const student = profileData?.student;
  const studentId = student?.id || `std-${user.id}`;
  const classId = student?.classId || 'cls-xii-1';
  const className = profileData?.className || 'XII-1';

  // Mission & Progress Data
  const [classMissions, setClassMissions] = useState<Mission[]>([]);
  const [studentProgressList, setStudentProgressList] = useState<StudentProgress[]>([]);
  const [classPortfolios, setClassPortfolios] = useState<PortfolioItem[]>([]);
  const [studentPortfolios, setStudentPortfolios] = useState<PortfolioItem[]>([]);

  // Active mission modal state
  const [activeMissionModal, setActiveMissionModal] = useState<Mission | null>(null);

  // Floating AI drawer
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);

  // Lab SubTab: 'device_center' | 'virtual_lab'
  const [labSubTab, setLabSubTab] = useState<'device_center' | 'virtual_lab'>('device_center');

  // Refresh all state from storage
  const refreshData = () => {
    const updatedProfile = storage.getStudentProfile(user.id);
    setProfileData(updatedProfile);

    // Misi hanya diterima murid dari classId yang dipilih!
    const missions = storage.getMissionsByClass(classId);
    setClassMissions(missions);

    const progress = storage.getAllStudentProgress(studentId);
    setStudentProgressList(progress);

    // Class Portfolios: Murid hanya melihat portofolio teman sekelas (classId sama) yang status visibilitasnya CLASS
    const classPfs = storage.getClassPortfolios(classId);
    setClassPortfolios(classPfs);

    // Student Portfolios: All portfolios owned by this student (both PRIVATE and CLASS)
    const studentPfs = storage.getStudentPortfolios(studentId);
    setStudentPortfolios(studentPfs);
  };

  useEffect(() => {
    refreshData();
  }, [user.id, classId, studentId]);

  // Current active mission summary
  const activeMission = classMissions.find((m) => {
    const prog = studentProgressList.find((p) => p.missionId === m.id);
    return !prog || prog.status === 'IN PROGRESS' || prog.status === 'AVAILABLE';
  }) || classMissions[0];

  // Rule-based ALME Recommendation Engine
  const almeRecommendation: AlmeRecommendation = useMemo(() => {
    const m1Prog = studentProgressList.find((p) => p.missionId.includes('-1'));
    const expSession = storage.getStudentExperimentSession(studentId, 'msn-cls-xii-1-2');

    return AlmeEngine.analyze({
      quizScore: m1Prog?.score || 75,
      experimentResultScore: expSession ? 90 : undefined,
      practiceScore: 78,
      assessmentResultScore: 82,
      literacyScore: 76,
      numeracyScore: 74,
      reasoningScore: 85,
      currentDifficulty: 2,
    });
  }, [studentProgressList, studentId]);

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
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center font-display font-extrabold text-sm shadow-sm">
            TS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-sm tracking-tight text-slate-900">
                TI SENANG
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
                Murid • Kelas {className}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Teknologi Inovatif untuk Pembelajaran MIPA Fase F
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* XP & Streak quick pill */}
          <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-2xl border border-slate-200 text-xs">
            <span className="flex items-center gap-1 font-mono font-bold text-amber-600">
              <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
              {profileData?.streakDays || 7}d
            </span>
            <span className="text-slate-300">|</span>
            <span className="flex items-center gap-1 font-mono font-bold text-purple-700">
              <Zap className="w-3.5 h-3.5 fill-purple-500 text-purple-600" />
              {profileData?.xp || 450} XP
            </span>
          </div>

          <button
            onClick={() => setActiveTab('profil')}
            className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 hover:bg-purple-200 flex items-center justify-center font-display font-bold text-xs transition-colors border border-purple-200"
            title="Buka Profil Siswa"
          >
            {user.name ? user.name[0] : 'M'}
          </button>
        </div>
      </header>

      {/* Main Scrollable Content Area */}
      <main
        style={{
          flex: 1,
          overflowY: 'auto',
          paddingBottom: '100px', // ensure space for fixed bottom navbar
        }}
        className="p-4 sm:p-6 lg:p-8"
      >
        {/* TAB 1: BERANDA (Classmates Portfolio Feed) */}
        {activeTab === 'beranda' && (
          <MuridBeranda
            className={className}
            classPortfolios={classPortfolios}
            onOpenDetail={() => {}}
          />
        )}

        {/* TAB 2: MISI (Main Mission Journey) */}
        {activeTab === 'misi' && (
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Student Greeting & Stats Banner */}
            <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-800 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur text-xs font-semibold uppercase tracking-wider mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    Mindful • Meaningful • Joyful
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight">
                    Selamat datang, {user.name} 👋
                  </h1>
                  <p className="text-purple-100 text-xs sm:text-sm max-w-xl leading-relaxed">
                    Siap melanjutkan petualangan sains hari ini di kelas {className}? Ambil peran aktif dalam menyelidiki data dan memecahkan tantangan saintifik.
                  </p>
                </div>

                {/* ALME Recommendation Box */}
                {almeRecommendation && (
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 max-w-sm shrink-0 space-y-2">
                    <div className="flex items-center justify-between gap-2 text-xs font-bold text-amber-300">
                      <div className="flex items-center gap-1.5">
                        <Bot className="w-4 h-4 text-amber-300" />
                        <span>Rekomendasi ALME:</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-slate-950 uppercase tracking-tight">
                        {almeRecommendation.type}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-white line-clamp-1">
                      {almeRecommendation.title}
                    </div>

                    <p className="text-[11px] text-purple-100 line-clamp-2">
                      {almeRecommendation.message}
                    </p>

                    {/* Gap Metrics */}
                    <div className="bg-black/20 rounded-xl p-2 text-[10px] grid grid-cols-3 gap-1 text-center font-mono border border-white/10">
                      <div>
                        <span className="text-purple-200 block text-[9px]">Saat Ini</span>
                        <span className="font-bold text-white">{almeRecommendation.current}</span>
                      </div>
                      <div className="border-x border-white/10">
                        <span className="text-purple-200 block text-[9px]">Target</span>
                        <span className="font-bold text-emerald-300">{almeRecommendation.target}</span>
                      </div>
                      <div>
                        <span className="text-purple-200 block text-[9px]">Gap</span>
                        <span className="font-bold text-amber-300">{almeRecommendation.gap}</span>
                      </div>
                    </div>

                    <p className="text-[10px] text-purple-200/90 italic line-clamp-2">
                      "{almeRecommendation.whyExplanation}"
                    </p>

                    <button
                      id="btn-alme-action"
                      onClick={() => {
                        if (activeMission) setActiveMissionModal(activeMission);
                      }}
                      className="w-full py-2 rounded-xl bg-white text-purple-900 hover:bg-purple-50 font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 active:scale-98 mt-1"
                    >
                      <span>{almeRecommendation.actionText}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* 7 Missions Journey Visual Map */}
            <MissionJourney
              missions={classMissions}
              progressList={studentProgressList}
              onOpenMission={(m) => setActiveMissionModal(m)}
            />
          </div>
        )}

        {/* TAB 3: LABORATORIUM & DEVICE CENTER (Simulasi Sensor Terpadu) */}
        {activeTab === 'lab' && (
          <div className="space-y-4 max-w-5xl mx-auto">
            {/* View Switcher: Device Center vs Virtual Lab */}
            <div className="flex items-center justify-between gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-1.5">
                <button
                  id="btn-subtab-device-center"
                  onClick={() => setLabSubTab('device_center')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    labSubTab === 'device_center'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Cpu className="w-4 h-4" />
                  <span>🔬 Device Center (Simulasi Sensor)</span>
                </button>
                <button
                  id="btn-subtab-virtual-lab"
                  onClick={() => setLabSubTab('virtual_lab')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    labSubTab === 'virtual_lab'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <FlaskConical className="w-4 h-4" />
                  <span>⚗️ Virtual Lab (Kalorimeter)</span>
                </button>
              </div>
              <span className="text-[11px] text-slate-400 font-mono hidden md:inline px-2">
                Simulasi MIPA Terpadu
              </span>
            </div>

            {/* Render Selected View */}
            {labSubTab === 'device_center' ? (
              <DeviceCenter
                studentId={studentId}
                missionId="msn-cls-xii-1-2"
                onNavigateToMisi2={() => {
                  const m2 = classMissions.find((m) => m.coreMissionNumber === 2);
                  if (m2) {
                    setActiveMissionModal(m2);
                  }
                }}
              />
            ) : (
              <VirtualLab
                studentId={studentId}
                missionId="msn-cls-xii-1-2"
                onNavigateToMisi2={() => {
                  const m2 = classMissions.find((m) => m.coreMissionNumber === 2);
                  if (m2) {
                    setActiveMissionModal(m2);
                  }
                }}
              />
            )}
          </div>
        )}

        {/* TAB 4: TEMAN BERPIKIR (Socratic AI) */}
        {activeTab === 'ai' && (
          <div className="h-[calc(100dvh-170px)] max-w-3xl mx-auto">
            <TemanBerpikirAI
              currentContext={`Murid ${user.name} • Kelas ${className} • MIPA Fase F`}
              isFloating={false}
            />
          </div>
        )}

        {/* TAB 5: PORTOFOLIO */}
        {activeTab === 'portofolio' && (
          <MuridPortofolio
            studentId={studentId}
            studentName={user.name}
            classId={classId}
            className={className}
            portfolios={studentPortfolios}
            onRefresh={refreshData}
          />
        )}

        {/* TAB 6: PROFIL */}
        {activeTab === 'profil' && profileData && (
          <MuridProfil profile={profileData} onLogout={onLogout} />
        )}
      </main>

      {/* Floating Socratic AI Button (at bottom right above nav) */}
      <div className="fixed right-5 bottom-20 z-40">
        <button
          onClick={() => setIsAiDrawerOpen((prev) => !prev)}
          className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-xl hover:shadow-2xl transition-all border border-white/20 active:scale-95"
          title="Teman Berpikir Sokratik AI"
        >
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-amber-300">
            <Bot className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold font-display tracking-tight hidden sm:inline">
            Teman Berpikir AI
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        </button>

        {/* Floating AI popup dialog */}
        {isAiDrawerOpen && (
          <div className="absolute bottom-14 right-0 z-50">
            <TemanBerpikirAI
              currentContext={activeMission?.title || 'Pembelajaran MIPA'}
              onClose={() => setIsAiDrawerOpen(false)}
              isFloating={true}
            />
          </div>
        )}
      </div>

      {/* MODAL FOR ACTIVE MISSION (MISI 1, MISI 2, ETC.) */}
      {activeMissionModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white w-full max-w-4xl max-h-[92vh] rounded-3xl overflow-y-auto shadow-2xl relative p-4 sm:p-6 my-auto">
            {/* Close button */}
            <button
              onClick={() => {
                setActiveMissionModal(null);
                refreshData();
              }}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors z-30"
              title="Tutup Misi"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Misi 1: Pahami Konsep */}
            {activeMissionModal.coreMissionNumber === 1 && (
              <Misi1PahamiKonsep
                studentId={studentId}
                missionId={activeMissionModal.id}
                onCompleted={() => {
                  refreshData();
                }}
                onClose={() => {
                  setActiveMissionModal(null);
                  refreshData();
                }}
              />
            )}

            {/* Misi 2: Eksplorasi & Eksperimen */}
            {activeMissionModal.coreMissionNumber === 2 && (
              <Misi2Eksplorasi
                studentId={studentId}
                studentName={user.name}
                classId={classId}
                className={className}
                missionId={activeMissionModal.id}
                onNavigateToLab={() => {
                  setActiveMissionModal(null);
                  setActiveTab('lab');
                }}
                onCompleted={() => {
                  refreshData();
                }}
                onClose={() => {
                  setActiveMissionModal(null);
                  refreshData();
                }}
              />
            )}

            {/* Misi 3 to 7: Generic Rich Mission Modal */}
            {activeMissionModal.coreMissionNumber > 2 && (
              <div className="space-y-6">
                <div className="p-6 bg-gradient-to-r from-purple-700 to-indigo-700 rounded-2xl text-white">
                  <span className="text-[11px] font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
                    {activeMissionModal.coreTitle}
                  </span>
                  <h2 className="text-2xl font-display font-extrabold mt-2">
                    {activeMissionModal.title}
                  </h2>
                  <p className="text-xs text-purple-100 mt-1">
                    {activeMissionModal.subjectName} • Hadiah: {activeMissionModal.xpReward} XP
                  </p>
                </div>

                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                    Deskripsi & Petunjuk Misi
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {activeMissionModal.description}
                  </p>
                </div>

                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-800 flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
                  <span>
                    Misi ini terintegrasi dengan pembelajaran kontekstual di kelas. Anda dapat berdiskusi dengan Teman Berpikir AI untuk mengeksplorasi ide solusi.
                  </span>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => {
                      storage.completeMission(
                        studentId,
                        activeMissionModal.id,
                        90,
                        activeMissionModal.xpReward,
                      );
                      refreshData();
                      setActiveMissionModal(null);
                    }}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors"
                  >
                    Tandai Misi Tuntas (+{activeMissionModal.xpReward} XP)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Fixed Bottom Navigation */}
      <MuridBottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};
