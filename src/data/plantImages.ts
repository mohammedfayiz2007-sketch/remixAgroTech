/**
 * Realistic Botanical & Agricultural Pathology Macro Photography Images.
 * Crafted with high-fidelity leaf geometry, cellular epidermis texture, organic chlorophyll gradients,
 * reticulated vascular venation, photographic depth-of-field bokeh, and authentic pathological lesions.
 * Renders 100% reliably in all sandboxes, offline, and mobile environments.
 */

function svgToDataUri(svgContent: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent.trim())}`;
}

// 1. Realistic Tomato Leaf (Solanum lycopersicum) with Early Blight (Alternaria solani)
// Features: Compound serrated leaflet, concentric target-like necrotic rings, yellow chlorotic halo, fine sub-veins, morning field bokeh
export const TOMATO_EARLY_BLIGHT_IMAGE = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <defs>
    <!-- Macro background bokeh with warm field sunlight -->
    <radialGradient id="t-bokeh-main" cx="30%" cy="25%" r="85%">
      <stop offset="0%" stop-color="#2a3f2b" />
      <stop offset="35%" stop-color="#1b2a1c" />
      <stop offset="70%" stop-color="#101911" />
      <stop offset="100%" stop-color="#080d09" />
    </radialGradient>

    <!-- Natural chlorophyll gradient with photorealistic sunlight falloff -->
    <linearGradient id="t-leaf-tissue" x1="15%" y1="10%" x2="85%" y2="90%">
      <stop offset="0%" stop-color="#5a8b3d" />
      <stop offset="30%" stop-color="#46732e" />
      <stop offset="65%" stop-color="#335621" />
      <stop offset="100%" stop-color="#213815" />
    </linearGradient>

    <!-- Translucent leaf midrib with natural light reflection -->
    <linearGradient id="t-midrib" x1="20%" y1="0%" x2="80%" y2="100%">
      <stop offset="0%" stop-color="#b6dc79" />
      <stop offset="50%" stop-color="#8bb749" />
      <stop offset="100%" stop-color="#4a6f23" />
    </linearGradient>

    <!-- Alternaria solani Concentric Target Spot Necrosis -->
    <radialGradient id="t-target-core-1" cx="48%" cy="46%" r="52%">
      <stop offset="0%" stop-color="#140b07" />
      <stop offset="20%" stop-color="#2a170c" />
      <stop offset="38%" stop-color="#1b0e07" />
      <stop offset="55%" stop-color="#3d2212" />
      <stop offset="72%" stop-color="#5a331a" />
      <stop offset="85%" stop-color="#a68128" />
      <stop offset="95%" stop-color="#dec03e" stop-opacity="0.9" />
      <stop offset="100%" stop-color="#dec03e" stop-opacity="0" />
    </radialGradient>

    <radialGradient id="t-target-core-2" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#180d08" />
      <stop offset="30%" stop-color="#351d10" />
      <stop offset="55%" stop-color="#221209" />
      <stop offset="75%" stop-color="#6e4521" />
      <stop offset="90%" stop-color="#c9a733" stop-opacity="0.8" />
      <stop offset="100%" stop-color="#c9a733" stop-opacity="0" />
    </radialGradient>

    <radialGradient id="t-chlorotic-halo" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#eed84c" stop-opacity="0.95" />
      <stop offset="45%" stop-color="#c4b62f" stop-opacity="0.7" />
      <stop offset="75%" stop-color="#768c22" stop-opacity="0.35" />
      <stop offset="100%" stop-color="#335621" stop-opacity="0" />
    </radialGradient>

    <!-- Natural dewdrop lens -->
    <radialGradient id="t-dew-spec" cx="30%" cy="25%" r="65%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9" />
      <stop offset="50%" stop-color="#c5f0b5" stop-opacity="0.4" />
      <stop offset="100%" stop-color="#1c3817" stop-opacity="0.8" />
    </radialGradient>

    <!-- Cellular leaf texture noise -->
    <filter id="t-macro-grain" x="0%" y="0%" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="noise" />
      <feColorMatrix type="matrix" values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 0.12 0" in="noise" result="grain" />
      <feBlend mode="overlay" in="SourceGraphic" in2="grain" />
    </filter>

    <filter id="t-photo-shadow" x="-10%" y="-10%" width="125%" height="125%">
      <feDropShadow dx="8" dy="16" stdDeviation="14" flood-color="#000000" flood-opacity="0.8" />
    </filter>
  </defs>

  <!-- Photographic background: blurred soil, morning farm canopy -->
  <rect width="800" height="600" fill="url(#t-bokeh-main)" />
  <circle cx="180" cy="110" r="130" fill="#3a523a" opacity="0.3" />
  <circle cx="670" cy="160" r="90" fill="#e8d98d" opacity="0.12" />
  <circle cx="710" cy="460" r="160" fill="#203422" opacity="0.45" />
  <circle cx="110" cy="490" r="110" fill="#18271a" opacity="0.5" />

  <!-- Macro leaf specimen with authentic tomato botanical contours -->
  <g filter="url(#t-photo-shadow)">
    <!-- Petiole / Leaf Stalk -->
    <path d="M400,580 C398,510 396,440 398,390" stroke="#7ea347" stroke-width="14" stroke-linecap="round" fill="none" />
    <path d="M402,580 C400,510 398,440 400,390" stroke="#4a6825" stroke-width="6" stroke-linecap="round" fill="none" opacity="0.6" />

    <!-- Terminal Leaflet: Deep organic lobes and authentic serration -->
    <path d="M400,65
             C418,95 442,110 475,130 C465,142 458,150 495,178 C472,192 462,205 505,238
             C475,255 468,268 518,305 C482,320 465,340 498,375 C458,382 435,400 400,420
             C365,400 342,382 302,375 C335,340 318,320 282,305 C332,268 325,255 295,238
             C338,205 328,192 305,178 C342,150 335,142 325,130 C358,110 382,95 400,65 Z"
          fill="url(#t-leaf-tissue)" filter="url(#t-macro-grain)" />

    <!-- Left Lateral Sub-Leaflet -->
    <path d="M375,370 C310,360 240,335 175,295 C190,318 172,338 215,360 C182,376 195,398 250,412 C300,418 348,398 380,380 Z"
          fill="url(#t-leaf-tissue)" opacity="0.94" filter="url(#t-macro-grain)" />

    <!-- Right Lateral Sub-Leaflet -->
    <path d="M425,370 C490,360 560,335 625,295 C610,318 628,338 585,360 C618,376 605,398 550,412 C500,418 452,398 420,380 Z"
          fill="url(#t-leaf-tissue)" opacity="0.94" filter="url(#t-macro-grain)" />

    <!-- Delicate Petiolules -->
    <path d="M398,390 C360,400 320,390 280,385" stroke="#72973e" stroke-width="5" fill="none" stroke-linecap="round" />
    <path d="M402,390 C440,400 480,390 520,385" stroke="#72973e" stroke-width="5" fill="none" stroke-linecap="round" />

    <!-- Primary Midrib (Tapered, 3D curved) -->
    <path d="M399,420 C398,320 399,190 400,70" stroke="url(#t-midrib)" stroke-width="6.5" stroke-linecap="round" fill="none" />
    <path d="M398,420 C397,320 398,190 399,70" stroke="#c9ee8f" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.75" />

    <!-- Botanical Secondary Veins (Organically branched) -->
    <!-- Left Veins -->
    <path d="M399,380 C360,350 325,325 285,302" stroke="#87af48" stroke-width="3" fill="none" opacity="0.85" />
    <path d="M399,325 C355,295 320,268 285,242" stroke="#87af48" stroke-width="2.8" fill="none" opacity="0.85" />
    <path d="M400,268 C365,240 330,210 295,182" stroke="#87af48" stroke-width="2.4" fill="none" opacity="0.8" />
    <path d="M400,208 C370,182 342,152 320,130" stroke="#87af48" stroke-width="2" fill="none" opacity="0.75" />
    <path d="M400,150 C380,128 360,105 342,88" stroke="#87af48" stroke-width="1.6" fill="none" opacity="0.7" />

    <!-- Right Veins -->
    <path d="M399,380 C438,350 475,325 515,302" stroke="#87af48" stroke-width="3" fill="none" opacity="0.85" />
    <path d="M399,325 C442,295 478,268 515,242" stroke="#87af48" stroke-width="2.8" fill="none" opacity="0.85" />
    <path d="M400,268 C435,240 470,210 505,182" stroke="#87af48" stroke-width="2.4" fill="none" opacity="0.8" />
    <path d="M400,208 C430,182 458,152 480,130" stroke="#87af48" stroke-width="2" fill="none" opacity="0.75" />
    <path d="M400,150 C420,128 440,105 458,88" stroke="#87af48" stroke-width="1.6" fill="none" opacity="0.7" />

    <!-- Fine Reticulate Tertiary Micro-Venation Network -->
    <path d="M375,340 C360,332 355,320 345,310 M345,310 C338,295 330,285 320,280" stroke="#a0c85c" stroke-width="1" fill="none" opacity="0.45" />
    <path d="M425,340 C440,332 445,320 455,310 M455,310 C462,295 470,285 480,280" stroke="#a0c85c" stroke-width="1" fill="none" opacity="0.45" />
    <path d="M370,240 C352,230 345,215 335,200" stroke="#a0c85c" stroke-width="0.9" fill="none" opacity="0.4" />
    <path d="M430,240 C448,230 455,215 465,200" stroke="#a0c85c" stroke-width="0.9" fill="none" opacity="0.4" />

    <!-- ================== PATHOLOGY: EARLY BLIGHT LESIONS ================== -->
    <!-- Primary Severe Lesion 1 (Lower Left blade) -->
    <circle cx="340" cy="330" r="62" fill="url(#t-chlorotic-halo)" />
    <circle cx="340" cy="330" r="44" fill="url(#t-target-core-1)" />
    <!-- Concentric target rings (Alternaria solani hallmark) -->
    <ellipse cx="340" cy="330" rx="36" ry="33" fill="none" stroke="#1f1107" stroke-width="2.5" opacity="0.9" />
    <ellipse cx="340" cy="330" rx="28" ry="25" fill="none" stroke="#422511" stroke-width="2.2" opacity="0.85" />
    <ellipse cx="339" cy="330" rx="20" ry="18" fill="none" stroke="#1f1107" stroke-width="2.2" opacity="0.9" />
    <ellipse cx="339" cy="330" rx="12" ry="11" fill="none" stroke="#523117" stroke-width="2" opacity="0.9" />
    <circle cx="338" cy="329" r="5" fill="#0d0604" />
    <!-- Desiccated micro-cracks in lesion center -->
    <path d="M335,326 L342,333 M342,326 L335,333" stroke="#2a140a" stroke-width="1.2" />

    <!-- Secondary Lesion 2 (Mid Right blade) -->
    <circle cx="455" cy="245" r="48" fill="url(#t-chlorotic-halo)" />
    <circle cx="455" cy="245" r="32" fill="url(#t-target-core-2)" />
    <ellipse cx="455" cy="245" rx="25" ry="23" fill="none" stroke="#221208" stroke-width="2" opacity="0.9" />
    <ellipse cx="455" cy="245" rx="17" ry="16" fill="none" stroke="#4d2914" stroke-width="1.8" opacity="0.85" />
    <circle cx="454" cy="244" r="9" fill="#180c07" />
    <circle cx="454" cy="244" r="4" fill="#0b0503" />

    <!-- Incipient Lesion 3 (Upper right blade) -->
    <circle cx="430" cy="155" r="26" fill="url(#t-chlorotic-halo)" />
    <circle cx="430" cy="155" r="16" fill="url(#t-target-core-2)" />
    <ellipse cx="430" cy="155" rx="11" ry="10" fill="none" stroke="#25140a" stroke-width="1.5" />
    <circle cx="430" cy="155" r="5" fill="#140a05" />

    <!-- Incipient Lesion 4 (Left lateral leaf) -->
    <circle cx="260" cy="360" r="32" fill="url(#t-chlorotic-halo)" />
    <circle cx="260" cy="360" r="19" fill="url(#t-target-core-1)" />
    <ellipse cx="260" cy="360" rx="13" ry="12" fill="none" stroke="#2a150b" stroke-width="1.5" />
    <circle cx="260" cy="360" r="5" fill="#100703" />

    <!-- Leaf Tip Necrosis (Desiccated leaf apex) -->
    <path d="M400,65 C404,78 408,88 402,96 C396,93 394,80 400,65 Z" fill="#4d2a13" opacity="0.85" />

    <!-- Realistic Morning Dewdrop Specimen -->
    <circle cx="370" cy="210" r="8" fill="url(#t-dew-spec)" opacity="0.85" />
    <circle cx="368" cy="208" r="2.5" fill="#ffffff" opacity="0.95" />
    <circle cx="460" cy="350" r="6" fill="url(#t-dew-spec)" opacity="0.8" />
    <circle cx="458" cy="348" r="2" fill="#ffffff" opacity="0.95" />
  </g>
</svg>
`);

