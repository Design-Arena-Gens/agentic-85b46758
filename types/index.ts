export interface MigrainePainLocation {
  frontal: boolean;
  temporal: boolean;
  parietal: boolean;
  occipital: boolean;
  neck: boolean;
  leftSide: boolean;
  rightSide: boolean;
}

export interface MigraineSymptomsData {
  aura: boolean;
  nausea: boolean;
  vomiting: boolean;
  lightSensitivity: boolean;
  soundSensitivity: boolean;
  smellSensitivity: boolean;
  visualDisturbances: boolean;
  dizziness: boolean;
}

export interface Medication {
  name: string;
  dosage: string;
  timeTaken: Date;
  reliefLevel: number; // 0-10
}

export interface ContextFactors {
  screenTimeHours: number;
  workHours: number;
  drivingHours: number;
  exerciseMinutes: number;
  sleepHours: number;
  sleepQuality: number; // 1-5
  stressLevel: number; // 1-10
  postureRating: number; // 1-5
  neckTension: boolean;
  environmentalNoise: number; // 1-5
  lightExposure: number; // 1-5
  weatherPressure: string; // 'low' | 'normal' | 'high'
  hydrationGlasses: number;
  caffeineIntake: number;
  alcoholIntake: number;
  mealRegularity: number; // 1-5
  hormonalPhase?: 'menstrual' | 'follicular' | 'ovulation' | 'luteal';
}

export interface MigraineTrigger {
  category: string;
  factor: string;
  correlationScore: number; // 0-100
  occurrences: number;
}

export interface MigrainePrediction {
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  probability: number; // 0-100
  triggers: string[];
  recommendations: string[];
  nextLikelyTime?: Date;
}

export interface MigrainEpisode {
  id: string;
  startTime: Date;
  endTime?: Date;
  duration?: number; // minutes
  painIntensity: number; // 1-10
  painLocation: MigrainePainLocation;
  symptoms: MigraineSymptomsData;
  medications: Medication[];
  contextFactors: ContextFactors;
  notes?: string;
  resolved: boolean;
}

export type MigraineEpisode = MigrainEpisode;

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender?: string;
  migraineHistory: number; // years
  chronicStatus: boolean;
  preferences: {
    notifications: boolean;
    earlyWarnings: boolean;
    weeklyReports: boolean;
    trackHormones: boolean;
  };
}

export interface AnalyticsData {
  totalEpisodes: number;
  averageDuration: number;
  averagePainIntensity: number;
  episodesThisMonth: number;
  episodesLastMonth: number;
  mostCommonTriggers: MigraineTrigger[];
  timePatterns: {
    hour: number;
    count: number;
  }[];
  dayOfWeekPatterns: {
    day: string;
    count: number;
  }[];
  seasonalPatterns: {
    month: string;
    count: number;
  }[];
}

export interface SelfHelpContent {
  id: string;
  title: string;
  category: 'prevention' | 'relief' | 'lifestyle' | 'education';
  duration: number; // minutes
  description: string;
  content: string;
  completed?: boolean;
}
