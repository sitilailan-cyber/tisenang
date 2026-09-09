import React, { useState, useEffect } from 'react';
import { Globe, Wifi, WifiOff, HardDrive, CheckCircle2 } from 'lucide-react';
import { syncQueueRepository } from '../../repositories';

export const InternetStatusBar: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(() =>
    typeof navigator !== 'undefined' ? navigator.onLine : true,
  );
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      const res = syncQueueRepository.processQueue();
      if (res.processedCount > 0) {
        setSyncNotice(res.message);
        setTimeout(() => setSyncNotice(null), 3000);
      }
    };
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const interval = setInterval(() => {
      const q = syncQueueRepository.getQueue();
      const pending = q.filter((i) => i.syncStatus === 'PENDING').length;
      setPendingCount(pending);
    }, 4000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="w-full">
      {/* Offline Alert Banner */}
      {!isOnline && (
        <div
          role="alert"
          className="bg-rose-50 border-b border-rose-200 px-4 py-2 text-rose-800 text-xs flex items-center justify-between gap-3 font-medium transition-all"
        >
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <span className="font-bold">🔴 OFFLINE:</span>
            <span>Internet tidak tersedia. Aktivitas belajar yang tersedia tetap dapat dilanjutkan.</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-rose-700 bg-rose-100 px-2.5 py-1 rounded-lg">
            <HardDrive className="w-3.5 h-3.5" />
            <span>Data tersimpan di perangkat.</span>
          </div>
        </div>
      )}

      {/* Sync notification toast */}
      {syncNotice && (
        <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-1.5 text-emerald-800 text-xs flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>{syncNotice}</span>
        </div>
      )}
    </div>
  );
};
