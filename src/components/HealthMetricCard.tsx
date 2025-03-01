import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import Card from './Card';

type MetricType = 'heart-rate' | 'hrv' | 'stress' | 'emotion' | 'sleep' | 'activity';

interface HealthMetricCardProps {
  type: MetricType;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  trendIsGood?: boolean;
  onPress?: () => void;
}

const HealthMetricCard: React.FC<HealthMetricCardProps> = ({
  type,
  value,
  unit,
  trend,
  trendValue,
  trendIsGood = true,
  onPress,
}) => {
  // Define icon and colors based on metric type
  const getMetricDetails = (type: MetricType) => {
    switch (type) {
      case 'heart-rate':
        return {
          icon: <FontAwesome5 name="heartbeat" size={24} color="#ec4899" />,
          title: 'Heart Rate',
          bgColor: 'bg-pink-50',
        };
      case 'hrv':
        return {
          icon: <MaterialCommunityIcons name="heart-pulse" size={24} color="#0ea5e9" />,
          title: 'HRV',
          bgColor: 'bg-blue-50',
        };
      case 'stress':
        return {
          icon: <MaterialCommunityIcons name="brain" size={24} color="#f97316" />,
          title: 'Stress Level',
          bgColor: 'bg-orange-50',
        };
      case 'emotion':
        return {
          icon: <Ionicons name="happy-outline" size={24} color="#10b981" />,
          title: 'Emotion',
          bgColor: 'bg-green-50',
        };
      case 'sleep':
        return {
          icon: <Ionicons name="moon-outline" size={24} color="#8b5cf6" />,
          title: 'Sleep',
          bgColor: 'bg-purple-50',
        };
      case 'activity':
        return {
          icon: <MaterialCommunityIcons name="walk" size={24} color="#f59e0b" />,
          title: 'Activity',
          bgColor: 'bg-amber-50',
        };
      default:
        return {
          icon: <Ionicons name="stats-chart" size={24} color="#6b7280" />,
          title: 'Metric',
          bgColor: 'bg-gray-50',
        };
    }
  };

  const { icon, title, bgColor } = getMetricDetails(type);

  // Determine trend icon and color
  const getTrendIcon = () => {
    if (!trend) return null;

    const isPositive = 
      (trend === 'up' && trendIsGood) || 
      (trend === 'down' && !trendIsGood);

    const iconName = trend === 'up' ? 'arrow-up' : trend === 'down' ? 'arrow-down' : 'remove';
    const color = trend === 'stable' ? '#6b7280' : isPositive ? '#10b981' : '#ef4444';

    return (
      <View className="flex-row items-center">
        <Ionicons name={iconName} size={16} color={color} />
        {trendValue && (
          <Text className={`ml-1 text-xs ${isPositive ? 'text-green-500' : trend === 'stable' ? 'text-gray-500' : 'text-red-500'}`}>
            {trendValue}
          </Text>
        )}
      </View>
    );
  };

  return (
    <TouchableOpacity 
      className={`rounded-xl overflow-hidden ${bgColor}`}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View className="p-4">
        <View className="flex-row justify-between items-center mb-2">
          <View className="flex-row items-center">
            {icon}
            <Text className="ml-2 text-gray-700 font-medium">{title}</Text>
          </View>
          {getTrendIcon()}
        </View>
        
        <View className="flex-row items-baseline">
          <Text className="text-2xl font-bold text-gray-800">{value}</Text>
          {unit && <Text className="ml-1 text-gray-500">{unit}</Text>}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default HealthMetricCard; 