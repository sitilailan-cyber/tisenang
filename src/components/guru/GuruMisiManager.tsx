import React, { useState } from 'react';
import {
  Target,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  Award,
  BookOpen,
  Send,
  Eye,
  AlertCircle,
  X,
  Sparkles,
} from 'lucide-react';
import { Mission, ClassRoom, Subject, MissionStatus, MissionCoreNumber } from '../../types';
import { storage } from '../../services/storage';

interface GuruMisiManagerProps {
  missions: Mission[];
  classes: ClassRoom[];
  subjects: Subject[];
  selectedClassId: string;
  onRefresh: () => void;
}

export const GuruMisiManager: React.FC<GuruMisiManagerProps> = ({
  missions,
  classes,
  subjects,
  selectedClassId,
  onRefresh,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMission, setEditingMission] = useState<Mission | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetClassId, setTargetClassId] = useState(selectedClassId || classes[0]?.id || 'cls-xii-1');
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || 'sbj-fisika');
  const [status, setStatus] = useState<MissionStatus>('PUBLISHED');
  const [coreNumber, setCoreNumber] = useState<MissionCoreNumber>(1);
  const [xpReward, setXpReward] = useState<number>(100);
  const [dueDate, setDueDate] = useState<string>('2026-10-15');

  const coreTitlesMap: Record<MissionCoreNumber, string> = {
    1: 'Misi 1 — Pahami Konsep',
    2: 'Misi 2 — Eksplorasi & Eksperimen',
    3: 'Misi 3 — Selesaikan Masalah Nyata',
    4: 'Misi 4 — Permainan Edukasi',
    5: 'Misi 5 — Latihan & Refleksi',
    6: 'Misi 6 — Pengayaan / Remedial',
    7: 'Misi 7 — Asesmen Sumatif',
  };

  // Filter missions for the currently selected class view
  const displayMissions = missions.filter((m) => m.classId === targetClassId);

  const openCreateModal = () => {
    setEditingMission(null);
    setTitle('');
    setDescription('');
    setTargetClassId(selectedClassId || classes[0]?.id || 'cls-xii-1');
    setSubjectId(subjects[0]?.id || 'sbj-fisika');
    setStatus('PUBLISHED');
    setCoreNumber(1);
    setXpReward(100);
    setDueDate('2026-10-15');
    setIsModalOpen(true);
  };

  const openEditModal = (m: Mission) => {
    setEditingMission(m);
    setTitle(m.title);
    setDescription(m.description);
    setTargetClassId(m.classId);
    setSubjectId(m.subjectId);
    setStatus(m.status);
    setCoreNumber(m.coreMissionNumber);
    setXpReward(m.xpReward);
    setDueDate(m.dueDate || '2026-10-15');
    setIsModalOpen(true);
  };

  const handleToggleStatus = (missionId: string) => {
    storage.togglePublishMission(missionId);
    onRefresh();
  };

  const handleDelete = (missionId: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus misi ini?')) {
      storage.deleteMission(missionId);
      onRefresh();
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert('Mohon lengkapi judul dan deskripsi misi.');
      return;
    }

    const selectedSubj = subjects.find((s) => s.id === subjectId);
    const selectedCls = classes.find((c) => c.id === targetClassId);

    const missionPayload: Mission = {
      id: editingMission ? editingMission.id : `msn-${targetClassId}-${Date.now()}`,
      title,
      description,
      status,
      classId: targetClassId,
      className: selectedCls?.className || 'XII-1',
      subjectId,
      subjectName: selectedSubj?.name || 'Fisika Eksperimental & Terapan',
      coreMissionNumber: Number(coreNumber) as MissionCoreNumber,
      coreTitle: coreTitlesMap[Number(coreNumber) as MissionCoreNumber],
      xpReward: Number(xpReward),
      dueDate,
    };

    if (editingMission) {
      storage.updateMission(editingMission.id, missionPayload);
    } else {
      storage.createMission(missionPayload);
    }

    setIsModalOpen(false);
    onRefresh();
  };

  return (
    <div className="space-y-5">
      {/* Top action row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-200">
        <div>
          <h3 className="font-display font-bold text-slate-800 text-base flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-600" />
            Kelola Misi Pembelajaran Kelas
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Misi yang dipublikasikan hanya akan diterima oleh murid di kelas target yang Anda tentukan.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Class Filter selector for Mission Table */}
          <select
            value={targetClassId}
            onChange={(e) => setTargetClassId(e.target.value)}
            className="h-10 px-3 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 bg-slate-50"
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                Kelas {c.className}
              </option>
            ))}
          </select>

          <button
            onClick={openCreateModal}
            className="h-10 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Misi Baru</span>
          </button>
        </div>
      </div>

      {/* Missions Grid */}
      <div className="space-y-3">
        {displayMissions.map((m) => {
          const isPublished = m.status === 'PUBLISHED';
          return (
            <div
              key={m.id}
              className={`p-5 rounded-3xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isPublished
                  ? 'bg-white border-slate-200 hover:border-indigo-300 shadow-xs'
                  : 'bg-slate-50/80 border-slate-200/80 opacity-80'
              }`}
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                    {m.coreTitle}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500">
                    Kelas {m.className}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    Tenggat: {m.dueDate || 'Sesuai Rencana'}
                  </span>
                </div>

                <h4 className="font-display font-bold text-slate-800 text-base">
                  {m.title}
                </h4>

                <p className="text-xs text-slate-600 max-w-2xl line-clamp-2">
                  {m.description}
                </p>
              </div>

              {/* Status and Action Buttons */}
              <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
                {/* Publish Toggle Button */}
                <button
                  type="button"
                  onClick={() => handleToggleStatus(m.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 ${
                    isPublished
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                      : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                  }`}
                  title="Klik untuk ubah status Publish / Draft"
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isPublished ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                  />
                  <span>{isPublished ? 'Published' : 'Draft'}</span>
                </button>

                <div className="flex items-center gap-1 font-mono font-bold text-xs text-amber-600 bg-amber-50 px-2.5 py-1.5 rounded-xl border border-amber-100">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  <span>+{m.xpReward} XP</span>
                </div>

                <button
                  onClick={() => openEditModal(m)}
                  className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-indigo-600 transition-colors"
                  title="Edit Misi"
                >
                  <Edit className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDelete(m.id)}
                  className="p-2 rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                  title="Hapus Misi"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE / EDIT MISSION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 bg-gradient-to-r from-indigo-700 to-purple-700 text-white flex items-center justify-between">
              <h3 className="font-display font-bold text-base">
                {editingMission ? 'Edit Misi Pembelajaran' : 'Buat Misi Pembelajaran Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Judul Misi
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Analisis Dinamika Termal & Efisiensi Pendinginan Kolektor Surya"
                  className="w-full h-10 px-3.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-200 text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Deskripsi & Arahan Siswa
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Jelaskan tujuan tugas, langkah penyelidikan, dan indikator saintifik yang diharapkan..."
                  className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-200 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Tahapan 7 Misi Utama
                  </label>
                  <select
                    value={coreNumber}
                    onChange={(e) => setCoreNumber(Number(e.target.value) as MissionCoreNumber)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs font-semibold"
                  >
                    <option value={1}>M1 — Pahami Konsep</option>
                    <option value={2}>M2 — Eksplorasi & Eksperimen</option>
                    <option value={3}>M3 — Selesaikan Masalah Nyata</option>
                    <option value={4}>M4 — Permainan Edukasi</option>
                    <option value={5}>M5 — Latihan & Refleksi</option>
                    <option value={6}>M6 — Pengayaan / Remedial</option>
                    <option value={7}>M7 — Asesmen Sumatif</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Target Kelas
                  </label>
                  <select
                    value={targetClassId}
                    onChange={(e) => setTargetClassId(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs font-semibold"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        Kelas {c.className}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Status Rilis
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as MissionStatus)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs font-bold"
                  >
                    <option value="PUBLISHED">Published (Aktif)</option>
                    <option value="DRAFT">Draft (Disimpan)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Reward XP
                  </label>
                  <input
                    type="number"
                    step="25"
                    value={xpReward}
                    onChange={(e) => setXpReward(Number(e.target.value))}
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Tenggat Waktu
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md"
                >
                  {editingMission ? 'Perbarui Misi' : 'Terbitkan Misi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
