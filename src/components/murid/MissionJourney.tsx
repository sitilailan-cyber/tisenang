import React from 'react';
import {
  CheckCircle2,
  Lock,
  Play,
  Award,
  Sparkles,
  ChevronRight,
  BookOpen,
  FlaskConical,
  Target,
  Gamepad2,
  BrainCircuit,
  GraduationCap,
  Compass,
} from 'lucide-react';
import { Mission, StudentProgress, MissionCoreNumber } from '../../types';

interface MissionJourneyProps {
  missions: Mission[];
  progressList: StudentProgress[];
  onOpenMission: (mission: Mission) => void;
}

export const MissionJourney: React.FC<MissionJourneyProps> = ({
  missions,
  progressList,
  onOpenMission,
}) => {
  // Sort missions 1 to 7
  const sortedMissions = [...missions].sort(
    (a, b) => a.coreMissionNumber - b.coreMissionNumber,
  );

  const getMissionStatus = (mission: Mission): 'COMPLETED' | 'IN PROGRESS' | 'AVAILABLE' | 'LOCKED' => {
    const prog = progressList.find((p) => p.missionId === mission.id);
    if (prog) return prog.status;

    // If mission 1, available by default if no record
    if (mission.coreMissionNumber === 1) return 'AVAILABLE';

    // If previous mission is completed, then this is available
    const prevMission = missions.find(
      (m) => m.coreMissionNumber === (mission.coreMissionNumber - 1),
    );
    if (prevMission) {
      const prevProg = progressList.find((p) => p.missionId === prevMission.id);
      if (prevProg && prevProg.status === 'COMPLETED') {
        return 'AVAILABLE';
      }
    }

    return 'LOCKED';
  };

  const getMissionProgress = (mission: Mission): number => {
    const prog = progressList.find((p) => p.missionId === mission.id);
    return prog ? prog.progress : 0;
  };

  const getMissionScore = (mission: Mission): number | undefined => {
    const prog = progressList.find((p) => p.missionId === mission.id);
    return prog?.score;
  };

  const getIconForCoreNumber = (num: MissionCoreNumber) => {
    switch (num) {
      case 1:
        return BookOpen;
      case 2:
        return FlaskConical;
      case 3:
        return Target;
      case 4:
        return Gamepad2;
      case 5:
        return BrainCircuit;
      case 6:
        return Sparkles;
      case 7:
        return GraduationCap;
      default:
        return Compass;
    }
  };

  const totalCompleted = sortedMissions.filter(
    (m) => getMissionStatus(m) === 'COMPLETED',
  ).length;

  return (
    <div className="space-y-6">
      {/* Journey Header Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
            Alur Pembelajaran MIPA Fase F
          </span>
          <h2 className="text-xl font-display font-extrabold text-slate-800 mt-2">
            Perjalanan 7 Misi Utama (Mission Journey)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 max-w-xl">
            Selesaikan misi secara berurutan mulai dari Pahami Konsep hingga Asesmen Sumatif untuk menguasai kompetensi MIPA secara mendalam dan menggembirakan.
          </p>
        </div>

        {/* Progress pill */}
        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-display font-bold text-sm">
            {totalCompleted}/7
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">Misi Tuntas</div>
            <div className="text-[11px] text-slate-500">
              {Math.round((totalCompleted / 7) * 100)}% Capaian Alur
            </div>
          </div>
        </div>
      </div>

      {/* Visual Journey Roadmap */}
      <div className="relative pl-6 sm:pl-8 space-y-6">
        {/* Continuous background vertical line connecting all missions */}
        <div className="absolute left-6 sm:left-8 top-8 bottom-8 w-1 bg-gradient-to-b from-emerald-500 via-indigo-500 to-slate-200 -translate-x-1/2 rounded-full pointer-events-none" />

        {/* START Point */}
        <div className="relative flex items-center gap-4">
          <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-[10px] shadow-sm -ml-3.5 z-10">
            🚀
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 font-mono">
            Mulai Perjalanan Belajar (START)
          </span>
        </div>

        {/* 7 Missions Items */}
        {sortedMissions.map((mission, idx) => {
          const status = getMissionStatus(mission);
          const progress = getMissionProgress(mission);
          const score = getMissionScore(mission);
          const IconComponent = getIconForCoreNumber(mission.coreMissionNumber);
          const isClickable = status !== 'LOCKED';

          return (
            <div key={mission.id} className="relative flex items-start gap-4 group">
              {/* Status node circle */}
              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center text-xs font-bold shadow-md -ml-4.5 z-10 transition-transform ${
                  status === 'COMPLETED'
                    ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                    : status === 'IN PROGRESS'
                    ? 'bg-blue-600 text-white ring-4 ring-blue-100 animate-pulse'
                    : status === 'AVAILABLE'
                    ? 'bg-amber-500 text-white ring-4 ring-amber-100'
                    : 'bg-slate-200 text-slate-400 border border-slate-300'
                }`}
              >
                {status === 'COMPLETED' ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : status === 'LOCKED' ? (
                  <Lock className="w-4 h-4" />
                ) : (
                  <IconComponent className="w-4 h-4" />
                )}
              </div>

              {/* Mission Card */}
              <div
                onClick={() => {
                  if (isClickable) onOpenMission(mission);
                }}
                className={`flex-1 rounded-3xl p-5 border transition-all ${
                  isClickable
                    ? 'bg-white hover:border-purple-300 hover:shadow-md cursor-pointer border-slate-200 active:scale-[0.99]'
                    : 'bg-slate-50/70 border-slate-200/80 opacity-70 cursor-not-allowed'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-bold text-slate-400 uppercase">
                        {mission.coreTitle}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                        {mission.subjectName}
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-slate-800 text-sm sm:text-base">
                      {mission.title}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-2 max-w-2xl leading-relaxed">
                      {mission.description}
                    </p>
                  </div>

                  {/* Status & CTA Badge */}
                  <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
                    {status === 'COMPLETED' && (
                      <div className="text-right">
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Selesai
                        </span>
                        {score !== undefined && (
                          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                            Skor: {score}/100
                          </div>
                        )}
                      </div>
                    )}

                    {status === 'IN PROGRESS' && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-200">
                        <Play className="w-3 h-3 fill-blue-600" />
                        Sedang Berjalan ({progress}%)
                      </span>
                    )}

                    {status === 'AVAILABLE' && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
                        <Sparkles className="w-3 h-3" />
                        Siap Dimulai
                      </span>
                    )}

                    {status === 'LOCKED' && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full">
                        <Lock className="w-3 h-3" />
                        Terkunci
                      </span>
                    )}

                    {isClickable && (
                      <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-purple-600 group-hover:text-white flex items-center justify-center transition-colors text-slate-400">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress bar inside card if IN PROGRESS */}
                {status === 'IN PROGRESS' && (
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-3">
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-mono font-bold text-blue-600">
                      {progress}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* FINISH Point */}
        <div className="relative flex items-center gap-4 pt-2">
          <div className="w-8 h-8 rounded-full bg-amber-400 text-white flex items-center justify-center font-bold text-xs shadow-md -ml-4 z-10 ring-4 ring-amber-100">
            <Award className="w-4 h-4 fill-white" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 font-mono">
              Puncak Capaian Pembelajaran (FINISH)
            </span>
            <div className="text-[11px] text-slate-500">
              Lulus Asesmen Sumatif & Mahir MIPA Fase F
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
