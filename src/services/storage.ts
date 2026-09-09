/**
 * TI SENANG - Database Abstraction Layer
 * Menjembatani penyimpanan data (Local Storage & siap untuk Firebase Firestore).
 * Skema sesuai spesifikasi:
 * - users: { id, fullName, username, role, createdAt }
 * - teachers: { id, userId }
 * - students: { id, userId, classId }
 * - classes: { id, className, createdAt }
 * - subjects: { id, name }
 * - teacherClasses: { id, teacherId, subjectId, classId }
 */

import {
  User,
  Teacher,
  Student,
  ClassRoom,
  Subject,
  TeacherClass,
  LearningMission,
  PortfolioItem,
  StudentProfileData,
  TeacherProfileData,
  Mission,
  StudentProgress,
  ExperimentSession,
  ExperimentData,
  ExperimentRow,
  AnalysisAnswers,
  MissionCoreNumber,
} from '../types';


const STORAGE_KEYS = {
  USERS: 'ti_senang_users',
  CREDENTIALS: 'ti_senang_credentials',
  TEACHERS: 'ti_senang_teachers',
  STUDENTS: 'ti_senang_students',
  CLASSES: 'ti_senang_classes',
  SUBJECTS: 'ti_senang_subjects',
  TEACHER_CLASSES: 'ti_senang_teacher_classes',
  MISSIONS: 'ti_senang_missions',
  PORTFOLIO: 'ti_senang_portfolio',
  CORE_MISSIONS: 'ti_senang_core_missions',
  STUDENT_PROGRESS: 'ti_senang_student_progress',
  EXPERIMENT_SESSIONS: 'ti_senang_experiment_sessions',
};


// Prototype default accounts
const DEFAULT_ADMIN_USER: User = {
  id: 'usr-admin-01',
  fullName: 'Administrator TI SENANG',
  username: 'inov',
  role: 'admin',
  createdAt: '2026-01-01T00:00:00Z',
};

const DEFAULT_CLASSES: ClassRoom[] = [
  { id: 'cls-xii-1', className: 'XII-1', createdAt: '2026-01-01T08:00:00Z' },
  { id: 'cls-xii-2', className: 'XII-2', createdAt: '2026-01-01T08:05:00Z' },
  { id: 'cls-xii-3', className: 'XII-3', createdAt: '2026-01-01T08:10:00Z' },
  { id: 'cls-xii-4', className: 'XII-4', createdAt: '2026-01-01T08:15:00Z' },
];

const DEFAULT_SUBJECTS: Subject[] = [
  { id: 'sbj-mat-lanjut', name: 'Matematika Tingkat Lanjut', code: 'MAT-F', category: 'Matematika' },
  { id: 'sbj-fisika', name: 'Fisika Eksperimental & Terapan', code: 'FIS-F', category: 'Fisika' },
  { id: 'sbj-kimia', name: 'Kimia Sintesis & Lingkungan', code: 'KIM-F', category: 'Kimia' },
  { id: 'sbj-biologi', name: 'Biologi Modern & Bioteknologi', code: 'BIO-F', category: 'Biologi' },
];

const INITIAL_USERS: User[] = [
  DEFAULT_ADMIN_USER,
  {
    id: 'usr-guru-01',
    fullName: 'Budi Santoso, M.Pd.',
    username: 'budi',
    role: 'guru',
    createdAt: '2026-01-05T09:00:00Z',
  },
  {
    id: 'usr-guru-02',
    fullName: 'Dr. Siti Rahmawati',
    username: 'siti',
    role: 'guru',
    createdAt: '2026-01-06T10:00:00Z',
  },
  {
    id: 'usr-mrd-01',
    fullName: 'Aisyah Azzahra',
    username: 'aisyah',
    role: 'murid',
    createdAt: '2026-01-10T08:00:00Z',
  },
  {
    id: 'usr-mrd-02',
    fullName: 'Fajar Pratama',
    username: 'fajar',
    role: 'murid',
    createdAt: '2026-01-10T08:15:00Z',
  },
  {
    id: 'usr-mrd-03',
    fullName: 'Nadia Putri',
    username: 'nadia',
    role: 'murid',
    createdAt: '2026-01-10T08:30:00Z',
  },
  {
    id: 'usr-mrd-04',
    fullName: 'Rizky Ramadhan',
    username: 'rizky',
    role: 'murid',
    createdAt: '2026-01-10T08:45:00Z',
  },
];

const INITIAL_CREDENTIALS: Record<string, string> = {
  inov: 'ttchm289', // Prototype admin credential
  budi: 'guru123',
  siti: 'guru123',
  aisyah: 'siswa123',
  fajar: 'siswa123',
  nadia: 'siswa123',
  rizky: 'siswa123',
};

const INITIAL_TEACHERS: Teacher[] = [
  { id: 'tch-01', userId: 'usr-guru-01' },
  { id: 'tch-02', userId: 'usr-guru-02' },
];

const INITIAL_STUDENTS: Student[] = [
  { id: 'std-01', userId: 'usr-mrd-01', classId: 'cls-xii-1' },
  { id: 'std-02', userId: 'usr-mrd-02', classId: 'cls-xii-1' },
  { id: 'std-03', userId: 'usr-mrd-03', classId: 'cls-xii-2' },
  { id: 'std-04', userId: 'usr-mrd-04', classId: 'cls-xii-3' },
];

const INITIAL_TEACHER_CLASSES: TeacherClass[] = [
  { id: 'tc-01', teacherId: 'tch-01', subjectId: 'sbj-fisika', classId: 'cls-xii-1' },
  { id: 'tc-02', teacherId: 'tch-01', subjectId: 'sbj-fisika', classId: 'cls-xii-2' },
];

const INITIAL_MISSIONS: LearningMission[] = [
  {
    id: 'msn-01',
    title: 'Eksplorasi Efek Fotolistrik Virtual',
    subjectName: 'Fisika Eksperimental',
    principle: 'Mindful',
    xpReward: 150,
    status: 'completed',
    description: 'Amati frekuensi ambang dan emisi elektron melalui simulasi interaktif dengan kesadaran penuh terhadap hukum kekekalan energi.',
    dueDate: '2026-09-15',
  },
  {
    id: 'msn-02',
    title: 'Analisis Transformasi Fourier pada Gelombang Suara',
    subjectName: 'Matematika Tingkat Lanjut',
    principle: 'Meaningful',
    xpReward: 200,
    status: 'active',
    description: 'Hubungkan konsep integral dan deret trigonometri untuk memahami dekomposisi nada harmonik pada alat musik tradisional.',
    dueDate: '2026-09-20',
  },
  {
    id: 'msn-03',
    title: 'Tantangan Stoikiometri Reaksi Katalitik Cepat',
    subjectName: 'Kimia Terapan',
    principle: 'Joyful',
    xpReward: 180,
    status: 'pending',
    description: 'Selesaikan puzzle kesetimbangan kimia berbasis game untuk menghasilkan rendemen reaksi optimal.',
    dueDate: '2026-09-25',
  },
];

