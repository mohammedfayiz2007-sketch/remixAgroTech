import React from 'react';
import { Severity, PlantHealthStatus } from '../types';

interface HealthStatusBarProps {
  score: number; // 0 - 100
  severity?: Severity;
  statusLabel?: PlantHealthStatus;
  showDetails?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const HealthStatusBar: React.FC<HealthStatusBarProps> = ({
  score,
  severity,
  statusLabel,
  showDetails = true,
  size = 'md',
}) => {
  const clampedScore = Math.min(100, Math.max(5, score));

  let derivedLabel: PlantHealthStatus = statusLabel || 'Recovering';
  let dotColor = 'bg-amber-400';

  if (clampedScore >= 80 || severity === 'healthy') {
    derivedLabel = 'Healthy';
    dotColor = 'bg-[#00FF66] shadow-[0_0_8px_#00FF66]';
  } else if (clampedScore >= 60) {
    derivedLabel = 'Recovering';
    dotColor = 'bg-amber-400 shadow-[0_0_8px_#FBBF24]';
  } else if (clampedScore >= 35 || severity === 'high') {
    derivedLabel = 'Needs Attention';
    dotColor = 'bg-orange-500 shadow-[0_0_8px_#F97316]';
  } else {
    derivedLabel = 'Critical';
    dotColor = 'bg-red-500 shadow-[0_0_8px_#EF4444]';
  }

  const heightClass = size === 'sm' ? 'h-2' : size === 'lg' ? 'h-3.5' : 'h-2.5';

  return (
    <div className="w-full">
      {showDetails && (
        <div className="flex items-center justify-between mb-1.5 text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-stone-300">
            <span className={`inline-block w-2 h-2 rounded-full ${dotColor}`} />
            <span>Plant Health Status:</span>
            <span className="font-bold text-white tracking-wide">{statusLabel || derivedLabel}</span>
          </div>
          <span className="text-[#00FF66] font-mono text-xs font-bold tabular-nums">
            {clampedScore}%
          </span>
        </div>
      )}

      {/* Visual RED -> ORANGE -> YELLOW -> GREEN bar */}
      <div className="relative w-full bg-[#141C15] rounded-full overflow-hidden p-[1px] border border-[#223124]">
        <div className={`w-full ${heightClass} rounded-full overflow-hidden bg-[#111712] relative`}>
          <div
            className="h-full rounded-full transition-all duration-700 ease-out bg-gradient-to-r from-red-600 via-amber-400 to-[#00FF66] relative shadow-[0_0_10px_rgba(0,255,102,0.4)]"
            style={{ width: `${clampedScore}%` }}
          >
            <div className="absolute inset-0 bg-white/20" />
          </div>
        </div>
      </div>

      {/* Indicator guide labels */}
      {showDetails && size !== 'sm' && (
        <div className="flex justify-between items-center text-[10px] text-stone-400 mt-1 font-semibold px-0.5">
          <span className="text-red-400 flex items-center gap-0.5">🔴 Critical</span>
          <span className="text-orange-400 flex items-center gap-0.5">🟠 Needs Attention</span>
          <span className="text-amber-300 flex items-center gap-0.5">🟡 Recovering</span>
          <span className="text-[#00FF66] flex items-center gap-0.5">🟢 Healthy</span>
        </div>
      )}
    </div>
  );
};
