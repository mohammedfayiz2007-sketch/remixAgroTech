import React, { useState } from 'react';
import { CheckCircle, ArrowRight, Sparkles, Navigation, Shield } from 'lucide-react';
import { UserSession } from '../types';
import { AgroLogo } from './AgroLogo';

interface OnboardingModalProps {
  onComplete: (user: UserSession) => void;
}

const COMMON_REGIONS = [
  { name: 'Nashik Agricultural Valley, Maharashtra', lat: 19.9975, lng: 73.7898 },
  { name: 'Punjab Agricultural Belt (Ludhiana)', lat: 30.9010, lng: 75.8573 },
  { name: 'Guntur & Krishna Crop Basin, Andhra Pradesh', lat: 16.3067, lng: 80.4365 },
  { name: 'Bengaluru Rural & Kolar District, Karnataka', lat: 13.1363, lng: 77.5684 },
  { name: 'Karnal & Kurukshetra Agronomy Zone, Haryana', lat: 29.6857, lng: 76.9905 },
  { name: 'Varanasi & Indo-Gangetic Plains, Uttar Pradesh', lat: 25.3176, lng: 82.9739 },
  { name: 'Thanjavur Cauvery Delta, Tamil Nadu', lat: 10.7870, lng: 79.1378 },
  { name: 'Anand & Saurashtra Agro Belt, Gujarat', lat: 22.5645, lng: 72.9289 },
];

