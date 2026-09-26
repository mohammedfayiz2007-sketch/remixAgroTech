import React, { useState, useEffect, useCallback } from 'react';
import {
  Cloud,
  Droplets,
  Wind,
  Sun,
  AlertTriangle,
  RefreshCw,
  MapPin,
  ChevronRight,
  Info,
  Calendar,
  Compass,
  CheckCircle2,
  Thermometer,
  CloudRain,
  Eye,
  Activity,
} from 'lucide-react';
import { UserSession } from '../types';

export interface WeatherData {
  location: string;
  coordinates: { lat: number; lng: number };
  current: {
    temperature: number;
    feelsLike: number;
    humidity: number;
    dewPoint: number;
    condition: string;
    iconUri: string;
    windSpeed: number;
    windDirection: string;
    rainProbability: number;
    uvIndex: number;
    cloudCover: number;
    updatedAt: string;
  };
  diseaseRisk: {
    level: 'low' | 'moderate' | 'critical';
    title: string;
    description: string;
    sporeIndex: number;
    leafWetnessHours: number;
    primaryThreats: string[];
  };
  sprayWindow: {
    status: string;
    advice: string;
    badgeClass: string;
  };
  forecast: Array<{
    date: string;
    dayName: string;
    maxTemp: number;
    minTemp: number;
    condition: string;
    iconUri: string;
    rainProbability: number;
    humidity: number;
    isHighHumidity: boolean;
  }>;
}

interface WeatherForecastCardProps {
  userSession: UserSession;
  className?: string;
  onOpenAssistantForWeatherAdvice?: () => void;
}

