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

In case of errors, the application will fall back to mock data to ensure a smooth user experience. 