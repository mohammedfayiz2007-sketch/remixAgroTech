import React from 'react';
import { Camera, LayoutDashboard, Users, Mail } from 'lucide-react';

import { AgroBotLogo } from './AgroBotLogo';

interface BottomNavProps {
  activeTab: 'scan' | 'dashboard' | 'community' | 'gmail';
  onTabChange: (tab: 'scan' | 'dashboard' | 'community' | 'gmail') => void;
  onOpenAssistant: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  onOpenAssistant,
}) => {
  return (
    <>
      {/* Floating Agro AI Assistant Trigger Button (available on all viewports) */}
      <button
        onClick={onOpenAssistant}
        aria-label="Open Agro AI Assistant"
        className="fixed bottom-20 md:bottom-7 right-4 sm:right-6 z-40 group cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 animate-bot-float focus:outline-none"
      >
        <div className="relative flex items-center justify-center p-2 rounded-2xl bg-[#0D150F]/90 backdrop-blur-md border border-[#00FF66]/50 shadow-[0_0_20px_rgba(0,255,102,0.4)] group-hover:border-[#00FF66] group-hover:shadow-[0_0_30px_rgba(0,255,102,0.65)] transition-all">
          <AgroBotLogo size={52} className="drop-shadow-[0_2px_8px_rgba(0,255,102,0.45)] group-hover:scale-105 transition-transform" />
          
          {/* Online badge */}
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF66] opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#00FF66] border-2 border-[#0A0E0B]" />
          </span>

          {/* Quick tooltip pill on hover on desktop */}
          <span className="hidden md:group-hover:flex absolute right-full mr-3 top-1/2 -translate-y-1/2 items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0B110D] border border-[#00FF66]/40 text-[#00FF66] text-xs font-bold whitespace-nowrap shadow-neon-sm pointer-events-none">
            <span>Ask Agro Bot</span>
            <span className="text-[10px] text-stone-400">· 24/7 AI</span>
          </span>
        </div>
      </button>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0A0E0B]/95 backdrop-blur-md border-t border-[#1C271E] shadow-2xl px-2 py-1 safe-area-bottom">
        <div className="grid grid-cols-4 items-center h-14">
          
          {/* 📷 Scan Tab */}
          <button
            onClick={() => onTabChange('scan')}
            className={`flex flex-col items-center justify-center h-full transition-colors cursor-pointer ${
              activeTab === 'scan'
                ? 'text-[#00FF66] font-bold drop-shadow-[0_0_8px_rgba(0,255,102,0.4)]'
                : 'text-stone-400 hover:text-stone-200 font-medium'
            }`}
          >
            <Camera className={`w-5 h-5 ${activeTab === 'scan' ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[10px] mt-1">Scan</span>
          </button>

          {/* 📊 Dashboard Tab */}
          <button
            onClick={() => onTabChange('dashboard')}
            className={`flex flex-col items-center justify-center h-full transition-colors cursor-pointer ${
              activeTab === 'dashboard'
                ? 'text-[#00FF66] font-bold drop-shadow-[0_0_8px_rgba(0,255,102,0.4)]'
                : 'text-stone-400 hover:text-stone-200 font-medium'
            }`}
          >
            <LayoutDashboard className={`w-5 h-5 ${activeTab === 'dashboard' ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[10px] mt-1">Dashboard</span>
          </button>

          {/* 👥 Community Tab */}
          <button
            onClick={() => onTabChange('community')}
            className={`flex flex-col items-center justify-center h-full transition-colors cursor-pointer ${
              activeTab === 'community'
                ? 'text-[#00FF66] font-bold drop-shadow-[0_0_8px_rgba(0,255,102,0.4)]'
                : 'text-stone-400 hover:text-stone-200 font-medium'
            }`}
          >
            <Users className={`w-5 h-5 ${activeTab === 'community' ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[10px] mt-1">Community</span>
          </button>

          {/* ✉️ Gmail Tab */}
          <button
            onClick={() => onTabChange('gmail')}
            className={`flex flex-col items-center justify-center h-full transition-colors cursor-pointer ${
              activeTab === 'gmail'
                ? 'text-[#00FF66] font-bold drop-shadow-[0_0_8px_rgba(0,255,102,0.4)]'
                : 'text-stone-400 hover:text-stone-200 font-medium'
            }`}
          >
            <Mail className={`w-5 h-5 ${activeTab === 'gmail' ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[10px] mt-1">Gmail</span>
          </button>

        </div>
      </nav>
    </>
  );
};
