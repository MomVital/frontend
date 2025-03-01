import React, { useState } from 'react';
import { View, Text, ScrollView, Switch, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';

const SettingsScreen = () => {
  const { user } = useAuth();
  
  // Notification settings
  const [dailyReminders, setDailyReminders] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(true);
  const [healthAlerts, setHealthAlerts] = useState(true);
  const [pregnancyUpdates, setPregnancyUpdates] = useState(true);
  
  // Privacy settings
  const [shareDataWithDoctor, setShareDataWithDoctor] = useState(true);
  const [anonymousDataCollection, setAnonymousDataCollection] = useState(true);
  
  // App settings
  const [darkMode, setDarkMode] = useState(false);
  const [biometricLogin, setBiometricLogin] = useState(false);
  
  const handleClearData = () => {
    Alert.alert(
      'Clear App Data',
      'Are you sure you want to clear all app data? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear Data',
          onPress: () => {
            // In a real app, this would clear local storage
            Alert.alert('Success', 'All app data has been cleared.');
          },
          style: 'destructive',
        },
      ]
    );
  };
  
  const renderSettingItem = (
    title: string, 
    description: string, 
    value: boolean, 
    onValueChange: (value: boolean) => void,
    icon?: keyof typeof Ionicons.glyphMap,
    iconColor: string = '#ec4899'
  ) => (
    <View className="flex-row items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
      <View className="flex-row items-center flex-1 mr-4">
        {icon && (
          <View className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center mr-3">
            <Ionicons name={icon} size={18} color={iconColor} />
          </View>
        )}
        <View>
          <Text className="text-gray-800 font-medium">{title}</Text>
          <Text className="text-gray-500 text-sm">{description}</Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#d1d5db', true: '#f9a8d4' }}
        thumbColor={value ? '#ec4899' : '#f3f4f6'}
      />
    </View>
  );
  
  const renderLinkItem = (
    title: string,
    icon: keyof typeof Ionicons.glyphMap,
    iconColor: string = '#ec4899',
    onPress: () => void
  ) => (
    <TouchableOpacity 
      className="flex-row items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
      onPress={onPress}
    >
      <View className="flex-row items-center">
        <View className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center mr-3">
          <Ionicons name={icon} size={18} color={iconColor} />
        </View>
        <Text className="text-gray-800 font-medium">{title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 p-4">
        <Text className="text-2xl font-bold text-gray-800 mb-4">Settings</Text>
        
        {/* Notification Settings */}
        <Card variant="elevated" className="mb-4">
          <Text className="text-lg font-bold text-gray-800 mb-3">Notifications</Text>
          
          {renderSettingItem(
            'Daily Reminders',
            'Receive daily reminders for health tracking',
            dailyReminders,
            setDailyReminders,
            'notifications-outline'
          )}
          
          {renderSettingItem(
            'Weekly Health Reports',
            'Get a summary of your weekly health data',
            weeklyReports,
            setWeeklyReports,
            'document-text-outline'
          )}
          
          {renderSettingItem(
            'Health Alerts',
            'Receive alerts for unusual health patterns',
            healthAlerts,
            setHealthAlerts,
            'alert-circle-outline'
          )}
          
          {renderSettingItem(
            'Pregnancy Updates',
            'Weekly updates about your pregnancy stage',
            pregnancyUpdates,
            setPregnancyUpdates,
            'information-circle-outline'
          )}
        </Card>
        
        {/* Privacy Settings */}
        <Card variant="elevated" className="mb-4">
          <Text className="text-lg font-bold text-gray-800 mb-3">Privacy & Data</Text>
          
          {renderSettingItem(
            'Share Data with Doctor',
            'Allow your doctor to access your health data',
            shareDataWithDoctor,
            setShareDataWithDoctor,
            'medkit-outline'
          )}
          
          {renderSettingItem(
            'Anonymous Data Collection',
            'Help improve the app by sharing anonymous data',
            anonymousDataCollection,
            setAnonymousDataCollection,
            'analytics-outline'
          )}
        </Card>
        
        {/* App Settings */}
        <Card variant="elevated" className="mb-4">
          <Text className="text-lg font-bold text-gray-800 mb-3">App Settings</Text>
          
          {renderSettingItem(
            'Dark Mode',
            'Switch between light and dark themes',
            darkMode,
            setDarkMode,
            'moon-outline'
          )}
          
          {renderSettingItem(
            'Biometric Login',
            'Use Face ID or Touch ID to log in',
            biometricLogin,
            setBiometricLogin,
            'finger-print-outline'
          )}
        </Card>
        
        {/* Account Settings */}
        <Card variant="elevated" className="mb-4">
          <Text className="text-lg font-bold text-gray-800 mb-3">Account</Text>
          
          {renderLinkItem(
            'Edit Profile',
            'person-outline',
            '#ec4899',
            () => {}
          )}
          
          {renderLinkItem(
            'Change Password',
            'lock-closed-outline',
            '#0ea5e9',
            () => {}
          )}
          
          {renderLinkItem(
            'Connected Devices',
            'bluetooth-outline',
            '#8b5cf6',
            () => {}
          )}
          
          {renderLinkItem(
            'Healthcare Provider',
            'medkit-outline',
            '#10b981',
            () => {}
          )}
        </Card>
        
        {/* Support & About */}
        <Card variant="elevated" className="mb-4">
          <Text className="text-lg font-bold text-gray-800 mb-3">Support & About</Text>
          
          {renderLinkItem(
            'Help & Support',
            'help-circle-outline',
            '#f59e0b',
            () => {}
          )}
          
          {renderLinkItem(
            'Privacy Policy',
            'shield-outline',
            '#6b7280',
            () => {}
          )}
          
          {renderLinkItem(
            'Terms of Service',
            'document-text-outline',
            '#6b7280',
            () => {}
          )}
          
          {renderLinkItem(
            'About MomVital',
            'information-circle-outline',
            '#ec4899',
            () => {}
          )}
        </Card>
        
        {/* Danger Zone */}
        <Card variant="elevated" className="mb-8">
          <Text className="text-lg font-bold text-gray-800 mb-3">Danger Zone</Text>
          
          <TouchableOpacity 
            className="flex-row items-center justify-between py-3 border-b border-gray-100"
            onPress={handleClearData}
          >
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-full bg-red-100 items-center justify-center mr-3">
                <Ionicons name="trash-outline" size={18} color="#ef4444" />
              </View>
              <Text className="text-red-500 font-medium">Clear App Data</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="flex-row items-center justify-between py-3"
          >
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-full bg-red-100 items-center justify-center mr-3">
                <Ionicons name="close-circle-outline" size={18} color="#ef4444" />
              </View>
              <Text className="text-red-500 font-medium">Delete Account</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
          </TouchableOpacity>
        </Card>
        
        <View className="items-center mb-8">
          <Text className="text-gray-400 text-sm">MomVital v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen; 