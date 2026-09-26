export type Severity = 'healthy' | 'moderate' | 'high' | 'critical';

export type PlantHealthStatus = 'Healthy' | 'Recovering' | 'Needs Attention' | 'Critical';

export type EnvironmentTag = 'Indoor' | 'Outdoor' | 'Greenhouse';

export interface EnvironmentalContext {
  environment: EnvironmentTag;
  confidence: number;
  locationName: string;
  coordinates?: { lat: number; lng: number };
  temperature: number; // in °C
  humidity: number; // in % RH
  uvIndex: number; // 0 - 12+
  windSpeed: number; // in km/h
  dewPoint: number; // in °C
  weatherDescription?: string;
  triggerReason: string;
  autoDetected: boolean;
  detectedAt?: string;
}

export interface EnvironmentSpecificGuidance {
  tag: EnvironmentTag;
  title: string;
  badgeColor: string;
  vulnerabilityOverview: string;
  recommendedActions: string[];
  riskFactors: string[];
  climateControlTips: string[];
}

export interface UserSession {
  name: string;
  emailOrPhone: string;
  location: string;
  latitude: number;
  longitude: number;
  language: string;
  isOnboarded: boolean;
  joinedDate: string;
}

export interface PlantScan {
  id: string;
  date: string;
  time: string;
  dayLabel: string; // e.g. "Day 1", "Day 3"
  imageUrl: string;
  plant: string;
  cropType: string;
  disease: string;
  confidence: number;
  severity: Severity;
  healthScore: number; // 0 - 100
  detectionSummary: string;
  symptoms: string[];
  possibleCauses: string[];
  generalGuidance: string[];
  whatChanged?: string;
  plantStatusTrend?: 'Improving' | 'Needs Attention' | 'Stable';
  environmentTag?: EnvironmentTag;
  environmentalContext?: EnvironmentalContext;
  environmentSpecificGuidance?: EnvironmentSpecificGuidance;
}

export interface TrackedPlant {
  id: string;
  customName: string; // e.g. "Tomato 01"
  cropType: string;
  plantName: string;
  icon: string;
  currentDisease: string;
  currentSeverity: Severity;
  currentHealthScore: number;
  healthStatusLabel: PlantHealthStatus;
  environmentTag?: EnvironmentTag;
  lastScannedDate: string;
  scans: PlantScan[];
  dailyActionPlan: {
    morning: string;
    watering: string;
    monitoring: string;
    nextStep: string;
  };
}

export interface CommunityDiseaseReport {
  id: string;
  diseaseName: string;
  crop: string;
  reportsCount: number;
  severity: Severity;
  lat: number;
  lng: number;
  locationName: string;
  samplePhotoUrl: string;
  lastUpdated: string;
  spreadAlert?: {
    title: string;
    causes: string[];
    prevention: string[];
  };
}

export interface CommunityReply {
  id: string;
  author: string;
  isExpert?: boolean;
  text: string;
  time: string;
}

export interface CommunityPost {
  id: string;
  authorName: string;
  authorRole: string;
  location: string;
  timeAgo: string;
  title: string;
  content: string;
  crop: string;
  diseaseTag?: string;
  imageUrl?: string;
  likes: number;
  isLiked?: boolean;
  replies: CommunityReply[];
}

export interface ExpertConsultation {
  id: string;
  timestamp: string;
  plantName: string;
  cropType: string;
  detectedDisease: string;
  symptoms: string;
  location: string;
  question: string;
  imageUrl: string;
  status: 'Under Review' | 'Answered';
  expertResponse?: {
    expertName: string;
    credentials: string;
    institution: string;
    answer: string;
    recommendedCulturalPractices: string[];
    reviewedAt: string;
  };
}

export interface AreaAlert {
  id: string;
  type: 'disease' | 'environmental' | 'reminder';
  icon: string;
  title: string;
  description: string;
  severity: 'warning' | 'critical' | 'info';
  timestamp: string;
}
