import { mockUser, mockHealthData, mockAiSuggestions } from './mockData';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuration
const USE_MOCK_BACKEND = false; // Set to false to use real backend
export const BACKEND_BASE_URL = 'http://52.20.137.195:3000'; // Video upload API
export const AI_BACKEND_BASE_URL = 'http://52.20.137.195:3001'; // Analysis APIs
export const LOCAL_API_URL = 'http://localhost:8081';

// Storage keys
const LATEST_SCAN_ID_KEY = 'LATEST_SCAN_ID';
const LATEST_ANALYSIS_DATA_KEY = 'LATEST_ANALYSIS_DATA';

// Types
export interface AnalysisResponse {
  bpms: number;
  sdnn: number;
  rmssd: number;
  pnn50: number;
  stress_level: number;
  week?: number;
}

export interface ApiResponse {
  message: string;
  results: {
    sdnn: number;
    bpms: number;
    rmssd: number;
    pnn50: number;
    stress_level: number;
  };
}

export interface AiSuggestionResponse {
  category: string;
  title: string;
  description: string;
  importance: 'high' | 'medium' | 'low';
  timestamp: string;
}

// Latest scan data storage functions
export const storeLatestScanId = async (scanId: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(LATEST_SCAN_ID_KEY, scanId);
    console.log('Stored latest scanId:', scanId);
  } catch (error) {
    console.error('Error storing latest scanId:', error);
  }
};

export const getLatestScanId = async (): Promise<string | null> => {
  try {
    const scanId = await AsyncStorage.getItem(LATEST_SCAN_ID_KEY);
    console.log('Retrieved latest scanId:', scanId);
    return scanId;
  } catch (error) {
    console.error('Error retrieving latest scanId:', error);
    return null;
  }
};

export const storeLatestAnalysisData = async (data: AnalysisResponse): Promise<void> => {
  try {
    await AsyncStorage.setItem(LATEST_ANALYSIS_DATA_KEY, JSON.stringify(data));
    console.log('Stored latest analysis data');
  } catch (error) {
    console.error('Error storing latest analysis data:', error);
  }
};

export const getLatestAnalysisData = async (): Promise<AnalysisResponse | null> => {
  try {
    const dataString = await AsyncStorage.getItem(LATEST_ANALYSIS_DATA_KEY);
    if (dataString) {
      const data = JSON.parse(dataString) as AnalysisResponse;
      console.log('Retrieved latest analysis data');
      return data;
    }
    return null;
  } catch (error) {
    console.error('Error retrieving latest analysis data:', error);
    return null;
  }
};

// Helper function to add pregnancy week to the analysis data
const addPregnancyWeekToData = (data: AnalysisResponse): AnalysisResponse => {
  const currentUser = mockUser; // In a real app, this would come from user context or state
  return {
    ...data,
    week: currentUser.pregnancyWeek
  };
};

// Save analysis data to local API
export const saveAnalysisData = async (data: AnalysisResponse): Promise<AnalysisResponse> => {
  try {
    console.log('Saving analysis data with week:', data.week);
    // Just return the data with the week added since we don't have a storage API
    return data;
  } catch (error) {
    console.error('Error saving analysis data:', error);
    return data;
  }
};

// Get heart beat analysis from backend
export const getHeartBeatAnalysis = async (data: AnalysisResponse): Promise<string> => {
  try {
    console.log('Fetching heart beat analysis from API...');
    const response = await fetch(`${AI_BACKEND_BASE_URL}/hb-analyze/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to get heart beat analysis: ${response.status}`);
    }
    
    const result = await response.json();
    return result.analysis || "Heart rate analysis completed successfully.";
  } catch (error) {
    console.error('Error getting heart beat analysis:', error);
    // Fallback to a basic analysis if the API call fails
    const bpm = data.bpms;
    if (bpm < 60) {
      return "Your heart rate is lower than average. This could indicate good cardiovascular fitness, but if you're experiencing symptoms like fatigue or dizziness, please consult your healthcare provider.";
    } else if (bpm >= 60 && bpm <= 80) {
      return "Your heart rate is within the normal range for pregnant women. This indicates good cardiovascular health.";
    } else if (bpm > 80 && bpm <= 100) {
      return "Your heart rate is slightly elevated, which is common during pregnancy. Consider relaxation techniques if you're feeling stressed.";
    } else {
      return "Your heart rate is higher than average. While this can be normal during pregnancy, consider resting and hydrating. If it persists, consult your healthcare provider.";
    }
  }
};

// Get HRV analysis from backend
export const getHrvAnalysis = async (data: AnalysisResponse): Promise<string> => {
  try {
    console.log('Fetching HRV analysis from API...');
    const response = await fetch(`${AI_BACKEND_BASE_URL}/hrv-analyze/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to get HRV analysis: ${response.status}`);
    }
    
    const result = await response.json();
    return result.analysis || "HRV analysis completed successfully.";
  } catch (error) {
    console.error('Error getting HRV analysis:', error);
    // Fallback to a basic analysis if the API call fails
    const sdnn = data.sdnn;
    if (sdnn < 30) {
      return "Your heart rate variability is lower than average, which may indicate higher stress levels. Consider incorporating stress-reduction activities into your daily routine.";
    } else if (sdnn >= 30 && sdnn <= 60) {
      return "Your heart rate variability is within the normal range, indicating a good balance between your sympathetic and parasympathetic nervous systems.";
    } else {
      return "Your heart rate variability is higher than average, which generally indicates good autonomic nervous system function and stress resilience.";
    }
  }
};

