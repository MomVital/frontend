import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { AuthStackParamList, RootStackParamList } from '../../App';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList> & 
  NativeStackNavigationProp<RootStackParamList>;

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { signIn, isLoading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }
    
    try {
      await signIn(email, password);
      navigation.navigate('Main');
    } catch (error) {
      Alert.alert('Login Failed', 'Invalid email or password. Please try again.');
    }
  };
  
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
          {/* Header with logo and welcome text */}
          <View className="items-center mt-10 mb-6">
            <View className="w-20 h-20 bg-primary-100 rounded-full items-center justify-center mb-4">
              <Ionicons name="heart" size={40} color="#ec4899" />
            </View>
            <Text className="text-2xl font-bold text-gray-800">Welcome to MomVital</Text>
            <Text className="text-gray-500 text-center px-10 mt-2">
              Your AI-powered pregnancy health companion
            </Text>
          </View>
          
          {/* Login form */}
          <View className="px-6 pt-6">
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
            
            <View className="mb-6">
              <Text className="text-gray-700 font-medium mb-2">Password</Text>
              <View className="flex-row items-center border border-gray-300 rounded-lg px-3 py-2">
                <Ionicons name="lock-closed-outline" size={20} color="#9ca3af" />
                <TextInput
                  className="flex-1 ml-2 text-gray-800"
                  placeholder="Enter your password"
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
            
            <Button
              title="Sign In"
              onPress={handleLogin}
              isLoading={isLoading}
              fullWidth
            />
            
            <TouchableOpacity className="mt-4 self-center">
              <Text className="text-primary-500 font-medium">Forgot Password?</Text>
            </TouchableOpacity>
            
            <View className="flex-row items-center my-6">
              <View className="flex-1 h-px bg-gray-300" />
              <Text className="mx-4 text-gray-500">or</Text>
              <View className="flex-1 h-px bg-gray-300" />
            </View>
            
            {/* Social login buttons */}
            <View className="flex-row justify-between mb-6">
              <TouchableOpacity className="flex-1 flex-row items-center justify-center py-3 bg-[#4267B2] rounded-lg mr-2">
                <Ionicons name="logo-facebook" size={20} color="white" />
                <Text className="text-white font-medium ml-2">Facebook</Text>
              </TouchableOpacity>
              
              <TouchableOpacity className="flex-1 flex-row items-center justify-center py-3 bg-white border border-gray-300 rounded-lg ml-2">
                <Ionicons name="logo-google" size={20} color="#DB4437" />
                <Text className="text-gray-700 font-medium ml-2">Google</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Sign up link */}
          <View className="flex-row justify-center mt-auto mb-8">
            <Text className="text-gray-600">Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text className="text-primary-500 font-medium">Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen; 