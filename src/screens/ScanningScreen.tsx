import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons, FontAwesome6 } from '@expo/vector-icons';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';

import { RootStackParamList } from '../../App';
import Button from '../components/Button';

type ScanningScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ScanningScreen = () => {
  const navigation = useNavigation<ScanningScreenNavigationProp>();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [facing, setFacing] = useState<CameraType>('front');
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanComplete, setScanComplete] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (scanning) {
      interval = setInterval(() => {
        setScanProgress((prev) => {
          const newProgress = prev + 1;
          if (newProgress >= 100) {
            clearInterval(interval);
            setScanning(false);
            setScanComplete(true);
            return 100;
          }
          return newProgress;
        });
      }, 100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [scanning]);

  useEffect(() => {
    if (scanComplete) {
      setAnalyzing(true);
      // Simulate analysis time
      const timeout = setTimeout(() => {
        setAnalyzing(false);
        navigation.navigate('Analysis', { scanId: 'new-scan-' + Date.now() });
      }, 2000);
      
      return () => clearTimeout(timeout);
    }
  }, [scanComplete, navigation]);

  if (!permission) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color="#ec4899" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center p-4">
        <Ionicons name="camera-outline" size={64} color="#ec4899" className="mb-4" />
        <Text className="text-xl font-bold text-gray-800 mb-2 text-center">Camera Access Needed</Text>
        <Text className="text-gray-600 mb-6 text-center">
          MomVital needs camera access to scan and analyze your health metrics.
        </Text>
        <Button title="Grant Camera Permission" onPress={requestPermission} />
      </SafeAreaView>
    );
  }

  const toggleFacing = () => {
    setFacing((prev) => (prev === 'front' ? 'back' : 'front'));
  };

  const startScan = () => {
    setScanning(true);
    setScanProgress(0);
    setScanComplete(false);
  };

  const cancelScan = () => {
    setScanning(false);
    setScanProgress(0);
  };

  const renderInstructions = () => (
    <View className="absolute top-0 left-0 right-0 bg-black/50 p-4 rounded-b-xl">
      <Text className="text-white text-lg font-semibold mb-1">Face Scanning Instructions</Text>
      <Text className="text-white text-sm">
        Position your face in the frame and stay still. Ensure good lighting for accurate results.
      </Text>
    </View>
  );

  const renderScanningOverlay = () => (
    <View className="absolute inset-0 flex items-center justify-center">
      <View className="bg-black/70 rounded-xl p-6 w-4/5 items-center">
        <Text className="text-white text-xl font-bold mb-4">Scanning in progress</Text>
        
        <View className="w-full h-3 bg-gray-700 rounded-full mb-2">
          <View 
            className="h-full bg-primary-500 rounded-full"
            style={{ width: `${scanProgress}%` }}
          />
        </View>
        
        <Text className="text-white mb-4">{scanProgress}%</Text>
        
        <Button 
          title="Cancel" 
          variant="outline" 
          onPress={cancelScan}
          style={{ borderColor: 'white' }}
        />
      </View>
    </View>
  );

  const renderAnalyzingOverlay = () => (
    <View className="absolute inset-0 flex items-center justify-center bg-black/80">
      <View className="items-center">
        <ActivityIndicator size="large" color="#ec4899" />
        <Text className="text-white text-xl font-bold mt-4">Analyzing your health data</Text>
        <Text className="text-white text-sm mt-2">This will just take a moment...</Text>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-black">
      <CameraView
        className="flex-1"
        ref={cameraRef}
        facing={facing}
        enableZoomGesture
      >
        {/* Face outline guide */}
        <View className="flex-1 items-center justify-center">
          <View className="w-64 h-64 border-2 border-dashed border-white/70 rounded-full" />
        </View>
        
        {!scanning && !analyzing && renderInstructions()}
        
        {/* Bottom controls */}
        {!scanning && !analyzing && (
          <View className="absolute bottom-10 left-0 right-0 flex-row justify-between items-center px-8">
            <TouchableOpacity 
              className="w-12 h-12 rounded-full bg-black/50 items-center justify-center"
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="w-16 h-16 rounded-full bg-primary-500 items-center justify-center"
              onPress={startScan}
            >
              <Ionicons name="scan" size={32} color="white" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="w-12 h-12 rounded-full bg-black/50 items-center justify-center"
              onPress={toggleFacing}
            >
              <FontAwesome6 name="camera-rotate" size={20} color="white" />
            </TouchableOpacity>
          </View>
        )}
        
        {scanning && renderScanningOverlay()}
        {analyzing && renderAnalyzingOverlay()}
      </CameraView>
    </View>
  );
};

export default ScanningScreen; 