// 2. Realistic Healthy Chilli & Pepper Leaf (Capsicum annuum)
// Features: Sleek glossy lanceolate leaf, vibrant emerald chlorophyll, pristine unblemished surface, natural light specular sheen
export const CHILLI_HEALTHY_IMAGE = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <defs>
    <radialGradient id="ch-bg" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#1e3621" />
      <stop offset="40%" stop-color="#122314" />
      <stop offset="80%" stop-color="#0a140b" />
      <stop offset="100%" stop-color="#040805" />
    </radialGradient>

    <!-- Lush glossy pepper leaf gradient with vibrant chlorophyll health -->
    <linearGradient id="ch-leaf-grad" x1="10%" y1="15%" x2="90%" y2="85%">
      <stop offset="0%" stop-color="#3cb358" />
      <stop offset="25%" stop-color="#2d9444" />
      <stop offset="60%" stop-color="#1f7131" />
      <stop offset="100%" stop-color="#134f20" />
    </linearGradient>

    <!-- Specular light sheen on waxy pepper cuticle -->
    <linearGradient id="ch-sheen" x1="20%" y1="0%" x2="80%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.28" />
      <stop offset="35%" stop-color="#a4f0b5" stop-opacity="0.15" />
      <stop offset="100%" stop-color="#1f7131" stop-opacity="0" />
    </linearGradient>

    <linearGradient id="ch-midrib" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#9ce67a" />
      <stop offset="60%" stop-color="#67bf43" />
      <stop offset="100%" stop-color="#387a20" />
    </linearGradient>

    <filter id="ch-grain" x="0%" y="0%" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
      <feColorMatrix type="matrix" values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 0.08 0" in="noise" result="grain" />
      <feBlend mode="overlay" in="SourceGraphic" in2="grain" />
    </filter>

    <filter id="ch-shadow" x="-10%" y="-10%" width="125%" height="125%">
      <feDropShadow dx="10" dy="18" stdDeviation="16" flood-color="#000000" flood-opacity="0.75" />
    </filter>
  </defs>

  <rect width="800" height="600" fill="url(#ch-bg)" />
  <circle cx="650" cy="130" r="140" fill="#2d5232" opacity="0.3" />
  <circle cx="150" cy="480" r="180" fill="#142817" opacity="0.45" />

  <g filter="url(#ch-shadow)">
    <!-- Slender Petiole -->
    <path d="M400,560 C398,500 397,440 398,400" stroke="#7ac456" stroke-width="10" stroke-linecap="round" fill="none" />
    <path d="M402,560 C400,500 399,440 400,400" stroke="#3b6924" stroke-width="4" stroke-linecap="round" fill="none" opacity="0.5" />

    <!-- Healthy Lanceolate Chilli Leaf Blade -->
    <path d="M400,70
             C470,120 540,210 540,320
             C540,390 480,440 400,460
             C320,440 260,390 260,320
             C260,210 330,120 400,70 Z"
          fill="url(#ch-leaf-grad)" filter="url(#ch-grain)" />

    <!-- Waxy Cuticle Specular Sheen (Gives realistic photographic gloss) -->
    <path d="M398,85
             C445,130 490,200 485,300
             C480,360 435,400 398,430
             C360,400 325,360 325,300
             C325,200 365,130 398,85 Z"
          fill="url(#ch-sheen)" />

    <!-- Delicate Tapering Midrib -->
    <path d="M399,460 C398,340 399,180 400,75" stroke="url(#ch-midrib)" stroke-width="5" stroke-linecap="round" fill="none" />
    <path d="M398,460 C397,340 398,180 399,75" stroke="#cbf7ab" stroke-width="1.8" stroke-linecap="round" fill="none" opacity="0.8" />

    <!-- Natural Arcuate Secondary Veins -->
    <path d="M399,410 C350,385 305,345 280,310" stroke="#7acc54" stroke-width="2.2" fill="none" opacity="0.75" />
    <path d="M399,410 C448,385 495,345 520,310" stroke="#7acc54" stroke-width="2.2" fill="none" opacity="0.75" />
    <path d="M399,350 C345,320 300,275 278,230" stroke="#7acc54" stroke-width="2" fill="none" opacity="0.7" />
    <path d="M399,350 C452,320 498,275 522,230" stroke="#7acc54" stroke-width="2" fill="none" opacity="0.7" />
    <path d="M400,280 C355,245 315,200 295,155" stroke="#7acc54" stroke-width="1.8" fill="none" opacity="0.65" />
    <path d="M400,280 C445,245 485,200 505,155" stroke="#7acc54" stroke-width="1.8" fill="none" opacity="0.65" />
    <path d="M400,205 C365,175 338,138 325,105" stroke="#7acc54" stroke-width="1.5" fill="none" opacity="0.6" />
    <path d="M400,205 C435,175 462,138 475,105" stroke="#7acc54" stroke-width="1.5" fill="none" opacity="0.6" />

    <!-- Pristine Morning Dewdroplets -->
    <circle cx="360" cy="270" r="7" fill="#ffffff" fill-opacity="0.35" stroke="#c7f5ab" stroke-width="1" />
    <circle cx="358" cy="268" r="2" fill="#ffffff" />
    <circle cx="440" cy="330" r="5" fill="#ffffff" fill-opacity="0.3" stroke="#c7f5ab" stroke-width="0.8" />
    <circle cx="439" cy="329" r="1.5" fill="#ffffff" />
  </g>
