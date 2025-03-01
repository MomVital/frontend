import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';

// Mock data for health history
const mockHealthHistory = [
  {
    id: '1',
    date: '2023-06-15',
    time: '09:30 AM',
    heartRate: 82,
    hrv: 45,
    stress: 'Medium',
    emotion: 'Calm',
  },
  {
    id: '2',
    date: '2023-06-12',
    time: '10:15 AM',
    heartRate: 85,
    hrv: 42,
    stress: 'High',
    emotion: 'Anxious',
  },
  {
    id: '3',
    date: '2023-06-08',
    time: '08:45 AM',
    heartRate: 78,
    hrv: 50,
    stress: 'Low',
    emotion: 'Happy',
  },
];

// Mock data for pregnancy milestones
const mockMilestones = [
  {
    week: 12,
    title: 'First Trimester Complete',
    description: 'Baby is now about the size of a lime.',
    completed: true,
  },
  {
    week: 20,
    title: 'Halfway Point',
    description: 'You may feel the baby move for the first time.',
    completed: true,
  },
  {
    week: 24,
    title: 'Viability Milestone',
    description: 'Baby has a chance of survival if born now with medical help.',
    completed: true,
  },
  {
    week: 28,
    title: 'Third Trimester Begins',
    description: "Baby's brain and lungs continue to develop rapidly.",
    completed: false,
  },
  {
    week: 37,
    title: 'Full Term',
    description: 'Baby is considered full term and ready for birth.',
    completed: false,
  },
];