export const CORE_MISSION_DEFINITIONS: Array<{
  coreMissionNumber: MissionCoreNumber;
  coreTitle: string;
  defaultTitle: string;
  defaultDescription: string;
  defaultSubjectId: string;
  defaultSubjectName: string;
  defaultXp: number;
}> = [
  {
    coreMissionNumber: 1,
    coreTitle: '🎯 Misi 1 — Pahami Konsep',
    defaultTitle: 'Regresi Linear & Analisis Data Sains',
    defaultDescription:
      'Pahami konsep diagram pencar (scatter plot), korelasi variabel, pemodelan garis regresi linear y = mx + c, dan prediksi kuantitatif.',
    defaultSubjectId: 'sbj-mat-lanjut',
    defaultSubjectName: 'Matematika Tingkat Lanjut',
    defaultXp: 100,
  },
  {
    coreMissionNumber: 2,
    coreTitle: '🔬 Misi 2 — Eksplorasi & Eksperimen',
    defaultTitle: 'Eksperimen Suhu dan Kalor Termal',
    defaultDescription:
      'Uji hubungan intensitas radiasi cahaya terhadap laju kenaikan suhu air melalui Virtual Lab dan pengumpulan data sensor laboratorium.',
    defaultSubjectId: 'sbj-fisika',
    defaultSubjectName: 'Fisika Eksperimental & Terapan',
    defaultXp: 150,
  },
  {
    coreMissionNumber: 3,
    coreTitle: '🎯 Misi 3 — Selesaikan Masalah Nyata',
    defaultTitle: 'Audit Efisiensi Energi Surya di Atap Sekolah',
    defaultDescription:
      'Rancang sudut kemiringan dan estimasi daya fotovoltaik untuk menyuplai energi laboratorium mandiri secara berkelanjutan.',
    defaultSubjectId: 'sbj-fisika',
    defaultSubjectName: 'Fisika Eksperimental & Terapan',
    defaultXp: 120,
  },
  {
    coreMissionNumber: 4,
    coreTitle: '🎮 Misi 4 — Permainan Edukasi',
    defaultTitle: 'Labirin Termodinamika & Gas Ideal',
    defaultDescription:
      'Selesaikan tantangan interaktif siklus termodinamika dan kesetimbangan gas ideal dalam simulasi terpandu yang menyenangkan.',
    defaultSubjectId: 'sbj-fisika',
    defaultSubjectName: 'Fisika Eksperimental & Terapan',
    defaultXp: 100,
  },
  {
    coreMissionNumber: 5,
    coreTitle: '🧠 Misi 5 — Latihan & Refleksi',
    defaultTitle: 'Studi Kasus & Refleksi Prinsip Termodinamika',
    defaultDescription:
      'Kerjakan studi analisis fenomena perpindahan kalor dan tuliskan refleksi kritis penerapan mindful science dalam keseharian.',
    defaultSubjectId: 'sbj-fisika',
    defaultSubjectName: 'Fisika Eksperimental & Terapan',
    defaultXp: 110,
  },
  {
    coreMissionNumber: 6,
    coreTitle: '✨ Misi 6 — Pengayaan / Remedial',
    defaultTitle: 'Pengayaan: Dinamika Entropi & Probabilitas Boltzmann',
    defaultDescription:
      'Pelajari pemodelan sebaran partikel gas dan formulasi entropi mikrostatik pada sistem terisolasi.',
    defaultSubjectId: 'sbj-fisika',
    defaultSubjectName: 'Fisika Eksperimental & Terapan',
    defaultXp: 130,
  },
  {
    coreMissionNumber: 7,
    coreTitle: '📊 Misi 7 — Asesmen Sumatif',
    defaultTitle: 'Asesmen Komprehensif MIPA Fase F Semester Ganjil',
    defaultDescription:
      'Evaluasi pencapaian tujuan pembelajaran mencakup pemahaman konsep, keterampilan eksperimen laboratorium, dan literasi data.',
    defaultSubjectId: 'sbj-mat-lanjut',
    defaultSubjectName: 'Matematika Tingkat Lanjut',
    defaultXp: 200,
  },
];

const generateInitialMissions = (): Mission[] => {
  const missions: Mission[] = [];
  const classes = DEFAULT_CLASSES;

  classes.forEach((cls) => {
    CORE_MISSION_DEFINITIONS.forEach((def) => {
      missions.push({
        id: `msn-${cls.id}-${def.coreMissionNumber}`,
        coreMissionNumber: def.coreMissionNumber,
        coreTitle: def.coreTitle,
        title: `${def.defaultTitle} (${cls.className})`,
        description: def.defaultDescription,
        status: 'PUBLISHED',
        subjectId: def.defaultSubjectId,
        subjectName: def.defaultSubjectName,
        classId: cls.id,
        createdByTeacherId: 'tch-01',
        createdAt: '2026-01-15T08:00:00Z',
        xpReward: def.defaultXp,
        dueDate: '2026-09-30',
      });
    });
  });

  return missions;
};

const INITIAL_CORE_MISSIONS: Mission[] = generateInitialMissions();