// Get stress analysis from backend
export const getStressAnalysis = async (data: AnalysisResponse): Promise<string> => {
  try {
    console.log('Fetching stress analysis from API...');
    const response = await fetch(`${AI_BACKEND_BASE_URL}/stress-analyze/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to get stress analysis: ${response.status}`);
    }
    
    const result = await response.json();
    return result.analysis || "Stress analysis completed successfully.";
  } catch (error) {
    console.error('Error getting stress analysis:', error);
    // Fallback to a basic analysis if the API call fails
    const stressLevel = data.stress_level;
    if (stressLevel < 30) {
      return "Your stress levels are low, which is excellent for both your health and your baby's development. Continue with your current stress management techniques.";
    } else if (stressLevel >= 30 && stressLevel <= 60) {
      return "Your stress levels are moderate. This is common during pregnancy, but consider incorporating more relaxation techniques into your routine.";
    } else {
      return "Your stress levels are higher than average. While occasional stress is normal during pregnancy, chronic high stress can affect your health and your baby's development. Consider speaking with your healthcare provider about stress management strategies.";
    }
  }
};

// Get emotional state analysis based on other metrics
export const getEmotionalStateAnalysis = async (data: AnalysisResponse): Promise<string> => {
  try {
    // We don't have a specific API for emotional state analysis
    // Instead, we'll derive it from stress level and HRV
    const stressLevel = data.stress_level;
    const sdnn = data.sdnn;
    
    if (stressLevel < 30 && sdnn > 50) {
      return "Your emotional state appears to be calm and balanced. This is beneficial for both your mental wellbeing and your baby's development.";
    } else if (stressLevel >= 30 && stressLevel <= 60) {
      return "Your emotional state shows some signs of stress, which is common during pregnancy. Consider mindfulness practices or gentle exercise to help maintain emotional balance.";
    } else {
      return "Your emotional state indicates higher levels of stress or anxiety. Remember that emotional fluctuations are normal during pregnancy, but if you're feeling overwhelmed, consider speaking with your healthcare provider or a mental health professional.";
    }
  } catch (error) {
    console.error('Error getting emotional state analysis:', error);
    return "Unable to analyze emotional state data. Please try again later.";
  }
};

