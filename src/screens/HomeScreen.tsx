import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { RootStackParamList } from '../../App';
import { useAuth } from '../context/AuthContext';
import HealthMetricCard from '../components/HealthMetricCard';
import Card from '../components/Card';
import Button from '../components/Button';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Mock data for health metrics
const mockHealthData = {
  heartRate: { value: 82, unit: 'bpm', trend: 'stable' as const, trendValue: '0%' },
  hrv: { value: 45, unit: 'ms', trend: 'up' as const, trendValue: '+5%', trendIsGood: true },
  stress: { value: 'Medium', trend: 'down' as const, trendValue: '-10%', trendIsGood: true },
  emotion: { value: 'Calm', trend: 'stable' as const },
  sleep: { value: '7.5', unit: 'hrs', trend: 'up' as const, trendValue: '+30min', trendIsGood: true },
  activity: { value: '2,450', unit: 'steps', trend: 'down' as const, trendValue: '-15%', trendIsGood: false },
};

// Mock data for tips
const mockTips = [
  {
    id: '1',
    title: 'Stay Hydrated',
    description: 'Drink at least 8-10 glasses of water daily to support your pregnancy.',
    icon: 'water',
  },
  {
    id: '2',
    title: 'Gentle Exercise',
    description: 'Try prenatal yoga or walking for 20-30 minutes daily.',
    icon: 'fitness',
  },
  {
    id: '3',
    title: 'Balanced Diet',
    description: 'Include plenty of fruits, vegetables, and protein in your meals.',
    icon: 'nutrition',
  },
];

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // In a real app, you would fetch fresh data here
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const calculateWeeksRemaining = () => {
    if (!user?.dueDate) return 0;
    
    const dueDate = new Date(user.dueDate);
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, Math.floor(diffDays / 7));
  };

  const weeksRemaining = calculateWeeksRemaining();

  // Mock data for health metrics
  const healthMetrics = [
    { name: 'Heart Rate', value: '72', unit: 'bpm', icon: 'heart-outline' },
    { name: 'Blood Pressure', value: '120/80', unit: 'mmHg', icon: 'fitness-outline' },
    { name: 'Sleep', value: '7.5', unit: 'hours', icon: 'bed-outline' },
    { name: 'Steps', value: '6,542', unit: 'steps', icon: 'footsteps-outline' },
  ];

  // Mock data for recent scans
  const recentScans = [
    { id: '1', date: 'Today, 9:30 AM', type: 'Heart Rate Variability' },
    { id: '2', date: 'Yesterday, 8:15 PM', type: 'Stress Level' },
  ];

  const handleScanPress = (scanId: string) => {
    // @ts-ignore
    navigation.navigate('Analysis', { scanId });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView 
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="p-6">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-6">
            <View>
              <Text className="text-2xl font-bold text-gray-800">Hello, {user?.name || 'Sarah'}</Text>
              <Text className="text-gray-600">Week {user?.pregnancyWeek || 24} of Pregnancy</Text>
            </View>
            <TouchableOpacity className="bg-gray-100 p-2 rounded-full">
              <Ionicons name="notifications-outline" size={24} color="#ec4899" />
            </TouchableOpacity>
          </View>

          {/* Health Summary Card */}
          <View className="bg-primary-50 p-5 rounded-xl mb-6">
            <Text className="text-lg font-semibold text-primary-800 mb-4">Today's Health Summary</Text>
            <View className="flex-row flex-wrap justify-between">
              {healthMetrics.map((metric, index) => (
                <View key={index} className="w-[48%] bg-white p-4 rounded-lg mb-3">
                  <View className="flex-row items-center mb-2">
                    <Ionicons name={metric.icon as any} size={20} color="#ec4899" />
                    <Text className="text-gray-600 ml-2">{metric.name}</Text>
                  </View>
                  <Text className="text-2xl font-bold text-gray-800">{metric.value}</Text>
                  <Text className="text-gray-500">{metric.unit}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Quick Actions */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</Text>
            <View className="flex-row justify-between">
              <TouchableOpacity 
                className="bg-secondary-50 p-4 rounded-xl items-center w-[48%]"
                // @ts-ignore
                onPress={() => navigation.navigate('Scan')}
              >
                <Ionicons name="pulse" size={24} color="#0ea5e9" />
                <Text className="text-secondary-800 mt-2 font-medium">New Scan</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                className="bg-accent-50 p-4 rounded-xl items-center w-[48%]"
                // @ts-ignore
                onPress={() => navigation.navigate('AIRecommendation', { analysisId: 'latest' })}
              >
                <Ionicons name="bulb-outline" size={24} color="#f97316" />
                <Text className="text-accent-800 mt-2 font-medium">AI Insights</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Recent Scans */}
          <View>
            <Text className="text-lg font-semibold text-gray-800 mb-4">Recent Scans</Text>
            {recentScans.map((scan) => (
              <TouchableOpacity 
                key={scan.id}
                className="bg-gray-50 p-4 rounded-lg mb-3 flex-row justify-between items-center"
                onPress={() => handleScanPress(scan.id)}
              >
                <View>
                  <Text className="text-gray-800 font-medium">{scan.type}</Text>
                  <Text className="text-gray-500">{scan.date}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen; 