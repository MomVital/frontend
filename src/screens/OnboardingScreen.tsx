import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type OnboardingScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;

const { width, height } = Dimensions.get('window');

const OnboardingScreen: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const navigation = useNavigation<OnboardingScreenNavigationProp>();

  const onboardingData = [
    {
      title: "Welcome to MomVital",
      description: "Your AI-powered pregnancy health companion",
      image: require('../../assets/onboarding-1.png')
    },
    {
      title: "Monitor Your Health",
      description: "Track vital signs and get personalized insights",
      image: require('../../assets/onboarding-1.png')
    },
    {
      title: "AI Recommendations",
      description: "Receive expert advice based on your health data",
      image: require('../../assets/onboarding-1.png')
    }
  ];

  const handleNext = () => {
    if (currentPage < onboardingData.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      console.log('Navigating to Auth screen');
      try {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Auth' }],
        });
      } catch (error) {
        console.error('Navigation error:', error);
      }
    }
  };

  const handleSkip = () => {
    console.log('Skipping to Auth screen');
    try {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Auth' }],
      });
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-between p-6">
        <View className="items-center mt-10">
          <Image 
            source={onboardingData[currentPage].image}
            className="w-72 h-72"
            resizeMode="contain"
          />
        </View>
        
        <View className="items-center">
          <Text className="text-3xl font-bold text-primary-600 mb-4">
            {onboardingData[currentPage].title}
          </Text>
          <Text className="text-lg text-gray-600 text-center mb-8">
            {onboardingData[currentPage].description}
          </Text>
          
          <View className="flex-row justify-center mb-8">
            {onboardingData.map((_, index) => (
              <View 
                key={index}
                className={`h-2 w-2 rounded-full mx-1 ${
                  index === currentPage ? 'bg-primary-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </View>
        </View>
        
        <View className="flex-row justify-between items-center mb-6">
          <TouchableOpacity onPress={handleSkip}>
            <Text className="text-gray-500 text-base">Skip</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={handleNext}
            className="bg-primary-500 px-8 py-3 rounded-full"
          >
            <Text className="text-white font-semibold text-base">
              {currentPage === onboardingData.length - 1 ? 'Get Started' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingScreen; 