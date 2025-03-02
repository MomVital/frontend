import React, { useState, useRef, useEffect } from 'react';
import { View, Alert, Pressable, Animated, Easing } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import styled from 'styled-components/native';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions, CameraType } from 'expo-camera';
import * as FileSystem from 'expo-file-system';

import Container from '../components/Container';
import Typography from '../components/Typography';
import Button from '../components/Button';
import { theme } from '../theme/theme';
import { RootStackParamList } from '../navigation/types';
import LoadingIndicator from '../components/LoadingIndicator';

type ScanScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Scan'>;

// Backend API URL
const API_URL = 'http://ip_address:3000/analyze/';
const RECORDING_DURATION = 30; // seconds

const ScanScreen: React.FC = () => {
  const navigation = useNavigation<ScanScreenNavigationProp>();
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [cameraType, setCameraType] = useState<'front' | 'back'>('front');
  const [isUploading, setIsUploading] = useState(false);
  const [videoUri, setVideoUri] = useState<string | null>(null);
  
  const cameraRef = useRef<CameraView>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const animatedValue = useRef(new Animated.Value(0)).current;
  
  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Animation for the progress circle
  useEffect(() => {
    if (isRecording) {
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: RECORDING_DURATION * 1000,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();
    } else {
      animatedValue.setValue(0);
    }
  }, [isRecording, animatedValue]);

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
    setCameraType(current => (current === 'back' ? 'front' : 'back'));
  };

  const startRecording = async () => {
    if (cameraRef.current) {
      setIsRecording(true);
      setRecordingTime(0);
      
      try {
        // Start recording video
        const { uri } = await cameraRef.current.recordAsync();
        setVideoUri(uri);
        console.log('Recording saved to:', uri);
      } catch (error) {
        console.error('Failed to record video:', error);
        Alert.alert('Error', 'Failed to record video');
        setIsRecording(false);
      }
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          const newTime = prev + 1;
          if (newTime >= RECORDING_DURATION) {
            stopRecording();
          }
          return newTime;
        });
      }, 1000);
    }
  };

  const stopRecording = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    if (cameraRef.current && isRecording) {
      try {
        await cameraRef.current.stopRecording();
        setIsRecording(false);
        
        // If we have a video URI, upload it
        if (videoUri) {
          uploadVideo(videoUri);
        }
      } catch (error) {
        console.error('Failed to stop recording:', error);
        setIsRecording(false);
      }
    }
  };

  const uploadVideo = async (uri: string) => {
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
      
      // Navigate to analysis screen with the scan ID from the response
      navigation.navigate('Analysis', { scanId: data.scanId || 'mock-scan-123' });
    } catch (error) {
      console.error('Failed to upload video:', error);
      Alert.alert(
        'Upload Error',
        'Failed to upload the video for analysis. Would you like to try again?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Try Again', onPress: () => uploadVideo(uri) }
        ]
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleScan = async () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  if (isUploading) {
    return (
      <Container center>
        <LoadingIndicator fullScreen color={theme.colors.primary} />
        <Typography variant="h3" color={theme.colors.primary} marginTop="xl">
          Uploading and Analyzing...
        </Typography>
        <Typography variant="body1" marginTop="md">
          Please wait while we process your scan
        </Typography>
      </Container>
    );
  }

  // Calculate the progress for the circle animation
  const circleProgress = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 360],
  });

  return (
    <Container backgroundColor={theme.colors.black} safeArea={false}>
      <CameraView 
        style={{ flex: 1 }}
        ref={cameraRef}
        facing={cameraType}
        videoStabilizationMode="standard"
      >
        <ScanOverlay>
          <ScanHeader>
            <Typography variant="h3" color={theme.colors.white} align="center">
              Face Scan
            </Typography>
            <Typography variant="body1" color={theme.colors.white} align="center" marginTop="xs">
              {isRecording 
                ? `Recording: ${recordingTime}/${RECORDING_DURATION} seconds` 
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
              <ProgressCircle>
                <AnimatedCircle 
                  style={{
                    transform: [{ rotate: circleProgress.interpolate({
                      inputRange: [0, 360],
                      outputRange: ['0deg', '360deg'],
                    })}]
                  }}
                />
                <ScanButtonInner isRecording={isRecording}>
                  {isRecording ? (
                    <FontAwesome5 name="stop" size={24} color={theme.colors.white} />
                  ) : (
                    <MaterialCommunityIcons name="heart-pulse" size={32} color={theme.colors.primary} />
                  )}
                </ScanButtonInner>
              </ProgressCircle>
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

const ProgressCircle = styled(View)`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  background-color: rgba(255, 255, 255, 0.2);
  justify-content: center;
  align-items: center;
  position: relative;
`;

const AnimatedCircle = styled(Animated.View)`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  border-width: 3px;
  border-color: ${theme.colors.primary};
  position: absolute;
  border-right-color: transparent;
  border-bottom-color: transparent;
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