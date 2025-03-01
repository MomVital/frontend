import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { RootStackParamList } from '../../App';
import Card from '../components/Card';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

type AIRecommendationScreenRouteProp = RouteProp<RootStackParamList, 'AIRecommendation'>;

// Mock AI recommendations data
const mockRecommendations = {
  summary: "Based on your recent health data, you're doing well overall with some areas for improvement.",
  healthStatus: "Your vital signs are within normal ranges for your pregnancy stage. Your heart rate and blood pressure are optimal, though your stress levels are slightly elevated.",
  insights: [
    {
      id: '1',
      title: 'Stress Management',
      description: 'Your stress levels are slightly elevated. This is common during pregnancy but should be monitored.',
      recommendations: [
        'Practice deep breathing exercises for 5-10 minutes twice daily',
        'Consider prenatal yoga or gentle stretching',
        'Maintain a regular sleep schedule of 7-9 hours per night',
        'Take short breaks throughout the day to rest and relax'
      ],
      icon: 'brain',
      color: '#f59e0b'
    },
    {
      id: '2',
      title: 'Heart Health',
      description: 'Your heart rate is normal but shows slight variations throughout the day.',
      recommendations: [
        'Continue with light to moderate exercise like walking for 20-30 minutes daily',
        'Stay hydrated with at least 8-10 glasses of water daily',
        'Maintain a balanced diet rich in fruits, vegetables, and whole grains',
        'Monitor your heart rate during exercise and rest if it exceeds 140 bpm'
      ],
      icon: 'heart',
      color: '#ec4899'
    },
    {
      id: '3',
      title: 'Emotional Wellbeing',
      description: 'Your emotional state is generally positive, which is beneficial for both you and your baby.',
      recommendations: [
        'Continue activities that bring you joy and relaxation',
        'Stay connected with supportive friends and family',
        'Consider joining a pregnancy support group to share experiences',
        'Take time each day for self-care activities you enjoy'
      ],
      icon: 'happy',
      color: '#10b981'
    }
  ],
  weeklyFocus: {
    title: "This Week's Focus: Stress Reduction",
    description: "Based on your recent data, focusing on stress reduction techniques would be most beneficial this week.",
    tips: [
      "Set aside 15 minutes each day for meditation or deep breathing",
      "Take a warm bath with lavender essential oil before bed",
      "Limit screen time in the evening to improve sleep quality",
      "Try progressive muscle relaxation when feeling tense"
    ]
  },
  nutritionTips: [
    "Increase iron intake with leafy greens and lean meats",
    "Ensure adequate calcium from dairy or fortified plant milks",
    "Include omega-3 rich foods like walnuts and flaxseeds",
    "Stay hydrated with water and herbal teas"
  ]
};

const AIRecommendationScreen = () => {
  const route = useRoute<AIRecommendationScreenRouteProp>();
  const { analysisId } = route.params;
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState(mockRecommendations);
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  const toggleInsight = (id: string) => {
    if (expandedInsight === id) {
      setExpandedInsight(null);
    } else {
      setExpandedInsight(id);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <View className="items-center">
          <ActivityIndicator size="large" color="#ec4899" />
          <Text className="mt-4 text-gray-600">AI is analyzing your health data...</Text>
          <Text className="mt-2 text-gray-500 text-sm">Generating personalized recommendations</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-4 pt-2">
        {/* AI Assistant Header */}
        <View className="flex-row items-center bg-primary-50 p-4 rounded-xl mb-4">
          <View className="w-12 h-12 rounded-full bg-primary-100 items-center justify-center mr-3">
            <Ionicons name="medkit" size={24} color="#ec4899" />
          </View>
          <View className="flex-1">
            <Text className="text-gray-800 font-bold text-lg">MomVital AI Assistant</Text>
            <Text className="text-gray-600">
              Personalized recommendations for week {user?.pregnancyWeek || 24}
            </Text>
          </View>
        </View>
        
        {/* Summary Card */}
        <Card variant="elevated" className="mb-4">
          <Text className="text-lg font-bold text-gray-800 mb-2">Summary</Text>
          <Text className="text-gray-700">{recommendations.summary}</Text>
          
          <View className="mt-3 pt-3 border-t border-gray-100">
            <Text className="text-gray-700">{recommendations.healthStatus}</Text>
          </View>
        </Card>
        
        {/* Insights */}
        <Text className="text-lg font-bold text-gray-800 mb-2 px-1">Health Insights</Text>
        
        {recommendations.insights.map((insight) => (
          <Card key={insight.id} variant="elevated" className="mb-4">
            <TouchableOpacity 
              className="flex-row items-center"
              onPress={() => toggleInsight(insight.id)}
            >
              <View 
                className="w-10 h-10 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: `${insight.color}20` }}
              >
                <Ionicons name={insight.icon as any} size={20} color={insight.color} />
              </View>
              <View className="flex-1">
                <Text className="text-gray-800 font-semibold">{insight.title}</Text>
                <Text className="text-gray-600 text-sm">{insight.description}</Text>
              </View>
              <Ionicons 
                name={expandedInsight === insight.id ? "chevron-up" : "chevron-down"} 
                size={20} 
                color="#6b7280" 
              />
            </TouchableOpacity>
            
            {expandedInsight === insight.id && (
              <View className="mt-3 pt-3 border-t border-gray-100">
                <Text className="text-gray-700 font-semibold mb-2">Recommendations:</Text>
                {insight.recommendations.map((rec, index) => (
                  <View key={index} className="flex-row mb-2">
                    <Text className="text-primary-500 mr-2">•</Text>
                    <Text className="text-gray-700 flex-1">{rec}</Text>
                  </View>
                ))}
              </View>
            )}
          </Card>
        ))}
        
        {/* Weekly Focus */}
        <Card variant="elevated" className="mb-4">
          <View className="flex-row items-center mb-3">
            <View className="w-10 h-10 rounded-full bg-primary-100 items-center justify-center mr-3">
              <Ionicons name="calendar" size={20} color="#ec4899" />
            </View>
            <Text className="text-lg font-bold text-gray-800">{recommendations.weeklyFocus.title}</Text>
          </View>
          
          <Text className="text-gray-700 mb-3">{recommendations.weeklyFocus.description}</Text>
          
          {recommendations.weeklyFocus.tips.map((tip, index) => (
            <View key={index} className="flex-row mb-2">
              <Text className="text-primary-500 mr-2">{index + 1}.</Text>
              <Text className="text-gray-700 flex-1">{tip}</Text>
            </View>
          ))}
        </Card>
        
        {/* Nutrition Tips */}
        <Card variant="elevated" className="mb-4">
          <View className="flex-row items-center mb-3">
            <View className="w-10 h-10 rounded-full bg-primary-100 items-center justify-center mr-3">
              <Ionicons name="nutrition" size={20} color="#ec4899" />
            </View>
            <Text className="text-lg font-bold text-gray-800">Nutrition Recommendations</Text>
          </View>
          
          {recommendations.nutritionTips.map((tip, index) => (
            <View key={index} className="flex-row mb-2">
              <Text className="text-primary-500 mr-2">•</Text>
              <Text className="text-gray-700 flex-1">{tip}</Text>
            </View>
          ))}
        </Card>
        
        {/* Action buttons */}
        <View className="flex-row justify-between mb-8 mt-2">
          <Button
            title="Save to Profile"
            variant="outline"
            style={{ flex: 1, marginRight: 8 }}
            icon="bookmark-outline"
          />
          <Button
            title="Share with Doctor"
            style={{ flex: 1, marginLeft: 8 }}
            icon="share-outline"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AIRecommendationScreen; 