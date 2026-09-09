/**
 * TI SENANG - Authentication & Authorization Context
 * Menjaga sesi login, validasi role pengguna, dan proteksi hak akses.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, Teacher, Student } from '../types';
import { storage } from '../services/storage';

interface AuthContextType {
  currentUser: User | null;
  currentRole: UserRole | null;
  teacherInfo: Teacher | null;
  studentInfo: Student | null;
  isAuthenticated: boolean;
  login: (username: string, password: string, intendedRole?: UserRole) => { success: boolean; error?: string };
  logout: () => void;
  canAccessRole: (role: UserRole) => boolean;
}

const SESSION_KEY = 'ti_senang_active_session';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [teacherInfo, setTeacherInfo] = useState<Teacher | null>(null);
  const [studentInfo, setStudentInfo] = useState<Student | null>(null);

  // Restore session from localStorage if present
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SESSION_KEY);
      if (stored) {
        const sessionUser = JSON.parse(stored) as User;
        const freshUser = storage.getUserById(sessionUser.id);
        if (freshUser) {
          setCurrentUser(freshUser);
          if (freshUser.role === 'guru') {
            setTeacherInfo(storage.getTeacherByUserId(freshUser.id) || null);
          } else if (freshUser.role === 'murid') {
            setStudentInfo(storage.getStudentByUserId(freshUser.id) || null);
          }
        } else {
          localStorage.removeItem(SESSION_KEY);
        }
      }
    } catch (e) {
      console.error('Session load error:', e);
      localStorage.removeItem(SESSION_KEY);
    }
  }, []);

  const login = (
    username: string,
    password: string,
    intendedRole?: UserRole,
  ): { success: boolean; error?: string } => {
    const user = storage.authenticate(username, password);

    if (!user) {
      return { success: false, error: 'Username atau password salah. Silakan coba lagi.' };
    }

    // Role strict check if specified
    if (intendedRole && user.role !== intendedRole) {
      const roleName =
        intendedRole === 'admin' ? 'Admin' : intendedRole === 'guru' ? 'Guru' : 'Murid';
      const userRoleName =
        user.role === 'admin' ? 'Admin' : user.role === 'guru' ? 'Guru' : 'Murid';
      return {
        success: false,
        error: `Akun ini terdaftar sebagai ${userRoleName}, tidak dapat masuk melalui portal ${roleName}.`,
      };
    }

    setCurrentUser(user);
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } catch {
      // ignore
    }

    if (user.role === 'guru') {
      const t = storage.getTeacherByUserId(user.id);
      setTeacherInfo(t || null);
      setStudentInfo(null);
    } else if (user.role === 'murid') {
      const s = storage.getStudentByUserId(user.id);
      setStudentInfo(s || null);
      setTeacherInfo(null);
    } else {
      setTeacherInfo(null);
      setStudentInfo(null);
    }

    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    setTeacherInfo(null);
    setStudentInfo(null);
    localStorage.removeItem(SESSION_KEY);
  };

  const canAccessRole = (role: UserRole): boolean => {
    if (!currentUser) return false;
    return currentUser.role === role;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole: currentUser?.role || null,
        teacherInfo,
        studentInfo,
        isAuthenticated: !!currentUser,
        login,
        logout,
        canAccessRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
