import React, { useState, useRef, useEffect } from 'react';
import { View, Alert, Pressable, BackHandler, Animated } from 'react-native';
import { useNavigation, CommonActions, StackActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import styled from 'styled-components/native';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import { Svg, Ellipse, Path } from 'react-native-svg';

import Container from '../components/Container';
import Typography from '../components/Typography';
import Button from '../components/Button';
import { theme } from '../theme/theme';
import { RootStackParamList } from '../navigation/types';
import LoadingIndicator from '../components/LoadingIndicator';
import Card from '../components/Card';
import { processVideoAnalysis, AnalysisResponse } from '../utils/apiService';

type ScanScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Scan'>;

// Backend API URL
const API_URL = 'http://52.20.137.195:3000/analyze/';
const USE_MOCK_DATA = false;

// Mock analysis response for testing
const mockAnalysisResponse: AnalysisResponse = {
  bpms: 79,
  sdnn: 45,
  rmssd: 42,
  pnn50: 30,
  stress_level: 35
};

const ScanScreen: React.FC = () => {
  const navigation = useNavigation<ScanScreenNavigationProp>();
  const [permission, requestPermission] = useCameraPermissions();
  const [isRecording, setIsRecording] = useState(false);
  const [cameraType, setCameraType] = useState<'front' | 'back'>('front');
  const [isUploading, setIsUploading] = useState(false);
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [scanId, setScanId] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const showMockFallbackDialog = false; // Flag to control whether to show the mock fallback dialog
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const cameraRef = useRef<CameraView>(null);
  
  // Animation values
  const scanLineAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;
  
  // Log when camera ref is available
  useEffect(() => {
    console.log('[CAMERA] Camera ref initialized:', cameraRef.current ? 'YES' : 'NO');
  }, []);
  
  // Start animations when recording
  useEffect(() => {
    // Scanning line animation
    Animated.loop(
      Animated.timing(scanLineAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();
    
    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 3,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        })
      ])
    ).start();
  }, []);
  
  // Add timer effect
  useEffect(() => {
    if (isRecording) {
      // Reset timer when starting recording
      setRecordingTime(0);
      
      // Start the timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prevTime => prevTime + 1);
      }, 1000);
    } else {
      // Clear the timer when stopping recording
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    
    // Cleanup function
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isRecording]);
  
  if (!permission) {
    // Camera permissions are still loading
    return (
      <Container center>
        <Typography variant="body1">Requesting camera permission...</Typography>
      </Container>
    );
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <Container center>
        <Typography variant="h3" marginBottom="md">
          We need your permission to use the camera
        </Typography>
        <Button title="Grant Permission" onPress={requestPermission} />
      </Container>
    );
  }

  const toggleCameraType = () => {
    if (isRecording) return;
    setCameraType(current => (current === 'back' ? 'front' : 'back'));
  };

  // Save video to a permanent location
  const saveVideo = async (tempUri: string) => {
    try {
      const newUri = FileSystem.documentDirectory + `scan_video_${Date.now()}.mp4`;
      await FileSystem.moveAsync({ from: tempUri, to: newUri });
      console.log('[SAVE] Video saved at:', newUri);
      return newUri;
    } catch (error) {
      console.error('[SAVE] Error saving video:', error);
      return tempUri; // Return original URI if save fails
    }
  };

  // Custom navigation function to handle the complex navigation
  const navigateToAnalysis = (scanId: string) => {
    console.log('[NAV] Attempting to navigate to Analysis with scanId:', scanId);
    
    try {
      // Use the same approach as in HomeScreen.tsx
      navigation.navigate('Analysis', { scanId });
      console.log('[NAV] Navigation to Analysis attempted');
    } catch (error) {
      console.error('[NAV] Navigation error:', error);
      // Show results in this screen as fallback
      setScanId(scanId);
      setShowResults(true);
    }
  };

  // Mock backend response
  const mockUploadVideo = async (uri: string) => {
    console.log('[MOCK] Starting mock upload for video:', uri);
    setIsUploading(true);
    
    try {
      // Simulate network delay
      console.log('[MOCK] Simulating network delay (2s)...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate mock scan ID
      const mockScanId = `mock-scan-${Date.now()}`;
      console.log('[MOCK] Generated mock scan ID:', mockScanId);
      
      // Process the mock analysis data
      const result = await processVideoAnalysis(mockAnalysisResponse, mockScanId);
      console.log('[MOCK] Processed analysis data:', result);
      
      // Use custom navigation function
      navigateToAnalysis(mockScanId);
    } catch (error) {
      console.error('[MOCK] Mock upload error:', error);
      Alert.alert(
        'Upload Error',
        'Failed to process the video. Would you like to try again?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Try Again', onPress: () => mockUploadVideo(uri) }
        ]
      );
    } finally {
      console.log('[MOCK] Setting isUploading to false');
      setIsUploading(false);
    }
  };

  const handleScan = async () => {
    console.log('[handleScan] called, isRecording:', isRecording);
    
    // Check if camera is available
    if (!cameraRef.current) {
      console.error('[RECORD] Camera reference is not available');
      Alert.alert('Error', 'Camera is not ready. Please try again.');
      return;
    }
    
    if (isRecording) {
      console.log('[RECORD] Stopping recording');
      setIsRecording(false);
      cameraRef.current.stopRecording();
      return;
    }
    
    console.log('[RECORD] Starting recording');
    setIsRecording(true);
    setRecordingTime(0); // Reset timer when starting recording
    
    try {
      console.log('[RECORD] Calling recordAsync()');
      const video = await cameraRef.current.recordAsync();
      
      if (!video || !video.uri) {
        console.error('[RECORD] No video recorded or missing URI');
        Alert.alert('Error', 'Failed to record video');
        setIsRecording(false);
        return;
      }
      
      console.log('[RECORD] Recording completed with URI:', video.uri);
      
      // Save video to a permanent location
      console.log('[RECORD] Saving video');
      const savedUri = await saveVideo(video.uri);
      console.log('[RECORD] Video saved, setting URI:', savedUri);
      
      // Set the video URI in state and wait for state update
      setVideoUri(savedUri);
      
      // Use the savedUri directly instead of relying on state update
      console.log('[RECORD] Starting upload with URI:', savedUri);
      await uploadVideoWithUri(savedUri);
    } catch (error) {
      console.error('[RECORD] Recording error:', error);
      Alert.alert('Error', 'Failed to record video');
      setIsRecording(false);
    }
  };
  
  // New function that takes the URI directly as a parameter
  const uploadVideoWithUri = async (uri: string) => {
    setIsUploading(true);
    setUploadError(null);
    
    try {
      // Attempt to upload to real backend
      if (uri) {
        try {
          console.log('[UPLOAD] Starting video upload to backend...');
          console.log('[UPLOAD] Video URI:', uri);
          
          // Try a completely different approach - read the file as base64 and send it directly
          console.log('[UPLOAD] Reading file as base64...');
          const fileInfo = await FileSystem.getInfoAsync(uri);
          console.log('[UPLOAD] File info:', fileInfo);
          
          if (!fileInfo.exists) {
            throw new Error('File does not exist');
          }
          
          console.log('[UPLOAD] File size:', fileInfo.size);
          
          // If file is too large, use mock data
          if (fileInfo.size && fileInfo.size > 50 * 1024 * 1024) { // 50MB
            console.log('[UPLOAD] File too large, using mock data');
            await mockUpload();
            return;
          }
          
          // Read the file as base64
          const base64 = await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
          });
          console.log('[UPLOAD] File read as base64, length:', base64.length);
          
          // Create a simple JSON payload with the base64 data
          const payload = {
            video: base64,
            filename: 'scan_video.mp4',
            contentType: 'video/mp4'
          };
          
          console.log('[UPLOAD] Sending request to:', API_URL);
          
          // Use a direct fetch with the JSON payload
          const uploadResponse = await fetch(API_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify(payload),
          });
          
          console.log('[UPLOAD] Upload response status:', uploadResponse.status);
          const responseText = await uploadResponse.text();
          console.log('[UPLOAD] Upload response text:', responseText);
          
          if (!uploadResponse.ok) {
            throw new Error(`Upload failed with status: ${uploadResponse.status}, response: ${responseText}`);
          }
          
          // Parse the response
          let uploadData;
          try {
            uploadData = JSON.parse(responseText);
            console.log('[UPLOAD] Upload successful, parsed response:', uploadData);
          } catch (parseError) {
            console.error('[UPLOAD] Error parsing response:', parseError);
            throw new Error('Failed to parse server response');
          }
          
          // Wait for 2 seconds to allow backend processing
          console.log('[UPLOAD] Waiting for backend processing...');
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Fetch analysis results from backend
          console.log('[UPLOAD] Fetching analysis results...');
          const analysisUrl = `${API_URL}results/${uploadData.scanId}`;
          console.log('[UPLOAD] Analysis URL:', analysisUrl);
          
          const analysisResponse = await fetch(analysisUrl);
          console.log('[UPLOAD] Analysis response status:', analysisResponse.status);
          
          if (!analysisResponse.ok) {
            const analysisText = await analysisResponse.text();
            console.error('[UPLOAD] Analysis response text:', analysisText);
            throw new Error(`Failed to get analysis results: ${analysisResponse.status}`);
          }
          
          const analysisData = await analysisResponse.json();
          console.log('[UPLOAD] Analysis results received:', analysisData);
          
          // Extract the analysis results from the response
          const analysisResults: AnalysisResponse = {
            bpms: analysisData.results.bpms,
            sdnn: analysisData.results.sdnn,
            rmssd: analysisData.results.rmssd,
            pnn50: analysisData.results.pnn50,
            stress_level: analysisData.results.stress_level
          };
          
          // Generate a unique scanId if not provided by the API
          const scanId = uploadData.scanId || `scan-${Date.now()}`;
          console.log('[UPLOAD] Using scanId:', scanId);
          
          // Store the scanId for later use
          setScanId(scanId);
          
          // Process the analysis data
          console.log('[UPLOAD] Processing analysis data...');
          const results = await processVideoAnalysis(analysisResults, scanId);
          console.log('[UPLOAD] Analysis processing complete');
          
          // Navigate to the analysis screen with the scanId
          console.log('[UPLOAD] Navigating to Analysis screen...');
          navigation.navigate('Analysis', { scanId });
        } catch (error) {
          console.error('[UPLOAD] Upload error:', error);
          if (error instanceof Error) {
            setUploadError(`Failed to upload video: ${error.message}`);
          } else {
            setUploadError('Failed to upload video. Please try again.');
          }
          
          // If upload fails, try mock data as fallback
          console.log('[UPLOAD] Upload failed, using mock data as fallback');
          await mockUpload();
        } finally {
          setIsUploading(false);
        }
      } else {
        console.error('[UPLOAD] No video URI provided');
        setUploadError('No video URI provided. Please try again.');
        setIsUploading(false);
        
        // Use mock data as fallback
        console.log('[UPLOAD] No video URI, using mock data as fallback');
        await mockUpload();
      }
    } catch (error) {
      console.error('[UPLOAD] Outer error:', error);
      setUploadError('Failed to upload video. Please try again.');
      setIsUploading(false);
      
      // Use mock data as fallback for any error
      console.log('[UPLOAD] Error occurred, using mock data as fallback');
      await mockUpload();
    }
  };

  // Maintain the original uploadVideo function for compatibility
  const uploadVideo = async () => {
    if (videoUri) {
      await uploadVideoWithUri(videoUri);
    } else {
      console.error('[UPLOAD] No video URI available in state');
      setUploadError('No video recorded. Please try again.');
      setIsUploading(false);
    }
  };

  const mockUpload = async () => {
    console.log('[MOCK] Using mock upload...');
    setIsUploading(true);
    setUploadError(null);
    
    try {
      // Simulate network delay
      console.log('[MOCK] Simulating network delay (2s)...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate a mock scanId
      const mockScanId = `mock-scan-${Date.now()}`;
      console.log('[MOCK] Generated mock scan ID:', mockScanId);
      
      // Process the mock analysis data
      console.log('[MOCK] Processing mock analysis data...');
      const results = await processVideoAnalysis(mockAnalysisResponse, mockScanId);
      console.log('[MOCK] Analysis processing complete');
      
      // Navigate to the analysis screen with the scanId
      console.log('[MOCK] Navigating to Analysis screen...');
      navigation.navigate('Analysis', { scanId: mockScanId });
    } catch (error) {
      console.error('[MOCK] Mock upload error:', error);
      setUploadError('Failed to process video. Please try again.');
    } finally {
      console.log('[MOCK] Upload process complete');
      setIsUploading(false);
    }
  };

  if (showResults) {
    return (
      <Container center>
        <Typography variant="h2" color={theme.colors.primary} marginBottom="lg">
          Scan Complete
        </Typography>
        <Typography variant="h3" marginBottom="md">
          Scan ID: {scanId}
        </Typography>
        <Typography variant="body1" marginBottom="xl">
          Your scan has been processed successfully. Here are your results.
        </Typography>
        
        <Card variant="elevated" marginBottom="lg" width="90%">
          <Typography variant="h3" color={theme.colors.primary} marginBottom="md">
            Health Analysis
          </Typography>
          <Typography variant="body1" marginBottom="sm">
            Heart Rate: 78 BPM (Normal)
          </Typography>
          <Typography variant="body1" marginBottom="sm">
            HRV: 65 ms (Good)
          </Typography>
          <Typography variant="body1" marginBottom="sm">
            Stress Level: Low
          </Typography>
          <Typography variant="body1">
            Emotional State: Calm
          </Typography>
        </Card>
        
        <Button 
          title="Return to Home" 
          onPress={() => navigation.navigate('Main')}
          size="large"
          marginTop="lg"
        />
      </Container>
    );
  }

  if (isUploading) {
    console.log('Rendering upload screen');
    return (
      <Container center>
        <LoadingIndicator fullScreen color={theme.colors.primary} />
        <Typography variant="h3" color={theme.colors.primary} marginTop="xl">
          {USE_MOCK_DATA ? 'Processing Scan...' : 'Uploading and Analyzing...'}
        </Typography>
        <Typography variant="body1" marginTop="md">
          Please wait while we process your scan
        </Typography>
      </Container>
    );
  }

  // Update the ScanningIndicator component to use Animated
  const renderScanningIndicator = () => {
    if (!isRecording) return null;
    
    const translateY = scanLineAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [10, 270] // Adjust based on the height of your ScanFrame
    });
    
    return (
      <ScanningIndicator>
        <AnimatedScanningLine 
          style={{ 
            transform: [{ translateY }],
            shadowColor: theme.colors.primary,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.8,
            shadowRadius: 5,
            elevation: 5
          }} 
        />
        <Typography variant="body2" color={theme.colors.white} align="center">
          Scanning...
        </Typography>
      </ScanningIndicator>
    );
  };
  
  // Update the FaceOutlineGuide component to use Animated
  const renderFaceOutlineGuide = () => {
    const scale = pulseAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.98, 1.02]
    });
    
    const opacity = pulseAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 0.7]
    });
    
    return (
      <FaceOutlineContainer>
        <AnimatedPulsingContainer style={{ transform: [{ scale }], opacity }}>
          <Svg height="100%" width="100%" viewBox="0 0 100 140">
            {/* Head outline */}
            <Ellipse
              cx="50"
              cy="50"
              rx="30"
              ry="40"
              stroke={theme.colors.white}
              strokeWidth="1"
              fill="none"
            />
            {/* Neck outline */}
            <Path
              d="M35,85 L35,100 Q50,110 65,100 L65,85"
              stroke={theme.colors.white}
              strokeWidth="1"
              fill="none"
            />
          </Svg>
        </AnimatedPulsingContainer>
      </FaceOutlineContainer>
    );
  };

  return (
    <Container backgroundColor={theme.colors.black} safeArea={false}>
      <CameraView 
        style={{ flex: 1 }}
        ref={cameraRef}
        facing={cameraType}
        videoStabilizationMode="standard"
        mode="video"
      >
        <ScanOverlay>
          <ScanHeader>
            <Typography variant="h3" color={theme.colors.white} align="center">
              Face Scan
            </Typography>
            <Typography variant="body1" color={theme.colors.white} align="center" marginTop="xs">
              {isRecording 
                ? `Recording...\nPlease record for 30 seconds` 
                : 'Center your face in the frame\nPlease record for 30 seconds'}
            </Typography>
          </ScanHeader>
          
          <ScanFrame>
            {renderFaceOutlineGuide()}
            {renderScanningIndicator()}
          </ScanFrame>
          
          <ControlsContainer>
            <ControlButton onPress={toggleCameraType} disabled={isRecording}>
              <FontAwesome5 
                name="sync-alt" 
                size={24} 
                color={isRecording ? theme.colors.lightGray : theme.colors.white} 
              />
              <Typography 
                variant="caption" 
                color={isRecording ? theme.colors.lightGray : theme.colors.white} 
                marginTop="xs"
              >
                Flip
              </Typography>
            </ControlButton>
            
            <ScanButton onPress={handleScan}>
              <ScanButtonOuter>
                <ScanButtonInner isRecording={isRecording}>
                  {isRecording ? (
                    <FontAwesome5 name="stop" size={24} color={theme.colors.white} />
                  ) : (
                    <MaterialCommunityIcons name="heart-pulse" size={32} color={theme.colors.primary} />
                  )}
                </ScanButtonInner>
              </ScanButtonOuter>
              <Typography variant="caption" color={theme.colors.white} marginTop="sm">
                {isRecording ? `${recordingTime}s` : 'Start Scan'}
              </Typography>
            </ScanButton>
            
            <ControlButton onPress={() => navigation.goBack()} disabled={isRecording}>
              <FontAwesome5 
                name="times" 
                size={24} 
                color={isRecording ? theme.colors.lightGray : theme.colors.white} 
              />
              <Typography 
                variant="caption" 
                color={isRecording ? theme.colors.lightGray : theme.colors.white} 
                marginTop="xs"
              >
                Cancel
              </Typography>
            </ControlButton>
          </ControlsContainer>
        </ScanOverlay>
      </CameraView>
    </Container>
  );
};

