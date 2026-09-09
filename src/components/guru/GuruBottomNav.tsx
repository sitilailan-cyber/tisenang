import React from 'react';
import {
  Home,
  Compass,
  Users,
  Target,
  BarChart3,
  FolderOpen,
  FileCheck,
  User,
} from 'lucide-react';

export type GuruTabType =
  | 'beranda'
  | 'navigasi'
  | 'kelas'
  | 'misi'
  | 'analitik'
  | 'portofolio'
  | 'asesmen'
  | 'profil';

interface GuruBottomNavProps {
  activeTab: GuruTabType;
  onTabChange: (tab: GuruTabType) => void;
}

export const GuruBottomNav: React.FC<GuruBottomNavProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs = [
    {
      id: 'beranda' as GuruTabType,
      label: 'Beranda',
      icon: Home,
    },
    {
      id: 'navigasi' as GuruTabType,
      label: 'Navigasi',
      icon: Compass,
    },
    {
      id: 'kelas' as GuruTabType,
      label: 'Kelas',
      icon: Users,
    },
    {
      id: 'misi' as GuruTabType,
      label: 'Misi',
      icon: Target,
    },
    {
      id: 'analitik' as GuruTabType,
      label: 'Analitik',
      icon: BarChart3,
    },
    {
      id: 'portofolio' as GuruTabType,
      label: 'Portofolio',
      icon: FolderOpen,
    },
    {
      id: 'asesmen' as GuruTabType,
      label: 'Asesmen',
      icon: FileCheck,
    },
    {
      id: 'profil' as GuruTabType,
      label: 'Profil',
      icon: User,
    },
  ];

  return (
    <nav
      id="guru-bottom-navigation"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        paddingBottom: 'env(safe-area-inset-bottom, 8px)',
      }}
      className="bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl transition-all"
    >
      <div className="max-w-4xl mx-auto px-2 py-1.5 flex items-center justify-between overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              id={`btn-guru-tab-${tab.id}`}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 min-w-[52px] py-1 px-1 flex flex-col items-center justify-center gap-1 rounded-xl transition-all relative ${
                isActive
                  ? 'text-indigo-600 font-bold'
                  : 'text-slate-400 hover:text-slate-600 font-medium'
              }`}
            >
              {isActive && (
                <span className="absolute -top-1 w-6 h-1 bg-indigo-600 rounded-full" />
              )}
              <div
                className={`w-8 h-6 rounded-lg flex items-center justify-center transition-all ${
                  isActive ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              </div>
              <span className="text-[10px] leading-tight tracking-tight truncate max-w-full">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
