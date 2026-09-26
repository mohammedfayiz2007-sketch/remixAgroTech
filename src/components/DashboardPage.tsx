import React, { useState, useEffect } from 'react';
import {
  PlusCircle,
  Camera,
  ChevronRight,
  Clock,
  ShieldAlert,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { TrackedPlant, AreaAlert, UserSession } from '../types';
import { HealthStatusBar } from './HealthStatusBar';
import { Shimmer, ShimmerPlantCard } from './Shimmer';
import { WeatherForecastCard } from './WeatherForecastCard';
import {
  TOMATO_EARLY_BLIGHT_IMAGE,
  CHILLI_HEALTHY_IMAGE,
  PADDY_LEAF_BLAST_IMAGE,
  POTATO_LATE_BLIGHT_IMAGE,
  CUCUMBER_POWDERY_MILDEW_IMAGE,
  CORN_LEAF_BLIGHT_IMAGE,
  BRINJAL_LEAF_SPOT_IMAGE,
  WHEAT_LEAF_RUST_IMAGE,
} from '../data/plantImages';

const getCropSpecimenImage = (plant: TrackedPlant) => {
  const latest = plant.scans[plant.scans.length - 1];
  if (latest?.imageUrl) return latest.imageUrl;
  const name = plant.plantName.toLowerCase();
  if (name.includes('tomato')) return TOMATO_EARLY_BLIGHT_IMAGE;
  if (name.includes('chilli') || name.includes('pepper')) return CHILLI_HEALTHY_IMAGE;
  if (name.includes('paddy') || name.includes('rice')) return PADDY_LEAF_BLAST_IMAGE;
  if (name.includes('potato')) return POTATO_LATE_BLIGHT_IMAGE;
  if (name.includes('cucumber') || name.includes('squash')) return CUCUMBER_POWDERY_MILDEW_IMAGE;
  if (name.includes('corn') || name.includes('maize')) return CORN_LEAF_BLIGHT_IMAGE;
  if (name.includes('brinjal') || name.includes('eggplant')) return BRINJAL_LEAF_SPOT_IMAGE;
  if (name.includes('wheat')) return WHEAT_LEAF_RUST_IMAGE;
  return TOMATO_EARLY_BLIGHT_IMAGE;
};

interface DashboardPageProps {
  userSession: UserSession;
  plants: TrackedPlant[];
  alerts: AreaAlert[];
  onSelectPlant: (plant: TrackedPlant) => void;
  onNavigateToScan: () => void;
  onOpenAssistant: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  userSession,
  plants,
  alerts,
  onSelectPlant,
  onNavigateToScan,
  onOpenAssistant,
}) => {
  // Simulated loading / telemetry refresh state
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initial simulated AI data fetch (700ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 700);
    return () => clearTimeout(timer);
  }, []);

  const handleManualRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 850);
  };

  const healthyCount = plants.filter((p) => p.currentHealthScore >= 80).length;
  const recoveringCount = plants.filter(
    (p) => p.currentHealthScore >= 60 && p.currentHealthScore < 80
  ).length;
  const attentionCount = plants.filter((p) => p.currentHealthScore < 60).length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      
      {/* Personalized Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow-[0_0_10px_rgba(0,255,102,0.3)]">
              Good morning, <span className="text-[#00FF66]">{userSession.name}</span> 🌱
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Crop-health control center for <span className="font-semibold text-stone-200">{userSession.location}</span>.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Refresh Telemetry Button to trigger shimmer on demand */}
          <button
            onClick={handleManualRefresh}
            disabled={isLoading}
            title="Refresh crop AI diagnostics & risk indices"
            className="h-11 px-3.5 rounded-xl border border-[#223325] bg-[#121913] hover:border-[#00FF66] text-stone-300 hover:text-white flex items-center gap-2 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#00FF66] ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh Telemetry</span>
          </button>

          <button
            onClick={onNavigateToScan}
            className="h-11 px-5 rounded-xl bg-[#00FF66] text-[#080C09] font-bold text-xs sm:text-sm hover:bg-[#33FF85] shadow-neon flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
          >
            <Camera className="w-4 h-4 text-black stroke-[2.5]" />
            <span>Scan New Plant</span>
          </button>
        </div>
      </div>

      {/* SHIMMER LOADING STATE vs LOADED DASHBOARD */}
      {isLoading ? (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Summary Box Shimmer Skeleton */}
          <div className="bg-[#0E1410] rounded-2xl border border-[#1E2B20] p-5 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1C281E]">
              <div className="space-y-2">
                <Shimmer className="w-36 h-3.5 rounded-md" />
                <Shimmer className="w-48 h-8 rounded-lg" />
              </div>

              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <Shimmer className="w-28 h-8 rounded-lg border border-[#202E22]" />
                <Shimmer className="w-32 h-8 rounded-lg border border-[#202E22]" />
                <Shimmer className="w-36 h-8 rounded-lg border border-[#202E22]" />
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <div className="flex justify-between items-center">
                <Shimmer className="w-44 h-3 rounded" />
                <Shimmer className="w-10 h-3 rounded" />
              </div>
              <Shimmer className="w-full h-3 rounded-full" />
            </div>
          </div>

          {/* Weather Microclimate Shimmer Skeleton */}
          <div className="bg-[#0E1410] rounded-2xl border border-[#1E2B20] p-5 shadow-xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[#1C281E]">
              <div className="flex items-center gap-2">
                <Shimmer className="w-8 h-8 rounded-xl" />
                <div className="space-y-1">
                  <Shimmer className="w-48 h-4 rounded" />
                  <Shimmer className="w-32 h-3 rounded" />
                </div>
              </div>
              <Shimmer className="w-20 h-7 rounded-lg" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <Shimmer className="md:col-span-4 h-36 rounded-2xl" />
              <Shimmer className="md:col-span-5 h-36 rounded-2xl" />
              <Shimmer className="md:col-span-3 h-36 rounded-2xl" />
            </div>
          </div>

          {/* Alerts Shimmer Skeleton */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Shimmer className="w-40 h-4 rounded" />
              <Shimmer className="w-20 h-3 rounded" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl border border-[#1E2B20] bg-[#0F1611] space-y-3"
                >
                  <div className="flex items-center gap-2.5">
                    <Shimmer className="w-6 h-6 rounded-lg shrink-0" />
                    <Shimmer className="w-3/4 h-4 rounded" />
                  </div>
                  <div className="space-y-1.5">
                    <Shimmer className="w-full h-3 rounded" />
                    <Shimmer className="w-4/5 h-3 rounded" />
                  </div>
                  <div className="pt-2 border-t border-[#1C281E] flex justify-between">
                    <Shimmer className="w-16 h-2.5 rounded" />
                    <Shimmer className="w-20 h-2.5 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Plant Cards Shimmer Skeleton (Replaced with reusable ShimmerPlantCard) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Shimmer className="w-36 h-5 rounded" />
              <Shimmer className="w-24 h-4 rounded" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((card) => (
                <ShimmerPlantCard key={card} />
              ))}
            </div>
          </div>

        </div>
      ) : (
        /* Loaded Dashboard Content */
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Plant Overview Metrics Bar */}
          <div className="bg-[#0E1410] rounded-2xl border border-[#1E2B20] p-5 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1C281E]">
              <div>
                <div className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                  Farm Plant Health Summary
                </div>
                <div className="text-2xl font-black text-white mt-0.5">
                  {plants.length} Saved Plants
                </div>
              </div>

              {/* Quick status counter chips */}
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00FF66]/10 text-[#00FF66] border border-[#00FF66]/30 text-xs font-bold shadow-neon-sm">
                  <span>🟢</span>
                  <span>{healthyCount} Healthy</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-bold">
                  <span>🟡</span>
                  <span>{recoveringCount} Recovering</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500/10 text-orange-300 border border-orange-500/30 text-xs font-bold">
                  <span>🟠</span>
                  <span>{attentionCount} Needs Attention</span>
                </div>
              </div>
            </div>

            {/* Global Progress Strip */}
            <div className="pt-3">
              <div className="text-[11px] font-semibold text-stone-300 mb-1.5 flex justify-between">
                <span>Overall Estimated Plot Vigor</span>
                <span className="font-mono text-[#00FF66] font-bold">
                  {plants.length > 0
                    ? Math.round(
                        plants.reduce((acc, p) => acc + p.currentHealthScore, 0) / plants.length
                      )
                    : 100}
                  %
                </span>
              </div>
              <HealthStatusBar
                score={
                  plants.length > 0
                    ? Math.round(
                        plants.reduce((acc, p) => acc + p.currentHealthScore, 0) / plants.length
                      )
                    : 90
                }
                showDetails={false}
                size="md"
              />
            </div>
          </div>

          {/* Real-time Agricultural Weather & Disease Prevention Radar */}
          <WeatherForecastCard
            userSession={userSession}
            onOpenAssistantForWeatherAdvice={onOpenAssistant}
          />

          {/* Dashboard Alerts Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-[#00FF66]" />
                <span>Important Farm Alerts</span>
              </h2>
              <span className="text-[11px] text-stone-400">Live area signals</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-xl border flex flex-col justify-between transition-all bg-[#0F1611] ${
                    alert.severity === 'critical'
                      ? 'border-red-500/50 shadow-[0_0_12px_rgba(239,68,68,0.15)] text-red-200'
                      : alert.severity === 'warning'
                      ? 'border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.15)] text-amber-200'
                      : 'border-[#00FF66]/40 shadow-neon-sm text-stone-200'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-base">{alert.icon}</span>
                      <h3 className="font-bold text-xs leading-snug text-white">
                        {alert.title}
                      </h3>
                    </div>
                    <p className="text-[11px] text-stone-400 leading-relaxed">
                      {alert.description}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-[#1C281E] flex items-center justify-between text-[10px] text-stone-500">
                    <span>{alert.timestamp}</span>
                    <span className="font-bold text-[#00FF66]">Verified Signal</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Saved Plants Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white">
                Monitored Crops
              </h2>
              <button
                onClick={onNavigateToScan}
                className="text-xs font-bold text-[#00FF66] hover:text-[#52FF96] flex items-center gap-1 cursor-pointer transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Add Plant</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {plants.map((plant) => {
                const latestScan = plant.scans[plant.scans.length - 1];

                return (
                  <div
                    key={plant.id}
                    onClick={() => onSelectPlant(plant)}
                    className="bg-[#0E1410] rounded-2xl border border-[#1E2B20] p-4 shadow-lg hover:border-[#00FF66] hover:shadow-neon transition-all cursor-pointer flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-11 h-11 rounded-xl bg-black border border-[#233325] flex items-center justify-center text-lg overflow-hidden shrink-0 group-hover:border-[#00FF66] transition-colors shadow-sm">
                            <img
                              src={getCropSpecimenImage(plant)}
                              alt={plant.customName}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = TOMATO_EARLY_BLIGHT_IMAGE;
                              }}
                            />
                          </div>
                          <div>
                            <h3 className="font-bold text-sm text-white group-hover:text-[#00FF66] transition-colors">
                              {plant.icon} {plant.customName}
                            </h3>
                            <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                              <span className="text-[11px] text-stone-400">
                                {plant.plantName} · {plant.cropType}
                              </span>
                              {(plant.environmentTag || latestScan?.environmentTag) && (
                                <span
                                  className={`text-[9px] font-semibold px-1.5 py-0.2 rounded border ${
                                    (plant.environmentTag || latestScan?.environmentTag) === 'Greenhouse'
                                      ? 'border-emerald-500/40 bg-emerald-950/40 text-emerald-300'
                                      : (plant.environmentTag || latestScan?.environmentTag) === 'Indoor'
                                      ? 'border-cyan-500/40 bg-cyan-950/40 text-cyan-300'
                                      : 'border-amber-500/40 bg-amber-950/40 text-amber-300'
                                  }`}
                                >
                                  {(plant.environmentTag || latestScan?.environmentTag) === 'Greenhouse' && '🌿 Greenhouse'}
                                  {(plant.environmentTag || latestScan?.environmentTag) === 'Indoor' && '🏡 Indoor'}
                                  {(plant.environmentTag || latestScan?.environmentTag) === 'Outdoor' && '☀️ Outdoor'}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="text-stone-500 group-hover:text-[#00FF66] transition-colors p-1">
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>

                      <div className="mb-3 flex items-center justify-between text-xs">
                        <span className="text-stone-400 font-medium">Condition:</span>
                        <span className="font-bold text-white group-hover:text-[#00FF66] transition-colors">
                          {plant.currentDisease}
                        </span>
                      </div>

                      <div className="bg-[#121A13] rounded-lg p-2.5 border border-[#1E2B20]">
                        <HealthStatusBar
                          score={plant.currentHealthScore}
                          severity={plant.currentSeverity}
                          statusLabel={plant.healthStatusLabel}
                          size="sm"
                        />
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#1C281E] flex items-center justify-between text-[11px] text-stone-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-stone-500" />
                        <span>Last scan: {plant.lastScannedDate}</span>
                      </span>
                      <span className="font-bold text-[#00FF66] group-hover:underline">
                        View Timeline →
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