// Get AI suggestions from backend
export const getAiSuggestions = async (
  data: AnalysisResponse,
  heartBeatAnalysis: string,
  hrvAnalysis: string,
  stressAnalysis: string,
  emotionalAnalysis: string
): Promise<AiSuggestionResponse[]> => {
  try {
    // Create a history string from the analysis results
    const historyString = `
      Heart Rate: ${data.bpms} BPM. ${heartBeatAnalysis}
      HRV Metrics: SDNN=${data.sdnn}, RMSSD=${data.rmssd}, pNN50=${data.pnn50}. ${hrvAnalysis}
      Stress Level: ${data.stress_level}/100. ${stressAnalysis}
      Emotional State: ${emotionalAnalysis}
      Pregnancy Week: ${data.week || 'Unknown'}
    `;
    
    console.log('Fetching AI suggestions from API...');
    
    const response = await fetch(`${AI_BACKEND_BASE_URL}/overall-analyze/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        analysis_data: data, // Send the full AnalysisResponse object
        week: data.week || 24, // Default to week 24 if not provided
        history_result: historyString
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to get AI suggestions: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('AI suggestions received:', result);
    
    // Convert the API response to our AiSuggestionResponse format
    const suggestions: AiSuggestionResponse[] = [];
    
    // Process stress_management suggestion
    if (result.stress_management) {
      suggestions.push({
        category: 'stress_management',
        title: 'Stress Management',
        description: result.stress_management,
        importance: 'high',
        timestamp: new Date().toISOString()
      });
    }
    
    // Process physical_activity suggestion
    if (result.physical_activity) {
      suggestions.push({
        category: 'physical_activity',
        title: 'Physical Activity',
        description: result.physical_activity,
        importance: 'medium',
        timestamp: new Date().toISOString()
      });
    }
    
    // Process nutrition suggestion
    if (result.nutrition) {
      suggestions.push({
        category: 'nutrition',
        title: 'Nutrition',
        description: result.nutrition,
        importance: 'high',
        timestamp: new Date().toISOString()
      });
    }
    
    // Process sleep suggestion
    if (result.sleep) {
      suggestions.push({
        category: 'sleep',
        title: 'Sleep',
        description: result.sleep,
        importance: 'medium',
        timestamp: new Date().toISOString()
      });
    }
    
    // If no suggestions were returned, use fallback
    if (suggestions.length === 0) {
      return getFallbackSuggestions();
    }
    
    return suggestions;
  } catch (error) {
    console.error('Error getting AI suggestions:', error);
    return getFallbackSuggestions();
  }
};

// Helper function to get fallback suggestions
const getFallbackSuggestions = (): AiSuggestionResponse[] => {
  return [
    {
      category: 'stress_management',
      title: 'Practice Deep Breathing',
      description: 'Take 5 minutes to practice deep breathing exercises. Inhale for 4 counts, hold for 4, and exhale for 6.',
      importance: 'high',
      timestamp: new Date().toISOString()
    },
    {
      category: 'physical_activity',
      title: 'Gentle Walking',
      description: 'A 15-minute gentle walk can help improve circulation and reduce stress.',
      importance: 'medium',
      timestamp: new Date().toISOString()
    },
    {
      category: 'nutrition',
      title: 'Stay Hydrated',
      description: 'Drink plenty of water throughout the day to stay hydrated, which is essential for both you and your baby.',
      importance: 'high',
      timestamp: new Date().toISOString()
    },
    {
      category: 'sleep',
      title: 'Establish a Bedtime Routine',
      description: 'Create a calming bedtime routine to improve sleep quality. Try to go to bed at the same time each night.',
      importance: 'medium',
      timestamp: new Date().toISOString()
    }
  ];
};

// Process video analysis data
export const processVideoAnalysis = async (
  analysisData: AnalysisResponse,
  scanId?: string
): Promise<{
  savedData: AnalysisResponse;
  heartBeatAnalysis: string;
  hrvAnalysis: string;
  stressAnalysis: string;
  emotionalAnalysis: string;
  aiSuggestions: AiSuggestionResponse[];
}> => {
  try {
    // Add pregnancy week to the data
    const dataWithWeek = addPregnancyWeekToData(analysisData);
    
    // Save the analysis data
    const savedData = await saveAnalysisData(dataWithWeek);
    console.log('Saved analysis data with week:', savedData.week);
    
    // Store the latest analysis data
    await storeLatestAnalysisData(savedData);
    
    // Store the scanId if provided
    if (scanId) {
      await storeLatestScanId(scanId);
    }
    
    // Get analyses in parallel
    const [heartBeatResult, hrvResult, stressResult] = await Promise.allSettled([
      getHeartBeatAnalysis(savedData),
      getHrvAnalysis(savedData),
      getStressAnalysis(savedData)
    ]);
    
    // Extract results or provide fallback messages
    const heartBeatAnalysis = heartBeatResult.status === 'fulfilled' ? heartBeatResult.value : 'Heart rate analysis unavailable';
    const hrvAnalysis = hrvResult.status === 'fulfilled' ? hrvResult.value : 'HRV analysis unavailable';
    const stressAnalysis = stressResult.status === 'fulfilled' ? stressResult.value : 'Stress analysis unavailable';
    
    // Get emotional state analysis
    const emotionalAnalysis = await getEmotionalStateAnalysis(savedData);
    
    // Create a history string for AI suggestions
    const historyString = `
      Heart Rate: ${savedData.bpms} BPM. ${heartBeatAnalysis}
      HRV Metrics: SDNN=${savedData.sdnn}, RMSSD=${savedData.rmssd}, pNN50=${savedData.pnn50}. ${hrvAnalysis}
      Stress Level: ${savedData.stress_level}/100. ${stressAnalysis}
      Emotional State: ${emotionalAnalysis}
      Pregnancy Week: ${savedData.week || 'Unknown'}
    `;
    
    // Get AI suggestions
    let aiSuggestions: AiSuggestionResponse[];
    try {
      aiSuggestions = await getAiSuggestions(
        savedData,
        heartBeatAnalysis,
        hrvAnalysis,
        stressAnalysis,
        emotionalAnalysis
      );
    } catch (error) {
      console.error('Error getting AI suggestions:', error);
      // Provide default suggestions if the AI suggestions fail
      aiSuggestions = [
        {
          category: 'stress_management',
          title: 'Take a Break',
          description: 'Consider taking a short break and trying the scan again later.',
          importance: 'medium',
          timestamp: new Date().toISOString()
        }
      ];
    }
    
    return {
      savedData,
      heartBeatAnalysis,
      hrvAnalysis,
      stressAnalysis,
      emotionalAnalysis,
      aiSuggestions
    };
  } catch (error) {
    console.error('Error processing video analysis:', error);
    // Return default values in case of error
    const defaultData = addPregnancyWeekToData(analysisData);
    return {
      savedData: defaultData,
      heartBeatAnalysis: 'Heart rate analysis unavailable due to an error',
      hrvAnalysis: 'HRV analysis unavailable due to an error',
      stressAnalysis: 'Stress analysis unavailable due to an error',
      emotionalAnalysis: 'Emotional state analysis unavailable due to an error',
      aiSuggestions: [
        {
          category: 'stress_management',
          title: 'Take a Break',
          description: 'Consider taking a short break and trying the scan again later.',
          importance: 'medium',
          timestamp: new Date().toISOString()
        }
      ]
    };
  }
}; 