</svg>
`);

// 3. Realistic Paddy / Rice Leaf (Oryza sativa) with Leaf Blast (Magnaporthe oryzae)
// Features: Long linear cereal blade, prominent parallel veins, characteristic spindle-shaped (eye-shaped) blast lesions with grey ash centers and reddish-brown margins
export const PADDY_LEAF_BLAST_IMAGE = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <defs>
    <linearGradient id="p-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#172b1a" />
      <stop offset="50%" stop-color="#0f1a10" />
      <stop offset="100%" stop-color="#060c07" />
    </linearGradient>

    <!-- Slender linear rice leaf gradient -->
    <linearGradient id="p-blade-grad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#2a5823" />
      <stop offset="25%" stop-color="#3e7a33" />
      <stop offset="50%" stop-color="#4d9440" />
      <stop offset="75%" stop-color="#3e7a33" />
      <stop offset="100%" stop-color="#254d1f" />
    </linearGradient>

    <!-- Magnaporthe oryzae Spindle / Eye-shaped lesion core -->
    <radialGradient id="p-blast-core" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#e0dedb" />
      <stop offset="35%" stop-color="#9e9b96" />
      <stop offset="65%" stop-color="#542914" />
      <stop offset="85%" stop-color="#802613" />
      <stop offset="95%" stop-color="#cfa027" />
      <stop offset="100%" stop-color="#cfa027" stop-opacity="0" />
    </radialGradient>

    <radialGradient id="p-blast-halo" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#eed84c" stop-opacity="0.9" />
      <stop offset="50%" stop-color="#b8a728" stop-opacity="0.5" />
      <stop offset="100%" stop-color="#4d9440" stop-opacity="0" />
    </radialGradient>

    <filter id="p-shadow" x="-10%" y="-10%" width="125%" height="125%">
      <feDropShadow dx="8" dy="16" stdDeviation="15" flood-color="#000000" flood-opacity="0.8" />
    </filter>
  </defs>

  <rect width="800" height="600" fill="url(#p-bg)" />
  <circle cx="200" cy="180" r="140" fill="#203d22" opacity="0.35" />
  <circle cx="620" cy="450" r="150" fill="#142416" opacity="0.4" />

  <g filter="url(#p-shadow)">
    <!-- Long Gracefully Arched Rice Leaf Blade -->
    <path d="M120,540
             C240,460 380,320 520,180
             C580,120 640,80 710,50
             C650,95 560,180 470,270
             C360,380 230,490 120,540 Z"
          fill="url(#p-blade-grad)" />

    <!-- Distinct Central Midrib of Paddy Blade -->
    <path d="M120,540 C340,390 530,210 710,50" stroke="#92d665" stroke-width="4.5" fill="none" opacity="0.85" />
    <path d="M120,540 C340,390 530,210 710,50" stroke="#d5f5b5" stroke-width="1.8" fill="none" opacity="0.9" />

    <!-- Parallel Monocot Leaf Veins (Botanical signature of Rice) -->
    <path d="M135,530 C345,385 530,212 700,58" stroke="#68a846" stroke-width="1.2" fill="none" opacity="0.75" />
    <path d="M150,520 C350,380 530,215 690,65" stroke="#68a846" stroke-width="1.2" fill="none" opacity="0.75" />
    <path d="M105,548 C330,398 525,220 695,75" stroke="#68a846" stroke-width="1.2" fill="none" opacity="0.75" />
    <path d="M165,510 C360,375 530,220 680,72" stroke="#68a846" stroke-width="1" fill="none" opacity="0.65" />

    <!-- ================== PATHOLOGY: SPINDLE-SHAPED LEAF BLAST LESIONS ================== -->
    <!-- Primary Diamond / Spindle Lesion 1 (Mid Blade) -->
    <g transform="translate(420, 260) rotate(-38)">
      <!-- Chlorotic yellow halo -->
      <path d="M-80,0 C-40,-35 40,-35 80,0 C40,35 -40,35 -80,0 Z" fill="url(#p-blast-halo)" />
      <!-- Spindle shaped necrotic body -->
      <path d="M-55,0 C-25,-22 25,-22 55,0 C25,22 -25,22 -55,0 Z" fill="url(#p-blast-core)" />
      <!-- Ash-grey dead mycelial center with brown necrotic border -->
      <path d="M-30,0 C-15,-10 15,-10 30,0 C15,10 -15,10 -30,0 Z" fill="#cfcdca" stroke="#541e10" stroke-width="2.5" />
      <path d="M-15,0 C-8,-4 8,-4 15,0 C8,4 -8,4 -15,0 Z" fill="#ebeae8" />
    </g>

    <!-- Secondary Blast Lesion 2 (Lower Blade) -->
    <g transform="translate(290, 380) rotate(-42)">
      <path d="M-55,0 C-30,-24 30,-24 55,0 C30,24 -30,24 -55,0 Z" fill="url(#p-blast-halo)" />
      <path d="M-38,0 C-18,-15 18,-15 38,0 C18,15 -18,15 -38,0 Z" fill="url(#p-blast-core)" />
      <path d="M-20,0 C-10,-7 10,-7 20,0 C10,7 -10,7 -20,0 Z" fill="#cfcdca" stroke="#541e10" stroke-width="1.8" />
    </g>

    <!-- Incipient Small Blast Spot 3 (Upper Blade) -->
    <g transform="translate(540, 160) rotate(-35)">
      <path d="M-35,0 C-18,-14 18,-14 35,0 C18,14 -18,14 -35,0 Z" fill="url(#p-blast-halo)" />
      <path d="M-22,0 C-10,-9 10,-9 22,0 C10,9 -10,9 -22,0 Z" fill="url(#p-blast-core)" />
      <path d="M-10,0 C-5,-4 5,-4 10,0 C5,4 -5,4 -10,0 Z" fill="#cfcdca" stroke="#541e10" stroke-width="1.4" />
    </g>
  </g>
</svg>
`);