const INITIAL_STUDENT_PROGRESS: StudentProgress[] = [
  // Student Aisyah (std-01, class cls-xii-1)
  {
    id: 'prog-std-01-1',
    studentId: 'std-01',
    missionId: 'msn-cls-xii-1-1',
    progress: 100,
    status: 'COMPLETED',
    score: 95,
    xp: 100,
    startedAt: '2026-09-01T08:00:00Z',
    completedAt: '2026-09-02T10:30:00Z',
  },
  {
    id: 'prog-std-01-2',
    studentId: 'std-01',
    missionId: 'msn-cls-xii-1-2',
    progress: 50,
    status: 'IN PROGRESS',
    score: 0,
    xp: 0,
    startedAt: '2026-09-03T09:00:00Z',
  },
  {
    id: 'prog-std-01-3',
    studentId: 'std-01',
    missionId: 'msn-cls-xii-1-3',
    progress: 0,
    status: 'AVAILABLE',
    score: 0,
    xp: 0,
    startedAt: '2026-09-04T08:00:00Z',
  },
  {
    id: 'prog-std-01-4',
    studentId: 'std-01',
    missionId: 'msn-cls-xii-1-4',
    progress: 0,
    status: 'LOCKED',
    score: 0,
    xp: 0,
    startedAt: '2026-09-04T08:00:00Z',
  },
  {
    id: 'prog-std-01-5',
    studentId: 'std-01',
    missionId: 'msn-cls-xii-1-5',
    progress: 0,
    status: 'LOCKED',
    score: 0,
    xp: 0,
    startedAt: '2026-09-04T08:00:00Z',
  },
  {
    id: 'prog-std-01-6',
    studentId: 'std-01',
    missionId: 'msn-cls-xii-1-6',
    progress: 0,
    status: 'LOCKED',
    score: 0,
    xp: 0,
    startedAt: '2026-09-04T08:00:00Z',
  },
  {
    id: 'prog-std-01-7',
    studentId: 'std-01',
    missionId: 'msn-cls-xii-1-7',
    progress: 0,
    status: 'LOCKED',
    score: 0,
    xp: 0,
    startedAt: '2026-09-04T08:00:00Z',
  },
  // Student Fajar (std-02, class cls-xii-1)
  {
    id: 'prog-std-02-1',
    studentId: 'std-02',
    missionId: 'msn-cls-xii-1-1',
    progress: 100,
    status: 'COMPLETED',
    score: 88,
    xp: 100,
    startedAt: '2026-09-01T08:00:00Z',
    completedAt: '2026-09-02T11:00:00Z',
  },
  {
    id: 'prog-std-02-2',
    studentId: 'std-02',
    missionId: 'msn-cls-xii-1-2',
    progress: 100,
    status: 'COMPLETED',
    score: 92,
    xp: 150,
    startedAt: '2026-09-02T13:00:00Z',
    completedAt: '2026-09-03T15:00:00Z',
  },
  {
    id: 'prog-std-02-3',
    studentId: 'std-02',
    missionId: 'msn-cls-xii-1-3',
    progress: 30,
    status: 'IN PROGRESS',
    score: 0,
    xp: 0,
    startedAt: '2026-09-04T08:00:00Z',
  },
];

const INITIAL_EXPERIMENT_SESSIONS: ExperimentSession[] = [
  {
    id: 'sess-std-01-m2',
    experimentId: 'exp-sess-std-01-m2',
    studentId: 'std-01',
    missionId: 'msn-cls-xii-1-2',
    startedAt: '2026-09-03T10:00:00Z',
    completedAt: '2026-09-03T10:15:00Z',
    status: 'COMPLETED',
    source: 'SIMULATION',
    recordedAt: '2026-09-03T10:15:00Z',
    readings: [
      {
        timestamp: 1788429600000,
        port1: { temperature: 25.0 },
        port2: { humidity: 72 },
        port3: { motion: 0 },
        port4: { voltage: 5.08, current: 0.41, conductivity: 310 },
        port5: { light: 650 },
      },
      {
        timestamp: 1788429900000,
        port1: { temperature: 28.6 },
        port2: { humidity: 71 },
        port3: { motion: 1 },
        port4: { voltage: 5.10, current: 0.42, conductivity: 322 },
        port5: { light: 652 },
      },
      {
        timestamp: 1788430200000,
        port1: { temperature: 32.8 },
        port2: { humidity: 70 },
        port3: { motion: 0 },
        port4: { voltage: 5.11, current: 0.43, conductivity: 335 },
        port5: { light: 648 },
      },
      {
        timestamp: 1788430500000,
        port1: { temperature: 37.4 },
        port2: { humidity: 69 },
        port3: { motion: 1 },
        port4: { voltage: 5.09, current: 0.42, conductivity: 348 },
        port5: { light: 655 },
      },
      {
        timestamp: 1788430800000,
        port1: { temperature: 42.1 },
        port2: { humidity: 68 },
        port3: { motion: 0 },
        port4: { voltage: 5.12, current: 0.44, conductivity: 360 },
        port5: { light: 650 },
      },
    ],
    parameters: {
      intensitasCahaya: 650,
      suhuAwal: 25.0,
      volumeAir: 200,
      waktuPengamatan: 20,
    },
    rows: [
      { waktu: 0, suhuAwal: 25.0, intensitasCahaya: 650, suhuAkhir: 25.0, kelembaban: 72, tegangan: 5.08, arus: 0.41, gerak: 0 },
      { waktu: 5, suhuAwal: 25.0, intensitasCahaya: 650, suhuAkhir: 28.6, kelembaban: 71, tegangan: 5.10, arus: 0.42, gerak: 1 },
      { waktu: 10, suhuAwal: 25.0, intensitasCahaya: 650, suhuAkhir: 32.8, kelembaban: 70, tegangan: 5.11, arus: 0.43, gerak: 0 },
      { waktu: 15, suhuAwal: 25.0, intensitasCahaya: 650, suhuAkhir: 37.4, kelembaban: 69, tegangan: 5.09, arus: 0.42, gerak: 1 },
      { waktu: 20, suhuAwal: 25.0, intensitasCahaya: 650, suhuAkhir: 42.1, kelembaban: 68, tegangan: 5.12, arus: 0.44, gerak: 0 },
    ],
  },
];

