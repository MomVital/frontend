import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

import { RootStackParamList } from '../../App';
import Button from '../components/Button';
import Card from '../components/Card';

type AnalysisScreenRouteProp = RouteProp<RootStackParamList, 'Analysis'>;
type AnalysisScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Mock data for analysis
const mockAnalysisData = {
  timestamp: new Date().toISOString(),
  heartRate: {
    current: 82,
    min: 65,
    max: 95,
    avg: 78,
    status: 'normal',
    history: [76, 78, 75, 80, 82, 79, 82],
  },
  hrv: {
    current: 45,
    min: 30,
    max: 65,
    avg: 48,
    status: 'normal',
    history: [42, 40, 38, 45, 50, 48, 45],
  },
  stress: {
    level: 'Medium',
    score: 65,
    status: 'elevated',
    history: [40, 45, 60, 70, 65, 60, 65],
  },
  emotion: {
    primary: 'Calm',
    secondary: 'Content',
    history: ['Anxious', 'Neutral', 'Happy', 'Content', 'Content', 'Calm', 'Calm'],
  },
  bloodPressure: {
    systolic: 118,
    diastolic: 75,
    status: 'normal',
  },
  oxygenSaturation: {
    value: 98,
    status: 'normal',
  },
  recommendations: [
    'Your heart rate is within normal range for your pregnancy stage.',
    'Your stress levels are slightly elevated. Consider practicing relaxation techniques.',
    'Your emotional state is positive, which is beneficial for both you and your baby.',
  ],
};

// Status color mapping
const statusColors = {
  normal: '#10b981', // green
  elevated: '#f59e0b', // amber
  high: '#ef4444', // red
  low: '#3b82f6', // blue
};

const screenWidth = Dimensions.get('window').width - 40; // -40 for padding

