import React, { useState, useEffect } from 'react';
import { storage } from '../../services/storage';
import { User, ClassRoom, Student } from '../../types';
import { Modal } from '../common/Modal';
import {
  Users,
  GraduationCap,
  School,
  Plus,
  Pencil,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Lock,
  Search,
  KeyRound,
  ShieldCheck,
} from 'lucide-react';

export const AdminCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'guru' | 'murid' | 'kelas'>('guru');

  // Data states
  const [teachers, setTeachers] = useState<Array<{ user: User; teacher: any }>>([]);
  const [students, setStudents] = useState<
    Array<{ user: User; student: Student; className: string }>
  >([]);
  const [classes, setClasses] = useState<ClassRoom[]>([]);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState('ALL');

  // Feedback notifications
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null,
  );

  // Modal States
  // 1. Teacher Modal
  const [teacherModalOpen, setTeacherModalOpen] = useState(false);
  const [editingTeacherId, setEditingTeacherId] = useState<string | null>(null);
  const [teacherForm, setTeacherForm] = useState({ fullName: '', username: '', password: '' });

  // 2. Student Modal
  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [studentForm, setStudentForm] = useState({
    fullName: '',
    username: '',
    password: '',
    classId: '',
  });

  // 3. Class Modal
  const [classModalOpen, setClassModalOpen] = useState(false);
  const [editingClassId, setEditingClassId] = useState<string | null>(null);
  const [classNameInput, setClassNameInput] = useState('');

  // Delete Confirmation Modal
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: 'guru' | 'murid' | 'kelas';
    id: string;
    name: string;
  } | null>(null);

  const refreshData = () => {
    setTeachers(storage.getTeachers());
    setStudents(storage.getStudents());
    const cls = storage.getClasses();
    setClasses(cls);
    if (cls.length > 0 && !studentForm.classId) {
      setStudentForm((prev) => ({ ...prev, classId: cls[0].id }));
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const showToast = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // TEACHER CRUD HANDLERS
  const handleOpenAddTeacher = () => {
    setEditingTeacherId(null);
    setTeacherForm({ fullName: '', username: '', password: '' });
    setTeacherModalOpen(true);
  };

  const handleOpenEditTeacher = (item: { user: User }) => {
    setEditingTeacherId(item.user.id);
    setTeacherForm({ fullName: item.user.fullName, username: item.user.username, password: '' });
    setTeacherModalOpen(true);
  };

  const handleSaveTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTeacherId) {
        storage.updateTeacher(
          editingTeacherId,
          teacherForm.fullName,
          teacherForm.username,
          teacherForm.password || undefined,
        );
        showToast('success', `Data guru ${teacherForm.fullName} berhasil diperbarui.`);
      } else {
        if (!teacherForm.password) {
          showToast('error', 'Password guru baru wajib diisi.');
          return;
        }
        storage.addTeacher(teacherForm.fullName, teacherForm.username, teacherForm.password);
        showToast('success', `Akun guru baru ${teacherForm.fullName} berhasil dibuat.`);
      }
      setTeacherModalOpen(false);
      refreshData();
    } catch (err: any) {
      showToast('error', err.message || 'Gagal menyimpan data guru.');
    }
  };

  // STUDENT CRUD HANDLERS
  const handleOpenAddStudent = () => {
    setEditingStudentId(null);
    setStudentForm({
      fullName: '',
      username: '',
      password: '',
      classId: classes[0]?.id || '',
    });
    setStudentModalOpen(true);
  };

  const handleOpenEditStudent = (item: { user: User; student: Student }) => {
    setEditingStudentId(item.user.id);
    setStudentForm({
      fullName: item.user.fullName,
      username: item.user.username,
      password: '',
      classId: item.student.classId,
    });
    setStudentModalOpen(true);
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!studentForm.classId) {
        showToast('error', 'Silakan pilih kelas untuk murid.');
        return;
      }

      if (editingStudentId) {
        storage.updateStudent(
          editingStudentId,
          studentForm.fullName,
          studentForm.username,
          studentForm.classId,
          studentForm.password || undefined,
        );
        showToast('success', `Data murid ${studentForm.fullName} berhasil diperbarui.`);
      } else {
        if (!studentForm.password) {
          showToast('error', 'Password murid baru wajib diisi.');
          return;
        }
        storage.addStudent(
          studentForm.fullName,
          studentForm.username,
          studentForm.password,
          studentForm.classId,
        );
        showToast('success', `Akun murid baru ${studentForm.fullName} berhasil dibuat.`);
      }
      setStudentModalOpen(false);
      refreshData();
    } catch (err: any) {
      showToast('error', err.message || 'Gagal menyimpan data murid.');
    }
  };

  // CLASS CRUD HANDLERS
  const handleOpenAddClass = () => {
    setEditingClassId(null);
    setClassNameInput('');
    setClassModalOpen(true);
  };

  const handleOpenEditClass = (cls: ClassRoom) => {
    setEditingClassId(cls.id);
    setClassNameInput(cls.className);
    setClassModalOpen(true);
  };

  const handleSaveClass = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingClassId) {
        storage.updateClass(editingClassId, classNameInput);
        showToast('success', `Nama kelas berhasil diubah menjadi ${classNameInput}.`);
      } else {
        storage.addClass(classNameInput);
        showToast('success', `Kelas baru ${classNameInput} berhasil ditambahkan.`);
      }
      setClassModalOpen(false);
      refreshData();
    } catch (err: any) {
      showToast('error', err.message || 'Gagal menyimpan kelas.');
    }
  };

  // DELETE CONFIRMATION HANDLER
  const handleConfirmDelete = () => {
    if (!deleteConfirm) return;
    try {
      if (deleteConfirm.type === 'guru') {
        storage.deleteTeacher(deleteConfirm.id);
        showToast('success', `Akun guru ${deleteConfirm.name} telah dihapus.`);
      } else if (deleteConfirm.type === 'murid') {
        storage.deleteStudent(deleteConfirm.id);
        showToast('success', `Akun murid ${deleteConfirm.name} telah dihapus.`);
      } else if (deleteConfirm.type === 'kelas') {
        storage.deleteClass(deleteConfirm.id);
        showToast('success', `Kelas ${deleteConfirm.name} telah dihapus.`);
      }
      setDeleteConfirm(null);
      refreshData();
    } catch (err: any) {
      showToast('error', err.message || 'Gagal menghapus data.');
    }
  };

  // Filtered queries
  const filteredTeachers = teachers.filter(
    (t) =>
      t.user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.user.username.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.user.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass =
      selectedClassFilter === 'ALL' || s.student.classId === selectedClassFilter;
    return matchesSearch && matchesClass;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 p-4 rounded-xl shadow-lg border flex items-center gap-3 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 ${
            notification.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-red-50 border-red-200 text-red-900'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          )}
          <span className="text-xs font-semibold">{notification.message}</span>
        </div>
      )}

      {/* Admin Center Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                Admin Center
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                Otoritas Terbatas
              </span>
            </div>
            <p className="text-sm text-slate-600">
              Pengelolaan fondasi: Akun Guru, Akun Murid, dan Daftar Kelas MIPA Fase F.
            </p>
          </div>

          {/* Strict Notice banner as mandated by prompt */}
          <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 text-xs text-amber-900 max-w-md flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p className="leading-snug">
              <span className="font-bold">Ketentuan Regulasi:</span> Admin HANYA mengelola akun, password, dan daftar kelas. Pemilihan mapel dan rombel diajar adalah hak mutlak Guru.
            </p>
          </div>
        </div>

        {/* 3 Metric Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div
            onClick={() => setActiveTab('guru')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              activeTab === 'guru'
                ? 'bg-blue-50/60 border-blue-300 shadow-xs'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Total Akun Guru
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <p className="font-display text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              {teachers.length}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">Pengajar terdaftar</p>
          </div>

          <div
            onClick={() => setActiveTab('murid')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              activeTab === 'murid'
                ? 'bg-pink-50/60 border-pink-300 shadow-xs'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Total Akun Murid
              </span>
              <div className="w-8 h-8 rounded-lg bg-pink-100 text-pink-700 flex items-center justify-center">
                <GraduationCap className="w-4 h-4" />
              </div>
            </div>
            <p className="font-display text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              {students.length}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">Siswa aktif MIPA</p>
          </div>

          <div
            onClick={() => setActiveTab('kelas')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              activeTab === 'kelas'
                ? 'bg-amber-50/60 border-amber-300 shadow-xs'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Daftar Kelas (Rombel)
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                <School className="w-4 h-4" />
              </div>
            </div>
            <p className="font-display text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              {classes.length}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">Rombel MIPA Fase F</p>
          </div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex rounded-xl bg-slate-200/70 p-1">
          <button
            id="tab-admin-guru"
            onClick={() => {
              setActiveTab('guru');
              setSearchQuery('');
            }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'guru'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>1. Akun Guru ({teachers.length})</span>
          </button>
          <button
            id="tab-admin-murid"
            onClick={() => {
              setActiveTab('murid');
              setSearchQuery('');
            }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'murid'
                ? 'bg-white text-pink-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>2. Akun Murid ({students.length})</span>
          </button>
          <button
            id="tab-admin-kelas"
            onClick={() => {
              setActiveTab('kelas');
              setSearchQuery('');
            }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'kelas'
                ? 'bg-white text-amber-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <School className="w-4 h-4" />
            <span>3. Daftar Kelas ({classes.length})</span>
          </button>
        </div>

        {/* Action Button for Current Tab */}
        <div>
          {activeTab === 'guru' && (
            <button
              id="btn-tambah-guru"
              onClick={handleOpenAddTeacher}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs hover:shadow transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Akun Guru</span>
            </button>
          )}
          {activeTab === 'murid' && (
            <button
              id="btn-tambah-murid"
              onClick={handleOpenAddStudent}
              disabled={classes.length === 0}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold shadow-xs hover:shadow transition-all disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Akun Murid</span>
            </button>
          )}
          {activeTab === 'kelas' && (
            <button
              id="btn-tambah-kelas"
              onClick={handleOpenAddClass}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs hover:shadow transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Kelas Baru</span>
            </button>
          )}
        </div>
      </div>

      {/* TAB 1: AKUN GURU */}
      {activeTab === 'guru' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari guru berdasarkan nama atau username..."
                className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-200 text-xs font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden bg-white"
              />
            </div>
            <span className="text-xs text-slate-500">
              Menampilkan {filteredTeachers.length} dari {teachers.length} guru
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3.5">Nama Lengkap</th>
                  <th className="px-6 py-3.5">Username</th>
                  <th className="px-6 py-3.5">Peran</th>
                  <th className="px-6 py-3.5">Terdaftar Sejak</th>
                  <th className="px-6 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTeachers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                      Tidak ada akun guru yang ditemukan.
                    </td>
                  </tr>
                ) : (
                  filteredTeachers.map((item) => (
                    <tr key={item.user.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-6 py-4 font-semibold text-slate-900">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0">
                            {item.user.fullName.charAt(0)}
                          </div>
                          <span>{item.user.fullName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-slate-600">
                        @{item.user.username}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                          Guru
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {new Date(item.user.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => handleOpenEditTeacher(item)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            title="Edit Akun Guru"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              setDeleteConfirm({
                                type: 'guru',
                                id: item.user.id,
                                name: item.user.fullName,
                              })
                            }
                            className="p-1.5 rounded-lg text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Hapus Akun Guru"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: AKUN MURID */}
      {activeTab === 'murid' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari murid berdasarkan nama atau username..."
                  className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-200 text-xs font-medium focus:border-pink-500 focus:ring-2 focus:ring-pink-100 outline-hidden bg-white"
                />
              </div>

              {/* Class Filter Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 shrink-0">Filter Kelas:</span>
                <select
                  value={selectedClassFilter}
                  onChange={(e) => setSelectedClassFilter(e.target.value)}
                  className="h-10 px-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:border-pink-500 focus:ring-2 focus:ring-pink-100 outline-hidden"
                >
                  <option value="ALL">Semua Kelas</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.className}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <span className="text-xs text-slate-500">
              Menampilkan {filteredStudents.length} dari {students.length} murid
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3.5">Nama Murid</th>
                  <th className="px-6 py-3.5">Username</th>
                  <th className="px-6 py-3.5">Kelas Terdaftar</th>
                  <th className="px-6 py-3.5">Terdaftar Sejak</th>
                  <th className="px-6 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                      Tidak ada akun murid yang ditemukan.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((item) => (
                    <tr key={item.user.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-6 py-4 font-semibold text-slate-900">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-700 font-bold flex items-center justify-center shrink-0">
                            {item.user.fullName.charAt(0)}
                          </div>
                          <span>{item.user.fullName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-slate-600">
                        @{item.user.username}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-purple-100 text-purple-900 border border-purple-200">
                          {item.className}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {new Date(item.user.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => handleOpenEditStudent(item)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-pink-600 hover:bg-pink-50 transition-colors"
                            title="Edit Akun Murid"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              setDeleteConfirm({
                                type: 'murid',
                                id: item.user.id,
                                name: item.user.fullName,
                              })
                            }
                            className="p-1.5 rounded-lg text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Hapus Akun Murid"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: DAFTAR KELAS */}
      {activeTab === 'kelas' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Daftar Rombongan Belajar (Rombel) MIPA Fase F
              </h3>
              <p className="text-[11px] text-slate-500">
                Nama kelas akan muncul pada dropdown pembuatan murid dan opsi kelas ajar guru.
              </p>
            </div>
            <span className="text-xs text-slate-500">{classes.length} Kelas Terdaftar</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3.5">Nama Kelas</th>
                  <th className="px-6 py-3.5">ID Rujukan</th>
                  <th className="px-6 py-3.5">Jumlah Murid Terdaftar</th>
                  <th className="px-6 py-3.5">Dibuat Pada</th>
                  <th className="px-6 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {classes.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                      Belum ada kelas yang dibuat. Silakan tambahkan kelas terlebih dahulu.
                    </td>
                  </tr>
                ) : (
                  classes.map((cls) => {
                    const studentCount = students.filter((s) => s.student.classId === cls.id).length;
                    return (
                      <tr key={cls.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-900 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                            <span>{cls.className}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-mono text-slate-500">{cls.id}</td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-800">
                            {studentCount} Murid
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500">
                          {new Date(cls.createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="inline-flex items-center gap-1">
                            <button
                              onClick={() => handleOpenEditClass(cls)}
                              className="p-1.5 rounded-lg text-slate-600 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                              title="Edit Nama Kelas"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                setDeleteConfirm({
                                  type: 'kelas',
                                  id: cls.id,
                                  name: cls.className,
                                })
                              }
                              className="p-1.5 rounded-lg text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors"
                              title="Hapus Kelas"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: TAMBAH / EDIT GURU */}
      {/* Form: Nama Lengkap, Username, Password. STRICT: NO MAPEL / KELAS! */}
      <Modal
        isOpen={teacherModalOpen}
        onClose={() => setTeacherModalOpen(false)}
        title={editingTeacherId ? 'Edit Akun Guru' : 'Buat Akun Guru Baru'}
        subtitle="Form: Nama Lengkap, Username, dan Password (Tanpa pilihan mapel/kelas)"
        maxWidth="md"
      >
        <form onSubmit={handleSaveTeacher} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Nama Lengkap
            </label>
            <input
              id="guru-fullname-input"
              type="text"
              required
              value={teacherForm.fullName}
              onChange={(e) => setTeacherForm({ ...teacherForm, fullName: e.target.value })}
              placeholder="contoh: Dr. Hendra Gunawan, M.Si."
              className="w-full h-11 px-3.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm font-medium outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Username
            </label>
            <input
              id="guru-username-input"
              type="text"
              required
              value={teacherForm.username}
              onChange={(e) => setTeacherForm({ ...teacherForm, username: e.target.value })}
              placeholder="contoh: hendra"
              className="w-full h-11 px-3.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm font-medium outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Password {editingTeacherId && '(Kosongkan jika tidak ingin mengubah)'}
            </label>
            <div className="relative">
              <input
                id="guru-password-input"
                type="password"
                required={!editingTeacherId}
                value={teacherForm.password}
                onChange={(e) => setTeacherForm({ ...teacherForm, password: e.target.value })}
                placeholder="••••••••"
                className="w-full h-11 px-3.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm font-medium outline-hidden"
              />
              <KeyRound className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/70 text-blue-900 text-xs">
            <p className="font-semibold">Peraturan Admin:</p>
            <p className="text-[11px] text-blue-800">
              Admin tidak menentukan mata pelajaran ataupun kelas yang diajar. Guru akan memilih mata pelajaran dan kelas mandiri saat login.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setTeacherModalOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Batal
            </button>
            <button
              id="btn-save-guru"
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs"
            >
              {editingTeacherId ? 'Simpan Perubahan' : 'Simpan Akun Guru'}
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 2: TAMBAH / EDIT MURID */}
      {/* Form: Nama Lengkap, Username, Password, Dropdown Kelas */}
      <Modal
        isOpen={studentModalOpen}
        onClose={() => setStudentModalOpen(false)}
        title={editingStudentId ? 'Edit Akun Murid' : 'Buat Akun Murid Baru'}
        subtitle="Form: Nama Lengkap, Username, Password, dan Kelas (Satu classId aktif)"
        maxWidth="md"
      >
        <form onSubmit={handleSaveStudent} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Nama Lengkap Murid
            </label>
            <input
              id="murid-fullname-input"
              type="text"
              required
              value={studentForm.fullName}
              onChange={(e) => setStudentForm({ ...studentForm, fullName: e.target.value })}
              placeholder="contoh: Aisyah Azzahra"
              className="w-full h-11 px-3.5 rounded-xl border border-slate-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-100 text-sm font-medium outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Username Murid
            </label>
            <input
              id="murid-username-input"
              type="text"
              required
              value={studentForm.username}
              onChange={(e) => setStudentForm({ ...studentForm, username: e.target.value })}
              placeholder="contoh: aisyah"
              className="w-full h-11 px-3.5 rounded-xl border border-slate-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-100 text-sm font-medium outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Password {editingStudentId && '(Kosongkan jika tidak ingin mengubah)'}
            </label>
            <div className="relative">
              <input
                id="murid-password-input"
                type="password"
                required={!editingStudentId}
                value={studentForm.password}
                onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })}
                placeholder="••••••••"
                className="w-full h-11 px-3.5 rounded-xl border border-slate-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-100 text-sm font-medium outline-hidden"
              />
              <KeyRound className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
            </div>
          </div>

          {/* Dropdown Kelas dari daftar kelas yang dibuat Admin */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Kelas (Dropdown dari Daftar Kelas)
            </label>
            <select
              id="murid-kelas-select"
              required
              value={studentForm.classId}
              onChange={(e) => setStudentForm({ ...studentForm, classId: e.target.value })}
              className="w-full h-11 px-3.5 rounded-xl border border-slate-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-100 text-sm font-medium outline-hidden bg-white"
            >
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.className}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500 mt-1">
              Setiap murid hanya memiliki satu classId aktif.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setStudentModalOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Batal
            </button>
            <button
              id="btn-save-murid"
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold shadow-xs"
            >
              {editingStudentId ? 'Simpan Perubahan' : 'Simpan Akun Murid'}
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 3: TAMBAH / EDIT KELAS */}
      {/* Form: Nama Kelas */}
      <Modal
        isOpen={classModalOpen}
        onClose={() => setClassModalOpen(false)}
        title={editingClassId ? 'Edit Nama Kelas' : 'Tambah Kelas Baru'}
        subtitle="Form: Nama Kelas (Contoh: XII-1, XII-2, XII-3, XII-4)"
        maxWidth="sm"
      >
        <form onSubmit={handleSaveClass} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Nama Kelas
            </label>
            <input
              id="kelas-name-input"
              type="text"
              required
              value={classNameInput}
              onChange={(e) => setClassNameInput(e.target.value)}
              placeholder="contoh: XII-1"
              className="w-full h-11 px-3.5 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 text-sm font-medium outline-hidden"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setClassModalOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Batal
            </button>
            <button
              id="btn-save-kelas"
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs"
            >
              {editingClassId ? 'Perbarui Kelas' : 'Simpan Kelas'}
            </button>
          </div>
        </form>
      </Modal>

      {/* DELETE CONFIRMATION MODAL */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Konfirmasi Penghapusan"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600">
            Apakah Anda yakin ingin menghapus data{' '}
            <span className="font-bold text-slate-900">{deleteConfirm?.name}</span>? Tindakan ini
            tidak dapat dibatalkan.
          </p>
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={() => setDeleteConfirm(null)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Batal
            </button>
            <button
              id="btn-confirm-delete"
              onClick={handleConfirmDelete}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs"
            >
              Ya, Hapus
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
