export interface User {
  id: string;
  name: string;
  email: string;
  pregnancyWeek: number;
  dueDate: string;
  lastCheckup: string;
}

export interface HealthData {
  timestamp: string;
  heartRate: number;
  hrv: number;
  stress: number;
  emotion: string;
  emotionConfidence: number;
}

export interface AISuggestion {
  id: string;
  category: 'exercise' | 'nutrition' | 'mental' | 'general';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
}

export interface HealthMetrics {
  currentHeartRate: number;
  averageHeartRate: number;
  currentHRV: number;
  averageHRV: number;
  stressLevel: number;
  dominantEmotion: string;
  emotionalBalance: number;
} 