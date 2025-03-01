import React from 'react';
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

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = React.useState(false);

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

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#ec4899" />
        }
      >
        {/* Header with user info */}
        <LinearGradient
          colors={['#ec4899', '#db2777']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="px-4 pt-4 pb-8 rounded-b-3xl"
        >
          <View className="flex-row justify-between items-center mb-4">
            <View>
              <Text className="text-white text-lg font-semibold">Hello,</Text>
              <Text className="text-white text-2xl font-bold">{user?.name || 'Mom'}</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Main', { screen: 'Profile' })}>
              {user?.profilePicture ? (
                <Image
                  source={{ uri: user.profilePicture }}
                  className="w-12 h-12 rounded-full border-2 border-white"
                />
              ) : (
                <View className="w-12 h-12 rounded-full bg-white/30 items-center justify-center">
                  <Ionicons name="person" size={24} color="white" />
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View className="bg-white/20 rounded-xl p-4 mb-2">
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="text-white text-sm opacity-80">Current pregnancy</Text>
                <Text className="text-white text-xl font-bold">Week {user?.pregnancyWeek || 0}</Text>
              </View>
              <View>
                <Text className="text-white text-sm opacity-80">Remaining</Text>
                <Text className="text-white text-xl font-bold">{weeksRemaining} weeks</Text>
              </View>
              <TouchableOpacity 
                className="bg-white/30 rounded-full p-2"
                onPress={() => {/* Navigate to pregnancy details */}}
              >
                <Ionicons name="calendar" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        {/* Quick action buttons */}
        <View className="flex-row justify-between px-4 -mt-5">
          <TouchableOpacity 
            className="bg-white rounded-xl p-3 shadow-sm flex-1 mr-2 items-center"
            onPress={() => navigation.navigate('Scan')}
          >
            <Ionicons name="heart" size={24} color="#ec4899" />
            <Text className="text-gray-800 font-medium mt-1">Scan Now</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="bg-white rounded-xl p-3 shadow-sm flex-1 ml-2 items-center"
            onPress={() => {/* Navigate to history */}}
          >
            <Ionicons name="time" size={24} color="#0ea5e9" />
            <Text className="text-gray-800 font-medium mt-1">History</Text>
          </TouchableOpacity>
        </View>

        {/* Health metrics section */}
        <View className="px-4 mt-6">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-lg font-bold text-gray-800">Health Metrics</Text>
            <TouchableOpacity>
              <Text className="text-primary-500 font-medium">See All</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row mb-3">
            <View className="flex-1 mr-2">
              <HealthMetricCard
                type="heart-rate"
                value={mockHealthData.heartRate.value}
                unit={mockHealthData.heartRate.unit}
                trend={mockHealthData.heartRate.trend}
                trendValue={mockHealthData.heartRate.trendValue}
                onPress={() => navigation.navigate('Analysis', { scanId: 'latest' })}
              />
            </View>
            <View className="flex-1 ml-2">
              <HealthMetricCard
                type="hrv"
                value={mockHealthData.hrv.value}
                unit={mockHealthData.hrv.unit}
                trend={mockHealthData.hrv.trend}
                trendValue={mockHealthData.hrv.trendValue}
                trendIsGood={mockHealthData.hrv.trendIsGood}
                onPress={() => navigation.navigate('Analysis', { scanId: 'latest' })}
              />
            </View>
          </View>

          <View className="flex-row mb-3">
            <View className="flex-1 mr-2">
              <HealthMetricCard
                type="stress"
                value={mockHealthData.stress.value}
                trend={mockHealthData.stress.trend}
                trendValue={mockHealthData.stress.trendValue}
                trendIsGood={mockHealthData.stress.trendIsGood}
                onPress={() => navigation.navigate('Analysis', { scanId: 'latest' })}
              />
            </View>
            <View className="flex-1 ml-2">
              <HealthMetricCard
                type="emotion"
                value={mockHealthData.emotion.value}
                trend={mockHealthData.emotion.trend}
                onPress={() => navigation.navigate('Analysis', { scanId: 'latest' })}
              />
            </View>
          </View>
        </View>

        {/* AI Recommendations */}
        <View className="px-4 mt-4">
          <Text className="text-lg font-bold text-gray-800 mb-3">AI Recommendations</Text>
          <Card variant="elevated">
            <View className="flex-row items-center mb-3">
              <View className="w-10 h-10 rounded-full bg-primary-100 items-center justify-center mr-3">
                <Ionicons name="bulb" size={20} color="#ec4899" />
              </View>
              <View>
                <Text className="text-gray-800 font-semibold">Personalized Insights</Text>
                <Text className="text-gray-500 text-sm">Based on your recent health data</Text>
              </View>
            </View>
            <Text className="text-gray-700 mb-3">
              Your stress levels have decreased this week. Keep up with your relaxation techniques and gentle exercise.
            </Text>
            <Button 
              title="View Full Recommendations" 
              variant="outline" 
              size="sm"
              onPress={() => navigation.navigate('AIRecommendation', { analysisId: 'latest' })}
            />
          </Card>
        </View>

        {/* Daily Tips */}
        <View className="px-4 mt-6 mb-8">
          <Text className="text-lg font-bold text-gray-800 mb-3">Daily Tips</Text>
          {mockTips.map((tip) => (
            <Card key={tip.id} variant="outlined" style={{ marginBottom: 10 }}>
              <View className="flex-row">
                <View className="w-10 h-10 rounded-full bg-primary-100 items-center justify-center mr-3">
                  <Ionicons name={tip.icon as any} size={20} color="#ec4899" />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-800 font-semibold">{tip.title}</Text>
                  <Text className="text-gray-600 text-sm mt-1">{tip.description}</Text>
                </View>
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen; 