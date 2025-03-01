import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

import { AuthStackParamList, RootStackParamList } from '../../App';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

type RegisterScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList> & 
  NativeStackNavigationProp<RootStackParamList>;

const RegisterScreen = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const { signUp, isLoading } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pregnancyWeek, setPregnancyWeek] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDueDate(selectedDate);
    }
  };
  
  const validateStep1 = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return false;
    }
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return false;
    }
    if (!password.trim()) {
      Alert.alert('Error', 'Please enter a password');
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return false;
    }
    return true;
  };
  
  const validateStep2 = () => {
    if (!pregnancyWeek.trim()) {
      Alert.alert('Error', 'Please enter your current pregnancy week');
      return false;
    }
    const weekNum = parseInt(pregnancyWeek);
    if (isNaN(weekNum) || weekNum < 1 || weekNum > 42) {
      Alert.alert('Error', 'Please enter a valid pregnancy week (1-42)');
      return false;
    }
    return true;
  };
  
  const handleNextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    }
  };
  
  const handlePrevStep = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };
  
  const handleRegister = async () => {
    if (!validateStep2()) return;
    
    try {
      await signUp(
        name, 
        email, 
        password, 
        parseInt(pregnancyWeek), 
        dueDate.toISOString().split('T')[0]
      );
      navigation.navigate('Main');
    } catch (error) {
      Alert.alert('Registration Failed', 'Could not create your account. Please try again.');
    }
  };
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  const renderStep1 = () => (
    <View>
      <View className="mb-4">
        <Text className="text-gray-700 font-medium mb-2">Full Name</Text>
        <View className="flex-row items-center border border-gray-300 rounded-lg px-3 py-2">
          <Ionicons name="person-outline" size={20} color="#9ca3af" />
          <TextInput
            className="flex-1 ml-2 text-gray-800"
            placeholder="Enter your full name"
            value={name}
            onChangeText={setName}
          />
        </View>
      </View>
      
      <View className="mb-4">
        <Text className="text-gray-700 font-medium mb-2">Email</Text>
        <View className="flex-row items-center border border-gray-300 rounded-lg px-3 py-2">
          <Ionicons name="mail-outline" size={20} color="#9ca3af" />
          <TextInput
            className="flex-1 ml-2 text-gray-800"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
      </View>
      
      <View className="mb-4">
        <Text className="text-gray-700 font-medium mb-2">Password</Text>
        <View className="flex-row items-center border border-gray-300 rounded-lg px-3 py-2">
          <Ionicons name="lock-closed-outline" size={20} color="#9ca3af" />
          <TextInput
            className="flex-1 ml-2 text-gray-800"
            placeholder="Create a password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons 
              name={showPassword ? "eye-off-outline" : "eye-outline"} 
              size={20} 
              color="#9ca3af" 
            />
          </TouchableOpacity>
        </View>
      </View>
      
      <View className="mb-6">
        <Text className="text-gray-700 font-medium mb-2">Confirm Password</Text>
        <View className="flex-row items-center border border-gray-300 rounded-lg px-3 py-2">
          <Ionicons name="lock-closed-outline" size={20} color="#9ca3af" />
          <TextInput
            className="flex-1 ml-2 text-gray-800"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showPassword}
          />
        </View>
      </View>
      
      <Button
        title="Next"
        onPress={handleNextStep}
        fullWidth
      />
    </View>
  );
  
  const renderStep2 = () => (
    <View>
      <View className="mb-4">
        <Text className="text-gray-700 font-medium mb-2">Current Pregnancy Week</Text>
        <View className="flex-row items-center border border-gray-300 rounded-lg px-3 py-2">
          <Ionicons name="calendar-outline" size={20} color="#9ca3af" />
          <TextInput
            className="flex-1 ml-2 text-gray-800"
            placeholder="Enter your current week (1-42)"
            value={pregnancyWeek}
            onChangeText={setPregnancyWeek}
            keyboardType="number-pad"
          />
        </View>
      </View>
      
      <View className="mb-6">
        <Text className="text-gray-700 font-medium mb-2">Expected Due Date</Text>
        <TouchableOpacity 
          className="flex-row items-center border border-gray-300 rounded-lg px-3 py-3"
          onPress={() => setShowDatePicker(true)}
        >
          <Ionicons name="calendar-outline" size={20} color="#9ca3af" />
          <Text className="flex-1 ml-2 text-gray-800">
            {formatDate(dueDate)}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#9ca3af" />
        </TouchableOpacity>
        
        {showDatePicker && (
          <DateTimePicker
            value={dueDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
            minimumDate={new Date()}
          />
        )}
      </View>
      
      <View className="flex-row justify-between mb-6">
        <TouchableOpacity 
          className="flex-row items-center"
          onPress={handlePrevStep}
        >
          <Ionicons name="arrow-back" size={20} color="#ec4899" />
          <Text className="text-primary-500 font-medium ml-1">Back</Text>
        </TouchableOpacity>
        
        <Button
          title="Create Account"
          onPress={handleRegister}
          isLoading={isLoading}
          style={{ width: '70%' }}
        />
      </View>
    </View>
  );
  
  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View className="px-6 pt-6">
            <TouchableOpacity 
              className="w-10 h-10 items-center justify-center"
              onPress={() => navigation.navigate('Login')}
            >
              <Ionicons name="arrow-back" size={24} color="#374151" />
            </TouchableOpacity>
          </View>
          
          {/* Title */}
          <View className="px-6 pt-4 pb-8">
            <Text className="text-2xl font-bold text-gray-800">Create Account</Text>
            <Text className="text-gray-500 mt-2">
              Join MomVital to track and monitor your pregnancy health
            </Text>
          </View>
          
          {/* Progress indicator */}
          <View className="px-6 mb-6 flex-row items-center">
            <View className={`h-2 rounded-full flex-1 ${currentStep >= 1 ? 'bg-primary-500' : 'bg-gray-200'}`} />
            <View className="w-2" />
            <View className={`h-2 rounded-full flex-1 ${currentStep >= 2 ? 'bg-primary-500' : 'bg-gray-200'}`} />
          </View>
          
          {/* Form */}
          <View className="px-6">
            {currentStep === 1 ? renderStep1() : renderStep2()}
          </View>
          
          {/* Sign in link */}
          <View className="flex-row justify-center mt-auto mb-8">
            <Text className="text-gray-600">Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text className="text-primary-500 font-medium">Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen; 