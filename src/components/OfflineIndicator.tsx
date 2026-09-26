import React from 'react';
import { WifiOff, Database } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 left-4 z-50 flex items-center gap-2.5 rounded-xl bg-[#171F19]/95 border border-[#FFB800]/50 px-3.5 py-2 text-xs font-medium text-amber-200 shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom duration-200">
      <span className="flex h-2 w-2 relative">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
      </span>
      <div className="flex items-center gap-1.5">
        <WifiOff className="w-3.5 h-3.5 text-amber-400" />
        <span className="font-semibold text-white">Offline Mode</span>
        <span className="text-stone-400">·</span>
        <span className="flex items-center gap-1 text-amber-300/90 text-[11px]">
          <Database className="w-3 h-3" /> Cached crop history available
        </span>
      </div>
    </div>
  );
};