const INITIAL_PORTFOLIO: PortfolioItem[] = [
  {
    id: 'pf-01',
    studentId: 'std-01',
    studentName: 'Aisyah Azzahra',
    classId: 'cls-xii-1',
    className: 'XII-1',
    title: 'Analisis Model Regresi Laju Pemanasan Air Radiatif',
    subjectName: 'Fisika Eksperimental & Terapan',
    subjectId: 'sbj-fisika',
    missionId: 'msn-cls-xii-1-2',
    date: '2026-09-03',
    category: 'Eksperimen',
    xpEarned: 150,
    visibility: 'CLASS',
    reflectionSummary:
      'Menghubungkan hukum pemanasan radiasi dengan persamaan linear kenaikan suhu per 5 menit.',
    conclusion:
      'Kenaikan suhu berbanding lurus dengan durasi pemanasan pada intensitas konstan 650 Lux.',
    analysisAnswers: {
      q1_amat: 'Suhu air meningkat bertahap dari 25°C hingga mencapai 42.1°C pada menit ke-20.',
      q2_pola: 'Kenaikan suhu menunjukkan tren linear positif stabil dengan kemiringan sekitar 0.85°C per menit.',
      q3_sebabSuhu: 'Energi foton dari radiasi cahaya diserap oleh molekul air dan diubah menjadi energi kinetik termal.',
      q4_hubunganVariabel: 'Semakin lama waktu radiasi dengan intensitas konstan, semakin besar kalor yang diserap oleh massa air.',
    },
    experimentData: {
      experimentId: 'exp-01',
      studentId: 'std-01',
      missionId: 'msn-cls-xii-1-2',
      inputMode: 'SIMULATION',
      rows: [
        { waktu: 0, suhuAwal: 25.0, intensitasCahaya: 650, suhuAkhir: 25.0 },
        { waktu: 5, suhuAwal: 25.0, intensitasCahaya: 650, suhuAkhir: 28.6 },
        { waktu: 10, suhuAwal: 25.0, intensitasCahaya: 650, suhuAkhir: 32.8 },
        { waktu: 15, suhuAwal: 25.0, intensitasCahaya: 650, suhuAkhir: 37.4 },
        { waktu: 20, suhuAwal: 25.0, intensitasCahaya: 650, suhuAkhir: 42.1 },
      ],
    },
  },
  {
    id: 'pf-02',
    studentId: 'std-02',
    studentName: 'Fajar Pratama',
    classId: 'cls-xii-1',
    className: 'XII-1',
    title: 'Eksperimen Suhu & Pengaruh Luas Penampang Bejana',
    subjectName: 'Fisika Eksperimental & Terapan',
    subjectId: 'sbj-fisika',
    missionId: 'msn-cls-xii-1-2',
    date: '2026-09-02',
    category: 'Eksperimen',
    xpEarned: 150,
    visibility: 'CLASS',
    reflectionSummary:
      'Mengamati pengaruh intensitas radiasi 700 Lux dan efisiensi transfer panas pada gelas kimia 200 mL.',
    conclusion:
      'Penyerapan kalor berlangsung efektif pada 15 menit awal sebelum laju pelepasan kalor ke lingkungan meningkat.',
    analysisAnswers: {
      q1_amat: 'Air mengalami kenaikan suhu signifikan saat disinari lampu halogen.',
      q2_pola: 'Grafik suhu terhadap waktu membentuk kurva linear naik.',
      q3_sebabSuhu: 'Energi radiasi terserap sempurna oleh partikel zat cair.',
      q4_hubunganVariabel: 'Hubungan waktu dan perubahan temperatur berbanding lurus.',
    },
  },
  {
    id: 'pf-03',
    studentId: 'std-03',
    studentName: 'Nadia Putri',
    classId: 'cls-xii-2',
    className: 'XII-2',
    title: 'Pemodelan Kalor Laten Peleburan Es Mandiri',
    subjectName: 'Fisika Eksperimental & Terapan',
    subjectId: 'sbj-fisika',
    date: '2026-09-04',
    category: 'Eksperimen',
    xpEarned: 130,
    visibility: 'CLASS', // In XII-2, so students in XII-1 will not see it in class feed
    reflectionSummary: 'Menganalisis anomali air dan kapasitas kalor spesifik pada rentang 0-10°C.',
  },
  {
    id: 'pf-04',
    studentId: 'std-01',
    studentName: 'Aisyah Azzahra',
    classId: 'cls-xii-1',
    className: 'XII-1',
    title: 'Catatan Refleksi Mandiri: Filosofi Entropi dan Kehidupan',
    subjectName: 'Fisika Eksperimental & Terapan',
    date: '2026-09-05',
    category: 'Refleksi',
    xpEarned: 100,
    visibility: 'PRIVATE', // Private, only Aisyah sees it
    reflectionSummary:
      'Refleksi pribadi mengenai hukum kedua termodinamika dan usaha menjaga ketertiban pikiran.',
  },
];


