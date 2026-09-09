/**
 * TI SENANG - Repository Abstraction Layer
 * Menyediakan repositori terstandar untuk database/data layer.
 * Memisahkan logika data dari tampilan, dengan penyimpanan offline-ready (IndexedDB & LocalStorage).
 */

import { storage } from '../services/storage';
import { idbService } from '../services/indexedDb';
import {
  User,
  Teacher,
  Student,
  ClassRoom,
  Mission,
  StudentProgress,
  ExperimentSession,
  PortfolioItem,
  SyncQueueItem,
  SyncQueueType,
} from '../types';

// ==========================================
// 1. User Repository
// ==========================================
export const userRepository = {
  getAll: (): User[] => storage.getUsers(),
  getById: (id: string): User | undefined => storage.getUserById(id),
  save: (user: User): void => {
    idbService.set('users', user);
  },
  delete: (id: string): void => {
    idbService.delete('users', id);
  },
};

// ==========================================
// 2. Teacher Repository
// ==========================================
export const teacherRepository = {
  getAll: () => storage.getTeachers(),
  getById: (id: string) => storage.getTeacherByUserId(id),
  save: (teacher: Teacher) => {
    idbService.set('teachers', teacher);
  },
};

// ==========================================
// 3. Student Repository
// ==========================================
export const studentRepository = {
  getAll: () => storage.getStudents(),
  getByClass: (classId: string) =>
    storage.getStudents().filter((s) => s.student.classId === classId),
  getById: (id: string) => storage.getStudentByUserId(id),
  save: (student: Student) => {
    idbService.set('students', student);
  },
};

// ==========================================
// 4. Class Repository
// ==========================================
export const classRepository = {
  getAll: (): ClassRoom[] => storage.getClasses(),
  getById: (id: string): ClassRoom | undefined =>
    storage.getClasses().find((c) => c.id === id),
  save: (cls: ClassRoom): void => {
    idbService.set('classes', cls);
  },
  delete: (id: string): void => {
    try {
      storage.deleteClass(id);
    } catch {
      // ignore validation error for offline deletion
    }
    idbService.delete('classes', id);
  },
};

// ==========================================
// 5. Mission Repository
// ==========================================
export const missionRepository = {
  getAll: (): Mission[] => storage.getAllMissions(),
  getByClass: (classId: string): Mission[] => storage.getMissionsByClass(classId),
  getById: (id: string): Mission | undefined =>
    storage.getAllMissions().find((m) => m.id === id),
  save: (mission: Mission): void => {
    idbService.set('missions', mission);
  },
};

// ==========================================
// 6. Progress Repository
// ==========================================
export const progressRepository = {
  getAllByStudent: (studentId: string): StudentProgress[] =>
    storage.getAllStudentProgress(studentId),
  getByStudentAndMission: (studentId: string, missionId: string): StudentProgress | undefined =>
    storage.getStudentProgress(studentId, missionId),
  save: (progress: StudentProgress): void => {
    storage.setStudentProgress(progress);
    idbService.set('studentProgress', progress);
    syncQueueRepository.enqueue('SAVE_PROGRESS', progress);
  },
};

// ==========================================
// 7. Experiment Repository
// ==========================================
export const experimentRepository = {
  getCompletedSimulationSession: (studentId: string, missionId: string): ExperimentSession | undefined =>
    storage.getStudentExperimentSession(studentId, missionId),
  saveSession: (session: ExperimentSession): void => {
    storage.saveExperimentSession(session);
    idbService.set('experimentSessions', { ...session, id: session.experimentId });
    syncQueueRepository.enqueue('SAVE_EXPERIMENT', session);
  },
};

// ==========================================
// 8. Portfolio Repository
// ==========================================
export const portfolioRepository = {
  getAll: (): PortfolioItem[] => storage.getAllPortfolios(),
  getByStudent: (studentId: string): PortfolioItem[] => storage.getStudentPortfolios(studentId),
  getByClass: (classId: string): PortfolioItem[] => storage.getClassPortfolios(classId),
  save: (portfolio: PortfolioItem): void => {
    storage.savePortfolio(portfolio);
    idbService.set('portfolios', portfolio);
    syncQueueRepository.enqueue('SAVE_PORTFOLIO', portfolio);
  },
  delete: (id: string): void => {
    storage.deletePortfolio(id);
    idbService.delete('portfolios', id);
  },
  toggleAppreciation: (
    portfolioId: string,
    userId: string,
    key: 'keren' | 'menginspirasi' | 'menarik' | 'bagus' | 'kreatif' | 'suka',
  ): PortfolioItem | undefined => {
    const all = storage.getAllPortfolios();
    const item = all.find((p) => p.id === portfolioId);
    if (!item) return undefined;

    const userApps = item.userAppreciations || {};
    const userKeys = userApps[userId] || [];

    const apps = item.appreciations || {};
    const currentCount = apps[key] || 0;

    let updatedKeys: string[];
    let newCount: number;

    if (userKeys.includes(key)) {
      // Remove appreciation
      updatedKeys = userKeys.filter((k) => k !== key);
      newCount = Math.max(0, currentCount - 1);
    } else {
      // Add appreciation
      updatedKeys = [...userKeys, key];
      newCount = currentCount + 1;
    }

    const updatedItem: PortfolioItem = {
      ...item,
      appreciations: {
        ...apps,
        [key]: newCount,
      },
      userAppreciations: {
        ...userApps,
        [userId]: updatedKeys,
      },
    };

    storage.savePortfolio(updatedItem);
    idbService.set('portfolios', updatedItem);
    return updatedItem;
  },
  toggleFeatured: (portfolioId: string): PortfolioItem | undefined => {
    const all = storage.getAllPortfolios();
    const item = all.find((p) => p.id === portfolioId);
    if (!item) return undefined;

    const updatedItem: PortfolioItem = {
      ...item,
      isFeatured: !item.isFeatured,
    };

    storage.savePortfolio(updatedItem);
    idbService.set('portfolios', updatedItem);
    return updatedItem;
  },
};

// ==========================================
// 9. Sync Queue Repository (Offline Synchronization)
// ==========================================
const SYNC_QUEUE_KEY = 'ti_senang_sync_queue';

export const syncQueueRepository = {
  getQueue: (): SyncQueueItem[] => {
    try {
      const data = localStorage.getItem(SYNC_QUEUE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  enqueue: (type: SyncQueueType, payload: any): SyncQueueItem => {
    const queue = syncQueueRepository.getQueue();
    const item: SyncQueueItem = {
      id: `sync-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      type,
      payload,
      createdAt: Date.now(),
      syncStatus: 'PENDING',
    };
    queue.push(item);
    try {
      localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
      idbService.set('syncQueue', item);
    } catch (e) {
      console.warn('Gagal menyimpan ke syncQueue:', e);
    }
    return item;
  },
  processQueue: (): { processedCount: number; message: string } => {
    const queue = syncQueueRepository.getQueue();
    const pending = queue.filter((q) => q.syncStatus === 'PENDING');
    if (pending.length === 0) {
      return { processedCount: 0, message: 'Data tersimpan di perangkat.' };
    }

    // Mark as synced locally (simulation of local synchronization)
    const updated = queue.map((q) => ({ ...q, syncStatus: 'SYNCED' as const }));
    try {
      localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Gagal memperbarui syncQueue:', e);
    }
    return {
      processedCount: pending.length,
      message: 'Data tersimpan di perangkat.',
    };
  },
};