export const WeatherForecastCard: React.FC<WeatherForecastCardProps> = ({
  userSession,
  className = '',
  onOpenAssistantForWeatherAdvice,
}) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isFahrenheit, setIsFahrenheit] = useState<boolean>(false);
  const [selectedDayIdx, setSelectedDayIdx] = useState<number>(0);
  const [isOfflineCached, setIsOfflineCached] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchWeather = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setErrorMsg(null);

    const lat = userSession.latitude || 19.9975;
    const lng = userSession.longitude || 73.7898;
    const location = userSession.location || 'Nashik Valley Agro-Belt';

    try {
      const res = await fetch(`/api/weather?lat=${lat}&lng=${lng}&location=${encodeURIComponent(location)}`);
      if (!res.ok) {
        throw new Error(`Weather service returned ${res.status}`);
      }
      const data: WeatherData = await res.json();
      setWeather(data);
      setIsOfflineCached(!navigator.onLine);
    } catch (err: any) {
      console.warn('Could not fetch live weather, checking fallback:', err);
      // Fallback data if completely offline without cache
      if (!weather) {
        setWeather({
          location: userSession.location || 'Nashik Valley Agro-Belt',
          coordinates: { lat, lng },
          current: {
            temperature: 28.5,
            feelsLike: 30.2,
            humidity: 68,
            dewPoint: 20.4,
            condition: 'Partly Cloudy',
            iconUri: 'https://maps.gstatic.com/weather/v1/partly_cloudy',
            windSpeed: 14,
            windDirection: 'W',
            rainProbability: 15,
            uvIndex: 4,
            cloudCover: 65,
            updatedAt: 'Offline Cached',
          },
          diseaseRisk: {
            level: 'moderate',
            title: 'Elevated Pathogen Risk',
            description: 'Elevated ambient humidity (68% RH) favors Early Blight and bacterial spots. Inspect lower leaves.',
            sporeIndex: 64,
            leafWetnessHours: 5.0,
            primaryThreats: ['Early Blight (Alternaria)', 'Bacterial Leaf Spot', 'Cercospora'],
          },
          sprayWindow: {
            status: 'Moderate Window',
            advice: 'Moderate breeze (14 km/h). Use coarser droplet nozzles and spray close to canopy.',
            badgeClass: 'text-amber-300 border-amber-500/40 bg-amber-950/30',
          },
          forecast: [
            { date: '2026-09-26', dayName: 'Today', maxTemp: 29, minTemp: 22, condition: 'Partly Cloudy', iconUri: 'https://maps.gstatic.com/weather/v1/partly_cloudy', rainProbability: 15, humidity: 68, isHighHumidity: false },
            { date: '2026-09-27', dayName: 'Tomorrow', maxTemp: 28, minTemp: 21, condition: 'Scattered Clouds', iconUri: 'https://maps.gstatic.com/weather/v1/mostly_cloudy', rainProbability: 25, humidity: 74, isHighHumidity: false },
            { date: '2026-09-28', dayName: 'Mon', maxTemp: 27, minTemp: 21, condition: 'Light Rain Showers', iconUri: 'https://maps.gstatic.com/weather/v1/rain', rainProbability: 60, humidity: 82, isHighHumidity: true },
            { date: '2026-09-29', dayName: 'Tue', maxTemp: 28, minTemp: 22, condition: 'Humid / Fog', iconUri: 'https://maps.gstatic.com/weather/v1/cloudy', rainProbability: 40, humidity: 79, isHighHumidity: true },
            { date: '2026-09-30', dayName: 'Wed', maxTemp: 30, minTemp: 23, condition: 'Mostly Sunny', iconUri: 'https://maps.gstatic.com/weather/v1/clear', rainProbability: 10, humidity: 62, isHighHumidity: false },
          ],
        });
        setIsOfflineCached(true);
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [userSession.latitude, userSession.longitude, userSession.location, weather]);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  const toTemp = (celsius: number) => {
    if (isFahrenheit) {
      return `${Math.round((celsius * 9) / 5 + 32)}°F`;
    }
    return `${celsius}°C`;
  };

  if (isLoading && !weather) {
    return (
      <div className={`bg-[#0E1410] rounded-2xl border border-[#1E2B20] p-5 shadow-xl space-y-4 animate-pulse ${className}`}>
        <div className="flex justify-between items-center">
          <div className="h-4 w-44 bg-[#1A261C] rounded"></div>
          <div className="h-8 w-24 bg-[#1A261C] rounded-lg"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="h-28 bg-[#141C15] rounded-xl"></div>
          <div className="h-28 bg-[#141C15] rounded-xl"></div>
          <div className="h-28 bg-[#141C15] rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (!weather) return null;

  const currentHum = weather.current.humidity;
  const isHighHum = currentHum >= 75;
  const isCriticalHum = currentHum >= 80;

  // Disease Risk Ring Color
  const riskBorderColor =
    weather.diseaseRisk.level === 'critical'
      ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
      : weather.diseaseRisk.level === 'moderate'
      ? 'border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.25)]'
      : 'border-[#00FF66] shadow-[0_0_15px_rgba(0,255,102,0.25)]';

  const riskBadgeColor =
    weather.diseaseRisk.level === 'critical'
      ? 'bg-red-500/20 text-red-400 border-red-500/50'
      : weather.diseaseRisk.level === 'moderate'
      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
      : 'bg-[#00FF66]/20 text-[#00FF66] border-[#00FF66]/50';

  return (
    <div className={`bg-[#0E1410] rounded-2xl border border-[#1E2B20] shadow-xl overflow-hidden transition-all text-stone-200 ${className}`}>
      
      {/* Top Header Bar */}
      <div className="p-4 sm:p-5 border-b border-[#1C281E] bg-[#121913] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#00FF66]/10 border border-[#00FF66]/30 text-[#00FF66]">
            <Cloud className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-tight">
                Farm Microclimate &amp; Disease Radar
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#00FF66]/10 text-[#00FF66] border border-[#00FF66]/30 uppercase tracking-wider">
                Live Sensor Feed
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-stone-400 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-[#00FF66] shrink-0" />
              <span className="truncate max-w-[260px] sm:max-w-md font-medium">
                {weather.location}
              </span>
              <span className="text-stone-600">·</span>
              <span className="text-[11px] font-mono text-stone-500">
                {weather.coordinates.lat.toFixed(2)}°N, {weather.coordinates.lng.toFixed(2)}°E
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {isOfflineCached && (
            <span className="text-[10px] font-semibold bg-stone-800 text-stone-300 border border-stone-700 px-2 py-1 rounded-lg">
              Offline Cache
            </span>
          )}

          {/* Unit Toggle */}
          <button
            onClick={() => setIsFahrenheit(!isFahrenheit)}
            className="px-2.5 py-1.5 rounded-lg border border-[#233325] bg-[#141C15] text-stone-300 hover:text-white text-xs font-semibold hover:border-[#00FF66] transition-colors cursor-pointer"
            title="Toggle Temperature Unit"
          >
            {isFahrenheit ? '°F' : '°C'}
          </button>

          {/* Refresh button */}
          <button
            onClick={() => fetchWeather(true)}
            disabled={isRefreshing}
            className="p-2 rounded-lg border border-[#233325] bg-[#141C15] text-stone-300 hover:text-white hover:border-[#00FF66] transition-colors cursor-pointer disabled:opacity-50"
            title="Refresh current meteorological conditions"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#00FF66] ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Meteorological Grid */}
      <div className="p-4 sm:p-6 space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* Tile 1: Current Ambient Conditions (5 cols) */}
          <div className="md:col-span-4 bg-[#141C15] border border-[#202E22] rounded-2xl p-4 flex flex-col justify-between shadow-inner">
            <div className="flex items-center justify-between pb-3 border-b border-[#1C281E]">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                Current Atmosphere
              </span>
              <span className="text-[11px] font-bold text-[#00FF66]">
                {weather.current.condition}
              </span>
            </div>

            <div className="py-4 flex items-center justify-between">
              <div>
                <div className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                  {toTemp(weather.current.temperature)}
                </div>
                <div className="text-xs text-stone-400 mt-1">
                  Feels like <span className="font-semibold text-stone-200">{toTemp(weather.current.feelsLike)}</span>
                </div>
              </div>

              <div className="w-16 h-16 rounded-2xl bg-black/40 border border-[#223325] p-2 flex items-center justify-center shrink-0">
                <img
                  src={weather.current.iconUri}
                  alt={weather.current.condition}
                  className="w-12 h-12 object-contain filter drop-shadow-[0_0_8px_rgba(0,255,102,0.4)]"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = 'https://maps.gstatic.com/weather/v1/partly_cloudy';
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#1C281E] text-xs">
              <div className="flex items-center gap-1.5 text-stone-300">
                <CloudRain className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>Rain: <strong>{weather.current.rainProbability}%</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-stone-300">
                <Wind className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span>Wind: <strong>{weather.current.windSpeed} km/h {weather.current.windDirection}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-stone-300">
                <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>UV Index: <strong>{weather.current.uvIndex}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-stone-300">
                <Eye className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span>Clouds: <strong>{weather.current.cloudCover}%</strong></span>
              </div>
            </div>
          </div>

          {/* Tile 2: CRITICAL HUMIDITY & DISEASE SPREAD RADAR (5 cols) */}
          <div className="md:col-span-5 bg-[#141C15] border border-[#202E22] rounded-2xl p-4 flex flex-col justify-between shadow-inner relative overflow-hidden">
            
            {/* Background subtle glow */}
            <div
              className={`absolute -right-12 -top-12 w-36 h-36 rounded-full blur-3xl opacity-20 pointer-events-none ${
                isCriticalHum ? 'bg-red-500' : isHighHum ? 'bg-amber-500' : 'bg-[#00FF66]'
              }`}
            />

            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#1C281E]">
                <div className="flex items-center gap-1.5">
                  <Droplets className={`w-4 h-4 ${isCriticalHum ? 'text-red-400' : isHighHum ? 'text-amber-400' : 'text-[#00FF66]'}`} />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Relative Humidity &amp; Spore Index
                  </span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${riskBadgeColor}`}>
                  {weather.diseaseRisk.level.toUpperCase()} RISK
                </span>
              </div>

              <div className="py-3 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-black text-white font-mono">
                      {currentHum}%
                    </span>
                    <span className="text-xs font-bold text-stone-400 uppercase">
                      RH (Ambient)
                    </span>
                  </div>
                  <div className="text-xs font-semibold mt-1 flex items-center gap-1.5 text-stone-300">
                    <Thermometer className="w-3.5 h-3.5 text-sky-400" />
                    <span>Dew Point: <strong>{toTemp(weather.current.dewPoint)}</strong></span>
                  </div>
                </div>

                {/* Circular Disease Risk Meter */}
                <div className="text-right">
                  <div className={`inline-flex flex-col items-center justify-center w-16 h-16 rounded-full border-2 bg-black/60 ${riskBorderColor}`}>
                    <span className="text-lg font-black text-white font-mono leading-none">
                      {weather.diseaseRisk.sporeIndex}
                    </span>
                    <span className="text-[9px] uppercase font-bold text-stone-400 tracking-tighter mt-0.5">
                      Spore / 100
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress gauge */}
              <div className="space-y-1">
                <div className="w-full h-2 rounded-full bg-[#0A0D0A] overflow-hidden border border-[#202E22]">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${
                      isCriticalHum
                        ? 'bg-gradient-to-r from-amber-500 to-red-500 shadow-[0_0_8px_#EF4444]'
                        : isHighHum
                        ? 'bg-gradient-to-r from-[#00FF66] to-amber-400 shadow-[0_0_8px_#F59E0B]'
                        : 'bg-gradient-to-r from-emerald-600 to-[#00FF66] shadow-[0_0_8px_#00FF66]'
                    }`}
                    style={{ width: `${Math.min(currentHum, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-stone-400 font-medium">
                  <span>Dry (&lt;55%)</span>
                  <span>Optimal (55-75%)</span>
                  <span className="text-red-400 font-bold">Fungal Danger (&gt;75%)</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#1C281E] mt-3 space-y-1 text-xs">
              <div className="text-[11px] text-stone-300 leading-snug">
                <strong className="text-white">Pathogen Alerts:</strong>{' '}
                {weather.diseaseRisk.primaryThreats.join(', ')}
              </div>
              <div className="text-[10px] text-stone-400">
                Leaf wetness period tonight: <strong className="text-[#00FF66]">{weather.diseaseRisk.leafWetnessHours} hours</strong>
              </div>
            </div>

          </div>

          {/* Tile 3: SPRAY ADVISORY & FIELD WORK (3 cols) */}
          <div className="md:col-span-3 bg-[#141C15] border border-[#202E22] rounded-2xl p-4 flex flex-col justify-between shadow-inner">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#1C281E]">
                <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                  Spray Window
                </span>
                <Compass className="w-4 h-4 text-[#00FF66]" />
              </div>

              <div className="py-3">
                <div className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold border mb-2 ${weather.sprayWindow.badgeClass}`}>
                  {weather.sprayWindow.status}
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  {weather.sprayWindow.advice}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-[#1C281E]">
              {onOpenAssistantForWeatherAdvice ? (
                <button
                  onClick={onOpenAssistantForWeatherAdvice}
                  className="w-full py-2 px-3 rounded-xl bg-[#00FF66]/10 text-[#00FF66] border border-[#00FF66]/30 text-xs font-bold hover:bg-[#00FF66]/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-neon-sm"
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Ask AI Spray Plan</span>
                </button>
              ) : (
                <div className="text-[10px] text-stone-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-[#00FF66]" />
                  <span>Calibrated for foliar bio-controls</span>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Dynamic High-Humidity Disease Prevention Action Banner */}
        <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
          isCriticalHum
            ? 'bg-red-950/20 border-red-500/40 text-red-200'
            : isHighHum
            ? 'bg-amber-950/20 border-amber-500/40 text-amber-200'
            : 'bg-[#121913] border-[#00FF66]/30 text-stone-200'
        }`}>
          <div className="flex items-start gap-2.5">
            <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${
              isCriticalHum ? 'text-red-400' : isHighHum ? 'text-amber-400' : 'text-[#00FF66]'
            }`} />
            <div>
              <div className="font-bold text-white text-xs sm:text-sm">
                {weather.diseaseRisk.title} — Agronomic Protocol
              </div>
              <p className="text-[11px] text-stone-300 mt-0.5 leading-relaxed max-w-3xl">
                {weather.diseaseRisk.description}
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <span className="text-[11px] font-bold text-stone-400">
              Protocol: <span className="text-[#00FF66] font-mono">AGRO-RH-{currentHum}</span>
            </span>
          </div>
        </div>

        {/* 5-Day Agricultural Weather & Humidity Outlook */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#00FF66]" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                5-Day Microclimate &amp; Humidity Outlook
              </h3>
            </div>
            <span className="text-[11px] text-stone-400">
              Check upcoming moisture spikes before foliar application
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {weather.forecast.map((day, idx) => (
              <div
                key={day.date}
                onClick={() => setSelectedDayIdx(idx)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  selectedDayIdx === idx
                    ? 'border-[#00FF66] bg-[#162218] shadow-neon-sm'
                    : 'border-[#1E2B20] bg-[#121913] hover:border-stone-500 hover:bg-[#141D15]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white">
                      {day.dayName}
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono">
                      {day.date.slice(5)}
                    </span>
                  </div>

                  <div className="my-2.5 flex items-center justify-between">
                    <img
                      src={day.iconUri}
                      alt={day.condition}
                      className="w-8 h-8 object-contain"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = 'https://maps.gstatic.com/weather/v1/partly_cloudy';
                      }}
                    />
                    <div className="text-right">
                      <div className="text-xs font-bold text-white">
                        {toTemp(day.maxTemp)}
                      </div>
                      <div className="text-[10px] text-stone-400">
                        {toTemp(day.minTemp)}
                      </div>
                    </div>
                  </div>

                  <div className="text-[11px] text-stone-300 truncate font-medium">
                    {day.condition}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-[#1C281E] flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-1 text-sky-400 font-bold">
                    <CloudRain className="w-3 h-3" />
                    <span>{day.rainProbability}%</span>
                  </div>

                  <div
                    className={`px-1.5 py-0.5 rounded font-bold font-mono ${
                      day.isHighHumidity
                        ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                        : 'bg-[#00FF66]/10 text-[#00FF66] border border-[#00FF66]/30'
                    }`}
                    title={day.isHighHumidity ? 'High humidity spike: Fungal sporulation risk' : 'Normal canopy moisture'}
                  >
                    {day.humidity}% RH
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
