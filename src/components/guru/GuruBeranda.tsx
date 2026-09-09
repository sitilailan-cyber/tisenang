import React, { useState } from 'react';
import {
  FolderOpen,
  Calendar,
  FlaskConical,
  BookOpen,
  Eye,
  Award,
  Filter,
  CheckCircle2,
  MessageSquare,
  Sparkles,
  X,
  FileText,
} from 'lucide-react';
import { PortfolioItem, ClassRoom } from '../../types';

interface GuruBerandaProps {
  portfolios: PortfolioItem[];
  classes: ClassRoom[];
}

export const GuruBeranda: React.FC<GuruBerandaProps> = ({ portfolios, classes }) => {
  const [selectedClassId, setSelectedClassId] = useState<string>('all');
  const [selectedPortfolio, setSelectedPortfolio] = useState<PortfolioItem | null>(null);
  const [feedbackSent, setFeedbackSent] = useState<Record<string, string>>({});
  const [feedbackInput, setFeedbackInput] = useState<string>('');

  const filteredPortfolios =
    selectedClassId === 'all'
      ? portfolios
      : portfolios.filter((p) => p.classId === selectedClassId);

  const handleSendFeedback = (portfolioId: string) => {
    if (!feedbackInput.trim()) return;
    setFeedbackSent((prev) => ({ ...prev, [portfolioId]: feedbackInput }));
    setFeedbackInput('');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-blue-700 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider mb-2">
            <FolderOpen className="w-3.5 h-3.5" />
            Beranda Portofolio Murid
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight">
            Karya & Laporan Eksperimen Siswa
          </h1>
        </div>

        {/* Class Filter */}
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur p-2 rounded-2xl border border-white/20 self-start sm:self-auto shrink-0">
          <Filter className="w-4 h-4 text-indigo-200 ml-1" />
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="bg-transparent text-white font-bold text-xs outline-hidden pr-2 cursor-pointer"
          >
            <option value="all" className="text-slate-800">
              Semua Kelas Binaan
            </option>
            {classes.map((c) => (
              <option key={c.id} value={c.id} className="text-slate-800">
                Kelas {c.className}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Portfolios Feed Grid */}
      {filteredPortfolios.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center">
            <FolderOpen className="w-8 h-8" />
          </div>
          <h3 className="font-display font-bold text-slate-800 text-base">
            Belum Ada Portofolio Terunggah
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Portofolio yang disimpan oleh siswa di kelas yang Anda ampu akan otomatis ditampilkan di sini.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredPortfolios.map((item) => {
            const hasFeedback = !!feedbackSent[item.id];
            return (
              <div
                key={item.id}
                onClick={() => setSelectedPortfolio(item)}
                className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center text-xs font-bold font-display shadow-xs">
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
                          <span>Kelas {item.className || 'XII'}</span>
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {item.category}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                      {item.subjectName || 'MIPA Fase F'}
                    </span>
                    <h3 className="font-display font-bold text-slate-800 text-sm sm:text-base mt-0.5 group-hover:text-indigo-600 transition-colors">
                      {item.title}
                    </h3>
                  </div>

                  {item.reflectionSummary && (
                    <p className="text-xs text-slate-600 line-clamp-3 bg-slate-50 p-3 rounded-2xl border border-slate-100 leading-relaxed italic">
                      "{item.reflectionSummary}"
                    </p>
                  )}

                  {item.experimentData && (
                    <div className="flex items-center gap-2 text-[11px] text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100 font-medium">
                      <FlaskConical className="w-3.5 h-3.5" />
                      <span>
                        Dilengkapi data sensor ({item.experimentData.rows.length} titik pengamatan, mode {item.experimentData.inputMode})
                      </span>
                    </div>
                  )}

                  {hasFeedback && (
                    <div className="p-2.5 bg-purple-50 rounded-xl border border-purple-200 text-xs text-purple-900 flex items-start gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Apresiasi Anda: </span>
                        <span>{feedbackSent[item.id]}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1 font-mono font-bold text-amber-600">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>+{item.xpEarned} XP Diberikan</span>
                  </div>

                  <span className="text-indigo-600 font-semibold text-xs flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Tinjau Laporan</span>
                    <Eye className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DETAIL REPORT MODAL */}
      {selectedPortfolio && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl max-h-[85vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-indigo-700 to-purple-700 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
                  Laporan Siswa: {selectedPortfolio.studentName} ({selectedPortfolio.className})
                </span>
                <h2 className="font-display font-bold text-base sm:text-lg mt-1">
                  {selectedPortfolio.title}
                </h2>
                <div className="text-xs text-indigo-200 mt-0.5">
                  Tanggal: {selectedPortfolio.date} • {selectedPortfolio.subjectName}
                </div>
              </div>

              <button
                onClick={() => setSelectedPortfolio(null)}
                className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Experiment Data Table if available */}
              {selectedPortfolio.experimentData && (
                <div className="space-y-3">
                  <h3 className="font-display font-bold text-slate-800 text-sm flex items-center gap-2">
                    <FlaskConical className="w-4 h-4 text-emerald-600" />
                    Data Kuantitatif Hasil Eksperimen ({selectedPortfolio.experimentData.inputMode})
                  </h3>

                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full text-xs text-left font-mono">
                      <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                        <tr>
                          <th className="py-2 px-3">Waktu (mnt)</th>
                          <th className="py-2 px-3">Suhu Awal (°C)</th>
                          <th className="py-2 px-3">Intensitas (Lux)</th>
                          <th className="py-2 px-3 text-emerald-700">Suhu Akhir (°C)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {selectedPortfolio.experimentData.rows.map((r, i) => (
                          <tr key={i}>
                            <td className="py-2 px-3 font-bold">{r.waktu}</td>
                            <td className="py-2 px-3">{r.suhuAwal}</td>
                            <td className="py-2 px-3">{r.intensitasCahaya}</td>
                            <td className="py-2 px-3 font-bold text-emerald-600">{r.suhuAkhir}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Analysis Answers */}
              {selectedPortfolio.analysisAnswers && (
                <div className="space-y-3">
                  <h3 className="font-display font-bold text-slate-800 text-sm flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    Jawaban Analisis Saintifik Siswa
                  </h3>
                  <div className="space-y-2 text-xs">
                    {selectedPortfolio.analysisAnswers.q1_amat && (
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <strong className="text-slate-700 block mb-0.5">1. Pengamatan:</strong>
                        <p className="text-slate-600">{selectedPortfolio.analysisAnswers.q1_amat}</p>
                      </div>
                    )}
                    {selectedPortfolio.analysisAnswers.q2_pola && (
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <strong className="text-slate-700 block mb-0.5">2. Pola Hubungan:</strong>
                        <p className="text-slate-600">{selectedPortfolio.analysisAnswers.q2_pola}</p>
                      </div>
                    )}
                    {selectedPortfolio.analysisAnswers.q3_sebabSuhu && (
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <strong className="text-slate-700 block mb-0.5">3. Tinjauan Termodinamika:</strong>
                        <p className="text-slate-600">{selectedPortfolio.analysisAnswers.q3_sebabSuhu}</p>
                      </div>
                    )}
                    {selectedPortfolio.analysisAnswers.q4_hubunganVariabel && (
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <strong className="text-slate-700 block mb-0.5">4. Hubungan Antarvariabel:</strong>
                        <p className="text-slate-600">{selectedPortfolio.analysisAnswers.q4_hubunganVariabel}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Conclusion */}
              {selectedPortfolio.conclusion && (
                <div className="p-4 bg-teal-50 rounded-2xl border border-teal-200 space-y-1">
                  <h4 className="font-display font-bold text-xs text-teal-900 uppercase tracking-wider">
                    Kesimpulan Siswa:
                  </h4>
                  <p className="text-xs sm:text-sm text-teal-800 leading-relaxed">
                    {selectedPortfolio.conclusion}
                  </p>
                </div>
              )}

              {/* Reflection */}
              {selectedPortfolio.reflectionSummary && (
                <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 space-y-1">
                  <h4 className="font-display font-bold text-xs text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                    Refleksi Pembelajaran Siswa:
                  </h4>
                  <p className="text-xs sm:text-sm text-purple-800 leading-relaxed italic">
                    "{selectedPortfolio.reflectionSummary}"
                  </p>
                </div>
              )}

              {/* Teacher Feedback Box */}
              <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-200 space-y-2">
                <h4 className="font-display font-bold text-xs text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                  Beri Catatan Apresiasi Guru:
                </h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={feedbackInput}
                    onChange={(e) => setFeedbackInput(e.target.value)}
                    placeholder="Tuliskan umpan balik yang memberdayakan dan menggembirakan..."
                    className="flex-1 h-9 px-3 rounded-xl border border-indigo-200 text-xs bg-white focus:outline-hidden"
                  />
                  <button
                    onClick={() => handleSendFeedback(selectedPortfolio.id)}
                    className="px-4 h-9 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors shrink-0"
                  >
                    Kirim Catatan
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedPortfolio(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs hover:bg-slate-900 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