const ProfileScreen = () => {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('info');
  
  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          onPress: signOut,
          style: 'destructive',
        },
      ]
    );
  };
  
  const calculateDaysRemaining = () => {
    if (!user?.dueDate) return 0;
    
    const dueDate = new Date(user.dueDate);
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  };
  
  const daysRemaining = calculateDaysRemaining();
  
  const renderInfoTab = () => (
    <View>
      {/* Pregnancy Progress */}
      <Card variant="elevated" className="mb-4">
        <Text className="text-lg font-bold text-gray-800 mb-3">Pregnancy Progress</Text>
        
        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-600">Current Week</Text>
          <Text className="font-semibold text-gray-800">Week {user?.pregnancyWeek || 0}</Text>
        </View>
        
        <View className="w-full h-3 bg-gray-200 rounded-full mb-1">
          <View 
            className="h-full bg-primary-500 rounded-full"
            style={{ width: `${Math.min(100, ((user?.pregnancyWeek || 0) / 40) * 100)}%` }}
          />
        </View>
        
        <View className="flex-row justify-between mb-4">
          <Text className="text-xs text-gray-500">Week 1</Text>
          <Text className="text-xs text-gray-500">Week 40</Text>
        </View>
        
        <View className="flex-row justify-between items-center bg-primary-50 p-3 rounded-lg">
          <View>
            <Text className="text-gray-600">Due Date</Text>
            <Text className="font-semibold text-gray-800">
              {user?.dueDate ? new Date(user.dueDate).toLocaleDateString() : 'Not set'}
            </Text>
          </View>
          <View>
            <Text className="text-gray-600">Days Remaining</Text>
            <Text className="font-semibold text-gray-800">{daysRemaining} days</Text>
          </View>
        </View>
      </Card>
      
      {/* Milestones */}
      <Card variant="elevated" className="mb-4">
        <Text className="text-lg font-bold text-gray-800 mb-3">Pregnancy Milestones</Text>
        
        {mockMilestones.map((milestone, index) => (
          <View 
            key={index} 
            className={`flex-row items-start mb-4 ${index === mockMilestones.length - 1 ? 'mb-0' : ''}`}
          >
            <View className={`w-8 h-8 rounded-full ${milestone.completed ? 'bg-primary-500' : 'bg-gray-300'} items-center justify-center`}>
              {milestone.completed ? (
                <Ionicons name="checkmark" size={16} color="white" />
              ) : (
                <Text className="text-white font-bold">{milestone.week}</Text>
              )}
            </View>
            
            <View className="ml-3 flex-1">
              <Text className={`font-semibold ${milestone.completed ? 'text-gray-800' : 'text-gray-500'}`}>
                Week {milestone.week}: {milestone.title}
              </Text>
              <Text className={`text-sm ${milestone.completed ? 'text-gray-600' : 'text-gray-400'}`}>
                {milestone.description}
              </Text>
            </View>
          </View>
        ))}
      </Card>
      
      {/* Personal Information */}
      <Card variant="elevated" className="mb-4">
        <Text className="text-lg font-bold text-gray-800 mb-3">Personal Information</Text>
        
        <View className="mb-3">
          <Text className="text-gray-500 text-sm">Email</Text>
          <Text className="text-gray-800">{user?.email || 'Not set'}</Text>
        </View>
        
        <View className="mb-3">
          <Text className="text-gray-500 text-sm">Phone</Text>
          <Text className="text-gray-800">+1 (555) 123-4567</Text>
        </View>
        
        <View>
          <Text className="text-gray-500 text-sm">Healthcare Provider</Text>
          <Text className="text-gray-800">Dr. Sarah Johnson</Text>
        </View>
      </Card>
    </View>
  );
  
  const renderHistoryTab = () => (
    <View>
      <Text className="text-lg font-bold text-gray-800 mb-3">Health Scan History</Text>
      
      {mockHealthHistory.map((record) => (
        <Card key={record.id} variant="elevated" className="mb-4">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="font-semibold text-gray-800">{record.date}</Text>
            <Text className="text-gray-500">{record.time}</Text>
          </View>
          
          <View className="flex-row flex-wrap">
            <View className="w-1/2 mb-2">
              <Text className="text-gray-500 text-sm">Heart Rate</Text>
              <Text className="text-gray-800">{record.heartRate} bpm</Text>
            </View>
            
            <View className="w-1/2 mb-2">
              <Text className="text-gray-500 text-sm">HRV</Text>
              <Text className="text-gray-800">{record.hrv} ms</Text>
            </View>
            
            <View className="w-1/2">
              <Text className="text-gray-500 text-sm">Stress Level</Text>
              <Text className="text-gray-800">{record.stress}</Text>
            </View>
            
            <View className="w-1/2">
              <Text className="text-gray-500 text-sm">Emotion</Text>
              <Text className="text-gray-800">{record.emotion}</Text>
            </View>
          </View>
          
          <TouchableOpacity className="mt-3 flex-row items-center">
            <Text className="text-primary-500 font-medium">View Details</Text>
            <Ionicons name="chevron-forward" size={16} color="#ec4899" />
          </TouchableOpacity>
        </Card>
      ))}
    </View>
  );
  
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* Profile header */}
        <LinearGradient
          colors={['#ec4899', '#db2777']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="pt-6 pb-8 px-4"
        >
          <View className="items-center">
            {user?.profilePicture ? (
              <Image
                source={{ uri: user.profilePicture }}
                className="w-24 h-24 rounded-full border-4 border-white mb-3"
              />
            ) : (
              <View className="w-24 h-24 rounded-full bg-white/30 items-center justify-center mb-3">
                <Ionicons name="person" size={40} color="white" />
              </View>
            )}
            
            <Text className="text-white text-xl font-bold">{user?.name || 'User'}</Text>
            <Text className="text-white/80">Week {user?.pregnancyWeek || 0} of Pregnancy</Text>
          </View>
        </LinearGradient>
        
        {/* Tab navigation */}
        <View className="flex-row bg-white border-b border-gray-200">
          <TouchableOpacity
            className={`flex-1 py-3 ${activeTab === 'info' ? 'border-b-2 border-primary-500' : ''}`}
            onPress={() => setActiveTab('info')}
          >
            <Text className={`text-center font-medium ${activeTab === 'info' ? 'text-primary-500' : 'text-gray-500'}`}>
              Profile
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            className={`flex-1 py-3 ${activeTab === 'history' ? 'border-b-2 border-primary-500' : ''}`}
            onPress={() => setActiveTab('history')}
          >
            <Text className={`text-center font-medium ${activeTab === 'history' ? 'text-primary-500' : 'text-gray-500'}`}>
              History
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Tab content */}
        <View className="p-4">
          {activeTab === 'info' ? renderInfoTab() : renderHistoryTab()}
          
          {/* Sign out button */}
          <Button
            title="Sign Out"
            variant="outline"
            onPress={handleSignOut}
            fullWidth
            style={{ marginTop: 16, marginBottom: 24 }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen; 