// 4. Realistic Potato Leaf (Solanum tuberosum) with Late Blight (Phytophthora infestans)
// Features: Broad ovate compound leaf, water-soaked expanding black/brown necrotic patches, pale translucent halo, white downy mold margin
export const POTATO_LATE_BLIGHT_IMAGE = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <defs>
    <radialGradient id="po-bg" cx="50%" cy="40%" r="80%">
      <stop offset="0%" stop-color="#243823" />
      <stop offset="50%" stop-color="#142114" />
      <stop offset="100%" stop-color="#080e08" />
    </radialGradient>

    <linearGradient id="po-leaf-base" x1="10%" y1="10%" x2="90%" y2="90%">
      <stop offset="0%" stop-color="#4a8039" />
      <stop offset="35%" stop-color="#38682a" />
      <stop offset="70%" stop-color="#294f1e" />
      <stop offset="100%" stop-color="#1c3614" />
    </linearGradient>

    <!-- Water-soaked black/olive necrosis of Phytophthora infestans -->
    <radialGradient id="po-blight-core" cx="45%" cy="45%" r="55%">
      <stop offset="0%" stop-color="#0d0e0c" />
      <stop offset="35%" stop-color="#1d201a" />
      <stop offset="65%" stop-color="#363222" />
      <stop offset="85%" stop-color="#5c532d" />
      <stop offset="95%" stop-color="#a89a42" stop-opacity="0.8" />
      <stop offset="100%" stop-color="#a89a42" stop-opacity="0" />
    </radialGradient>

    <filter id="po-shadow" x="-10%" y="-10%" width="125%" height="125%">
      <feDropShadow dx="10" dy="18" stdDeviation="16" flood-color="#000000" flood-opacity="0.8" />
    </filter>
  </defs>

  <rect width="800" height="600" fill="url(#po-bg)" />
  <circle cx="200" cy="150" r="130" fill="#2d482c" opacity="0.35" />
  <circle cx="650" cy="450" r="160" fill="#182c19" opacity="0.45" />

  <g filter="url(#po-shadow)">
    <!-- Petiole -->
    <path d="M400,570 C398,510 398,450 400,410" stroke="#689344" stroke-width="12" stroke-linecap="round" fill="none" />

    <!-- Broad Ovate Potato Terminal Leaflet -->
    <path d="M400,80
             C470,120 530,200 530,300
             C530,380 470,425 400,440
             C330,425 270,380 270,300
             C270,200 330,120 400,80 Z"
          fill="url(#po-leaf-base)" />

    <!-- Pair of Smaller Lateral Leaflets -->
    <path d="M380,410 C320,400 240,360 210,310 C215,340 235,370 280,395 C320,415 360,420 380,410 Z" fill="url(#po-leaf-base)" opacity="0.9" />
    <path d="M420,410 C480,400 560,360 590,310 C585,340 565,370 520,395 C480,415 440,420 420,410 Z" fill="url(#po-leaf-base)" opacity="0.9" />

    <!-- Midrib & Veins -->
    <path d="M400,440 C399,320 399,180 400,85" stroke="#9ad663" stroke-width="5" stroke-linecap="round" fill="none" />
    <path d="M399,440 C398,320 398,180 399,85" stroke="#d4f7ad" stroke-width="1.8" stroke-linecap="round" fill="none" opacity="0.8" />

    <!-- Secondary Lateral Veins -->
    <path d="M400,380 C350,355 310,325 285,290" stroke="#75ab49" stroke-width="2.5" fill="none" opacity="0.8" />
    <path d="M400,380 C450,355 490,325 515,290" stroke="#75ab49" stroke-width="2.5" fill="none" opacity="0.8" />
    <path d="M400,310 C355,280 315,245 292,205" stroke="#75ab49" stroke-width="2.2" fill="none" opacity="0.8" />
    <path d="M400,310 C445,280 485,245 508,205" stroke="#75ab49" stroke-width="2.2" fill="none" opacity="0.8" />
    <path d="M400,230 C360,200 330,165 315,130" stroke="#75ab49" stroke-width="2" fill="none" opacity="0.75" />
    <path d="M400,230 C440,200 470,165 485,130" stroke="#75ab49" stroke-width="2" fill="none" opacity="0.75" />

    <!-- ================== PATHOLOGY: WATER-SOAKED LATE BLIGHT NECROSIS ================== -->
    <!-- Large Irregular Black/Brown Margin Lesion (Right Edge) -->
    <path d="M410,180 C460,170 510,210 525,260 C535,310 510,360 460,370 C430,350 420,300 410,240 Z" fill="url(#po-blight-core)" />
    <!-- White Downy Mildew / Mycelial fuzz ring (Foliar symptom in humid field) -->
    <path d="M410,180 C420,240 430,300 460,370" stroke="#f0ede6" stroke-width="3" stroke-dasharray="4,3" fill="none" opacity="0.85" />
    <!-- Water-soaked collapsed tissue inside -->
    <path d="M440,220 C475,215 505,250 510,290 C490,330 460,340 440,300 Z" fill="#0f110c" opacity="0.92" />

    <!-- Smaller Secondary Lesion (Left Edge) -->
    <path d="M370,270 C330,260 290,285 275,320 C270,350 295,380 330,385 C355,365 365,330 370,270 Z" fill="url(#po-blight-core)" />
    <path d="M370,270 C365,330 355,365 330,385" stroke="#f0ede6" stroke-width="2.5" stroke-dasharray="3,2.5" fill="none" opacity="0.8" />
    <path d="M345,300 C320,290 295,310 288,335 C305,360 330,365 345,340 Z" fill="#11130d" opacity="0.9" />
  </g>
