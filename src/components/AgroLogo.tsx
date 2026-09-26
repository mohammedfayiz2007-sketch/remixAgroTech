import React from 'react';

interface AgroLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  textColor?: string;
}

export const AgroLogo: React.FC<AgroLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  textColor = 'text-white',
}) => {
  // Dimension presets for the emblem mark
  const sizeMap = {
    sm: { mark: 'w-7 h-7', text: 'text-lg', subtext: 'text-[9px]' },
    md: { mark: 'w-10 h-10', text: 'text-xl', subtext: 'text-[11px]' },
    lg: { mark: 'w-14 h-14', text: 'text-2xl', subtext: 'text-xs' },
    xl: { mark: 'w-20 h-20', text: 'text-4xl', subtext: 'text-sm' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Precision Vector Emblem Mark of the uploaded Agro Ribbon Leaf 'A' */}
      <div className={`${currentSize.mark} shrink-0 drop-shadow-[0_0_12px_rgba(0,255,102,0.35)]`}>
        <svg
          viewBox="0 0 400 400"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Left ribbon primary gradient (lime to vibrant green) */}
            <linearGradient id="agroLeftRibbon" x1="120" y1="300" x2="210" y2="70" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#48C324" />
              <stop offset="25%" stopColor="#67DF35" />
              <stop offset="60%" stopColor="#2BA31E" />
              <stop offset="100%" stopColor="#126815" />
            </linearGradient>

            {/* Top apex loop gradient */}
            <linearGradient id="agroApex" x1="180" y1="70" x2="250" y2="150" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#67DF35" />
              <stop offset="50%" stopColor="#1E891A" />
              <stop offset="100%" stopColor="#0B4A11" />
            </linearGradient>

            {/* Right leg downward fold */}
            <linearGradient id="agroRightLeg" x1="220" y1="130" x2="310" y2="310" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#157B18" />
              <stop offset="60%" stopColor="#0B4E12" />
              <stop offset="100%" stopColor="#06320B" />
            </linearGradient>

            {/* Main leaf blade gradient */}
            <linearGradient id="agroLeafTop" x1="160" y1="280" x2="330" y2="120" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#259B1B" />
              <stop offset="35%" stopColor="#44C226" />
              <stop offset="70%" stopColor="#5BE033" />
              <stop offset="100%" stopColor="#7AEB42" />
            </linearGradient>

            {/* Leaf lower curve shadow */}
            <linearGradient id="agroLeafBottom" x1="160" y1="300" x2="280" y2="240" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0E5114" />
              <stop offset="50%" stopColor="#197319" />
              <stop offset="100%" stopColor="#2EA820" />
            </linearGradient>

            {/* Inner fold shadow */}
            <linearGradient id="agroFoldShadow" x1="160" y1="260" x2="185" y2="290" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#062F0A" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#062F0A" stopOpacity="0" />
            </linearGradient>

            {/* Drop shadow filter for leaf depth */}
            <filter id="leafShadow" x="120" y="80" width="220" height="240" filterUnits="userSpaceOnUse">
              <feDropShadow dx="-2" dy="4" stdDeviation="6" floodColor="#041E07" floodOpacity="0.5" />
            </filter>
          </defs>

          {/* BACKGROUND RIGHT LEG OF 'A' */}
          <path
            d="M 215,75 
               C 235,90 252,130 290,240 
               C 305,280 320,305 310,308 
               C 275,310 240,270 230,225 
               C 220,180 200,125 185,95 Z"
            fill="url(#agroRightLeg)"
          />

          {/* INNER FOLD SHADOW BEHIND MAIN ARCH */}
          <path
            d="M 175,200 
               C 160,250 140,290 120,305 
               C 135,305 160,285 175,240 Z"
            fill="url(#agroFoldShadow)"
          />

          {/* LEFT ARCHING STRIP OF 'A' (Folded dynamic ribbon) */}
          <path
            d="M 120,305 
               C 105,295 110,265 140,190 
               C 170,115 195,70 215,75 
               C 230,78 220,110 195,160 
               C 170,210 155,270 160,290 
               C 165,302 145,308 120,305 Z"
            fill="url(#agroLeftRibbon)"
          />

          {/* BOTTOM LEFT FOLD CURL */}
          <path
            d="M 120,305 
               C 135,280 155,270 170,290 
               C 155,305 135,312 120,305 Z"
            fill="#52D029"
          />

          {/* THE PROMINENT RIGHT LEAF WITH TAPERED WHITE VEIN */}
          <g filter="url(#leafShadow)">
            {/* Leaf Body Upper */}
            <path
              d="M 160,295 
                 C 165,250 185,185 240,140 
                 C 275,110 315,95 325,98 
                 C 328,105 315,145 280,185 
                 C 240,230 190,280 160,295 Z"
              fill="url(#agroLeafTop)"
            />

            {/* Leaf Body Lower half shading */}
            <path
              d="M 160,295 
                 C 175,275 220,240 260,205 
                 C 285,185 310,145 325,98 
                 C 310,120 280,170 245,210 
                 C 205,255 175,285 160,295 Z"
              fill="url(#agroLeafBottom)"
            />

            {/* Crisp Pure White Central Vein curving gracefully from leaf base to tip */}
            <path
              d="M 162,293 
                 C 175,255 200,195 245,155 
                 C 275,130 305,108 322,100 
                 C 300,112 268,138 238,168 
                 C 195,210 170,265 162,293 Z"
              fill="#FFFFFF"
            />
          </g>

          {/* SUBTLE HIGHLIGHT SWEEP ON LEFT SHOULDER */}
          <path
            d="M 180,85 
               C 195,73 212,74 218,80 
               C 210,83 195,95 185,115 
               C 178,102 176,92 180,85 Z"
            fill="#9BFF69"
            opacity="0.85"
          />
        </svg>
      </div>

      {/* Modern 'Agro' Typography matching the provided logo brandmark */}
      {showText && (
        <div className="flex flex-col justify-center">
          <div className="flex items-baseline gap-1.5 leading-none">
            <span
              className={`font-black tracking-tight ${currentSize.text} ${textColor} font-sans`}
              style={{ letterSpacing: '-0.03em' }}
            >
              Agro
            </span>
            <span className="text-[10px] font-extrabold tracking-widest text-[#00FF66] bg-[#00FF66]/10 border border-[#00FF66]/30 px-1.5 py-0.5 rounded uppercase">
              AI
            </span>
          </div>
          <span className={`${currentSize.subtext} font-semibold text-stone-400 tracking-tight mt-0.5`}>
            Detect Early. Grow Better.
          </span>
        </div>
      )}
    </div>
  );
};
