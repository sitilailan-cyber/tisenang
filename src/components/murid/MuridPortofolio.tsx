import React, { useState } from 'react';
import {
  FolderLock,
  Lock,
  Globe2,
  Plus,
  Trash2,
  Eye,
  Calendar,
  FlaskConical,
  BookOpen,
  Award,
  Sparkles,
  FileCheck,
  X,
  LineChart,
} from 'lucide-react';
import { PortfolioItem, PortfolioVisibility } from '../../types';
import { storage } from '../../services/storage';

interface MuridPortofolioProps {
  studentId: string;
  studentName: string;
  classId: string;
  className: string;
  portfolios: PortfolioItem[];
  onRefresh: () => void;
}

export const MuridPortofolio: React.FC<MuridPortofolioProps> = ({
  studentId,
  studentName,
  classId,
  className,
  portfolios,
  onRefresh,
}) => {
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New portfolio state
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('Fisika Eksperimental & Terapan');
  const [newCategory, setNewCategory] = useState<'Eksperimen' | 'Refleksi' | 'Proyek MIPA'>('Refleksi');
  const [newVisibility, setNewVisibility] = useState<PortfolioVisibility>('PRIVATE');
  const [newSummary, setNewSummary] = useState('');
  const [newConclusion, setNewConclusion] = useState('');

  const handleToggleVisibility = (item: PortfolioItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedVisibility: PortfolioVisibility = item.visibility === 'CLASS' ? 'PRIVATE' : 'CLASS';
    const updatedItem = { ...item, visibility: updatedVisibility };
    storage.savePortfolio(updatedItem);
    onRefresh();
    if (selectedItem?.id === item.id) {
      setSelectedItem(updatedItem);
    }
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Apakah Anda yakin ingin menghapus portofolio ini?')) {
      storage.deletePortfolio(id);
      if (selectedItem?.id === id) setSelectedItem(null);
      onRefresh();
    }
  };

  const handleCreateNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSummary.trim()) {
      alert('Mohon lengkapi judul dan catatan refleksi.');
      return;
    }

    const newItem: PortfolioItem = {
      id: `pf-${Date.now()}`,
      studentId,
      studentName,
      classId,
      className,
      title: newTitle,
      subjectName: newSubject,
      date: new Date().toISOString().split('T')[0],
      category: newCategory,
      xpEarned: 120,
      visibility: newVisibility,
      reflectionSummary: newSummary,
      conclusion: newConclusion,
    };

    storage.savePortfolio(newItem);
    setIsAddModalOpen(false);
    setNewTitle('');
    setNewSummary('');
    setNewConclusion('');
    onRefresh();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider mb-2">
            <FolderLock className="w-3.5 h-3.5" />
            Portofolio Belajar Murid
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight">
            Rekam Jejak & Portofolio MIPA
          </h1>
          <p className="text-purple-100 text-xs sm:text-sm mt-1 max-w-xl">
            Koleksi otentik laporan eksperimen, analisis data kuantitatif, dan refleksi mendalam Anda selama Fase F.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-3 rounded-2xl bg-white text-purple-800 hover:bg-purple-50 font-bold text-xs shadow-md transition-all flex items-center gap-2 self-start sm:self-auto shrink-0 active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Refleksi / Portofolio</span>
        </button>
      </div>

      {/* Portfolios List */}
      {portfolios.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-purple-50 text-purple-600 mx-auto flex items-center justify-center">
            <FolderLock className="w-8 h-8" />
          </div>
          <h3 className="font-display font-bold text-slate-800 text-base">
            Portofolio Belum Terisi
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Selesaikan Misi 2 (Eksplorasi & Eksperimen) atau klik tombol Tambah Refleksi di atas untuk menyimpan karya saintifik pertama Anda.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {portfolios.map((item) => {
            const isClassVisible = item.visibility === 'CLASS';
            return (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs hover:shadow-md hover:border-purple-300 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider bg-purple-50 px-2.5 py-1 rounded-full border border-purple-100">
                      {item.category}
                    </span>

                    {/* Visibility Toggle Badge */}
                    <button
                      type="button"
                      onClick={(e) => handleToggleVisibility(item, e)}
                      title="Klik untuk mengubah visibilitas"
                      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full border transition-colors ${
                        isClassVisible
                          ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                          : 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
                      }`}
                    >
                      {isClassVisible ? (
                        <>
                          <Globe2 className="w-3 h-3 text-blue-500" />
                          <span>Kelas {className} (Publik)</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3 h-3 text-purple-500" />
                          <span>Pribadi (Private)</span>
                        </>
                      )}
                    </button>
                  </div>

                  <h3 className="font-display font-bold text-slate-800 text-sm sm:text-base group-hover:text-purple-700 transition-colors">
                    {item.title}
                  </h3>

                  <div className="text-[11px] text-slate-400 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{item.date}</span>
                    <span>•</span>
                    <span>{item.subjectName}</span>
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
                        Data Eksperimen Sensor ({item.experimentData.rows.length} baris)
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-mono font-bold text-amber-600">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>+{item.xpEarned} XP</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleDelete(item.id, e)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Hapus Portofolio"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <span className="text-purple-600 font-semibold text-xs flex items-center gap-1">
                      <span>Buka Laporan</span>
                      <Eye className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DETAIL MODAL */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl max-h-[85vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-purple-700 to-indigo-700 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
                  {selectedItem.category} • {selectedItem.subjectName}
                </span>
                <h2 className="font-display font-bold text-base sm:text-lg mt-1">
                  {selectedItem.title}
                </h2>
                <div className="text-xs text-purple-200 mt-0.5">
                  {selectedItem.studentName || studentName} • {selectedItem.date}
                </div>
              </div>

              <button
                onClick={() => setSelectedItem(null)}
                className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Visibility Status Bar */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-600">
                  Status Berbagi: <strong>{selectedItem.visibility === 'CLASS' ? `Publik di Kelas ${className}` : 'Pribadi (Private)'}</strong>
                </span>
                <button
                  onClick={(e) => handleToggleVisibility(selectedItem, e)}
                  className="text-xs font-bold text-purple-700 hover:underline"
                >
                  Ubah ke {selectedItem.visibility === 'CLASS' ? 'Pribadi' : 'Publik Kelas'}
                </button>
              </div>

              {/* Experiment Data Table & Graph if available */}
              {selectedItem.experimentData && (
                <div className="space-y-4">
                  <h3 className="font-display font-bold text-slate-800 text-sm flex items-center gap-2">
                    <FlaskConical className="w-4 h-4 text-emerald-600" />
                    Data Kuantitatif Hasil Eksperimen ({selectedItem.experimentData.inputMode})
                  </h3>

                  {/* Table */}
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
                        {selectedItem.experimentData.rows.map((r, i) => (
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
              {selectedItem.analysisAnswers && (
                <div className="space-y-3">
                  <h3 className="font-display font-bold text-slate-800 text-sm flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-indigo-600" />
                    Jawaban Analisis Saintifik
                  </h3>
                  <div className="space-y-2 text-xs">
                    {selectedItem.analysisAnswers.q1_amat && (
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <strong className="text-slate-700 block mb-0.5">1. Pengamatan:</strong>
                        <p className="text-slate-600">{selectedItem.analysisAnswers.q1_amat}</p>
                      </div>
                    )}
                    {selectedItem.analysisAnswers.q2_pola && (
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <strong className="text-slate-700 block mb-0.5">2. Pola Grafik:</strong>
                        <p className="text-slate-600">{selectedItem.analysisAnswers.q2_pola}</p>
                      </div>
                    )}
                    {selectedItem.analysisAnswers.q3_sebabSuhu && (
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <strong className="text-slate-700 block mb-0.5">3. Mekanisme Kalor:</strong>
                        <p className="text-slate-600">{selectedItem.analysisAnswers.q3_sebabSuhu}</p>
                      </div>
                    )}
                    {selectedItem.analysisAnswers.q4_hubunganVariabel && (
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <strong className="text-slate-700 block mb-0.5">4. Hubungan Antarvariabel:</strong>
                        <p className="text-slate-600">{selectedItem.analysisAnswers.q4_hubunganVariabel}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Conclusion */}
              {selectedItem.conclusion && (
                <div className="p-4 bg-teal-50 rounded-2xl border border-teal-200 space-y-1">
                  <h4 className="font-display font-bold text-xs text-teal-900 uppercase tracking-wider">
                    Kesimpulan Saintifik:
                  </h4>
                  <p className="text-xs sm:text-sm text-teal-800 leading-relaxed">
                    {selectedItem.conclusion}
                  </p>
                </div>
              )}

              {/* Reflection */}
              {selectedItem.reflectionSummary && (
                <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 space-y-1">
                  <h4 className="font-display font-bold text-xs text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                    Refleksi Mindful & Meaningful:
                  </h4>
                  <p className="text-xs sm:text-sm text-purple-800 leading-relaxed italic">
                    "{selectedItem.reflectionSummary}"
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs hover:bg-slate-900 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD NEW PORTFOLIO MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 bg-gradient-to-r from-purple-700 to-indigo-700 text-white flex items-center justify-between">
              <h3 className="font-display font-bold text-base">Tambah Portofolio / Refleksi MIPA</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNew} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Judul Karya / Proyek</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Contoh: Pemodelan Siklus Termodinamika Mesin Carnot Sederhana"
                  className="w-full h-10 px-3.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-200 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Mata Pelajaran</label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs"
                  >
                    <option value="Fisika Eksperimental & Terapan">Fisika Eksperimental & Terapan</option>
                    <option value="Matematika Tingkat Lanjut">Matematika Tingkat Lanjut</option>
                    <option value="Kimia Terapan & Material">Kimia Terapan & Material</option>
                    <option value="Biologi & Bioteknologi">Biologi & Bioteknologi</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kategori</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs"
                  >
                    <option value="Refleksi">Refleksi Mindful</option>
                    <option value="Eksperimen">Laporan Eksperimen</option>
                    <option value="Proyek MIPA">Proyek MIPA Nyata</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Visibilitas</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewVisibility('PRIVATE')}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2 ${
                      newVisibility === 'PRIVATE'
                        ? 'bg-purple-50 border-purple-500 text-purple-900 font-bold'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Pribadi</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewVisibility('CLASS')}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2 ${
                      newVisibility === 'CLASS'
                        ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    <Globe2 className="w-3.5 h-3.5" />
                    <span>Bagikan ke Kelas ({className})</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Catatan Refleksi Bermakna</label>
                <textarea
                  rows={3}
                  required
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  placeholder="Ceritakan pemahaman baru, kesulitan yang diatasi, dan relevansinya bagi Anda..."
                  className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-200 text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-md"
                >
                  Simpan Portofolio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
