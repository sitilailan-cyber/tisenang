import React, { useState } from 'react';
import {
  Sparkles,
  Users,
  Eye,
  Heart,
  MessageSquare,
  Calendar,
  FlaskConical,
  BookOpen,
  Award,
  Lock,
  Globe2,
} from 'lucide-react';
import { PortfolioItem } from '../../types';

interface MuridBerandaProps {
  className: string;
  classPortfolios: PortfolioItem[];
  onOpenDetail?: (item: PortfolioItem) => void;
}

export const MuridBeranda: React.FC<MuridBerandaProps> = ({
  className,
  classPortfolios,
  onOpenDetail,
}) => {
  const [likes, setLikes] = useState<Record<string, number>>({});

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikes((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Feed Header */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider mb-2">
              <Users className="w-3.5 h-3.5" />
              Galeri Kelas {className}
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight">
              Karya & Eksperimen Teman Sekelas
            </h1>
            <p className="text-blue-100 text-xs sm:text-sm mt-1 max-w-xl">
              Saling mengapresiasi, berbagi temuan data, dan merayakan proses pembelajaran saintifik bersama teman kelas {className}.
            </p>
          </div>

          <div className="px-4 py-2 rounded-2xl bg-white/10 backdrop-blur border border-white/20 text-xs font-semibold self-start sm:self-auto">
            {classPortfolios.length} Karya Terpublikasi
          </div>
        </div>
      </div>

      {/* Portfolios Feed Grid */}
      {classPortfolios.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-500 mx-auto flex items-center justify-center">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="font-display font-bold text-slate-800 text-base">
            Belum Ada Portofolio Kelas yang Dibagikan
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Jadilah yang pertama membagikan hasil eksperimen atau catatan refleksi Anda ke kelas {className}!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {classPortfolios.map((item) => {
            const likeCount = (likes[item.id] || 0) + (item.id === 'pf-01' ? 4 : 2);
            return (
              <div
                key={item.id}
                onClick={() => onOpenDetail && onOpenDetail(item)}
                className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  {/* Author Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-xs font-bold font-display shadow-xs">
                        {(item.studentName || 'M')[0]}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800">
                          {item.studentName || 'Murid MIPA'}
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{item.date}</span>
                          <span>•</span>
                          <span>Kelas {item.className || className}</span>
                        </div>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                      <Globe2 className="w-3 h-3 text-blue-500" />
                      Kelas
                    </span>
                  </div>

                  {/* Title & Category */}
                  <div>
                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                      {item.subjectName || 'Fisika Eksperimental'}
                    </span>
                    <h3 className="font-display font-bold text-slate-800 text-sm sm:text-base mt-0.5 group-hover:text-indigo-600 transition-colors">
                      {item.title}
                    </h3>
                  </div>

                  {/* Reflection or Summary Snippet */}
                  {item.reflectionSummary && (
                    <p className="text-xs text-slate-600 line-clamp-3 bg-slate-50 p-3 rounded-2xl border border-slate-100 leading-relaxed italic">
                      "{item.reflectionSummary}"
                    </p>
                  )}

                  {/* Experiment Data Mini-Badge */}
                  {item.experimentData && (
                    <div className="flex items-center gap-2 text-[11px] text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100 font-medium">
                      <FlaskConical className="w-3.5 h-3.5" />
                      <span>
                        Dilengkapi data terukur ({item.experimentData.rows.length} baris pengamatan, mode {item.experimentData.inputMode})
                      </span>
                    </div>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => handleLike(item.id, e)}
                      className="flex items-center gap-1 hover:text-rose-600 transition-colors"
                    >
                      <Heart className="w-4 h-4 fill-rose-100 text-rose-500" />
                      <span>{likeCount}</span>
                    </button>
                    <div className="flex items-center gap-1">
                      <Award className="w-4 h-4 text-amber-500" />
                      <span className="font-mono font-bold">+{item.xpEarned} XP</span>
                    </div>
                  </div>

                  <span className="text-indigo-600 font-semibold text-xs flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Lihat Laporan</span>
                    <Eye className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
