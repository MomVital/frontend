# MomVital API Integration

This document outlines the API integration between the MomVital frontend and backend services.

## API Endpoints

### Video Analysis API
- **URL**: `http://52.20.137.195:3000/analyze/`
- **Method**: `POST`
- **Description**: Uploads a video for analysis and returns heart rate and HRV data
- **Request Body**: Form data with video file
- **Response**:
  ```json
  {
    "message": "Processing complete",
    "results": {
      "sdnn": number,
      "bpms": number,
      "rmssd": number,
      "pnn50": number,
      "stress_level": number
    }
  }
  ```

### Local Health Data API
- **URL**: `http://localhost:8081/healthdata`
- **Method**: `POST`
- **Description**: Stores health data with pregnancy week information
- **Request Body**:
  ```json
  {
    "bpms": number,
    "sdnn": number,
    "rmssd": number,
    "pnn50": number,
    "stress_level": number,
    "week": number
  }
  ```

### AI Analysis APIs

#### Heart Beat Analysis
- **URL**: `http://52.20.137.195:3001/hb-analyze`
- **Method**: `POST`
- **Description**: Analyzes heart beat data
- **Request Body**: Health data object
- **Response**: Text analysis of heart rate data

#### HRV Analysis
- **URL**: `http://52.20.137.195:3001/hrv-analyze`
- **Method**: `POST`
- **Description**: Analyzes HRV data
- **Request Body**: Health data object
- **Response**: Text analysis of HRV data

#### Stress Analysis
- **URL**: `http://52.20.137.195:3001/stress-analyze`
- **Method**: `POST`
- **Description**: Analyzes stress levels
- **Request Body**: Health data object
- **Response**: Text analysis of stress data

#### Overall Analysis (AI Suggestions)
- **URL**: `http://52.20.137.195:3001/overall-analyze`
- **Method**: `POST`
- **Description**: Provides AI suggestions based on all health data
- **Request Body**:
  ```json
  {
    "analysis_data": {
      "timesES": [int, int, ...],
      "bpmES": [float, float, ...],
      "nni_seq": [float, float, ...],
      "hrv_results": {
        "sdnn": float,
        "rmssd": float,
        "pnn50": float,
        "lf": float,
        "hf": float,
        "lf_hf_ratio": float
      },
      "week": int
    },
    "history_result": "string"
  }
  ```
- **Response**:
  ```json
  {
    "stress_management": "string",
    "physical_activity": "string",
    "nutrition": "string",
    "sleep": "string"
  }
  ```

## Mock vs Real Backend

The application supports both mock and real backend modes:

1. **Mock Backend Mode**: Uses predefined mock data for testing without requiring a connection to the backend servers.
2. **Real Backend Mode**: Connects to the actual backend APIs for processing real data.

To switch between modes, modify the `USE_MOCK_BACKEND` constant in `apiService.ts`.

## Data Flow

1. User records a video in the ScanScreen
2. Video is uploaded to the backend for analysis
3. Backend returns heart rate and HRV data
4. Frontend adds pregnancy week information and saves to local API
5. Frontend requests analyses from AI backend:
   - Heart beat analysis
   - HRV analysis
   - Stress analysis
   - Emotional state analysis (currently mock only)
6. Frontend combines all analyses and requests AI suggestions
7. Results are displayed in the AnalysisScreen and AiSuggestionsScreen

## Error Handling

The API service includes error handling for:
- Network failures
- Invalid responses
- Timeout issues
- Local API unavailability

### Local API Fallback

The application is designed to continue functioning even if the local API is not available:

1. When saving analysis data to the local API fails, the application logs a warning but continues with the flow.
2. The data with the pregnancy week is still used for subsequent API calls.
3. This ensures that the user experience is not interrupted even if the local storage mechanism is unavailable.

### Graceful Degradation

The application implements graceful degradation in several ways:

1. **API Call Failures**: If any individual API call fails, the application continues with default values.
2. **Promise.allSettled**: Used for parallel API calls to ensure that if one call fails, others can still succeed.
3. **Default Values**: Meaningful default values are provided for all analysis results in case of API failures.
4. **Mock Data Fallback**: The application can fall back to mock data if real backend connections fail.

## Troubleshooting

If you encounter the "[API] Error saving analysis data" message:

1. Check that your local API server is running at `http://localhost:8081/healthdata`
2. Verify network connectivity between your app and the local API
3. Ensure the local API accepts the data format being sent
4. The app will continue to function despite this error, but data will not be saved locally

If you need to disable the local API call entirely, you can modify the `saveAnalysisData` function in `apiService.ts` to always return the data with the week added without attempting to save it. 