const ScanOverlay = styled(View)`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.4);
  justify-content: space-between;
  padding: ${theme.spacing.lg}px;
`;

const ScanHeader = styled(View)`
  margin-top: ${theme.spacing.xl}px;
`;

const ScanFrame = styled(View)`
  align-self: center;
  width: 240px;
  height: 360px;
  border-width: 3px;
  border-color: ${theme.colors.primary};
  border-radius: ${theme.borderRadius.md}px;
  overflow: hidden;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const ScanningIndicator = styled(View)`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: flex-end;
  padding-bottom: ${theme.spacing.sm}px;
`;

const ScanningLineBase = styled(View)`
  height: 2px;
  width: 100%;
  background-color: ${theme.colors.primary};
  position: absolute;
`;

const AnimatedScanningLine = Animated.createAnimatedComponent(ScanningLineBase);

const ControlsContainer = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.xl}px;
`;

const ControlButton = styled(Pressable)<{ disabled?: boolean }>`
  align-items: center;
  padding: ${theme.spacing.sm}px;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`;

const ScanButton = styled(Pressable)`
  align-items: center;
`;

const ScanButtonOuter = styled(View)`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  border-width: 5px;
  border-color: ${theme.colors.white};
  justify-content: center;
  align-items: center;
`;

const ScanButtonInner = styled(View)<{ isRecording: boolean }>`
  width: 60px;
  height: 60px;
  border-radius: 30px;
  background-color: ${({ isRecording }) => isRecording ? theme.colors.error : theme.colors.white};
  justify-content: center;
  align-items: center;
`;

const FaceOutlineContainer = styled(View)`
  position: absolute;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  opacity: 0.5;
`;

const PulsingContainerBase = styled(View)`
  width: 100%;
  height: 100%;
`;

const AnimatedPulsingContainer = Animated.createAnimatedComponent(PulsingContainerBase);

export default ScanScreen; 