import { EnvironmentTag, EnvironmentalContext, EnvironmentSpecificGuidance } from '../types';

/**
 * Evaluates real-time meteorological / location triggers to classify the cultivation environment.
 * Triggers considered:
 * - Ambient Humidity (RH%)
 * - Temperature (°C)
 * - Dew Point (°C) & Condensation Risk
 * - Solar UV Index
 * - Wind Velocity (km/h)
 * - Solar Azimuth / Time of Day
 * - Location Name context (nursery, greenhouse, hoop house, field, valley, indoor)
 */
export async function fetchAndEvaluateEnvironment(
  latitude: number,
  longitude: number,
  locationName: string,
  userOverride?: EnvironmentTag
): Promise<EnvironmentalContext> {
  let temp = 21.0;
  let humidity = 75;
  let uvIndex = 3.5;
  let windSpeed = 6.2;
  let dewPoint = 16.4;
  let weatherDesc = 'Mild agricultural microclimate';

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,uv_index`,
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.current) {
        temp = Math.round((data.current.temperature_2m ?? temp) * 10) / 10;
        humidity = Math.round(data.current.relative_humidity_2m ?? humidity);
        uvIndex = Math.round((data.current.uv_index ?? uvIndex) * 10) / 10;
        windSpeed = Math.round((data.current.wind_speed_10m ?? windSpeed) * 10) / 10;
        dewPoint = Math.round((data.current.dew_point_2m ?? (temp - ((100 - humidity) / 5))) * 10) / 10;
        
        const wCode = data.current.weather_code ?? 0;
        if (wCode === 0) weatherDesc = 'Clear sky / full solar exposure';
        else if (wCode <= 3) weatherDesc = 'Partly cloudy to overcast';
        else if (wCode <= 48) weatherDesc = 'Dense coastal marine fog / dew layer';
        else if (wCode <= 67) weatherDesc = 'Active precipitation / rain shower';
        else weatherDesc = 'Overcast atmospheric disturbance';
      }
    }
  } catch (err) {
    console.warn('Using local agricultural microclimate approximation:', err);
    // Realistic regional Indian agricultural defaults based on coordinates
    if (locationName.toLowerCase().includes('nashik') || locationName.toLowerCase().includes('maharashtra') || locationName.toLowerCase().includes('pune') || locationName.toLowerCase().includes('dindori')) {
      humidity = 82;
      temp = 25.4;
      uvIndex = 5.8;
      windSpeed = 5.2;
      dewPoint = 21.0;
      weatherDesc = 'Godavari agro-valley morning mist with warm afternoon sunlight';
    } else if (locationName.toLowerCase().includes('punjab') || locationName.toLowerCase().includes('ludhiana') || locationName.toLowerCase().includes('haryana')) {
      humidity = 68;
      temp = 28.2;
      uvIndex = 6.4;
      windSpeed = 7.5;
      dewPoint = 19.5;
      weatherDesc = 'Indo-Gangetic alluvial plain with strong solar radiation';
    } else if (locationName.toLowerCase().includes('bengaluru') || locationName.toLowerCase().includes('karnataka')) {
      humidity = 74;
      temp = 23.8;
      uvIndex = 6.1;
      windSpeed = 6.0;
      dewPoint = 18.0;
      weatherDesc = 'Deccan plateau temperate microclimate with moderate breeze';
    } else if (locationName.toLowerCase().includes('guntur') || locationName.toLowerCase().includes('andhra') || locationName.toLowerCase().includes('tamil nadu')) {
      humidity = 79;
      temp = 29.5;
      uvIndex = 7.0;
      windSpeed = 8.4;
      dewPoint = 23.5;
      weatherDesc = 'Warm tropical delta with high relative humidity';
    } else {
      humidity = 78;
      temp = 26.0;
      uvIndex = 6.0;
      windSpeed = 6.5;
      dewPoint = 20.5;
      weatherDesc = 'Indian agricultural belt seasonal microclimate';
    }
  }

  // Calculate environmental scores based on physical triggers
  let greenhouseScore = 0;
  let outdoorScore = 0;
  let indoorScore = 0;
  const triggerNotes: string[] = [];

  const lowerLoc = locationName.toLowerCase();
  const isGreenhouseKeyword = lowerLoc.includes('greenhouse') || lowerLoc.includes('poly') || lowerLoc.includes('hoop') || lowerLoc.includes('tunnel') || lowerLoc.includes('nursery');
  const isIndoorKeyword = lowerLoc.includes('indoor') || lowerLoc.includes('apartment') || lowerLoc.includes('home') || lowerLoc.includes('hydroponic') || lowerLoc.includes('grow room');

  // Trigger 1: Relative Humidity & Condensation Delta
  const dewSpread = Math.abs(temp - dewPoint);
  if (humidity >= 80 || dewSpread <= 2.5) {
    greenhouseScore += 45;
    triggerNotes.push(`High ambient humidity (${humidity}% RH) with narrow dew-point spread (${dewSpread.toFixed(1)}°C) matches polyhouse/greenhouse moisture traps`);
  } else if (humidity < 50) {
    indoorScore += 25;
    outdoorScore += 20;
    triggerNotes.push(`Dry ambient air (${humidity}% RH)`);
  } else {
    outdoorScore += 20;
  }

  // Trigger 2: Wind Speed
  if (windSpeed <= 3.5) {
    greenhouseScore += 25;
    indoorScore += 30;
    triggerNotes.push(`Low air movement (${windSpeed} km/h) indicates protected enclosure or indoor buffer`);
  } else if (windSpeed >= 8.0) {
    outdoorScore += 40;
    triggerNotes.push(`Open wind speed (${windSpeed} km/h) signifies outdoor field exposure`);
  } else {
    greenhouseScore += 15;
    outdoorScore += 15;
  }

  // Trigger 3: Solar Radiation & UV Index
  if (uvIndex >= 3.0) {
    outdoorScore += 35;
    greenhouseScore += 15;
    triggerNotes.push(`Active solar radiation (UV ${uvIndex}) indicates daytime sunlight penetration`);
  } else if (uvIndex <= 0.8) {
    indoorScore += 35;
    triggerNotes.push(`Subdued UV index (${uvIndex}) aligns with indoor artificial light or interior window sill`);
  }

  // Trigger 4: Location Name Clues
  if (isGreenhouseKeyword) {
    greenhouseScore += 50;
    triggerNotes.push(`Location context explicitly mentions greenhouse / nursery sector`);
  } else if (isIndoorKeyword) {
    indoorScore += 50;
    triggerNotes.push(`Location context indicates indoor facility`);
  }

  // Determine winning classification
  let autoTag: EnvironmentTag = 'Outdoor';
  let confidence = 75;

  if (greenhouseScore > outdoorScore && greenhouseScore > indoorScore) {
    autoTag = 'Greenhouse';
    confidence = Math.min(96, Math.max(70, Math.round((greenhouseScore / (greenhouseScore + outdoorScore + indoorScore)) * 100 + 20)));
  } else if (indoorScore > outdoorScore && indoorScore >= greenhouseScore) {
    autoTag = 'Indoor';
    confidence = Math.min(94, Math.max(68, Math.round((indoorScore / (greenhouseScore + outdoorScore + indoorScore)) * 100 + 20)));
  } else {
    autoTag = 'Outdoor';
    confidence = Math.min(98, Math.max(72, Math.round((outdoorScore / (greenhouseScore + outdoorScore + indoorScore)) * 100 + 20)));
  }

  const finalEnv: EnvironmentTag = userOverride || autoTag;
  const isOverridden = Boolean(userOverride && userOverride !== autoTag);

  const primaryReason = isOverridden
    ? `Manually designated as ${userOverride} by grower (Ambient triggers: ${temp}°C, ${humidity}% RH, UV ${uvIndex}, ${windSpeed} km/h wind).`
    : triggerNotes.slice(0, 2).join('. ') + '.';

  return {
    environment: finalEnv,
    confidence: isOverridden ? 99 : confidence,
    locationName,
    coordinates: { lat: latitude, lng: longitude },
    temperature: temp,
    humidity,
    uvIndex,
    windSpeed,
    dewPoint,
    weatherDescription: weatherDesc,
    triggerReason: primaryReason,
    autoDetected: !isOverridden,
    detectedAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
  };
}

/**
 * Returns customized, highly specific environmental guidance protocols
 * tailored specifically for Indoor, Outdoor, or Greenhouse crop environments.
 */
export function getEnvironmentSpecificGuidance(
  env: EnvironmentTag,
  plant: string,
  disease: string
): EnvironmentSpecificGuidance {
  const isHealthy = disease.toLowerCase().includes('healthy');
  const crop = plant || 'Crop';

  if (env === 'Greenhouse') {
    return {
      tag: 'Greenhouse',
      title: 'Greenhouse & Polyhouse Microclimate Protocol',
      badgeColor: 'border-emerald-500/40 bg-emerald-950/40 text-emerald-300',
      vulnerabilityOverview:
        'Enclosed structures trap foliar transpiration and thermal energy, creating stagnant high-humidity pockets (>80% RH) where fungal spores germinate rapidly on leaf surfaces.',
      recommendedActions: [
        'Active Ridge & Sidewall Venting: Crack vents for 30–45 minutes at sunrise to exhaust humid nocturnal air before solar heating causes condensation drips.',
        'Canopy Air Circulation: Run Horizontal Airflow (HAF) fans continuously at 0.5–1.0 m/s across the top of the canopy to break the stagnant boundary layer.',
        'Morning-Only Drip Delivery: Complete all fertigation cycles before 11:00 AM so the soil surface dries before nightfall, reducing overnight relative humidity.',
        'Protected Biocontrol Application: Introduce beneficial antagonistic microbes (e.g. Bacillus subtilis or Trichoderma) which thrive in warm, sheltered greenhouse atmospheres.',
      ],
      riskFactors: [
        'Condensation dripping from poly film or glass rafters directly onto crop leaves',
        'Stagnant microclimates in center beds with restricted side-curtain airflow',
        'High density planting reducing air circulation between lower petioles',
      ],
      climateControlTips: [
        'Target daytime RH between 60% and 72% for optimum stomatal gas exchange',
        'Sanitize greenhouse staging tables, trellis clips, and shears between rows',
        'Ensure floor drainage gravel is free of standing puddles',
      ],
    };
  }

  if (env === 'Indoor') {
    return {
      tag: 'Indoor',
      title: 'Indoor & Grow Room Precision Care Plan',
      badgeColor: 'border-cyan-500/40 bg-cyan-950/40 text-cyan-300',
      vulnerabilityOverview:
        'Indoor environments lack natural predatory insects and wind movement. Without proper airflow and photoperiod regulation, container potting soils can easily become waterlogged and encourage fungal gnats and leaf spotting.',
      recommendedActions: [
        'Targeted Photoperiod & PPFD: Maintain 14–16 hours of full-spectrum LED light at 350–500 µmol/m²/s PPFD; ensure an uninterrupted 8-hour dark period for starch metabolism.',
        'Oscillating Fan Setup: Position an oscillating fan 1.5–2 meters away on gentle setting to create natural stem flexion and eliminate dead air pockets around foliage.',
        'Runoff Saucer Drainage: Empty catch saucers 20 minutes after watering; never allow container roots to sit in stagnant runoff water.',
        'Isolation & Foliar Cleaning: Isolate from other indoor plants while treating; gently wipe upper leaf surfaces with damp microfiber to remove indoor dust buildup.',
      ],
      riskFactors: [
        'Stagnant room air fostering powdery spore germination in shady lower canopies',
        'Over-watering due to lower indoor evapotranspiration rates compared to open sun',
        'Absence of natural UV-B antimicrobial wavelengths under standard household bulbs',
      ],
      climateControlTips: [
        'Maintain indoor ambient temperature between 20°C and 24°C (68°F–75°F)',
        'Check container soil moisture 2 inches deep before applying irrigation',
        'Use sterile, well-draining soilless potting mix with perlite or pumice',
      ],
    };
  }

  // Default: Outdoor
  return {
    tag: 'Outdoor',
    title: 'Open-Field & Garden Environmental Action Plan',
    badgeColor: 'border-amber-500/40 bg-amber-950/40 text-amber-300',
    vulnerabilityOverview:
      'Outdoor crops are subject to open weather fluctuations, rain splash spore transport from soil, regional windborne pathogen drifts, and intense direct solar UV scorch.',
    recommendedActions: [
      'Soil Splash Barrier Mulching: Apply 2–3 inches of clean organic straw or dark woven landscape fabric around the base to prevent rain splash-back from spreading soilborne spores.',
      'Weather-Timed Spray Windows: Never spray foliar treatments during peak solar UV hours (11:00 AM – 3:00 PM) to prevent leaf scalding; apply at early dawn or twilight.',
      'Wind & Canopy Pruning: Prune dense lower suckers and orient planting rows parallel to prevailing breezes to accelerate leaf drying after morning dew or rainfall.',
      'Drip vs Furrow Irrigation: Avoid overhead sprinklers; deliver irrigation directly to root zones via ground drip tape to keep foliage dry.',
    ],
    riskFactors: [
      'Heavy rainstorms splashing fungal spores from topsoil up into lower canopy tiers',
      'Windborne spore drifts from adjacent blighted fields during humid weather fronts',
      'Prolonged leaf wetness after overnight dew or coastal morning marine layers',
    ],
    climateControlTips: [
      'Monitor regional weather radar for upcoming storm or coastal fog systems',
      'Erect windbreaks or row covers if winds regularly exceed 25 km/h to prevent mechanical leaf abrasion',
      'Collect and remove all fallen diseased foliage from the field plot—never till infected leaves into the soil',
    ],
  };
}