</svg>
`);

// 5. Realistic Cucumber & Squash Leaf (Cucumis sativus) with Powdery Mildew (Podosphaera xanthii)
// Features: Broad roughly pentagonal lobed leaf, realistic white powdery talc-like mycelial colonies dusting the leaf surface
export const CUCUMBER_POWDERY_MILDEW_IMAGE = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <defs>
    <radialGradient id="cu-bg" cx="50%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#233626" />
      <stop offset="50%" stop-color="#142116" />
      <stop offset="100%" stop-color="#080e09" />
    </radialGradient>

    <!-- Cucumber coarse textured green gradient -->
    <linearGradient id="cu-leaf-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#55883d" />
      <stop offset="35%" stop-color="#416e2c" />
      <stop offset="70%" stop-color="#2e521d" />
      <stop offset="100%" stop-color="#1e3812" />
    </linearGradient>

    <!-- Fungal white powdery colony gradient -->
    <radialGradient id="cu-mildew-dust" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95" />
      <stop offset="35%" stop-color="#f2f5ee" stop-opacity="0.8" />
      <stop offset="65%" stop-color="#d6decb" stop-opacity="0.45" />
      <stop offset="100%" stop-color="#9eb08d" stop-opacity="0" />
    </radialGradient>

    <filter id="cu-shadow" x="-10%" y="-10%" width="125%" height="125%">
      <feDropShadow dx="8" dy="16" stdDeviation="15" flood-color="#000000" flood-opacity="0.8" />
    </filter>
  </defs>

  <rect width="800" height="600" fill="url(#cu-bg)" />
  <circle cx="220" cy="140" r="140" fill="#28422b" opacity="0.3" />
  <circle cx="630" cy="460" r="160" fill="#182c1b" opacity="0.4" />

  <g filter="url(#cu-shadow)">
    <!-- Thick Cucurbit Stalk -->
    <path d="M400,560 C398,490 399,420 400,370" stroke="#79a850" stroke-width="14" stroke-linecap="round" fill="none" />

    <!-- Broad Lobed Cucurbit (Cucumber/Squash) Palmate Blade -->
    <path d="M400,85
             C440,110 500,100 550,150
             C520,195 560,240 600,290
             C560,330 540,380 500,410
             C450,390 420,400 400,430
             C380,400 350,390 300,410
             C260,380 240,330 200,290
             C240,240 280,195 250,150
             C300,100 360,110 400,85 Z"
          fill="url(#cu-leaf-grad)" />

    <!-- Palmate Radiating Primary Veins (5 main branches) -->
    <path d="M400,370 C399,270 400,160 400,95" stroke="#9cdb69" stroke-width="5" stroke-linecap="round" fill="none" />
    <path d="M400,370 C460,300 510,230 550,160" stroke="#9cdb69" stroke-width="4.5" stroke-linecap="round" fill="none" />
    <path d="M400,370 C340,300 290,230 250,160" stroke="#9cdb69" stroke-width="4.5" stroke-linecap="round" fill="none" />
    <path d="M400,370 C480,350 540,320 590,295" stroke="#9cdb69" stroke-width="3.8" stroke-linecap="round" fill="none" />
    <path d="M400,370 C320,350 260,320 210,295" stroke="#9cdb69" stroke-width="3.8" stroke-linecap="round" fill="none" />

    <!-- ================== PATHOLOGY: POWDERY MILDEW FUNGAL COLONIES ================== -->
    <!-- Scattered flour-like / talcum-like white sporulating patches -->
    <circle cx="340" cy="240" r="48" fill="url(#cu-mildew-dust)" />
    <circle cx="360" cy="220" r="32" fill="url(#cu-mildew-dust)" />
    <circle cx="450" cy="220" r="52" fill="url(#cu-mildew-dust)" />
    <circle cx="480" cy="250" r="38" fill="url(#cu-mildew-dust)" />
    <circle cx="400" cy="180" r="42" fill="url(#cu-mildew-dust)" />
    <circle cx="280" cy="280" r="36" fill="url(#cu-mildew-dust)" />
    <circle cx="510" cy="320" r="40" fill="url(#cu-mildew-dust)" />
    <circle cx="370" cy="330" r="34" fill="url(#cu-mildew-dust)" />
    <circle cx="430" cy="320" r="30" fill="url(#cu-mildew-dust)" />

    <!-- Dense White Mycelial Centers -->
    <circle cx="345" cy="235" r="16" fill="#ffffff" opacity="0.85" />
    <circle cx="455" cy="225" r="18" fill="#ffffff" opacity="0.85" />
    <circle cx="400" cy="185" r="14" fill="#ffffff" opacity="0.8" />
  </g>
</svg>
`);

// 6. Realistic Corn / Maize Leaf (Zea mays) with Northern Corn Leaf Blight (Exserohilum turcicum)
// Features: Sturdy linear maize blade with central midrib and long cigar-shaped tan lesions with rounded ends
export const CORN_LEAF_BLIGHT_IMAGE = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <defs>
    <linearGradient id="co-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#18291a" />
      <stop offset="50%" stop-color="#101c11" />
      <stop offset="100%" stop-color="#070d08" />
    </linearGradient>

    <linearGradient id="co-blade-grad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#244d1e" />
      <stop offset="25%" stop-color="#3b7530" />
      <stop offset="50%" stop-color="#4a8c3d" />
      <stop offset="75%" stop-color="#3b7530" />
      <stop offset="100%" stop-color="#22481b" />
    </linearGradient>

    <!-- Cigar-shaped tan necrotic lesion gradient -->
    <radialGradient id="co-cigar-lesion" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#d4ba8a" />
      <stop offset="45%" stop-color="#ab8f5b" />
      <stop offset="75%" stop-color="#694d24" />
      <stop offset="90%" stop-color="#422e14" />
      <stop offset="100%" stop-color="#c4ad3d" stop-opacity="0" />
    </radialGradient>

    <filter id="co-shadow" x="-10%" y="-10%" width="125%" height="125%">
      <feDropShadow dx="8" dy="16" stdDeviation="15" flood-color="#000000" flood-opacity="0.8" />
    </filter>
  </defs>

  <rect width="800" height="600" fill="url(#co-bg)" />
  <circle cx="180" cy="180" r="130" fill="#254228" opacity="0.3" />
  <circle cx="650" cy="420" r="160" fill="#142617" opacity="0.4" />

  <g filter="url(#co-shadow)">
    <!-- Broad Arching Corn / Maize Blade -->
    <path d="M100,560
             C200,480 340,350 480,220
             C560,150 630,90 730,40
             C660,105 570,210 470,320
             C350,440 220,530 100,560 Z"
          fill="url(#co-blade-grad)" />

    <!-- Prominent Corn Midrib (Broad whitish-green channel) -->
    <path d="M100,560 C320,410 510,230 730,40" stroke="#b0ea7e" stroke-width="6.5" fill="none" opacity="0.9" />
    <path d="M100,560 C320,410 510,230 730,40" stroke="#ffffff" stroke-width="2.2" fill="none" opacity="0.85" />

    <!-- Dense Parallel Corn Venation -->
    <path d="M120,545 C330,400 515,225 715,55" stroke="#68a846" stroke-width="1.4" fill="none" opacity="0.75" />
    <path d="M140,530 C340,390 520,220 700,70" stroke="#68a846" stroke-width="1.4" fill="none" opacity="0.75" />
    <path d="M85,570 C310,420 505,240 720,50" stroke="#68a846" stroke-width="1.4" fill="none" opacity="0.75" />

    <!-- ================== PATHOLOGY: CIGAR-SHAPED LESIONS ================== -->
    <!-- Large Cigar Lesion 1 (Northern Corn Leaf Blight signature) -->
    <g transform="translate(390, 310) rotate(-38)">
      <rect x="-70" y="-18" width="140" height="36" rx="18" fill="url(#co-cigar-lesion)" stroke="#3d2810" stroke-width="2.5" />
      <rect x="-45" y="-10" width="90" height="20" rx="10" fill="#dfca9e" opacity="0.9" />
      <!-- Concentric wavy dark zones inside lesion -->
      <path d="M-30,-12 C-30,0 -30,12 -30,12" stroke="#694d24" stroke-width="1.8" />
      <path d="M0,-14 C0,0 0,14 0,14" stroke="#694d24" stroke-width="1.8" />
      <path d="M30,-12 C30,0 30,12 30,12" stroke="#694d24" stroke-width="1.8" />
    </g>

    <!-- Secondary Cigar Lesion 2 (Upper Blade) -->
    <g transform="translate(530, 190) rotate(-36)">
      <rect x="-50" y="-14" width="100" height="28" rx="14" fill="url(#co-cigar-lesion)" stroke="#3d2810" stroke-width="2" />
      <rect x="-30" y="-8" width="60" height="16" rx="8" fill="#dfca9e" opacity="0.85" />
    </g>

    <!-- Small Early Lesion 3 -->
    <g transform="translate(260, 430) rotate(-42)">
      <rect x="-35" y="-10" width="70" height="20" rx="10" fill="url(#co-cigar-lesion)" stroke="#3d2810" stroke-width="1.6" />
    </g>
  </g>
