import React from 'react';
import "./global.css";
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { View } from 'react-native';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import ScanningScreen from './src/screens/ScanningScreen';
import AnalysisScreen from './src/screens/AnalysisScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import AIRecommendationScreen from './src/screens/AIRecommendationScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';

// Import context
import { AuthProvider } from './src/context/AuthContext';

// Define navigation types
export type RootStackParamList = {
  Onboarding: undefined;
  Auth: undefined;
  Main: undefined;
  Scan: undefined;
  Analysis: { scanId: string };
  AIRecommendation: { analysisId: string };
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Scan: undefined;
  Profile: undefined;
  Settings: undefined;
};

// Create navigators
const Stack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Auth navigator component
const AuthNavigator = () => {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
};

// Main tab navigator component
const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === 'Home') {
            return <Ionicons name="home" size={size} color={color} />;
          } else if (route.name === 'Scan') {
            return <MaterialCommunityIcons name="heart-pulse" size={size} color={color} />;
          } else if (route.name === 'Profile') {
            return <FontAwesome5 name="user-alt" size={size} color={color} />;
          } else if (route.name === 'Settings') {
            return <Ionicons name="settings-sharp" size={size} color={color} />;
          }
          return null;
        },
        tabBarActiveTintColor: '#ec4899',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarStyle: {
          paddingVertical: 5,
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          backgroundColor: 'white',
          position: 'absolute',
          borderTopColor: '#f3f4f6',
          height: 60,
        },
        tabBarLabelStyle: {
          paddingBottom: 5,
          fontSize: 12,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Scan" component={ScanningScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <NavigationContainer>
            <StatusBar style="auto" />
            <Stack.Navigator initialRouteName="Main" screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Main" component={MainNavigator} />
              <Stack.Screen 
                name="Analysis" 
                component={AnalysisScreen} 
                options={{ 
                  headerShown: true, 
                  headerTitle: 'Health Analysis',
                  headerTintColor: '#ec4899',
                  headerStyle: {
                    backgroundColor: 'white',
                  },
                }} 
              />
              <Stack.Screen 
                name="AIRecommendation" 
                component={AIRecommendationScreen} 
                options={{ 
                  headerShown: true, 
                  headerTitle: 'AI Recommendations',
                  headerTintColor: '#ec4899',
                  headerStyle: {
                    backgroundColor: 'white',
                  },
                }} 
              />
            </Stack.Navigator>
          </NavigationContainer>
        </AuthProvider>
      </SafeAreaProvider>
    </View>
  );
}