// Helper to safely access and initialize storage
class StorageService {
  private getItem<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(key);
      if (!data) {
        this.setItem(key, defaultValue);
        return defaultValue;
      }
      return JSON.parse(data) as T;
    } catch {
      return defaultValue;
    }
  }

  private setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error saving ${key} to localStorage:`, e);
    }
  }

  // Initialize seed data if not present
  public initialize(): void {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      this.setItem(STORAGE_KEYS.USERS, INITIAL_USERS);
      this.setItem(STORAGE_KEYS.CREDENTIALS, INITIAL_CREDENTIALS);
      this.setItem(STORAGE_KEYS.TEACHERS, INITIAL_TEACHERS);
      this.setItem(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS);
      this.setItem(STORAGE_KEYS.CLASSES, DEFAULT_CLASSES);
      this.setItem(STORAGE_KEYS.SUBJECTS, DEFAULT_SUBJECTS);
      this.setItem(STORAGE_KEYS.TEACHER_CLASSES, INITIAL_TEACHER_CLASSES);
      this.setItem(STORAGE_KEYS.MISSIONS, INITIAL_MISSIONS);
      this.setItem(STORAGE_KEYS.PORTFOLIO, INITIAL_PORTFOLIO);
    }

    if (!localStorage.getItem(STORAGE_KEYS.CORE_MISSIONS)) {
      this.setItem(STORAGE_KEYS.CORE_MISSIONS, INITIAL_CORE_MISSIONS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.STUDENT_PROGRESS)) {
      this.setItem(STORAGE_KEYS.STUDENT_PROGRESS, INITIAL_STUDENT_PROGRESS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.EXPERIMENT_SESSIONS)) {
      this.setItem(STORAGE_KEYS.EXPERIMENT_SESSIONS, INITIAL_EXPERIMENT_SESSIONS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.PORTFOLIO)) {
      this.setItem(STORAGE_KEYS.PORTFOLIO, INITIAL_PORTFOLIO);
    }
  }

  public resetToDefaults(): void {
    this.setItem(STORAGE_KEYS.USERS, INITIAL_USERS);
    this.setItem(STORAGE_KEYS.CREDENTIALS, INITIAL_CREDENTIALS);
    this.setItem(STORAGE_KEYS.TEACHERS, INITIAL_TEACHERS);
    this.setItem(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS);
    this.setItem(STORAGE_KEYS.CLASSES, DEFAULT_CLASSES);
    this.setItem(STORAGE_KEYS.SUBJECTS, DEFAULT_SUBJECTS);
    this.setItem(STORAGE_KEYS.TEACHER_CLASSES, INITIAL_TEACHER_CLASSES);
    this.setItem(STORAGE_KEYS.MISSIONS, INITIAL_MISSIONS);
    this.setItem(STORAGE_KEYS.CORE_MISSIONS, INITIAL_CORE_MISSIONS);
    this.setItem(STORAGE_KEYS.STUDENT_PROGRESS, INITIAL_STUDENT_PROGRESS);
    this.setItem(STORAGE_KEYS.EXPERIMENT_SESSIONS, INITIAL_EXPERIMENT_SESSIONS);
    this.setItem(STORAGE_KEYS.PORTFOLIO, INITIAL_PORTFOLIO);
  }


  // AUTHENTICATION
  public authenticate(username: string, password: string): User | null {
    const cleanUsername = username.trim().toLowerCase();
    const users = this.getUsers();
    const credentials = this.getItem<Record<string, string>>(STORAGE_KEYS.CREDENTIALS, INITIAL_CREDENTIALS);

    const user = users.find((u) => u.username.toLowerCase() === cleanUsername);
    if (!user) return null;

    const storedPass = credentials[cleanUsername];
    if (storedPass && storedPass === password) {
      return user;
    }

    return null;
  }

  // USERS
  public getUsers(): User[] {
    return this.getItem<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
  }

  public getUserById(id: string): User | undefined {
    return this.getUsers().find((u) => u.id === id);
  }

  // CLASSES (Admin Only CRUD)
  public getClasses(): ClassRoom[] {
    const list = this.getItem<ClassRoom[]>(STORAGE_KEYS.CLASSES, DEFAULT_CLASSES);
    return list.sort((a, b) => a.className.localeCompare(b.className));
  }

  public addClass(className: string): ClassRoom {
    const classes = this.getClasses();
    const trimmed = className.trim();
    const existing = classes.find((c) => c.className.toLowerCase() === trimmed.toLowerCase());
    if (existing) {
      throw new Error(`Kelas dengan nama "${trimmed}" sudah terdaftar.`);
    }

    const newClass: ClassRoom = {
      id: `cls-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      className: trimmed,
      createdAt: new Date().toISOString(),
    };

    classes.push(newClass);
    this.setItem(STORAGE_KEYS.CLASSES, classes);
    return newClass;
  }

  public updateClass(id: string, className: string): ClassRoom {
    const classes = this.getClasses();
    const index = classes.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error('Kelas tidak ditemukan.');
    }

    const trimmed = className.trim();
    const duplicate = classes.find(
      (c) => c.id !== id && c.className.toLowerCase() === trimmed.toLowerCase(),
    );
    if (duplicate) {
      throw new Error(`Nama kelas "${trimmed}" sudah digunakan oleh kelas lain.`);
    }

    classes[index] = {
      ...classes[index],
      className: trimmed,
    };

    this.setItem(STORAGE_KEYS.CLASSES, classes);
    return classes[index];
  }

  public deleteClass(id: string): void {
    // Check if students are currently enrolled in this class
    const students = this.getStudents();
    const enrolledStudents = students.filter((s) => s.student.classId === id);
    if (enrolledStudents.length > 0) {
      throw new Error(
        `Tidak dapat menghapus kelas ini karena masih ada ${enrolledStudents.length} murid terdaftar. Pindahkan atau hapus akun murid terlebih dahulu.`,
      );
    }

    const classes = this.getClasses().filter((c) => c.id !== id);
    this.setItem(STORAGE_KEYS.CLASSES, classes);

    // Also remove teacherClasses mappings for this class
    const tc = this.getTeacherClassesRaw().filter((item) => item.classId !== id);
    this.setItem(STORAGE_KEYS.TEACHER_CLASSES, tc);
  }

  // TEACHERS (Admin Only CRUD)
  // Form: Nama Lengkap, Username, Password
  // Admin DOES NOT assign subjects or classes here!
  public getTeachers(): Array<{ user: User; teacher: Teacher }> {
    const users = this.getUsers().filter((u) => u.role === 'guru');
    const teachers = this.getItem<Teacher[]>(STORAGE_KEYS.TEACHERS, INITIAL_TEACHERS);

    return users.map((u) => {
      let t = teachers.find((tech) => tech.userId === u.id);
      if (!t) {
        t = { id: `tch-${u.id}`, userId: u.id };
      }
      return { user: u, teacher: t };
    });
  }

  public addTeacher(fullName: string, username: string, password: string): { user: User; teacher: Teacher } {
    const users = this.getUsers();
    const cleanUsername = username.trim().toLowerCase();

    if (users.some((u) => u.username.toLowerCase() === cleanUsername)) {
      throw new Error(`Username "${cleanUsername}" sudah digunakan.`);
    }

    const newUserId = `usr-guru-${Date.now()}`;
    const newUser: User = {
      id: newUserId,
      fullName: fullName.trim(),
      username: cleanUsername,
      role: 'guru',
      createdAt: new Date().toISOString(),
    };

    const newTeacher: Teacher = {
      id: `tch-${Date.now()}`,
      userId: newUserId,
    };

    // Save user & credentials
    users.push(newUser);
    this.setItem(STORAGE_KEYS.USERS, users);

    const credentials = this.getItem<Record<string, string>>(STORAGE_KEYS.CREDENTIALS, INITIAL_CREDENTIALS);
    credentials[cleanUsername] = password;
    this.setItem(STORAGE_KEYS.CREDENTIALS, credentials);

    const teachers = this.getItem<Teacher[]>(STORAGE_KEYS.TEACHERS, INITIAL_TEACHERS);
    teachers.push(newTeacher);
    this.setItem(STORAGE_KEYS.TEACHERS, teachers);

    return { user: newUser, teacher: newTeacher };
  }

  public updateTeacher(
    userId: string,
    fullName: string,
    username: string,
    newPassword?: string,
  ): { user: User; teacher: Teacher } {
    const users = this.getUsers();
    const userIndex = users.findIndex((u) => u.id === userId && u.role === 'guru');
    if (userIndex === -1) {
      throw new Error('Akun guru tidak ditemukan.');
    }

    const cleanUsername = username.trim().toLowerCase();
    const duplicate = users.find(
      (u) => u.id !== userId && u.username.toLowerCase() === cleanUsername,
    );
    if (duplicate) {
      throw new Error(`Username "${cleanUsername}" sudah digunakan pengguna lain.`);
    }

    const oldUsername = users[userIndex].username.toLowerCase();
    users[userIndex] = {
      ...users[userIndex],
      fullName: fullName.trim(),
      username: cleanUsername,
    };
    this.setItem(STORAGE_KEYS.USERS, users);

    const credentials = this.getItem<Record<string, string>>(STORAGE_KEYS.CREDENTIALS, INITIAL_CREDENTIALS);
    if (cleanUsername !== oldUsername) {
      const oldPass = credentials[oldUsername] || 'guru123';
      delete credentials[oldUsername];
      credentials[cleanUsername] = newPassword && newPassword.trim() ? newPassword.trim() : oldPass;
    } else if (newPassword && newPassword.trim()) {
      credentials[cleanUsername] = newPassword.trim();
    }
    this.setItem(STORAGE_KEYS.CREDENTIALS, credentials);

    const teacher = this.getTeacherByUserId(userId) || { id: `tch-${userId}`, userId };
    return { user: users[userIndex], teacher };
  }

  public deleteTeacher(userId: string): void {
    const users = this.getUsers().filter((u) => u.id !== userId);
    this.setItem(STORAGE_KEYS.USERS, users);

    const teacher = this.getTeacherByUserId(userId);
    if (teacher) {
      const teachers = this.getItem<Teacher[]>(STORAGE_KEYS.TEACHERS, INITIAL_TEACHERS).filter(
        (t) => t.id !== teacher.id,
      );
      this.setItem(STORAGE_KEYS.TEACHERS, teachers);

      // Clean up teacher assignments
      const tcs = this.getTeacherClassesRaw().filter((item) => item.teacherId !== teacher.id);
      this.setItem(STORAGE_KEYS.TEACHER_CLASSES, tcs);
    }
  }

  public getTeacherByUserId(userId: string): Teacher | undefined {
    const teachers = this.getItem<Teacher[]>(STORAGE_KEYS.TEACHERS, INITIAL_TEACHERS);
    return teachers.find((t) => t.userId === userId);
  }

  // STUDENTS (Admin Only CRUD)
  // Form: Nama Lengkap, Username, Password, Dropdown Kelas (classId)
  public getStudents(): Array<{ user: User; student: Student; className: string }> {
    const users = this.getUsers().filter((u) => u.role === 'murid');
    const students = this.getItem<Student[]>(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS);
    const classes = this.getClasses();

    return users.map((u) => {
      let s = students.find((std) => std.userId === u.id);
      if (!s) {
        s = { id: `std-${u.id}`, userId: u.id, classId: classes[0]?.id || '' };
      }
      const c = classes.find((cls) => cls.id === s?.classId);
      return {
        user: u,
        student: s,
        className: c ? c.className : 'Tanpa Kelas',
      };
    });
  }

  public addStudent(
    fullName: string,
    username: string,
    password: string,
    classId: string,
  ): { user: User; student: Student } {
    const users = this.getUsers();
    const cleanUsername = username.trim().toLowerCase();

    if (users.some((u) => u.username.toLowerCase() === cleanUsername)) {
      throw new Error(`Username "${cleanUsername}" sudah digunakan.`);
    }

    const classes = this.getClasses();
    if (!classes.some((c) => c.id === classId)) {
      throw new Error('Kelas yang dipilih tidak valid.');
    }

    const newUserId = `usr-mrd-${Date.now()}`;
    const newUser: User = {
      id: newUserId,
      fullName: fullName.trim(),
      username: cleanUsername,
      role: 'murid',
      createdAt: new Date().toISOString(),
    };

    const newStudent: Student = {
      id: `std-${Date.now()}`,
      userId: newUserId,
      classId,
    };

    users.push(newUser);
    this.setItem(STORAGE_KEYS.USERS, users);

    const credentials = this.getItem<Record<string, string>>(STORAGE_KEYS.CREDENTIALS, INITIAL_CREDENTIALS);
    credentials[cleanUsername] = password;
    this.setItem(STORAGE_KEYS.CREDENTIALS, credentials);

    const students = this.getItem<Student[]>(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS);
    students.push(newStudent);
    this.setItem(STORAGE_KEYS.STUDENTS, students);

    return { user: newUser, student: newStudent };
  }

  public updateStudent(
    userId: string,
    fullName: string,
    username: string,
    classId: string,
    newPassword?: string,
  ): { user: User; student: Student } {
    const users = this.getUsers();
    const userIndex = users.findIndex((u) => u.id === userId && u.role === 'murid');
    if (userIndex === -1) {
      throw new Error('Akun murid tidak ditemukan.');
    }

    const cleanUsername = username.trim().toLowerCase();
    const duplicate = users.find(
      (u) => u.id !== userId && u.username.toLowerCase() === cleanUsername,
    );
    if (duplicate) {
      throw new Error(`Username "${cleanUsername}" sudah digunakan pengguna lain.`);
    }

    const oldUsername = users[userIndex].username.toLowerCase();
    users[userIndex] = {
      ...users[userIndex],
      fullName: fullName.trim(),
      username: cleanUsername,
    };
    this.setItem(STORAGE_KEYS.USERS, users);

    const credentials = this.getItem<Record<string, string>>(STORAGE_KEYS.CREDENTIALS, INITIAL_CREDENTIALS);
    if (cleanUsername !== oldUsername) {
      const oldPass = credentials[oldUsername] || 'siswa123';
      delete credentials[oldUsername];
      credentials[cleanUsername] = newPassword && newPassword.trim() ? newPassword.trim() : oldPass;
    } else if (newPassword && newPassword.trim()) {
      credentials[cleanUsername] = newPassword.trim();
    }
    this.setItem(STORAGE_KEYS.CREDENTIALS, credentials);

    const students = this.getItem<Student[]>(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS);
    const studentIndex = students.findIndex((s) => s.userId === userId);
    if (studentIndex !== -1) {
      students[studentIndex] = {
        ...students[studentIndex],
        classId,
      };
      this.setItem(STORAGE_KEYS.STUDENTS, students);
      return { user: users[userIndex], student: students[studentIndex] };
    } else {
      const newStd: Student = { id: `std-${userId}`, userId, classId };
      students.push(newStd);
      this.setItem(STORAGE_KEYS.STUDENTS, students);
      return { user: users[userIndex], student: newStd };
    }
  }

  public deleteStudent(userId: string): void {
    const users = this.getUsers().filter((u) => u.id !== userId);
    this.setItem(STORAGE_KEYS.USERS, users);

    const students = this.getItem<Student[]>(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS).filter(
      (s) => s.userId !== userId,
    );
    this.setItem(STORAGE_KEYS.STUDENTS, students);
  }

  public getStudentByUserId(userId: string): Student | undefined {
    const students = this.getItem<Student[]>(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS);
    return students.find((s) => s.userId === userId);
  }

  // SUBJECTS & TEACHER ASSIGNMENTS (Guru selects subject & classes)
  public getSubjects(): Subject[] {
    return this.getItem<Subject[]>(STORAGE_KEYS.SUBJECTS, DEFAULT_SUBJECTS);
  }

  public getTeacherClassesRaw(): TeacherClass[] {
    return this.getItem<TeacherClass[]>(STORAGE_KEYS.TEACHER_CLASSES, INITIAL_TEACHER_CLASSES);
  }

  public getTeacherClasses(teacherId: string): TeacherClass[] {
    return this.getTeacherClassesRaw().filter((tc) => tc.teacherId === teacherId);
  }

  /**
   * Guru saves chosen subject and checked classes.
   * Format: teacherId, subjectId, classId.
   */
  public saveTeacherAssignments(
    teacherId: string,
    subjectId: string,
    selectedClassIds: string[],
  ): TeacherClass[] {
    const all = this.getTeacherClassesRaw();
    // Remove existing assignments for this teacher + subject
    const filtered = all.filter(
      (tc) => !(tc.teacherId === teacherId && tc.subjectId === subjectId),
    );

    const newAssignments: TeacherClass[] = selectedClassIds.map((cid) => ({
      id: `tc-${teacherId}-${subjectId}-${cid}`,
      teacherId,
      subjectId,
      classId: cid,
    }));

    const updated = [...filtered, ...newAssignments];
    this.setItem(STORAGE_KEYS.TEACHER_CLASSES, updated);
    return newAssignments;
  }

  /**
   * Guru views students automatically based on the chosen classes.
   * No manual student typing!
   */
  public getStudentsByClassIds(classIds: string[]): Array<{
    user: User;
    student: Student;
    className: string;
  }> {
    const allStudents = this.getStudents();
    return allStudents.filter((item) => classIds.includes(item.student.classId));
  }

  /**
   * Mengambil daftar murid otomatis berdasarkan classId tertentu.
   * Guru TIDAK mengetik nama murid secara manual!
   */
  public getStudentsByClass(classId: string): Student[] {
    const allStudents = this.getStudents();
    return allStudents
      .filter((item) => item.student.classId === classId)
      .map((item, idx) => ({
        ...item.student,
        name: item.user.fullName,
        email: `${item.user.username}@sma.sch.id`,
        nisn: `00${782190 + idx * 13}`,
      }));
  }

  // GURU PROFILE DATA
  public getTeacherProfile(userId: string): TeacherProfileData | null {
    const user = this.getUserById(userId);
    if (!user || user.role !== 'guru') return null;

    let teacher = this.getTeacherByUserId(userId);
    if (!teacher) {
      teacher = { id: `tch-${userId}`, userId, nip: '198402142008012003' };
    }

    const assignedTeacherClasses = this.getTeacherClasses(teacher.id);
    const allClasses = this.getClasses();
    const allSubjects = this.getSubjects();

    const assignedClassIds = assignedTeacherClasses.map((tc) => tc.classId);
    const classes = allClasses.filter((c) => assignedClassIds.includes(c.id));
    const effectiveClasses = classes.length > 0 ? classes : allClasses.slice(0, 2);

    const assignedSubjectIds = assignedTeacherClasses.map((tc) => tc.subjectId);
    const subjects = allSubjects.filter((s) => assignedSubjectIds.includes(s.id));
    const effectiveSubjects = subjects.length > 0 ? subjects : allSubjects.slice(0, 1);

    return {
      user,
      teacher: {
        ...teacher,
        name: user.fullName,
        nip: teacher.nip || '198402142008012003',
      },
      subjects: effectiveSubjects,
      classes: effectiveClasses,
      assignedTeacherClasses,
    };
  }

  // MURID PROFILE DATA
  public getStudentProfile(userId: string): StudentProfileData | null {
    const user = this.getUserById(userId);
    if (!user || user.role !== 'murid') return null;

    let student = this.getStudentByUserId(userId);
    if (!student) {
      const classes = this.getClasses();
      student = { id: `std-${userId}`, userId, classId: classes[0]?.id || '' };
    }

    const classes = this.getClasses();
    const classObj = classes.find((c) => c.id === student?.classId);
    const className = classObj ? classObj.className : 'XII-1';

    const allMissions = this.getItem<LearningMission[]>(STORAGE_KEYS.MISSIONS, INITIAL_MISSIONS);
    const allPortfolio = this.getStudentPortfolios(student.id);
    const progressList = this.getAllStudentProgress(student.id);

    // Calculate real XP from completed progress + portfolio
    const completedProgress = progressList.filter((p) => p.status === 'COMPLETED');
    const missionXp = completedProgress.reduce((sum, p) => sum + (p.xp || 100), 0);
    const portfolioXp = allPortfolio.reduce((sum, p) => sum + p.xpEarned, 0);
    const totalXp = missionXp + portfolioXp + 450; // starting base XP for high school MIPA achievements

    return {
      user,
      student,
      className,
      xp: totalXp,
      level: Math.floor(totalXp / 300) + 1,
      completedMissionsCount: completedProgress.length,
      streakDays: 7,
      missions: allMissions,
      portfolio: allPortfolio,
    };
  }

  // ==========================================
  // SISTEM MISI (TEACHER & STUDENT)
  // ==========================================

  public getAllMissions(): Mission[] {
    return this.getItem<Mission[]>(STORAGE_KEYS.CORE_MISSIONS, INITIAL_CORE_MISSIONS);
  }

  /**
   * Misi hanya diterima murid dari classId yang dipilih!
   * Murid hanya menerima misi berstatus PUBLISHED.
   */
  public getMissionsByClass(classId: string): Mission[] {
    const all = this.getAllMissions();
    return all
      .filter((m) => m.classId === classId && m.status === 'PUBLISHED')
      .sort((a, b) => a.coreMissionNumber - b.coreMissionNumber);
  }

  /**
   * Guru melihat misi yang dia buat atau yang ditugaskan ke kelas yang dia ajar.
   */
  public getTeacherMissions(teacherId: string, filterClassId?: string): Mission[] {
    const all = this.getAllMissions();
    return all.filter((m) => {
      const matchTeacher = m.createdByTeacherId === teacherId;
      if (filterClassId) {
        return matchTeacher && m.classId === filterClassId;
      }
      return matchTeacher;
    });
  }

  public createMission(data: Omit<Mission, 'id' | 'createdAt'>): Mission {
    const all = this.getAllMissions();
    const newMission: Mission = {
      ...data,
      id: `msn-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    all.push(newMission);
    this.setItem(STORAGE_KEYS.CORE_MISSIONS, all);
    return newMission;
  }

  public updateMission(id: string, updates: Partial<Mission>): Mission {
    const all = this.getAllMissions();
    const index = all.findIndex((m) => m.id === id);
    if (index === -1) throw new Error('Misi tidak ditemukan');

    all[index] = { ...all[index], ...updates };
    this.setItem(STORAGE_KEYS.CORE_MISSIONS, all);
    return all[index];
  }

  public deleteMission(id: string): void {
    const all = this.getAllMissions().filter((m) => m.id !== id);
    this.setItem(STORAGE_KEYS.CORE_MISSIONS, all);
  }

  public togglePublishMission(id: string): Mission {
    const all = this.getAllMissions();
    const index = all.findIndex((m) => m.id === id);
    if (index === -1) throw new Error('Misi tidak ditemukan');

    all[index].status = all[index].status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    this.setItem(STORAGE_KEYS.CORE_MISSIONS, all);
    return all[index];
  }

  // ==========================================
  // PROGRESS BELAJAR (STUDENT PROGRESS)
  // ==========================================

  public getAllStudentProgress(studentId: string): StudentProgress[] {
    const all = this.getItem<StudentProgress[]>(
      STORAGE_KEYS.STUDENT_PROGRESS,
      INITIAL_STUDENT_PROGRESS,
    );
    return all.filter((p) => p.studentId === studentId);
  }

  public getStudentProgress(studentId: string, missionId: string): StudentProgress | undefined {
    const all = this.getAllStudentProgress(studentId);
    return all.find((p) => p.missionId === missionId);
  }

  public setStudentProgress(progress: StudentProgress): void {
    const all = this.getItem<StudentProgress[]>(
      STORAGE_KEYS.STUDENT_PROGRESS,
      INITIAL_STUDENT_PROGRESS,
    );
    const index = all.findIndex((p) => p.id === progress.id);
    if (index !== -1) {
      all[index] = progress;
    } else {
      all.push(progress);
    }
    this.setItem(STORAGE_KEYS.STUDENT_PROGRESS, all);
  }

  /**
   * Ketika murid menyelesaikan misi:
   * progress = 100, status = COMPLETED, xp += 100, data tersimpan.
   * Secara otomatis membuka misi berikutnya jika statusnya LOCKED.
   */
  public completeMission(
    studentId: string,
    missionId: string,
    score: number = 100,
    xpReward: number = 100,
  ): StudentProgress {
    const all = this.getItem<StudentProgress[]>(
      STORAGE_KEYS.STUDENT_PROGRESS,
      INITIAL_STUDENT_PROGRESS,
    );
    let current = all.find((p) => p.studentId === studentId && p.missionId === missionId);

    const now = new Date().toISOString();

    if (current) {
      current.progress = 100;
      current.status = 'COMPLETED';
      current.score = score;
      current.xp = xpReward;
      current.completedAt = now;
    } else {
      current = {
        id: `prog-${studentId}-${missionId}`,
        studentId,
        missionId,
        progress: 100,
        status: 'COMPLETED',
        score,
        xp: xpReward,
        startedAt: now,
        completedAt: now,
      };
      all.push(current);
    }

    // Unlock next core mission if available
    const missions = this.getAllMissions();
    const completedMission = missions.find((m) => m.id === missionId);
    if (completedMission && completedMission.coreMissionNumber < 7) {
      const nextCoreNum = (completedMission.coreMissionNumber + 1) as MissionCoreNumber;
      const nextMission = missions.find(
        (m) => m.classId === completedMission.classId && m.coreMissionNumber === nextCoreNum,
      );
      if (nextMission) {
        let nextProg = all.find(
          (p) => p.studentId === studentId && p.missionId === nextMission.id,
        );
        if (!nextProg) {
          nextProg = {
            id: `prog-${studentId}-${nextMission.id}`,
            studentId,
            missionId: nextMission.id,
            progress: 0,
            status: 'AVAILABLE',
            score: 0,
            xp: 0,
            startedAt: now,
          };
          all.push(nextProg);
        } else if (nextProg.status === 'LOCKED') {
          nextProg.status = 'AVAILABLE';
        }
      }
    }

    this.setItem(STORAGE_KEYS.STUDENT_PROGRESS, all);
    return current;
  }

  // ==========================================
  // EXPERIMENT SESSIONS (VIRTUAL LAB SENSOR)
  // ==========================================

  public getStudentExperimentSession(
    studentId: string,
    missionId: string,
  ): ExperimentSession | undefined {
    const sessions = this.getItem<ExperimentSession[]>(
      STORAGE_KEYS.EXPERIMENT_SESSIONS,
      INITIAL_EXPERIMENT_SESSIONS,
    );
    return sessions.find(
      (s) =>
        s.studentId === studentId &&
        s.missionId === missionId &&
        s.status === 'COMPLETED' &&
        s.source === 'SIMULATION',
    );
  }

  public saveExperimentSession(session: ExperimentSession): void {
    const sessions = this.getItem<ExperimentSession[]>(
      STORAGE_KEYS.EXPERIMENT_SESSIONS,
      INITIAL_EXPERIMENT_SESSIONS,
    );
    const index = sessions.findIndex(
      (s) => s.studentId === session.studentId && s.missionId === session.missionId,
    );
    if (index !== -1) {
      sessions[index] = session;
    } else {
      sessions.push(session);
    }
    this.setItem(STORAGE_KEYS.EXPERIMENT_SESSIONS, sessions);
  }

  // ==========================================
  // PORTOFOLIO PEMBELAJARAN
  // ==========================================

  public getAllPortfolios(): PortfolioItem[] {
    return this.getItem<PortfolioItem[]>(STORAGE_KEYS.PORTFOLIO, INITIAL_PORTFOLIO);
  }

  public getStudentPortfolios(studentId: string): PortfolioItem[] {
    const all = this.getAllPortfolios();
    return all.filter((p) => p.studentId === studentId);
  }

  /**
   * Murid hanya melihat portofolio teman sekelas (classId sama) yang status visibilitasnya CLASS
   */
  public getClassPortfolios(classId: string): PortfolioItem[] {
    const all = this.getAllPortfolios();
    return all.filter((p) => p.classId === classId && p.visibility === 'CLASS');
  }

  /**
   * Guru dapat melihat portofolio murid pada kelas yang diajar
   */
  public getTeacherStudentPortfolios(classIds: string[]): PortfolioItem[] {
    const all = this.getAllPortfolios();
    return all.filter((p) => p.classId && classIds.includes(p.classId));
  }

  public savePortfolio(item: PortfolioItem): void {
    const all = this.getAllPortfolios();
    const index = all.findIndex((p) => p.id === item.id);
    if (index !== -1) {
      all[index] = item;
    } else {
      all.unshift(item);
    }
    this.setItem(STORAGE_KEYS.PORTFOLIO, all);
  }

  public deletePortfolio(id: string): void {
    const all = this.getAllPortfolios().filter((p) => p.id !== id);
    this.setItem(STORAGE_KEYS.PORTFOLIO, all);
  }
}


export const storage = new StorageService();
// Auto-initialize on import
storage.initialize();
