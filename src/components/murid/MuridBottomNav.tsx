import React from 'react';
import { Home, Target, FlaskConical, Bot, FolderLock, User } from 'lucide-react';

export type MuridTabType = 'beranda' | 'misi' | 'lab' | 'ai' | 'portofolio' | 'profil';

interface MuridBottomNavProps {
  activeTab: MuridTabType;
  onTabChange: (tab: MuridTabType) => void;
}

export const MuridBottomNav: React.FC<MuridBottomNavProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs = [
    { id: 'beranda' as MuridTabType, label: 'Beranda', icon: Home },
    { id: 'misi' as MuridTabType, label: 'Misi', icon: Target },
    { id: 'lab' as MuridTabType, label: 'Laboratorium', icon: FlaskConical },
    { id: 'ai' as MuridTabType, label: 'Teman Berpikir', icon: Bot },
    { id: 'portofolio' as MuridTabType, label: 'Portofolio', icon: FolderLock },
    { id: 'profil' as MuridTabType, label: 'Profil', icon: User },
  ];

  return (
    <nav
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
      <div className="max-w-xl mx-auto px-2 py-2 flex items-center justify-between">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 py-1 px-1 flex flex-col items-center justify-center gap-1 rounded-2xl transition-all relative ${
                isActive
                  ? 'text-purple-600 font-bold'
                  : 'text-slate-400 hover:text-slate-600 font-medium'
              }`}
            >
              {isActive && (
                <span className="absolute -top-1 w-6 h-1 bg-purple-600 rounded-full" />
              )}
              <div
                className={`w-9 h-7 rounded-xl flex items-center justify-center transition-all ${
                  isActive ? 'bg-purple-100/70 text-purple-700' : 'text-slate-500'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              </div>
              <span className="text-[10px] leading-none tracking-tight whitespace-nowrap">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