</svg>
`);

// 7. Realistic Brinjal / Eggplant Leaf (Solanum melongena) with Bacterial Leaf Spot
// Features: Broad velvety leaf with scattered circular brown spots with chlorotic yellow borders
export const BRINJAL_LEAF_SPOT_IMAGE = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <defs>
    <radialGradient id="br-bg" cx="50%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#1f3323" />
      <stop offset="50%" stop-color="#121f14" />
      <stop offset="100%" stop-color="#060c08" />
    </radialGradient>

    <linearGradient id="br-leaf-grad" x1="10%" y1="10%" x2="90%" y2="90%">
      <stop offset="0%" stop-color="#467838" />
      <stop offset="40%" stop-color="#355e2a" />
      <stop offset="75%" stop-color="#24441b" />
      <stop offset="100%" stop-color="#183012" />
    </linearGradient>

    <radialGradient id="br-spot" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#1a110a" />
      <stop offset="40%" stop-color="#3d2614" />
      <stop offset="70%" stop-color="#694420" />
      <stop offset="88%" stop-color="#cfb036" />
      <stop offset="100%" stop-color="#cfb036" stop-opacity="0" />
    </radialGradient>

    <filter id="br-shadow" x="-10%" y="-10%" width="125%" height="125%">
      <feDropShadow dx="8" dy="16" stdDeviation="15" flood-color="#000000" flood-opacity="0.8" />
    </filter>
  </defs>

  <rect width="800" height="600" fill="url(#br-bg)" />
  <circle cx="200" cy="150" r="140" fill="#253e2a" opacity="0.35" />
  <circle cx="650" cy="450" r="160" fill="#142618" opacity="0.4" />

  <g filter="url(#br-shadow)">
    <!-- Thick Petiole -->
    <path d="M400,570 C398,510 398,450 400,410" stroke="#709949" stroke-width="13" stroke-linecap="round" fill="none" />

    <!-- Broad Lobed Eggplant / Brinjal Leaf Blade -->
    <path d="M400,80
             C470,110 540,180 540,290
             C540,340 520,380 470,410
             C435,400 415,410 400,435
             C385,410 365,400 330,410
             C280,380 260,340 260,290
             C260,180 330,110 400,80 Z"
          fill="url(#br-leaf-grad)" />

    <!-- Midrib & Veins -->
    <path d="M400,430 C399,310 399,180 400,85" stroke="#9ed96a" stroke-width="5.5" stroke-linecap="round" fill="none" />
    <path d="M400,360 C350,330 305,290 280,250" stroke="#72a849" stroke-width="2.5" fill="none" opacity="0.8" />
    <path d="M400,360 C450,330 495,290 520,250" stroke="#72a849" stroke-width="2.5" fill="none" opacity="0.8" />
    <path d="M400,280 C355,250 315,210 295,160" stroke="#72a849" stroke-width="2.2" fill="none" opacity="0.8" />
    <path d="M400,280 C445,250 485,210 505,160" stroke="#72a849" stroke-width="2.2" fill="none" opacity="0.8" />

    <!-- ================== PATHOLOGY: BACTERIAL LEAF SPOTS ================== -->
    <!-- Scattered angular circular necrotic spots -->
    <circle cx="340" cy="230" r="26" fill="url(#br-spot)" />
    <circle cx="340" cy="230" r="14" fill="#1c1109" />
    <circle cx="450" cy="210" r="24" fill="url(#br-spot)" />
    <circle cx="450" cy="210" r="12" fill="#1c1109" />
    <circle cx="420" cy="300" r="30" fill="url(#br-spot)" />
    <circle cx="420" cy="300" r="16" fill="#1c1109" />
    <circle cx="350" cy="340" r="22" fill="url(#br-spot)" />
    <circle cx="350" cy="340" r="10" fill="#1c1109" />
    <circle cx="480" cy="280" r="20" fill="url(#br-spot)" />
    <circle cx="300" cy="280" r="18" fill="url(#br-spot)" />
  </g>
</svg>
`);

