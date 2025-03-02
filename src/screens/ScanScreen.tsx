import React, { useState, useRef } from 'react';
import { View, Alert, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import styled from 'styled-components/native';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';

import Container from '../components/Container';
import Typography from '../components/Typography';
import Button from '../components/Button';
import { theme } from '../theme/theme';
import { RootStackParamList } from '../navigation/types';
import LoadingIndicator from '../components/LoadingIndicator';

type ScanScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Scan'>;

const ScanScreen: React.FC = () => {
  const navigation = useNavigation<ScanScreenNavigationProp>();
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(false);
  const [cameraType, setCameraType] = useState<'front' | 'back'>('front');
  const cameraRef = useRef<CameraView>(null);

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

  const handleScan = async () => {
    setIsScanning(true);
    
    // Simulate scanning process
    setTimeout(() => {
      setIsScanning(false);
      
      // Mock successful scan
      Alert.alert(
        "Scan Complete",
        "Your health data has been successfully analyzed.",
        [
          { 
            text: "View Results", 
            onPress: () => navigation.navigate('Analysis', { scanId: 'mock-scan-123' }) 
          }
        ]
      );
    }, 3000);
  };

  if (isScanning) {
    return <LoadingIndicator fullScreen color={theme.colors.primary} />;
  }

  return (
    <Container backgroundColor={theme.colors.black} safeArea={false}>
      <CameraView 
        style={{ flex: 1 }}
        ref={cameraRef}
        facing={cameraType}
      >
        <ScanOverlay>
          <ScanHeader>
            <Typography variant="h3" color={theme.colors.white} align="center">
              Face Scan
            </Typography>
            <Typography variant="body1" color={theme.colors.white} align="center" marginTop="xs">
              Position your face in the frame
            </Typography>
          </ScanHeader>
          
          <ScanFrame>
            {isScanning && (
              <ScanningIndicator>
                <ScanningLine />
                <Typography variant="body2" color={theme.colors.white} align="center" marginTop="sm">
                  Scanning...
                </Typography>
              </ScanningIndicator>
            )}
          </ScanFrame>
          
          <ControlsContainer>
            <ControlButton onPress={toggleCameraType}>
              <FontAwesome5 name="sync-alt" size={24} color={theme.colors.white} />
              <Typography variant="caption" color={theme.colors.white} marginTop="xs">
                Flip
              </Typography>
            </ControlButton>
            
            <ScanButton onPress={handleScan} disabled={isScanning}>
              <ScanButtonInner isScanning={isScanning}>
                {isScanning && (
                  <MaterialCommunityIcons name="heart-pulse" size={32} color={theme.colors.white} />
                )}
              </ScanButtonInner>
            </ScanButton>
            
            <ControlButton onPress={() => navigation.goBack()}>
              <FontAwesome5 name="times" size={24} color={theme.colors.white} />
              <Typography variant="caption" color={theme.colors.white} marginTop="xs">
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

const ControlButton = styled(Pressable)`
  align-items: center;
  padding: ${theme.spacing.sm}px;
`;

const ScanButton = styled(Pressable)<{ disabled: boolean }>`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  background-color: rgba(255, 255, 255, 0.2);
  justify-content: center;
  align-items: center;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`;

const ScanButtonInner = styled(View)<{ isScanning: boolean }>`
  width: 60px;
  height: 60px;
  border-radius: 30px;
  background-color: ${({ isScanning }) => isScanning ? theme.colors.primary : theme.colors.white};
  justify-content: center;
  align-items: center;
`;

export default ScanScreen; 