import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Sparkles,
  TrendingUp,
  Camera,
  Clock,
  RefreshCw,
  Mail,
} from 'lucide-react';
import { TrackedPlant } from '../types';
import { HealthStatusBar } from './HealthStatusBar';
import { Shimmer, ShimmerScanHistoryItem } from './Shimmer';
import { TOMATO_EARLY_BLIGHT_IMAGE } from '../data/plantImages';

interface PlantDetailModalProps {
  plant: TrackedPlant;
  onClose: () => void;
  onUploadNewScanForPlant: (plant: TrackedPlant) => void;
  onAskAIAboutPlant: (plant: TrackedPlant) => void;
  onEmailPlantReport?: (plant: TrackedPlant) => void;
}

export const PlantDetailModal: React.FC<PlantDetailModalProps> = ({
  plant,
  onClose,
  onUploadNewScanForPlant,
  onAskAIAboutPlant,
  onEmailPlantReport,
}) => {
  const [selectedScanIndex, setSelectedScanIndex] = useState<number>(
    plant.scans.length - 1
  );

  // Simulated AI differential calculation loading state
  const [isAiLoading, setIsAiLoading] = useState<boolean>(true);

  useEffect(() => {
    // Initial simulated AI synthesis (450ms)
    const timer = setTimeout(() => {
      setIsAiLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, []);

  const handleScanChange = (idx: number) => {
    if (idx === selectedScanIndex) return;
    setIsAiLoading(true);
    setSelectedScanIndex(idx);
    setTimeout(() => {
      setIsAiLoading(false);
    }, 350);
  };

  const handleRefreshPlan = () => {
    setIsAiLoading(true);
    setTimeout(() => {
      setIsAiLoading(false);
    }, 550);
  };

  const activeScan = plant.scans[selectedScanIndex] || plant.scans[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#0D120E] text-stone-100 rounded-2xl border border-[#00FF66]/30 shadow-neon max-w-2xl w-full my-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Top Header */}
        <div className="bg-[#080B09] px-6 py-5 text-white flex items-start justify-between border-b border-[#1E2D21]">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-black border border-[#00FF66]/40 shrink-0 shadow-neon-sm">
              <img
                src={activeScan.imageUrl || TOMATO_EARLY_BLIGHT_IMAGE}
                alt={plant.customName}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-extrabold tracking-tight text-white">
                  {plant.customName}
                </h2>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#00FF66]/10 text-[#00FF66] border border-[#00FF66]/30">
                  {plant.cropType}
                </span>
              {(plant.environmentTag || activeScan.environmentTag) && (
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded border inline-flex items-center gap-1 ${
                    (plant.environmentTag || activeScan.environmentTag) === 'Greenhouse'
                      ? 'border-emerald-500/40 bg-emerald-950/40 text-emerald-300'
                      : (plant.environmentTag || activeScan.environmentTag) === 'Indoor'
                      ? 'border-cyan-500/40 bg-cyan-950/40 text-cyan-300'
                      : 'border-amber-500/40 bg-amber-950/40 text-amber-300'
                  }`}
                >
                  {(plant.environmentTag || activeScan.environmentTag) === 'Greenhouse' && '🌿 Greenhouse'}
                  {(plant.environmentTag || activeScan.environmentTag) === 'Indoor' && '🏡 Indoor'}
                  {(plant.environmentTag || activeScan.environmentTag) === 'Outdoor' && '☀️ Outdoor'}
                </span>
              )}
            </div>
            
            <div className="mt-2 flex items-center gap-3 text-xs text-stone-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#00FF66]" />
                <span>Last updated: {plant.lastScannedDate}</span>
              </span>
              <span>·</span>
              <span>
                Current condition: <strong className="text-[#00FF66]">{plant.currentDisease}</strong>
              </span>
            </div>
          </div>
        </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleRefreshPlan}
              disabled={isAiLoading}
              title="Refresh AI growth differential"
              className="p-1.5 rounded-lg text-stone-400 hover:text-[#00FF66] hover:bg-[#1A261D] transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isAiLoading ? 'animate-spin text-[#00FF66]' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-[#1A261D] transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Main Plant Health Status Bar (or Shimmer) */}
          {isAiLoading ? (
            <div className="bg-[#121A13] rounded-xl p-4 border border-[#202E22] space-y-2">
              <div className="flex justify-between items-center">
                <Shimmer className="w-36 h-3.5 rounded" />
                <Shimmer className="w-10 h-3.5 rounded" />
              </div>
              <Shimmer className="w-full h-3 rounded-full" />
              <div className="flex justify-between pt-1">
                <Shimmer className="w-16 h-2 rounded" />
                <Shimmer className="w-20 h-2 rounded" />
                <Shimmer className="w-18 h-2 rounded" />
                <Shimmer className="w-16 h-2 rounded" />
              </div>
            </div>
          ) : (
            <div className="bg-[#121A13] rounded-xl p-4 border border-[#202E22]">
              <HealthStatusBar
                score={plant.currentHealthScore}
                severity={plant.currentSeverity}
                statusLabel={plant.healthStatusLabel}
                size="lg"
              />
            </div>
          )}

          {/* "WHAT CHANGED?" FEATURE (or Shimmer) */}
          {isAiLoading ? (
            <div className="bg-[#111913] rounded-xl p-4 border border-[#1E2B20] space-y-3">
              <div className="flex justify-between items-center">
                <Shimmer className="w-32 h-4 rounded" />
                <Shimmer className="w-24 h-4 rounded" />
              </div>
              <div className="bg-[#0A0E0B] p-3 rounded-lg border border-[#1A261D] space-y-2">
                <Shimmer className="w-48 h-3.5 rounded" />
                <Shimmer className="w-full h-3 rounded" />
                <Shimmer className="w-4/5 h-3 rounded" />
              </div>
            </div>
          ) : (
            <div className="bg-[#111913] rounded-xl p-4 border border-[#00FF66]/30 space-y-3 shadow-neon-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#00FF66] flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-[#00FF66]" />
                  <span>What Changed?</span>
                </h3>
                
                <div className="flex items-center gap-1.5 text-xs font-bold">
                  <span className="text-stone-300">Plant Status:</span>
                  <span
                    className={`px-2 py-0.5 rounded font-bold ${
                      activeScan.plantStatusTrend === 'Improving'
                        ? 'bg-[#00FF66]/20 text-[#00FF66] border border-[#00FF66]/50'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}
                  >
                    {activeScan.plantStatusTrend === 'Improving' ? 'Improving ↗' : 'Needs Attention ⚠️'}
                  </span>
                </div>
              </div>

              <div className="text-xs text-stone-300 leading-relaxed bg-[#0A0E0B] p-3 rounded-lg border border-[#1A261D]">
                <p className="font-bold text-white mb-1.5">
                  Comparison with earlier observation:
                </p>
                <div className="space-y-1">
                  {activeScan.whatChanged ? (
                    <p>{activeScan.whatChanged}</p>
                  ) : (
                    <>
                      <p className="text-[#00FF66]">🟢 Affected area appears reduced compared to baseline.</p>
                      <p className="text-[#00FF66]">🟢 Leaf discoloration and chlorotic halo halted.</p>
                      <p className="text-stone-300">🟢 No new affected leaves detected on mid-tier canopy.</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* PLANT HISTORY / VISUAL TIMELINE */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#00FF66]" />
                <span>Visual Scan Timeline</span>
              </h3>
              <span className="text-xs text-stone-400">
                {plant.scans.length} Scans Recorded
              </span>
            </div>

            {/* Timeline Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              {plant.scans.map((scan, idx) => (
                <button
                  key={scan.id}
                  onClick={() => handleScanChange(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                    selectedScanIndex === idx
                      ? 'bg-[#00FF66] text-[#0A0D0A] shadow-neon-sm'
                      : 'bg-[#151E17] text-stone-300 hover:bg-[#1C291E] border border-[#233325]'
                  }`}
                >
                  <img
                    src={scan.imageUrl || TOMATO_EARLY_BLIGHT_IMAGE}
                    alt={scan.dayLabel}
                    className="w-4 h-4 rounded-full object-cover shrink-0"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = TOMATO_EARLY_BLIGHT_IMAGE;
                    }}
                  />
                  <span>{scan.dayLabel || `Scan #${idx + 1}`}</span>
                  <span className="text-[10px] opacity-75">· {scan.date}</span>
                </button>
              ))}
            </div>

            {/* Selected Scan Card (or ShimmerScanHistoryItem) */}
            {isAiLoading ? (
              <ShimmerScanHistoryItem />
            ) : (
              <div className="bg-[#121A13] rounded-xl p-4 border border-[#223224] flex flex-col sm:flex-row gap-4 items-start">
                <div className="w-32 h-24 rounded-lg overflow-hidden bg-black border border-[#00FF66]/40 shrink-0">
                  <img
                    src={activeScan.imageUrl || TOMATO_EARLY_BLIGHT_IMAGE}
                    alt={plant.customName}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = TOMATO_EARLY_BLIGHT_IMAGE;
                    }}
                  />
                </div>

                <div className="flex-1 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">
                      {activeScan.disease}
                    </span>
                    <span className="font-mono text-[#00FF66] font-bold">
                      {activeScan.confidence}% Match
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-stone-400">
                    <span>Severity:</span>
                    <span className="font-bold text-stone-200 capitalize">
                      {activeScan.severity}
                    </span>
                    <span>·</span>
                    <span>Scanned on {activeScan.date} at {activeScan.time}</span>
                  </div>

                  <p className="text-stone-300 line-clamp-2 leading-relaxed pt-1">
                    {activeScan.detectionSummary}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* DAILY PERSONALIZED ACTION PLAN (or Shimmer) */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#00FF66]" />
              <span>Today's Personalized Action Plan</span>
            </h3>

            {isAiLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-[#121A13] p-3 rounded-xl border border-[#202E22] space-y-2">
                    <Shimmer className="w-24 h-3.5 rounded" />
                    <Shimmer className="w-full h-3 rounded" />
                    <Shimmer className="w-4/5 h-3 rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-[#121A13] p-3 rounded-xl border border-[#202E22] space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-white">
                    <span className="text-[#00FF66]">🌱</span>
                    <span>Morning</span>
                  </div>
                  <p className="text-stone-300 leading-snug">
                    {plant.dailyActionPlan?.morning || 'Check affected leaves for fungal spore dust or moisture.'}
                  </p>
                </div>

                <div className="bg-[#121A13] p-3 rounded-xl border border-[#202E22] space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-white">
                    <span className="text-blue-400">💧</span>
                    <span>Watering</span>
                  </div>
                  <p className="text-stone-300 leading-snug">
                    {plant.dailyActionPlan?.watering || 'Avoid unnecessary excess moisture; ground drip only.'}
                  </p>
                </div>

                <div className="bg-[#121A13] p-3 rounded-xl border border-[#202E22] space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-white">
                    <span className="text-amber-400">🔍</span>
                    <span>Monitoring</span>
                  </div>
                  <p className="text-stone-300 leading-snug">
                    {plant.dailyActionPlan?.monitoring || 'Check nearby leaves and stems for similar symptoms.'}
                  </p>
                </div>

                <div className="bg-[#121A13] p-3 rounded-xl border border-[#202E22] space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-white">
                    <span className="text-[#00FF66]">📷</span>
                    <span>Next Step</span>
                  </div>
                  <p className="text-stone-300 leading-snug">
                    {plant.dailyActionPlan?.nextStep || 'Re-scan the plant after 3 to 5 days.'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-[#1C281E] flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => onUploadNewScanForPlant(plant)}
              className="h-11 px-5 rounded-xl bg-[#00FF66] text-[#080C09] text-xs font-bold hover:bg-[#33FF85] transition-all flex items-center gap-2 shadow-neon-sm cursor-pointer"
            >
              <Camera className="w-4 h-4 stroke-[2.5]" />
              <span>Upload New Scan to Track</span>
            </button>

            {onEmailPlantReport && (
              <button
                onClick={() => onEmailPlantReport(plant)}
                className="h-11 px-4 rounded-xl bg-[#142017] border border-[#00FF66]/40 text-stone-200 hover:text-white text-xs font-bold hover:bg-[#1B2C1F] hover:border-[#00FF66] transition-colors flex items-center gap-2 cursor-pointer shadow-neon-sm"
                title="Send official diagnostic email report via Gmail"
              >
                <Mail className="w-4 h-4 text-[#00FF66]" />
                <span>Email Report via Gmail</span>
              </button>
            )}

            <button
              onClick={() => onAskAIAboutPlant(plant)}
              className="h-11 px-4 rounded-xl bg-[#142017] border border-[#00FF66]/40 text-[#00FF66] text-xs font-bold hover:bg-[#1B2C1F] hover:border-[#00FF66] transition-colors flex items-center gap-2 cursor-pointer shadow-neon-sm"
            >
              <Sparkles className="w-4 h-4 text-[#00FF66]" />
              <span>Ask Agro AI About This Plant</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
