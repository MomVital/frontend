import React, { useState, useRef, useEffect } from 'react';
import { View, Alert, Pressable, BackHandler } from 'react-native';
import { useNavigation, CommonActions, StackActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import styled from 'styled-components/native';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as FileSystem from 'expo-file-system';

import Container from '../components/Container';
import Typography from '../components/Typography';
import Button from '../components/Button';
import { theme } from '../theme/theme';
import { RootStackParamList } from '../navigation/types';
import LoadingIndicator from '../components/LoadingIndicator';
import Card from '../components/Card';

type ScanScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Scan'>;

// Backend API URL
const API_URL = 'http://ip_address:3000/analyze/';
const USE_MOCK_BACKEND = true;

const ScanScreen: React.FC = () => {
  const navigation = useNavigation<ScanScreenNavigationProp>();
  const [permission, requestPermission] = useCameraPermissions();
  const [isRecording, setIsRecording] = useState(false);
  const [cameraType, setCameraType] = useState<'front' | 'back'>('front');
  const [isUploading, setIsUploading] = useState(false);
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [scanId, setScanId] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  
  const cameraRef = useRef<CameraView>(null);
  
  // Log when camera ref is available
  useEffect(() => {
    console.log('[CAMERA] Camera ref initialized:', cameraRef.current ? 'YES' : 'NO');
  }, []);
  
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
      console.log('[SAVE] Moving video from', tempUri, 'to', newUri);
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

  const uploadVideo = async (uri: string) => {
    console.log('[UPLOAD] uploadVideo called with URI:', uri);
    
    // Use mock backend if real backend is not available
    if (USE_MOCK_BACKEND) {
      console.log('[UPLOAD] Using mock backend');
      return mockUploadVideo(uri);
    }
    
    console.log('[UPLOAD] Using real backend');
    setIsUploading(true);
    
    try {
      // Create form data for the video upload
      const formData = new FormData();
      formData.append('video', {
        uri,
        name: 'scan_video.mp4',
        type: 'video/mp4',
      } as any);
      
      // Upload to backend
      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Upload successful:', data);
      
      // Use custom navigation function
      navigateToAnalysis(data.scanId);
    } catch (error) {
      console.error('Failed to upload video:', error);
      
      // If backend connection failed, offer to use mock backend
      Alert.alert(
        'Upload Error',
        'Failed to connect to the backend server. Would you like to use the mock backend instead?',
        [
          { 
            text: 'Cancel', 
            style: 'cancel' 
          },
          { 
            text: 'Try Again', 
            onPress: () => uploadVideo(uri) 
          },
          { 
            text: 'Use Mock', 
            onPress: () => mockUploadVideo(uri) 
          }
        ]
      );
    } finally {
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
      
      // Save and upload only happen after recording is complete
      console.log('[RECORD] Saving video');
      const savedUri = await saveVideo(video.uri);
      console.log('[RECORD] Video saved, setting URI:', savedUri);
      setVideoUri(savedUri);
      console.log('[RECORD] Starting upload');
      await uploadVideo(savedUri);
    } catch (error) {
      console.error('[RECORD] Recording error:', error);
      Alert.alert('Error', 'Failed to record video');
      setIsRecording(false);
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
          {USE_MOCK_BACKEND ? 'Processing Scan...' : 'Uploading and Analyzing...'}
        </Typography>
        <Typography variant="body1" marginTop="md">
          Please wait while we process your scan
        </Typography>
      </Container>
    );
  }

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
                ? `Recording...` 
                : 'Position your face in the frame'}
            </Typography>
          </ScanHeader>
          
          <ScanFrame>
            {isRecording && (
              <ScanningIndicator>
                <ScanningLine />
                <Typography variant="body2" color={theme.colors.white} align="center" marginTop="sm">
                  Scanning...
                </Typography>
              </ScanningIndicator>
            )}
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
                {isRecording ? 'Stop' : 'Start Scan'}
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
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: space-between;
  padding: ${theme.spacing.lg}px;
`;

const ScanHeader = styled(View)`
  margin-top: ${theme.spacing.xl}px;
`;

const ScanFrame = styled(View)`
  align-self: center;
  width: 250px;
  height: 250px;
  border-width: 2px;
  border-color: ${theme.colors.primary};
  border-radius: ${theme.borderRadius.md}px;
  overflow: hidden;
  justify-content: center;
  align-items: center;
`;

const ScanningIndicator = styled(View)`
  width: 100%;
  align-items: center;
`;

const ScanningLine = styled(View)`
  height: 2px;
  width: 100%;
  background-color: ${theme.colors.primary};
  position: absolute;
  top: 0;
  animation: scan 2s infinite;
`;

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

export default ScanScreen; 