/**
 * TI SENANG - Type Definitions
 * Teknologi Inovatif untuk Sistem Pembelajaran Adaptif dan Menggembirakan
 * MIPA Fase F (Mindful, Meaningful, Joyful)
 */

export type UserRole = 'admin' | 'guru' | 'murid';

export interface User {
  id: string;
  fullName: string;
  name?: string;
  username: string;
  role: UserRole;
  createdAt: string;
}

export interface Teacher {
  id: string;
  userId: string;
  nip?: string;
  name?: string;
}

export interface Student {
  id: string;
  userId: string;
  classId: string;
  name?: string;
  email?: string;
  nisn?: string;
}

export interface ClassRoom {
  id: string;
  className: string;
  createdAt: string;
  academicYear?: string;
}

export interface Subject {
  id: string;
  name: string;
  category?: 'Matematika' | 'Fisika' | 'Kimia' | 'Biologi' | 'Lainnya';
  code: string;
}

export interface TeacherClass {
  id: string;
  teacherId: string;
  subjectId: string;
  classId: string;
}

export interface LearningMission {
  id: string;
  title: string;
  subjectName: string;
  principle: 'Mindful' | 'Meaningful' | 'Joyful';
  xpReward: number;
  status: 'active' | 'completed' | 'pending';
  description: string;
  dueDate: string;
}

export type MissionCoreNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type MissionStatus = 'DRAFT' | 'PUBLISHED';

export interface Mission {
  id: string;
  coreMissionNumber: MissionCoreNumber;
  coreTitle: string; // e.g. "🎯 Misi 1 — Pahami Konsep"
  title: string;
  description: string;
  status: MissionStatus;
  subjectId: string;
  subjectName: string;
  classId: string; // Targets specific class!
  className?: string;
  createdByTeacherId?: string;
  createdAt?: string;
  xpReward: number;
  dueDate?: string;
  isAlmeSideMission?: boolean;
}

export type MissionJourneyStatus = 'LOCKED' | 'AVAILABLE' | 'IN PROGRESS' | 'COMPLETED';

export interface StudentProgress {
  id: string;
  studentId: string;
  missionId: string;
  progress: number; // 0 to 100
  status: MissionJourneyStatus;
  score: number;
  xp: number;
  startedAt: string;
  completedAt?: string;
}

export interface SensorReading {
  timestamp: number;
  port1: {
    temperature: number; // 🌡 Sensor Suhu Probe (°C)
  };
  port2: {
    humidity: number; // 💧 Sensor Kelembaban (%)
  };
  port3: {
    motion: number; // 🚶 Sensor Gerak (0 atau 1)
  };
  port4: {
    voltage: number; // ⚡ Tegangan (V)
    current: number; // ⚡ Arus (A)
    conductivity: number; // ⚡ Konduktivitas (µS/cm)
  };
  port5: {
    light: number; // 💡 Sensor Cahaya (lux)
  };
}

export interface ExperimentRow {
  waktu: number; // detik atau menit
  suhuAwal: number;
  intensitasCahaya: number;
  suhuAkhir: number;
  kelembaban?: number;
  tegangan?: number;
  arus?: number;
  gerak?: number;
}

export interface ExperimentData {
  experimentId: string;
  studentId: string;
  missionId: string;
  inputMode: 'MANUAL' | 'SIMULATION';
  rows: ExperimentRow[];
  timestamp?: string;
  parameters?: {
    intensitasCahaya: number;
    suhuAwal: number;
    volumeAir: number;
    waktuPengamatan: number;
  };
}

export interface ExperimentSession {
  id?: string;
  experimentId: string;
  studentId: string;
  missionId: string;
  startedAt: string;
  completedAt: string;
  status: 'COMPLETED';
  source: 'SIMULATION';
  readings: SensorReading[];
  recordedAt?: string;
  rows?: ExperimentRow[];
  parameters?: {
    intensitasCahaya: number;
    suhuAwal: number;
    volumeAir: number;
    waktuPengamatan: number;
  };
}

export interface PortfolioEvidence {
  completed: boolean;
  category: string;
  hasData: boolean;
  hasGraph: boolean;
  hasConclusion: boolean;
  hasReflection: boolean;
}

export interface TemanBerpikirEvidence {
  hintLevelReached: number;
  scaffoldingUsed?: boolean;
}

export interface AlmeRecommendation {
  type: 'Remedial' | 'Help Mission' | 'Numeracy' | 'Literacy' | 'Reasoning' | 'Strengthening' | 'Continue' | 'Enrichment' | 'Difficulty Up';
  title: string;
  message: string;
  current: number | string;
  target: number | string;
  gap: number | string;
  reason: string;
  actionText: string;
  actionTargetMissionId?: string;
  whyExplanation: string;
  difficultyLevel: number; // 1 to 5
}

export interface AnalysisAnswers {
  q1_amat: string;
  q2_pola: string;
  q3_sebabSuhu: string;
  q4_hubunganVariabel: string;
}

export type PortfolioVisibility = 'PRIVATE' | 'CLASS';

export type PortfolioCategory =
  | 'Eksperimen'
  | 'Analisis Data'
  | 'Solusi'
  | 'Refleksi'
  | 'Proyek MIPA'
  | 'Karya Kreatif';

export interface PortfolioAppreciations {
  keren?: number; // 👏 Keren
  menginspirasi?: number; // 💡 Menginspirasi
  menarik?: number; // 🔬 Eksperimennya menarik
  bagus?: number; // 📊 Analisisnya bagus
  kreatif?: number; // ✨ Ide kreatif
  suka?: number; // ❤️ Suka
}

export interface PortfolioItem {
  id: string;
  studentId: string;
  studentName?: string;
  classId?: string;
  className?: string;
  title: string;
  subjectName: string;
  subjectId?: string;
  missionId?: string;
  date: string;
  category: PortfolioCategory;
  xpEarned: number;
  visibility: PortfolioVisibility;
  reflectionSummary: string;
  description?: string;
  experimentData?: ExperimentData;
  graphData?: Array<{ waktu: number; suhu: number }>;
  analysisAnswers?: AnalysisAnswers;
  conclusion?: string;
  documentation?: string;
  isFeatured?: boolean; // ⭐ Karya Unggulan (ditandai guru)
  appreciations?: PortfolioAppreciations;
  userAppreciations?: { [userId: string]: string[] }; // Emoji keys given by user
  portfolioEvidence?: PortfolioEvidence;
}

export type SyncQueueType =
  | 'SAVE_PROGRESS'
  | 'SAVE_EXPERIMENT'
  | 'SAVE_REFLECTION'
  | 'SAVE_PORTFOLIO';

export interface SyncQueueItem {
  id: string;
  type: SyncQueueType;
  payload: any;
  createdAt: number;
  syncStatus: 'PENDING' | 'SYNCED';
}

export interface StudentProfileData {
  user: User;
  student: Student;
  className: string;
  xp: number;
  level: number;
  completedMissionsCount: number;
  streakDays: number;
  missions: LearningMission[];
  portfolio: PortfolioItem[];
}

export interface TeacherProfileData {
  user: User;
  teacher: Teacher;
  subjects: Subject[];
  classes: ClassRoom[];
  assignedTeacherClasses: TeacherClass[];
}


