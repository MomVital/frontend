import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { View } from 'react-native';

import { RootStackParamList, TabParamList } from './src/navigation/types';
import { theme } from './src/theme/theme';
import HomeScreen from './src/screens/HomeScreen';
import ScanScreen from './src/screens/ScanScreen';
import AnalysisScreen from './src/screens/AnalysisScreen';
import AiSuggestionsScreen from './src/screens/AiSuggestionsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import RegistrationScreen from './src/screens/RegistrationScreen';
import PregnancyTrackerScreen from './src/screens/PregnancyTrackerScreen';
import Logo from './src/components/Logo';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const HomeStack = () => {
  return (
    <Stack.Navigator
      id="HomeStack"
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: theme.colors.white,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Analysis" 
        component={AnalysisScreen} 
        options={{ title: 'Health Analysis' }}
      />
      <Stack.Screen 
        name="AiSuggestions" 
        component={AiSuggestionsScreen} 
        options={{ title: 'AI Suggestions' }}
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ title: 'Settings' }}
      />
    </Stack.Navigator>
  );
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      id="MainTabs"
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.gray,
        tabBarStyle: {
          backgroundColor: theme.colors.white,
          borderTopColor: theme.colors.lightGray,
          paddingBottom: 5,
          paddingTop: 5,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="ScanTab"
        component={ScanScreen}
        options={{
          tabBarLabel: 'Scan',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="scan" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="TrackerTab"
        component={PregnancyTrackerScreen}
        options={{
          tabBarLabel: 'Tracker',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const RootStack = () => {
  return (
    <Stack.Navigator 
      id="RootStack"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Main" component={TabNavigator} />
      <Stack.Screen 
        name="Registration" 
        component={RegistrationScreen} 
        options={{ 
          headerShown: true,
          title: 'Create Account',
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
          headerTintColor: theme.colors.white,
        }}
      />
      <Stack.Screen 
        name="Scan" 
        component={ScanScreen} 
        options={{ 
          headerShown: true,
          title: 'Health Scan',
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
          headerTintColor: theme.colors.white,
        }}
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ 
          headerShown: true,
          title: 'Settings',
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
          headerTintColor: theme.colors.white,
        }}
      />
      <Stack.Screen 
        name="PregnancyTracker" 
        component={PregnancyTrackerScreen} 
        options={{ 
          headerShown: true,
          title: 'Pregnancy Tracker',
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
          headerTintColor: theme.colors.white,
        }}
      />
      <Stack.Screen 
        name="Analysis" 
        component={AnalysisScreen} 
        options={{ 
          headerShown: true,
          title: 'Health Analysis',
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
          headerTintColor: theme.colors.white,
        }}
      />
      <Stack.Screen 
        name="AiSuggestions" 
        component={AiSuggestionsScreen} 
        options={{ 
          headerShown: true,
          title: 'AI Suggestions',
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
          headerTintColor: theme.colors.white,
        }}
      />
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <RootStack />
    </NavigationContainer>
  );
}