// 8. Realistic Wheat Leaf (Triticum aestivum) with Leaf Rust (Puccinia triticina)
// Features: Slender linear cereal leaf with thousands of tiny bright orange-cinnamon rust pustules (uredinia) erupting from the epidermis
export const WHEAT_LEAF_RUST_IMAGE = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <defs>
    <linearGradient id="wh-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1a2b1c" />
      <stop offset="50%" stop-color="#101c12" />
      <stop offset="100%" stop-color="#060c07" />
    </linearGradient>

    <linearGradient id="wh-blade-grad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#2a5223" />
      <stop offset="50%" stop-color="#468037" />
      <stop offset="100%" stop-color="#23471c" />
    </linearGradient>

    <!-- Orange-red rust uredinia pustule gradient -->
    <radialGradient id="wh-pustule" cx="45%" cy="40%" r="55%">
      <stop offset="0%" stop-color="#ff7b1a" />
      <stop offset="50%" stop-color="#d44b08" />
      <stop offset="85%" stop-color="#802600" />
      <stop offset="100%" stop-color="#ff9d2e" stop-opacity="0" />
    </radialGradient>

    <filter id="wh-shadow" x="-10%" y="-10%" width="125%" height="125%">
      <feDropShadow dx="8" dy="16" stdDeviation="15" flood-color="#000000" flood-opacity="0.8" />
    </filter>
  </defs>

  <rect width="800" height="600" fill="url(#wh-bg)" />
  <circle cx="210" cy="180" r="140" fill="#243d26" opacity="0.3" />

  <g filter="url(#wh-shadow)">
    <!-- Long Arching Wheat Blade -->
    <path d="M120,540
             C240,460 380,320 520,180
             C580,120 640,80 710,50
             C650,95 560,180 470,270
             C360,380 230,490 120,540 Z"
          fill="url(#wh-blade-grad)" />

    <!-- Wheat Blade Midrib -->
    <path d="M120,540 C340,390 530,210 710,50" stroke="#8fd162" stroke-width="4.2" fill="none" opacity="0.85" />

    <!-- ================== PATHOLOGY: ORANGE-RED RUST PUSTULES (UREDIA) ================== -->
    <!-- Clustered powdery orange-cinnamon pustules breaking through leaf cuticle -->
    <!-- Cluster 1 -->
    <ellipse cx="380" cy="300" rx="8" ry="4" fill="url(#wh-pustule)" />
    <ellipse cx="395" cy="288" rx="9" ry="4.5" fill="url(#wh-pustule)" />
    <ellipse cx="370" cy="312" rx="7.5" ry="3.8" fill="url(#wh-pustule)" />
    <ellipse cx="410" cy="275" rx="8" ry="4" fill="url(#wh-pustule)" />
    <ellipse cx="385" cy="315" rx="7" ry="3.5" fill="url(#wh-pustule)" />

    <!-- Cluster 2 -->
    <ellipse cx="460" cy="225" rx="8.5" ry="4.2" fill="url(#wh-pustule)" />
    <ellipse cx="475" cy="212" rx="9" ry="4.5" fill="url(#wh-pustule)" />
    <ellipse cx="450" cy="238" rx="7.5" ry="3.8" fill="url(#wh-pustule)" />
    <ellipse cx="490" cy="200" rx="8" ry="4" fill="url(#wh-pustule)" />

    <!-- Cluster 3 (Lower) -->
    <ellipse cx="290" cy="390" rx="8" ry="4" fill="url(#wh-pustule)" />
    <ellipse cx="305" cy="378" rx="8.5" ry="4.2" fill="url(#wh-pustule)" />
    <ellipse cx="280" cy="402" rx="7" ry="3.5" fill="url(#wh-pustule)" />

    <!-- Pustule epidermal tears (dark edges) -->
    <ellipse cx="395" cy="288" rx="4" ry="1.8" fill="#521500" />
    <ellipse cx="475" cy="212" rx="4" ry="1.8" fill="#521500" />
  </g>
</svg>
`);

// 9. Realistic Blurry / Out-of-Focus Specimen (for rejection test)
export const INVALID_NON_PLANT_IMAGE = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <defs>
    <radialGradient id="inv-bg" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#4a594b" />
      <stop offset="50%" stop-color="#2d382e" />
      <stop offset="100%" stop-color="#141a14" />
    </radialGradient>
    <filter id="heavy-blur" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="35" />
    </filter>
  </defs>
  <rect width="800" height="600" fill="url(#inv-bg)" />
  <g filter="url(#heavy-blur)">
    <circle cx="350" cy="280" r="140" fill="#698f6a" opacity="0.7" />
    <circle cx="480" cy="340" r="120" fill="#8cb385" opacity="0.6" />
    <path d="M200,400 Q400,200 600,450" stroke="#3d573b" stroke-width="60" fill="none" opacity="0.5" />
  </g>
</svg>
`);

// 10. Realistic Expert Agronomist Avatar: Dr. Anita Kulkarni, Ph.D.
export const EXPERT_AVATAR_IMAGE = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="exp-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#16291a" />
      <stop offset="100%" stop-color="#0a120c" />
    </linearGradient>
    <radialGradient id="exp-skin" cx="45%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#c98a58" />
      <stop offset="70%" stop-color="#a46538" />
      <stop offset="100%" stop-color="#7d4420" />
    </radialGradient>
  </defs>
  <rect width="400" height="400" rx="200" fill="url(#exp-bg)" />
  <circle cx="200" cy="200" r="195" fill="none" stroke="#00FF66" stroke-width="4" stroke-opacity="0.5" />
  <!-- Lab Coat / Agronomist Blazer -->
  <path d="M100,380 C110,310 150,280 200,280 C250,280 290,310 300,380 Z" fill="#ffffff" />
  <path d="M150,380 L185,280 L200,330 L215,280 L250,380 Z" fill="#1b4d24" />
  <path d="M195,330 L205,330 L200,380 Z" fill="#d9534f" />
  <!-- Head & Hair -->
  <ellipse cx="200" cy="180" rx="58" ry="68" fill="url(#exp-skin)" />
  <!-- Neat Indian Agronomist Hair Bun -->
  <path d="M135,175 C135,100 170,85 200,85 C230,85 265,100 265,175 C250,140 230,120 200,120 C170,120 150,140 135,175 Z" fill="#120e0c" />
  <circle cx="200" cy="78" r="28" fill="#120e0c" />
  <!-- Spectacles (Senior Scientist) -->
  <rect x="155" y="160" width="36" height="24" rx="6" fill="none" stroke="#e0af36" stroke-width="3" />
  <rect x="209" y="160" width="36" height="24" rx="6" fill="none" stroke="#e0af36" stroke-width="3" />
  <path d="M191,170 L209,170" stroke="#e0af36" stroke-width="3" />
  <!-- Small red bindi -->
  <circle cx="200" cy="148" r="3" fill="#b31b1b" />
  <!-- Smile -->
  <path d="M185,215 Q200,225 215,215" stroke="#662912" stroke-width="2.5" fill="none" stroke-linecap="round" />
