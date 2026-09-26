import React, { useState } from 'react';
import { Download, Share, X, Check } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // Hide button if already running as an installed PWA
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00FF66] hover:bg-[#33FF85] text-[#090C0A] text-xs font-bold transition-all shadow-neon-sm cursor-pointer"
        title="Install AGRO App for quick offline access"
      >
        <Download className="w-3.5 h-3.5 stroke-[2.5]" />
        <span className="hidden sm:inline">Install App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#00FF66]/40 hover:border-[#00FF66] bg-[#141B15] text-[#00FF66] text-xs font-semibold transition-all cursor-pointer"
          title="Install AGRO on iPhone / iPad"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Install App</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-2xl bg-[#0F1611] p-5 shadow-2xl border border-[#253828] text-stone-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-[#1C281E] pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Download className="w-4 h-4 text-[#00FF66]" />
                  Install AGRO on iOS
                </h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="text-stone-400 hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-stone-300">
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#1A261D] border border-[#00FF66]/50 text-[#00FF66] font-bold flex items-center justify-center text-[11px] shrink-0 mt-0.5">
                    1
                  </div>
                  <p>
                    Tap the <strong className="text-white">Share</strong> button{' '}
                    <Share className="inline w-3.5 h-3.5 text-[#00FF66] mx-0.5" /> in your Safari toolbar.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#1A261D] border border-[#00FF66]/50 text-[#00FF66] font-bold flex items-center justify-center text-[11px] shrink-0 mt-0.5">
                    2
                  </div>
                  <p>
                    Scroll down and select <strong className="text-white">Add to Home Screen</strong>.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#1A261D] border border-[#00FF66]/50 text-[#00FF66] font-bold flex items-center justify-center text-[11px] shrink-0 mt-0.5">
                    3
                  </div>
                  <p>
                    Tap <strong className="text-white">Add</strong> in the top right to enable offline crop diagnostics!
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2 rounded-xl bg-[#00FF66] text-[#0A0D0A] text-xs font-bold hover:bg-[#33FF85] transition-all cursor-pointer shadow-neon-sm"
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
