import React, { useState } from 'react';
import { MapPin, Sparkles, Cloud, LogOut, CheckCircle2 } from 'lucide-react';
import { UserSession } from '../types';
import { AgroLogo } from './AgroLogo';
import { FARMER_AVATARS } from '../data/plantImages';
import { useFirebase } from '../firebase/FirebaseContext';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  userSession: UserSession;
  activeTab: 'scan' | 'dashboard' | 'community' | 'gmail';
  onTabChange: (tab: 'scan' | 'dashboard' | 'community' | 'gmail') => void;
  onOpenAssistant: () => void;
  onOpenLocationEdit: () => void;
  unreadAlertsCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  userSession,
  activeTab,
  onTabChange,
  onOpenAssistant,
  onOpenLocationEdit,
}) => {
  const { currentUser, signInWithGoogle, signOut } = useFirebase();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-[#0C100D]/95 backdrop-blur-md border-b border-[#1A231C] shadow-lg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Zone 1: AGRO Logo & Tagline */}
        <div className="flex items-center gap-3">
          <div 
            onClick={() => onTabChange('scan')} 
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <AgroLogo size="md" />
          </div>
        </div>

        {/* Zone 2: Navigation Links (Desktop view) */}
        <nav className="hidden md:flex items-center gap-1 bg-[#121813] p-1 rounded-xl border border-[#1E2A20]">
          <button
            onClick={() => onTabChange('scan')}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'scan'
                ? 'bg-[#00FF66] text-[#0A0D0A] shadow-neon-sm font-bold'
                : 'text-stone-300 hover:text-white hover:bg-[#1A241C]'
            }`}
          >
            📷 Scan Plant
          </button>
          <button
            onClick={() => onTabChange('dashboard')}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-[#00FF66] text-[#0A0D0A] shadow-neon-sm font-bold'
                : 'text-stone-300 hover:text-white hover:bg-[#1A241C]'
            }`}
          >
            📊 Dashboard
          </button>
          <button
            onClick={() => onTabChange('community')}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'community'
                ? 'bg-[#00FF66] text-[#0A0D0A] shadow-neon-sm font-bold'
                : 'text-stone-300 hover:text-white hover:bg-[#1A241C]'
            }`}
          >
            👥 Community &amp; Map
          </button>
          <button
            onClick={() => onTabChange('gmail')}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'gmail'
                ? 'bg-[#00FF66] text-[#0A0D0A] shadow-neon-sm font-bold'
                : 'text-stone-300 hover:text-white hover:bg-[#1A241C]'
            }`}
          >
            <span>✉️</span>
            <span>Gmail</span>
          </button>
        </nav>

        {/* Zone 3: Location Chip & Actions */}
        <div className="flex items-center gap-2 relative">
          {/* Location button */}
          <button
            onClick={onOpenLocationEdit}
            title="Change Farm Location"
            className="flex items-center gap-1.5 text-xs text-stone-200 bg-[#141B15] hover:bg-[#1C271E] hover:border-[#00FF66]/40 px-3 py-1.5 rounded-lg border border-[#223124] transition-colors max-w-[140px] sm:max-w-[180px] cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-[#00FF66] shrink-0" />
            <span className="truncate font-medium">{userSession.location}</span>
          </button>

          {/* AI Assistant Quick Trigger */}
          <button
            onClick={onOpenAssistant}
            className="hidden sm:flex items-center gap-1.5 text-xs font-bold bg-[#00FF66] text-[#090C0A] hover:bg-[#33FF85] px-3.5 py-1.5 rounded-lg shadow-neon-sm transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 fill-[#090C0A]" />
            <span>Agro AI</span>
          </button>

          {/* PWA In-App Install Trigger */}
          <PWAInstallButton />

          {/* Firebase Authentication & Cloud State */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-1.5 p-1 rounded-full border border-[#00FF66]/60 bg-[#141F16] hover:border-[#00FF66] transition-all cursor-pointer shadow-neon-sm"
                title={`${currentUser.displayName || 'Farmer'} (Firebase Cloud Connected)`}
              >
                <div className="w-7 h-7 rounded-full overflow-hidden bg-black shrink-0">
                  <img
                    src={currentUser.photoURL || FARMER_AVATARS[userSession.name] || FARMER_AVATARS['Rajesh Sharma']}
                    alt={currentUser.displayName || userSession.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="w-2 h-2 rounded-full bg-[#00FF66] animate-pulse mr-1" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl bg-[#0F1611] border border-[#223325] shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center gap-2.5 pb-2.5 border-b border-[#1C291E]">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-black shrink-0 border border-[#00FF66]/40">
                      <img
                        src={currentUser.photoURL || FARMER_AVATARS[userSession.name] || FARMER_AVATARS['Rajesh Sharma']}
                        alt={currentUser.displayName || userSession.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-white truncate">{currentUser.displayName || userSession.name}</p>
                      <p className="text-[11px] text-stone-400 truncate">{currentUser.email || userSession.emailOrPhone}</p>
                    </div>
                  </div>

                  <div className="py-2 space-y-1 text-xs text-stone-300">
                    <div className="flex items-center gap-1.5 text-[#00FF66] font-medium text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Firebase Cloud Connected</span>
                    </div>
                    <p className="text-[11px] text-stone-400">
                      Crops and diagnostics synced with Firestore.
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#1C291E] flex flex-col gap-1">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onTabChange('gmail');
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-xs text-[#00FF66] hover:bg-[#1A261D] rounded-lg transition-colors cursor-pointer flex items-center gap-2 font-semibold"
                    >
                      <span>✉️</span>
                      <span>Farm Mail (Gmail)</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onOpenLocationEdit();
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-xs text-stone-200 hover:bg-[#1A261D] rounded-lg transition-colors cursor-pointer"
                    >
                      Farm Preferences
                    </button>
                    <button
                      onClick={async () => {
                        setShowProfileMenu(false);
                        await signOut();
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors cursor-pointer font-semibold"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => signInWithGoogle()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141E16] border border-[#00FF66]/40 hover:border-[#00FF66] hover:bg-[#1B291D] text-[#00FF66] text-xs font-bold transition-all shadow-neon-sm cursor-pointer"
              title="Sign in with Google to sync farm scans with Firebase"
            >
              <Cloud className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Connect Cloud</span>
              <span className="sm:hidden">Sign In</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
