import React from 'react';

interface AgroBotLogoProps {
  className?: string;
  size?: number | string;
}

export const AgroBotLogo: React.FC<AgroBotLogoProps> = ({
  className = '',
  size = 48,
}) => {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={`overflow-visible select-none ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Glow Filters */}
        <filter id="botNeonGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        <filter id="hologramGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        {/* Head Shell Gradient (Crisp ceramic white to pearl grey) */}
        <linearGradient id="headShell" x1="20" y1="20" x2="80" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="65%" stopColor="#F1F6F2" />
          <stop offset="100%" stopColor="#D4E2D6" />
        </linearGradient>

        {/* Head Green Accent Trim */}
        <linearGradient id="greenTrim" x1="15" y1="20" x2="85" y2="70" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#43D634" />
          <stop offset="50%" stopColor="#1E9C22" />
          <stop offset="100%" stopColor="#0B5614" />
        </linearGradient>

        {/* Visor Screen Gradient (Dark glossy curved monitor glass) */}
        <radialGradient id="screenGlass" cx="48%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#253229" />
          <stop offset="60%" stopColor="#111812" />
          <stop offset="100%" stopColor="#070C08" />
        </radialGradient>

        {/* Plant Sprout Leaves on top */}
        <linearGradient id="sproutGradient1" x1="45" y1="25" x2="25" y2="5" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1B8721" />
          <stop offset="50%" stopColor="#45D835" />
          <stop offset="100%" stopColor="#6EEB46" />
        </linearGradient>

        <linearGradient id="sproutGradient2" x1="50" y1="25" x2="72" y2="5" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#167A1B" />
          <stop offset="50%" stopColor="#3BCB2C" />
          <stop offset="100%" stopColor="#67DF35" />
        </linearGradient>

        {/* Neon Green Face Glow */}
        <linearGradient id="neonFace" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#80FF77" />
          <stop offset="100%" stopColor="#00FF66" />
        </linearGradient>

        {/* Hologram Rings at bottom */}
        <linearGradient id="holoRingGrad" x1="30" y1="92" x2="70" y2="92" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00FF66" stopOpacity="0.1" />
          <stop offset="50%" stopColor="#00FF66" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#00FF66" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      {/* 1. BOTTOM LEVITATION HOLOGRAPHIC EMITTER RINGS */}
      <g opacity="0.85">
        <ellipse cx="49" cy="94" rx="20" ry="3.5" stroke="url(#holoRingGrad)" strokeWidth="1.5" filter="url(#hologramGlow)" />
        <ellipse cx="49" cy="91" rx="13" ry="2.2" stroke="#00FF66" strokeWidth="1.5" strokeOpacity="0.9" />
        <ellipse cx="49" cy="88" rx="7" ry="1.4" fill="#00FF66" fillOpacity="0.8" filter="url(#botNeonGlow)" />
      </g>

      {/* 2. BODY CHASSIS */}
      <g>
        {/* Lower floating body cone/pod */}
        <path
          d="M37 73C37 73 40 85 49 85C58 85 61 73 61 73L37 73Z"
          fill="#13741A"
        />
        <path
          d="M40 76C40 76 43 83 49 83C55 83 58 76 58 76L40 76Z"
          fill="#44D735"
        />

        {/* Torso capsule */}
        <ellipse cx="49" cy="69" rx="17" ry="11" fill="url(#headShell)" stroke="#D0DED3" strokeWidth="0.8" />
        {/* Torso green waist band */}
        <path d="M34 71C38 73.5 60 73.5 64 71C63 74 58 77 49 77C40 77 35 74 34 71Z" fill="#1B8721" />

        {/* Dual Foliage Emblem on Chest */}
        <path
          d="M47 69C45 66 43.5 66 42 67C43 68.5 45 71 47.5 71C48.5 71 48 69.5 47 69Z"
          fill="#1C9223"
        />
        <path
          d="M51 68C53 64.5 56 63 58 64C57 66 55 69.5 51.5 70.5C50.5 70.5 50.5 69 51 68Z"
          fill="#1A8320"
        />
        {/* Chest emblem leaf white vein */}
        <path d="M51.5 69.5C53.5 67.5 55.5 65.5 57 64.5" stroke="#FFFFFF" strokeWidth="0.5" strokeLinecap="round" />
      </g>

      {/* 3. LEFT & RIGHT ROBOT ARMS */}
      {/* Right Arm (Waving friendly hand) */}
      <g>
        {/* Shoulder joint */}
        <circle cx="67" cy="61" r="4.2" fill="#13741A" />
        <circle cx="67" cy="61" r="2.8" fill="#3FD431" />
        {/* Forearm angled up in wave */}
        <path
          d="M68 59C72 56 77 52 82 48C84 46.5 86.5 48.5 85 50.5C80 56 75 62 70 65C68.5 66 67 63 68 59Z"
          fill="url(#headShell)"
          stroke="#D0DED3"
          strokeWidth="0.6"
        />
        {/* Green forearm accent cuff */}
        <path d="M74 53L77 50C78 52 76 56 74 57L72 56C73 54.5 73.5 53.5 74 53Z" fill="#167A1B" />
        {/* Cute 2-finger waving mitten */}
        <path
          d="M82 48C84 45 87 47 85 49L89 48.5C90.5 49.5 89.5 51.5 87.5 52.5C85.5 53.5 83 52 82 48Z"
          fill="#115C16"
        />
      </g>

      {/* Left Arm (Relaxed at side) */}
      <g>
        {/* Shoulder */}
        <circle cx="31" cy="64" r="4" fill="#13741A" />
        <circle cx="31" cy="64" r="2.6" fill="#3FD431" />
        {/* Forearm */}
        <path
          d="M30 65C27 68 25 72 26 76C27 78.5 30 79 32 77C33 74 34 69 33 65C32.5 64 31 64 30 65Z"
          fill="url(#headShell)"
          stroke="#D0DED3"
          strokeWidth="0.6"
        />
        <circle cx="28" cy="76" r="2.6" fill="#167A1B" />
        <circle cx="28" cy="76" r="1.4" fill="#6EEB46" />
      </g>

      {/* 4. SPROUT ON HEAD (Two vibrant botanical leaves) */}
      {/* Sprout Stem */}
      <path
        d="M49 22C49 20 48.5 17 46 15"
        stroke="#1A8A20"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      {/* Left Leaf */}
      <path
        d="M46 16C40 14 31 9 23 9C21 16 26 25 38 24C44 23.5 45.5 18 46 16Z"
        fill="url(#sproutGradient1)"
      />
      {/* Left Leaf Center Vein */}
      <path
        d="M44 17C37 16 30 14 25 10.5"
        stroke="#99F88A"
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      {/* Right Leaf (Tilted upwards) */}
      <path
        d="M47 16C53 14 65 8 72 8C74 15 69 24 57 24C50 24 48 18 47 16Z"
        fill="url(#sproutGradient2)"
      />
      {/* Right Leaf Center Vein */}
      <path
        d="M48 17C55 16 63 13 69 9.5"
        stroke="#B1FFA4"
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      {/* 5. ROBOT HEAD (Chubby curved monitor head) */}
      <g>
        {/* Head Shell Outer Green Trim ring */}
        <rect
          x="16"
          y="17"
          width="66"
          height="45"
          rx="22.5"
          fill="url(#greenTrim)"
        />

        {/* Head Ceramic White Face Surround */}
        <rect
          x="19"
          y="18.5"
          width="60"
          height="42"
          rx="21"
          fill="url(#headShell)"
          stroke="#C8D8CB"
          strokeWidth="0.8"
        />

        {/* Left Ear Speaker / Sensor Pod */}
        <g>
          <ellipse cx="17.5" cy="39" rx="3.5" ry="6.5" fill="#13741A" />
          <ellipse cx="17" cy="39" rx="2.5" ry="5" fill="#3FD431" />
          <ellipse cx="16.5" cy="39" rx="1.2" ry="3" fill="#88FF7F" />
        </g>

        {/* Right Ear Speaker / Sensor Pod */}
        <g>
          <ellipse cx="80.5" cy="39" rx="3.5" ry="6.5" fill="#13741A" />
          <ellipse cx="81" cy="39" rx="2.5" ry="5" fill="#3FD431" />
          <ellipse cx="81.5" cy="39" rx="1.2" ry="3" fill="#88FF7F" />
        </g>

        {/* High Gloss Screen Visor */}
        <rect
          x="24.5"
          y="23.5"
          width="49"
          height="32"
          rx="15"
          fill="url(#screenGlass)"
          stroke="#101811"
          strokeWidth="1.2"
        />

        {/* Screen Top Glass Light Reflection */}
        <path
          d="M29 27C35 25 63 25 69 27C70.5 28 68 31 63 30.5C53 29.5 39 30 32 32C29.5 32.5 28 28 29 27Z"
          fill="#FFFFFF"
          fillOpacity="0.16"
        />

        {/* 6. GLOWING NEON EXPRESSION (Happy Curved Eyes & Smile) */}
        <g filter="url(#botNeonGlow)">
          {/* Left Eye (Happy upward crescent curve) */}
          <path
            d="M34 40C34.5 34.5 42.5 34.5 43 40"
            stroke="url(#neonFace)"
            strokeWidth="3.6"
            strokeLinecap="round"
          />

          {/* Right Eye (Happy upward crescent curve) */}
          <path
            d="M55 40C55.5 34.5 63.5 34.5 64 40"
            stroke="url(#neonFace)"
            strokeWidth="3.6"
            strokeLinecap="round"
          />

          {/* Cute Open Smiling Mouth */}
          <path
            d="M44.5 44C44.5 44 48.5 48.5 53.5 44C53.5 44 54 48 49 48C44 48 44.5 44 44.5 44Z"
            fill="url(#neonFace)"
          />
        </g>
      </g>
    </svg>
  );
};