const LANGUAGES = [
  'English (India)',
  'हिन्दी (Hindi)',
  'मराठी (Marathi)',
  'ਪੰਜਾਬੀ (Punjabi)',
  'తెలుగు (Telugu)',
  'தமிழ் (Tamil)',
  'ಕನ್ನಡ (Kannada)',
  'ગુજરાતી (Gujarati)',
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onComplete }) => {
  const [authMode, setAuthMode] = useState<'options' | 'form'>('options');
  const [method, setMethod] = useState<'google' | 'email' | 'phone'>('google');
  const [name, setName] = useState('Rajesh Sharma');
  const [emailOrPhone, setEmailOrPhone] = useState('rajesh.sharma@agro-farms.in');
  const [location, setLocation] = useState('Nashik Agricultural Valley, Maharashtra');
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({ lat: 19.9975, lng: 73.7898 });
  const [language, setLanguage] = useState('English (India)');
  const [isLocating, setIsLocating] = useState(false);
  const [welcomeName, setWelcomeName] = useState<string | null>(null);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser. Please select your region manually.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocation(`GPS: ${pos.coords.latitude.toFixed(2)}°N, ${pos.coords.longitude.toFixed(2)}°E`);
      },
      (err) => {
        setIsLocating(false);
        console.warn('Geolocation error:', err);
        setLocation('Nashik Agricultural Valley, Maharashtra');
      },
      { timeout: 8000 }
    );
  };

  const handleSelectPredefinedLocation = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = COMMON_REGIONS.find((r) => r.name === e.target.value);
    if (selected) {
      setLocation(selected.name);
      setCoords({ lat: selected.lat, lng: selected.lng });
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const finalName = name.trim() || 'Farmer';
    setWelcomeName(finalName);

    setTimeout(() => {
      onComplete({
        name: finalName,
        emailOrPhone: emailOrPhone.trim() || 'farmer@agro.local',
        location,
        latitude: coords.lat,
        longitude: coords.lng,
        language,
        isOnboarded: true,
        joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      });
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-[#0D120E] text-stone-100 rounded-2xl border border-[#00FF66]/30 shadow-neon max-w-lg w-full overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Welcome Splash overlay when completed */}
        {welcomeName ? (
          <div className="p-8 text-center flex flex-col items-center justify-center min-h-[380px]">
            <div className="w-16 h-16 rounded-full bg-[#00FF66]/10 border border-[#00FF66] text-[#00FF66] flex items-center justify-center mb-4 shadow-neon animate-bounce">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Welcome to Agro, <span className="text-[#00FF66]">{welcomeName}</span> 🌱
            </h2>
            <p className="text-sm text-stone-400 max-w-sm mb-6">
              Initializing AI crop health decision support system for {location}...
            </p>
            <div className="w-48 h-1.5 bg-[#162218] rounded-full overflow-hidden">
              <div className="w-full h-full bg-[#00FF66] animate-pulse" />
            </div>
          </div>
        ) : (
          <div>
            {/* Header banner with Black and Neon green */}
            <div className="bg-[#080B09] border-b border-[#1E2C20] px-6 py-6 text-white relative">
              <div className="flex items-center justify-between mb-3">
                <AgroLogo size="lg" />
                <span className="text-[10px] font-bold text-[#00FF66] bg-[#00FF66]/10 border border-[#00FF66]/30 px-2 py-0.5 rounded-full">
                  BIO-INTELLIGENCE
                </span>
              </div>
              <h1 className="text-lg font-bold mt-3 text-white">
                Start Monitoring Your Crops
              </h1>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                AI foliar disease detection, real-time spread tracking, and grower decision support.
              </p>
            </div>

            {/* Content area */}
            <div className="p-6">
              {authMode === 'options' ? (
                <div className="space-y-4">
                  <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                    Sign in or create grower account
                  </p>

                  {/* Google option */}
                  <button
                    onClick={() => {
                      setMethod('google');
                      setAuthMode('form');
                    }}
                    className="w-full h-12 flex items-center justify-center gap-3 rounded-xl border border-[#233325] bg-[#121913] hover:bg-[#18231A] hover:border-[#00FF66]/50 font-semibold text-white text-sm transition-all"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </button>

                  {/* Email option */}
                  <button
                    onClick={() => {
                      setMethod('email');
                      setAuthMode('form');
                    }}
                    className="w-full h-12 flex items-center justify-center gap-3 rounded-xl border border-[#233325] bg-[#121913] hover:bg-[#18231A] hover:border-[#00FF66]/50 font-semibold text-white text-sm transition-all"
                  >
                    <span>✉️</span>
                    <span>Continue with Email</span>
                  </button>

                  {/* Phone option */}
                  <button
                    onClick={() => {
                      setMethod('phone');
                      setAuthMode('form');
                    }}
                    className="w-full h-12 flex items-center justify-center gap-3 rounded-xl border border-[#233325] bg-[#121913] hover:bg-[#18231A] hover:border-[#00FF66]/50 font-semibold text-white text-sm transition-all"
                  >
                    <span>📱</span>
                    <span>Continue with Phone</span>
                  </button>

                  <div className="pt-2 text-center">
                    <p className="text-[11px] text-stone-500">
                      Used by commercial growers, smallholder farmers, and agricultural advisors worldwide.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name field */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">
                      Grower / Farm Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Marcus Vance or Green Valley Orchards"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#2A3C2D] bg-[#141B15] text-white text-sm focus:outline-none focus:border-[#00FF66] focus:ring-1 focus:ring-[#00FF66]"
                    />
                  </div>

                  {/* Email or Phone field */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">
                      {method === 'phone' ? 'Mobile Phone Number' : 'Email Address'}
                    </label>
                    <input
                      type={method === 'phone' ? 'tel' : 'email'}
                      required
                      value={emailOrPhone}
                      onChange={(e) => setEmailOrPhone(e.target.value)}
                      placeholder={method === 'phone' ? '+1 (555) 234-5678' : 'grower@farm.com'}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#2A3C2D] bg-[#141B15] text-white text-sm focus:outline-none focus:border-[#00FF66] focus:ring-1 focus:ring-[#00FF66]"
                    />
                  </div>

                  {/* Location selection */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-stone-300">
                        Agricultural Location
                      </label>
                      <button
                        type="button"
                        onClick={handleUseCurrentLocation}
                        disabled={isLocating}
                        className="text-[11px] text-[#00FF66] hover:text-[#52FF96] font-semibold flex items-center gap-1"
                      >
                        <Navigation className={`w-3 h-3 ${isLocating ? 'animate-spin' : ''}`} />
                        {isLocating ? 'Detecting...' : 'Use Current Location'}
                      </button>
                    </div>

                    <select
                      value={location}
                      onChange={handleSelectPredefinedLocation}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#2A3C2D] bg-[#141B15] text-white text-sm focus:outline-none focus:border-[#00FF66]"
                    >
                      {COMMON_REGIONS.map((r) => (
                        <option key={r.name} value={r.name} className="bg-[#141B15] text-white">
                          {r.name}
                        </option>
                      ))}
                    </select>
                    <p className="text-[11px] text-stone-500 mt-1">
                      Used to customize local weather risk and area disease alerts.
                    </p>
                  </div>

                  {/* Language selection */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">
                      Preferred Language
                    </label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#2A3C2D] bg-[#141B15] text-white text-sm focus:outline-none focus:border-[#00FF66]"
                    >
                      {LANGUAGES.map((lang) => (
                        <option key={lang} value={lang} className="bg-[#141B15] text-white">
                          {lang}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Privacy note */}
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#121A13] border border-[#223324] text-[11px] text-stone-400">
                    <Shield className="w-4 h-4 text-[#00FF66] shrink-0" />
                    <span>Exact location is never publicly displayed. Only anonymized area signals are shared.</span>
                  </div>

                  {/* Submit button */}
                  <div className="pt-2 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setAuthMode('options')}
                      className="px-4 py-2.5 text-xs font-semibold text-stone-400 hover:text-white"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 h-12 bg-[#00FF66] text-[#080C09] rounded-xl font-bold text-sm hover:bg-[#33FF85] transition-all flex items-center justify-center gap-2 shadow-neon cursor-pointer active:scale-98"
                    >
                      <span>Get Started with AGRO</span>
                      <ArrowRight className="w-4 h-4 stroke-[3]" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
