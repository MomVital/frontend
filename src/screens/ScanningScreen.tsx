import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../../App';

type ScanningScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ScanningScreen: React.FC = () => {
  const navigation = useNavigation<ScanningScreenNavigationProp>();
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  const startScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    
    // Simulate scan progress
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        const newProgress = prev + 0.1;
        if (newProgress >= 1) {
          clearInterval(interval);
          setTimeout(() => {
            setIsScanning(false);
            // @ts-ignore
            navigation.navigate('Analysis', { scanId: 'new-scan-' + Date.now() });
          }, 500);
          return 1;
        }
        return newProgress;
      });
    }, 500);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 p-6 justify-between">
        <View>
          <Text className="text-2xl font-bold text-gray-800 mb-2">Health Scan</Text>
          <Text className="text-gray-600 mb-6">
            Place your finger on the camera to measure your vital signs
          </Text>
          
          <View className="bg-gray-50 p-5 rounded-xl mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-4">How it works</Text>
            <View className="mb-4">
              <View className="flex-row items-center mb-2">
                <View className="bg-primary-100 w-8 h-8 rounded-full items-center justify-center mr-3">
                  <Text className="text-primary-600 font-bold">1</Text>
                </View>
                <Text className="text-gray-700">Place your finger on the camera lens</Text>
              </View>
              <View className="flex-row items-center mb-2">
                <View className="bg-primary-100 w-8 h-8 rounded-full items-center justify-center mr-3">
                  <Text className="text-primary-600 font-bold">2</Text>
                </View>
                <Text className="text-gray-700">Hold still for 30 seconds</Text>
              </View>
              <View className="flex-row items-center">
                <View className="bg-primary-100 w-8 h-8 rounded-full items-center justify-center mr-3">
                  <Text className="text-primary-600 font-bold">3</Text>
                </View>
                <Text className="text-gray-700">View your health analysis</Text>
              </View>
            </View>
          </View>
        </View>
        
        <View className="items-center">
          {isScanning ? (
            <View className="items-center">
              <ActivityIndicator size="large" color="#ec4899" />
              <Text className="text-gray-600 mt-4 mb-2">Scanning...</Text>
              <Text className="text-gray-500">{Math.round(scanProgress * 100)}%</Text>
              <View className="w-full h-2 bg-gray-200 rounded-full mt-2">
                <View 
                  className="h-2 bg-primary-500 rounded-full" 
                  style={{ width: `${scanProgress * 100}%` }} 
                />
              </View>
            </View>
          ) : (
            <TouchableOpacity
              className="bg-primary-500 w-40 h-40 rounded-full items-center justify-center"
              onPress={startScan}
            >
              <Ionicons name="pulse" size={60} color="white" />
              <Text className="text-white font-bold mt-2">Start Scan</Text>
            </TouchableOpacity>
          )}
        </View>
        
        <View>
          <Text className="text-gray-500 text-center mb-4">
            This feature uses your device's camera to analyze blood flow patterns
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ScanningScreen; 