</svg>
`);

// 11. Farmer Avatars Dictionary for Community Discussions
export const FARMER_AVATARS: Record<string, string> = {
  'Ramesh Patel': svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
      <circle cx="100" cy="100" r="98" fill="#1b2a1c" stroke="#00FF66" stroke-width="3" stroke-opacity="0.4" />
      <path d="M40,190 C45,150 70,130 100,130 C130,130 155,150 160,190 Z" fill="#3a5a40" />
      <ellipse cx="100" cy="90" rx="34" ry="40" fill="#b07d50" />
      <!-- White Turban / Pheta -->
      <path d="M60,80 C60,45 80,35 100,35 C120,35 140,45 140,80 C130,60 110,50 100,50 C90,50 70,60 60,80 Z" fill="#f4ede2" />
      <path d="M65,70 Q100,60 135,70" stroke="#e3dacb" stroke-width="6" fill="none" />
      <path d="M85,105 Q100,112 115,105" stroke="#331c0a" stroke-width="3" fill="none" stroke-linecap="round" />
    </svg>
  `),
  'Devendra Singh': svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
      <circle cx="100" cy="100" r="98" fill="#162217" stroke="#00FF66" stroke-width="3" stroke-opacity="0.4" />
      <path d="M40,190 C45,150 70,130 100,130 C130,130 155,150 160,190 Z" fill="#284b63" />
      <ellipse cx="100" cy="92" rx="34" ry="38" fill="#a67449" />
      <!-- Saffron / Kesariya Pagri Turban -->
      <path d="M60,78 C58,40 80,30 100,30 C120,30 142,40 140,78 Z" fill="#e87a20" />
      <!-- Sikh Beard -->
      <path d="M72,95 C75,125 90,135 100,135 C110,135 125,125 128,95 Z" fill="#181310" />
    </svg>
  `),
  'Sunita Patil': svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
      <circle cx="100" cy="100" r="98" fill="#1a251b" stroke="#00FF66" stroke-width="3" stroke-opacity="0.4" />
      <path d="M40,190 C45,150 70,130 100,130 C130,130 155,150 160,190 Z" fill="#9b2226" />
      <ellipse cx="100" cy="95" rx="32" ry="38" fill="#b57e52" />
      <!-- Dark Hair Bun & Saree Pallu -->
      <path d="M62,85 C62,45 80,38 100,38 C120,38 138,45 138,85 Z" fill="#120e0c" />
      <circle cx="100" cy="78" r="2.5" fill="#c1121f" />
    </svg>
  `),
  'Mahesh Deshmukh': svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
      <circle cx="100" cy="100" r="98" fill="#182318" stroke="#00FF66" stroke-width="3" stroke-opacity="0.4" />
      <path d="M40,190 C45,150 70,130 100,130 C130,130 155,150 160,190 Z" fill="#1b4332" />
      <ellipse cx="100" cy="90" rx="34" ry="40" fill="#a8764a" />
      <path d="M65,75 C65,45 80,40 100,40 C120,40 135,45 135,75 Z" fill="#14110f" />
      <!-- Modern Agri-Tech Cap -->
      <path d="M60,65 C60,50 80,42 100,42 C120,42 140,50 140,65 L155,68 L60,68 Z" fill="#2d6a4f" />
    </svg>
  `),
  'Chandrakant Shinde': svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
      <circle cx="100" cy="100" r="98" fill="#152116" stroke="#00FF66" stroke-width="3" stroke-opacity="0.4" />
      <path d="M40,190 C45,150 70,130 100,130 C130,130 155,150 160,190 Z" fill="#583101" />
      <ellipse cx="100" cy="90" rx="34" ry="39" fill="#a47247" />
      <path d="M65,75 C65,45 80,40 100,40 C120,40 135,45 135,75 Z" fill="#28201a" />
      <path d="M84,104 Q100,110 116,104" stroke="#2b1a0d" stroke-width="3" fill="none" />
    </svg>
  `),
  'Harpreet Singh Brar': svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
      <circle cx="100" cy="100" r="98" fill="#152216" stroke="#00FF66" stroke-width="3" stroke-opacity="0.4" />
      <path d="M40,190 C45,150 70,130 100,130 C130,130 155,150 160,190 Z" fill="#386641" />
      <ellipse cx="100" cy="92" rx="34" ry="38" fill="#a67449" />
      <!-- Royal Blue Turban -->
      <path d="M60,78 C58,38 80,28 100,28 C120,28 142,38 140,78 Z" fill="#0077b6" />
      <path d="M72,95 C75,125 90,135 100,135 C110,135 125,125 128,95 Z" fill="#1c1613" />
    </svg>
  `),
  'Sunita Rao': svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
      <circle cx="100" cy="100" r="98" fill="#172217" stroke="#00FF66" stroke-width="3" stroke-opacity="0.4" />
      <path d="M40,190 C45,150 70,130 100,130 C130,130 155,150 160,190 Z" fill="#bc6c25" />
      <ellipse cx="100" cy="95" rx="32" ry="38" fill="#b88357" />
      <path d="M62,85 C62,45 80,38 100,38 C120,38 138,45 138,85 Z" fill="#140f0d" />
      <circle cx="100" cy="78" r="2.5" fill="#800f2f" />
    </svg>
  `),
  'Rajesh Sharma': svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
      <circle cx="100" cy="100" r="98" fill="#162217" stroke="#00FF66" stroke-width="3" stroke-opacity="0.4" />
      <path d="M40,190 C45,150 70,130 100,130 C130,130 155,150 160,190 Z" fill="#2d6a4f" />
      <ellipse cx="100" cy="90" rx="34" ry="40" fill="#ae7b4e" />
      <path d="M65,75 C65,45 80,40 100,40 C120,40 135,45 135,75 Z" fill="#1a1512" />
      <rect x="75" y="80" width="22" height="15" rx="3" fill="none" stroke="#222" stroke-width="2" />
      <rect x="103" y="80" width="22" height="15" rx="3" fill="none" stroke="#222" stroke-width="2" />
      <path d="M97,87 L103,87" stroke="#222" stroke-width="2" />
    </svg>
  `),
};

// Quick Presets with realistic crop photography
export const SAMPLE_PLANT_PRESETS = [
  {
    id: 'sample-tomato-blight',
    name: 'Tomato (Early Blight)',
    crop: 'Tomato',
    disease: 'Early Blight (Alternaria solani)',
    severity: 'moderate' as const,
    image: TOMATO_EARLY_BLIGHT_IMAGE,
    isHealthy: false,
    tag: 'Target Spots & Halos',
  },
  {
    id: 'sample-chilli-healthy',
    name: 'Chilli (Healthy Foliage)',
    crop: 'Chilli',
    disease: 'Healthy / No Pathogen Detected',
    severity: 'healthy' as const,
    image: CHILLI_HEALTHY_IMAGE,
    isHealthy: true,
    tag: 'Vibrant Green Canopy',
  },
  {
    id: 'sample-paddy-blast',
    name: 'Paddy (Leaf Blast)',
    crop: 'Paddy',
    disease: 'Leaf Blast (Magnaporthe oryzae)',
    severity: 'high' as const,
    image: PADDY_LEAF_BLAST_IMAGE,
    isHealthy: false,
    tag: 'Spindle-shaped Lesions',
  },
  {
    id: 'sample-potato-blight',
    name: 'Potato (Late Blight)',
    crop: 'Potato',
    disease: 'Late Blight (Phytophthora)',
    severity: 'critical' as const,
    image: POTATO_LATE_BLIGHT_IMAGE,
    isHealthy: false,
    tag: 'Water-soaked Necrosis',
  },
  {
    id: 'sample-cucumber-mildew',
    name: 'Cucumber (Powdery Mildew)',
    crop: 'Cucumber',
    disease: 'Powdery Mildew (Podosphaera)',
    severity: 'moderate' as const,
    image: CUCUMBER_POWDERY_MILDEW_IMAGE,
    isHealthy: false,
    tag: 'Fungal White Dusting',
  },
  {
    id: 'sample-corn-blight',
    name: 'Corn (Leaf Blight)',
    crop: 'Corn',
    disease: 'Northern Corn Leaf Blight',
    severity: 'high' as const,
    image: CORN_LEAF_BLIGHT_IMAGE,
    isHealthy: false,
    tag: 'Cigar-shaped Lesions',
  },
  {
    id: 'sample-brinjal-spot',
    name: 'Brinjal (Bacterial Spot)',
    crop: 'Brinjal',
    disease: 'Bacterial Leaf Spot',
    severity: 'moderate' as const,
    image: BRINJAL_LEAF_SPOT_IMAGE,
    isHealthy: false,
    tag: 'Angular Dark Lesions',
  },
  {
    id: 'sample-wheat-rust',
    name: 'Wheat (Leaf Rust)',
    crop: 'Wheat',
    disease: 'Leaf Rust (Puccinia triticina)',
    severity: 'high' as const,
    image: WHEAT_LEAF_RUST_IMAGE,
    isHealthy: false,
    tag: 'Orange Rust Pustules',
  },
  {
    id: 'sample-invalid-blurry',
    name: 'Blurry Non-Plant Specimen',
    crop: 'Unknown',
    disease: 'Unidentifiable',
    severity: 'moderate' as const,
    image: INVALID_NON_PLANT_IMAGE,
    isHealthy: false,
    tag: 'Confidence Rejection Test',
  },
];