const chartConfig = {
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  color: (opacity = 1) => `rgba(236, 72, 153, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.5,
  useShadowColorFromDataset: false,
  propsForDots: {
    r: '5',
    strokeWidth: '2',
    stroke: '#ec4899',
  },
  propsForLabels: {
    fontSize: 10,
  },
};

const AnalysisScreen = () => {
  const route = useRoute<AnalysisScreenRouteProp>();
  const navigation = useNavigation<AnalysisScreenNavigationProp>();
  const { scanId } = route.params;
  
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(mockAnalysisData);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color="#ec4899" />
        <Text className="mt-4 text-gray-600">Loading analysis results...</Text>
      </SafeAreaView>
    );
  }

  const renderOverviewTab = () => (
    <View>
      {/* Summary Card */}
      <Card variant="elevated" className="mb-4">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-lg font-bold text-gray-800">Health Summary</Text>
          <Text className="text-sm text-gray-500">
            {new Date(data.timestamp).toLocaleString()}
          </Text>
        </View>
        
        <View className="flex-row flex-wrap">
          <View className="w-1/2 mb-3">
            <Text className="text-gray-500 text-sm">Heart Rate</Text>
            <View className="flex-row items-center">
              <Text className="text-xl font-bold text-gray-800">{data.heartRate.current}</Text>
              <Text className="text-gray-600 ml-1">bpm</Text>
              <View className={`ml-2 px-2 py-0.5 rounded-full bg-${data.heartRate.status === 'normal' ? 'green' : 'amber'}-100`}>
                <Text className={`text-xs text-${data.heartRate.status === 'normal' ? 'green' : 'amber'}-600`}>
                  {data.heartRate.status}
                </Text>
              </View>
            </View>
          </View>
          
          <View className="w-1/2 mb-3">
            <Text className="text-gray-500 text-sm">HRV</Text>
            <View className="flex-row items-center">
              <Text className="text-xl font-bold text-gray-800">{data.hrv.current}</Text>
              <Text className="text-gray-600 ml-1">ms</Text>
              <View className={`ml-2 px-2 py-0.5 rounded-full bg-${data.hrv.status === 'normal' ? 'green' : 'amber'}-100`}>
                <Text className={`text-xs text-${data.hrv.status === 'normal' ? 'green' : 'amber'}-600`}>
                  {data.hrv.status}
                </Text>
              </View>
            </View>
          </View>
          
          <View className="w-1/2 mb-3">
            <Text className="text-gray-500 text-sm">Stress Level</Text>
            <View className="flex-row items-center">
              <Text className="text-xl font-bold text-gray-800">{data.stress.level}</Text>
              <View className={`ml-2 px-2 py-0.5 rounded-full bg-${data.stress.status === 'normal' ? 'green' : 'amber'}-100`}>
                <Text className={`text-xs text-${data.stress.status === 'normal' ? 'green' : 'amber'}-600`}>
                  {data.stress.status}
                </Text>
              </View>
            </View>
          </View>
          
          <View className="w-1/2 mb-3">
            <Text className="text-gray-500 text-sm">Emotion</Text>
            <Text className="text-xl font-bold text-gray-800">{data.emotion.primary}</Text>
          </View>
          
          <View className="w-1/2">
            <Text className="text-gray-500 text-sm">Blood Pressure</Text>
            <View className="flex-row items-center">
              <Text className="text-xl font-bold text-gray-800">{data.bloodPressure.systolic}/{data.bloodPressure.diastolic}</Text>
              <View className={`ml-2 px-2 py-0.5 rounded-full bg-${data.bloodPressure.status === 'normal' ? 'green' : 'amber'}-100`}>
                <Text className={`text-xs text-${data.bloodPressure.status === 'normal' ? 'green' : 'amber'}-600`}>
                  {data.bloodPressure.status}
                </Text>
              </View>
            </View>
          </View>
          
          <View className="w-1/2">
            <Text className="text-gray-500 text-sm">Oxygen Saturation</Text>
            <View className="flex-row items-center">
              <Text className="text-xl font-bold text-gray-800">{data.oxygenSaturation.value}%</Text>
              <View className={`ml-2 px-2 py-0.5 rounded-full bg-${data.oxygenSaturation.status === 'normal' ? 'green' : 'amber'}-100`}>
                <Text className={`text-xs text-${data.oxygenSaturation.status === 'normal' ? 'green' : 'amber'}-600`}>
                  {data.oxygenSaturation.status}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Card>
      
      {/* Heart Rate Chart */}
      <Card variant="elevated" className="mb-4">
        <Text className="text-lg font-bold text-gray-800 mb-3">Heart Rate Trend</Text>
        <LineChart
          data={{
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [
              {
                data: data.heartRate.history,
                color: (opacity = 1) => `rgba(236, 72, 153, ${opacity})`,
                strokeWidth: 2,
              },
            ],
          }}
          width={screenWidth - 32} // -32 for card padding
          height={180}
          chartConfig={chartConfig}
          bezier
          style={{
            borderRadius: 8,
          }}
        />
        <View className="flex-row justify-between mt-2">
          <View>
            <Text className="text-gray-500 text-xs">Min</Text>
            <Text className="font-semibold">{data.heartRate.min} bpm</Text>
          </View>
          <View>
            <Text className="text-gray-500 text-xs">Avg</Text>
            <Text className="font-semibold">{data.heartRate.avg} bpm</Text>
          </View>
          <View>
            <Text className="text-gray-500 text-xs">Max</Text>
            <Text className="font-semibold">{data.heartRate.max} bpm</Text>
          </View>
        </View>
      </Card>
      
      {/* Stress Level Chart */}
      <Card variant="elevated" className="mb-4">
        <Text className="text-lg font-bold text-gray-800 mb-3">Stress Level Trend</Text>
        <LineChart
          data={{
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [
              {
                data: data.stress.history,
                color: (opacity = 1) => `rgba(245, 158, 11, ${opacity})`,
                strokeWidth: 2,
              },
            ],
          }}
          width={screenWidth - 32}
          height={180}
          chartConfig={{
            ...chartConfig,
            color: (opacity = 1) => `rgba(245, 158, 11, ${opacity})`,
            propsForDots: {
              r: '5',
              strokeWidth: '2',
              stroke: '#f59e0b',
            },
          }}
          bezier
          style={{
            borderRadius: 8,
          }}
        />
        <View className="mt-2">
          <Text className="text-gray-500 text-xs">Stress Score</Text>
          <Text className="font-semibold">{data.stress.score}/100</Text>
        </View>
      </Card>
      
      {/* Recommendations */}
      <Card variant="elevated" className="mb-4">
        <View className="flex-row items-center mb-3">
          <Ionicons name="bulb-outline" size={20} color="#ec4899" />
          <Text className="text-lg font-bold text-gray-800 ml-2">Recommendations</Text>
        </View>
        
        {data.recommendations.map((recommendation, index) => (
          <View key={index} className="flex-row mb-2 last:mb-0">
            <Text className="text-primary-500 mr-2">•</Text>
            <Text className="text-gray-700 flex-1">{recommendation}</Text>
          </View>
        ))}
        
        <TouchableOpacity 
          className="mt-3 flex-row items-center"
          onPress={() => navigation.navigate('AIRecommendation', { analysisId: scanId })}
        >
          <Text className="text-primary-500 font-semibold">View detailed AI recommendations</Text>
          <Ionicons name="chevron-forward" size={16} color="#ec4899" />
        </TouchableOpacity>
      </Card>
    </View>
  );

  const renderDetailedTab = () => (
    <View>
      {/* Heart Rate Details */}
      <Card variant="elevated" className="mb-4">
        <Text className="text-lg font-bold text-gray-800 mb-3">Heart Rate Details</Text>
        <Text className="text-gray-700 mb-3">
          Your heart rate is {data.heartRate.current} bpm, which is within the normal range for your pregnancy stage. 
          During pregnancy, it's normal for your heart rate to increase by 15-20 beats per minute.
        </Text>
        <View className="bg-gray-100 p-3 rounded-lg">
          <Text className="text-gray-700 font-medium">Normal Range: 60-100 bpm</Text>
          <Text className="text-gray-700 font-medium">Pregnancy Range: 70-90 bpm</Text>
          <Text className="text-gray-700 font-medium">Your Average: {data.heartRate.avg} bpm</Text>
        </View>
      </Card>
      
      {/* HRV Details */}
      <Card variant="elevated" className="mb-4">
        <Text className="text-lg font-bold text-gray-800 mb-3">Heart Rate Variability Details</Text>
        <Text className="text-gray-700 mb-3">
          Your HRV is {data.hrv.current} ms, indicating good autonomic nervous system balance. 
          HRV is a measure of the variation in time between each heartbeat and can indicate stress and overall health.
        </Text>
        <View className="bg-gray-100 p-3 rounded-lg">
          <Text className="text-gray-700 font-medium">Normal Range: 30-60 ms</Text>
          <Text className="text-gray-700 font-medium">Your Average: {data.hrv.avg} ms</Text>
          <Text className="text-gray-700 font-medium">Trend: Stable</Text>
        </View>
      </Card>
      
      {/* Stress Details */}
      <Card variant="elevated" className="mb-4">
        <Text className="text-lg font-bold text-gray-800 mb-3">Stress Level Details</Text>
        <Text className="text-gray-700 mb-3">
          Your stress level is {data.stress.level.toLowerCase()} with a score of {data.stress.score}/100. 
          Some stress during pregnancy is normal, but chronic high stress can affect both you and your baby.
        </Text>
        <View className="bg-gray-100 p-3 rounded-lg">
          <Text className="text-gray-700 font-medium">Low: 0-40</Text>
          <Text className="text-gray-700 font-medium">Medium: 41-70</Text>
          <Text className="text-gray-700 font-medium">High: 71-100</Text>
        </View>
      </Card>
      
      {/* Emotion Details */}
      <Card variant="elevated" className="mb-4">
        <Text className="text-lg font-bold text-gray-800 mb-3">Emotional State Details</Text>
        <Text className="text-gray-700 mb-3">
          Your primary emotion is {data.emotion.primary} with secondary emotions of {data.emotion.secondary}. 
          Emotional well-being is important during pregnancy and can affect your baby's development.
        </Text>
        <View className="bg-gray-100 p-3 rounded-lg">
          <Text className="text-gray-700 font-medium">Primary: {data.emotion.primary}</Text>
          <Text className="text-gray-700 font-medium">Secondary: {data.emotion.secondary}</Text>
          <Text className="text-gray-700 font-medium">Weekly Trend: Improving</Text>
        </View>
      </Card>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-4 pt-2">
        {/* Tab navigation */}
        <View className="flex-row bg-gray-200 rounded-full p-1 mb-4">
          <TouchableOpacity
            className={`flex-1 py-2 rounded-full ${activeTab === 'overview' ? 'bg-white' : ''}`}
            onPress={() => setActiveTab('overview')}
          >
            <Text className={`text-center font-medium ${activeTab === 'overview' ? 'text-primary-500' : 'text-gray-500'}`}>
              Overview
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 py-2 rounded-full ${activeTab === 'detailed' ? 'bg-white' : ''}`}
            onPress={() => setActiveTab('detailed')}
          >
            <Text className={`text-center font-medium ${activeTab === 'detailed' ? 'text-primary-500' : 'text-gray-500'}`}>
              Detailed
            </Text>
          </TouchableOpacity>
        </View>
        
        {activeTab === 'overview' ? renderOverviewTab() : renderDetailedTab()}
        
        {/* Action buttons */}
        <View className="flex-row justify-between mb-8 mt-4">
          <Button
            title="Save Results"
            variant="outline"
            style={{ flex: 1, marginRight: 8 }}
          />
          <Button
            title="AI Recommendations"
            style={{ flex: 1, marginLeft: 8 }}
            onPress={() => navigation.navigate('AIRecommendation', { analysisId: scanId })}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AnalysisScreen; 