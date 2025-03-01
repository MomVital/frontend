import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../../App';

type AnalysisScreenRouteProp = RouteProp<RootStackParamList, 'Analysis'>;
type AnalysisScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const AnalysisScreen: React.FC = () => {
  const route = useRoute<AnalysisScreenRouteProp>();
  const navigation = useNavigation<AnalysisScreenNavigationProp>();
  const { scanId } = route.params;

  // Mock data for health metrics
  const healthMetrics = [
    { name: 'Heart Rate', value: '72', unit: 'bpm', status: 'normal', icon: 'heart-outline' },
    { name: 'HRV', value: '45', unit: 'ms', status: 'normal', icon: 'pulse-outline' },
    { name: 'Stress Level', value: 'Medium', status: 'caution', icon: 'thermometer-outline' },
    { name: 'Emotion', value: 'Calm', status: 'good', icon: 'happy-outline' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'text-green-600';
      case 'normal':
        return 'text-blue-600';
      case 'caution':
        return 'text-yellow-600';
      case 'warning':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const handleGetRecommendations = () => {
    // @ts-ignore
    navigation.navigate('AIRecommendation', { analysisId: scanId });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        <View className="p-6">
          <View className="mb-6">
            <Text className="text-2xl font-bold text-gray-800 mb-2">Health Analysis</Text>
            <Text className="text-gray-600">
              Scan ID: {scanId}
            </Text>
          </View>

          <View className="bg-primary-50 p-5 rounded-xl mb-6">
            <Text className="text-lg font-semibold text-primary-800 mb-4">Results Summary</Text>
            <View className="space-y-4">
              {healthMetrics.map((metric, index) => (
                <View key={index} className="bg-white p-4 rounded-lg">
                  <View className="flex-row justify-between items-center">
                    <View className="flex-row items-center">
                      <Ionicons name={metric.icon as any} size={24} color="#ec4899" />
                      <Text className="text-gray-800 font-medium ml-2">{metric.name}</Text>
                    </View>
                    <View className="flex-row items-center">
                      <Text className="text-2xl font-bold text-gray-800 mr-2">
                        {metric.value}
                      </Text>
                      {metric.unit && (
                        <Text className="text-gray-500">{metric.unit}</Text>
                      )}
                    </View>
                  </View>
                  <View className="flex-row justify-between mt-2">
                    <Text className="text-gray-500">Status</Text>
                    <Text className={`font-medium ${getStatusColor(metric.status)}`}>
                      {metric.status.charAt(0).toUpperCase() + metric.status.slice(1)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <TouchableOpacity
            className="bg-primary-500 py-4 rounded-lg items-center mb-6"
            onPress={handleGetRecommendations}
          >
            <Text className="text-white font-bold text-lg">Get AI Recommendations</Text>
          </TouchableOpacity>

          <View className="bg-gray-50 p-5 rounded-xl">
            <Text className="text-lg font-semibold text-gray-800 mb-4">About This Analysis</Text>
            <Text className="text-gray-600 mb-3">
              This analysis is based on photoplethysmography (PPG) technology, which uses your device's camera to detect blood volume changes in the microvascular bed of tissue.
            </Text>
            <Text className="text-gray-600">
              The results provide an estimate of your current health status but should not be used as a substitute for professional medical advice.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AnalysisScreen; 