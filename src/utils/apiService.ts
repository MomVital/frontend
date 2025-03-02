import { mockUser, mockHealthData, mockAiSuggestions } from './mockData';

// Configuration
const USE_MOCK_BACKEND = true; // Set to false to use real backend
const BACKEND_BASE_URL = 'http://52.20.137.195:3000';
const AI_BACKEND_BASE_URL = 'http://52.20.137.195:3001';
const LOCAL_API_URL = 'http://localhost:8081/healthdata';

// Types
export interface AnalysisResponse {
  timesES: number[];
  bpmES: number[];
  nni_seq: number[];
  hrv_results: Record<string, number | string>;
  week?: number;
}

export interface AiSuggestionResponse {
  stress_management: string;
  physical_activity: string;
  nutrition: string;
  sleep: string;
}

// Helper function to add pregnancy week to the analysis data
const addPregnancyWeekToData = (data: AnalysisResponse): AnalysisResponse => {
  return {
    ...data,
    week: mockUser.pregnancyWeek, // In a real app, this would come from user profile
  };
};

// Save analysis data to local API
export const saveAnalysisData = async (data: AnalysisResponse): Promise<AnalysisResponse> => {
  try {
    const dataWithWeek = addPregnancyWeekToData(data);
    
    // In a real app, this would be a POST request to your local API
    console.log('[API] Saving analysis data to local API:', dataWithWeek);
    
    // Mock implementation - in a real app, you would POST to LOCAL_API_URL
    if (!USE_MOCK_BACKEND) {
      const response = await fetch(LOCAL_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataWithWeek),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to save data: ${response.status}`);
      }
      
      return await response.json();
    }
    
    // For mock mode, just return the data with week added
    return dataWithWeek;
  } catch (error) {
    console.error('[API] Error saving analysis data:', error);
    throw error;
  }
};

// Get heart beat analysis from backend
export const getHeartBeatAnalysis = async (analysisData: AnalysisResponse): Promise<string> => {
  if (USE_MOCK_BACKEND) {
    return "Your heart rate is within the normal range for pregnant women in their second trimester. The slight elevation is normal and corresponds with your activity levels.";
  }
  
  try {
    const response = await fetch(`${AI_BACKEND_BASE_URL}/hb-analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(analysisData),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to get heart beat analysis: ${response.status}`);
    }
    
    const data = await response.json();
    return data.analysis || '';
  } catch (error) {
    console.error('[API] Error getting heart beat analysis:', error);
    return "Unable to analyze heart rate data. Please try again later.";
  }
};

// Get HRV analysis from backend
export const getHrvAnalysis = async (analysisData: AnalysisResponse): Promise<string> => {
  if (USE_MOCK_BACKEND) {
    return "Your HRV indicates a good balance between rest and activity. This suggests your autonomic nervous system is functioning well during pregnancy.";
  }
  
  try {
    const response = await fetch(`${AI_BACKEND_BASE_URL}/hrv-analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(analysisData),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to get HRV analysis: ${response.status}`);
    }
    
    const data = await response.json();
    return data.analysis || '';
  } catch (error) {
    console.error('[API] Error getting HRV analysis:', error);
    return "Unable to analyze HRV data. Please try again later.";
  }
};

// Get stress analysis from backend
export const getStressAnalysis = async (analysisData: AnalysisResponse): Promise<string> => {
  if (USE_MOCK_BACKEND) {
    return "Your current stress level is medium. We've noticed a pattern of increased stress levels in the mid-afternoon. This could be related to work activities or fatigue.";
  }
  
  try {
    const response = await fetch(`${AI_BACKEND_BASE_URL}/stress-analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(analysisData),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to get stress analysis: ${response.status}`);
    }
    
    const data = await response.json();
    return data.analysis || '';
  } catch (error) {
    console.error('[API] Error getting stress analysis:', error);
    return "Unable to analyze stress data. Please try again later.";
  }
};

// Get emotional state analysis (mock only for now)
export const getEmotionalStateAnalysis = (): string => {
  return "Your emotional state appears balanced. The data shows a healthy variation between calm and excited states, which is normal during pregnancy.";
};

// Get AI suggestions from backend
export const getAiSuggestions = async (
  analysisData: AnalysisResponse, 
  historyResults: string
): Promise<AiSuggestionResponse> => {
  if (USE_MOCK_BACKEND) {
    // Return mock suggestions
    return {
      stress_management: mockAiSuggestions[0].description,
      physical_activity: mockAiSuggestions[1].description,
      nutrition: mockAiSuggestions[2].description,
      sleep: mockAiSuggestions[3].description,
    };
  }
  
  try {
    const response = await fetch(`${AI_BACKEND_BASE_URL}/overall-analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        analysis_data: analysisData,
        history_result: historyResults
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to get AI suggestions: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('[API] Error getting AI suggestions:', error);
    // Return empty suggestions if there's an error
    return {
      stress_management: '',
      physical_activity: '',
      nutrition: '',
      sleep: ''
    };
  }
};

// Process video analysis data
export const processVideoAnalysis = async (
  analysisData: AnalysisResponse
): Promise<{
  savedData: AnalysisResponse;
  heartBeatAnalysis: string;
  hrvAnalysis: string;
  stressAnalysis: string;
  emotionalAnalysis: string;
  aiSuggestions: AiSuggestionResponse;
}> => {
  try {
    // Step 1: Save the data with week added
    const savedData = await saveAnalysisData(analysisData);
    
    // Step 2: Get analyses in parallel
    const [heartBeatAnalysis, hrvAnalysis, stressAnalysis] = await Promise.all([
      getHeartBeatAnalysis(savedData),
      getHrvAnalysis(savedData),
      getStressAnalysis(savedData)
    ]);
    
    // Step 3: Get emotional state analysis (mock only for now)
    const emotionalAnalysis = getEmotionalStateAnalysis();
    
    // Step 4: Combine all analyses for AI suggestions
    const historyResults = `Heart Rate: ${heartBeatAnalysis}\nHRV: ${hrvAnalysis}\nStress: ${stressAnalysis}\nEmotional: ${emotionalAnalysis}`;
    
    // Step 5: Get AI suggestions
    const aiSuggestions = await getAiSuggestions(savedData, historyResults);
    
    return {
      savedData,
      heartBeatAnalysis,
      hrvAnalysis,
      stressAnalysis,
      emotionalAnalysis,
      aiSuggestions
    };
  } catch (error) {
    console.error('[API] Error processing video analysis:', error);
    throw error;
  }
}; 