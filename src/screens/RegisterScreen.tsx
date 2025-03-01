import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../App';

type RegisterScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

const RegisterScreen: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigation = useNavigation<RegisterScreenNavigationProp>();

  const handleRegister = () => {
    console.log('Register pressed with:', { name, email, password, confirmPassword });
    // In a real app, you would validate and register here
    // For now, we'll just navigate to the Main screen
    // @ts-ignore - Navigating to a screen outside the auth stack
    navigation.reset({
      index: 0,
      routes: [{ name: 'Main' }],
    });
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="flex-1 p-6 justify-center">
            <View className="items-center mb-8">
              <Image 
                source={require('../../assets/icon.png')}
                className="w-24 h-24"
                resizeMode="contain"
              />
              <Text className="text-3xl font-bold text-primary-600 mt-4">Create Account</Text>
              <Text className="text-lg text-gray-600 mt-2">Join MomVital today</Text>
            </View>
            
            <View className="mb-4">
              <Text className="text-gray-700 mb-2 font-medium">Full Name</Text>
              <TextInput
                className="bg-gray-100 p-4 rounded-lg text-gray-800"
                placeholder="Enter your full name"
                value={name}
                onChangeText={setName}
              />
            </View>
            
            <View className="mb-4">
              <Text className="text-gray-700 mb-2 font-medium">Email</Text>
              <TextInput
                className="bg-gray-100 p-4 rounded-lg text-gray-800"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            
            <View className="mb-4">
              <Text className="text-gray-700 mb-2 font-medium">Password</Text>
              <TextInput
                className="bg-gray-100 p-4 rounded-lg text-gray-800"
                placeholder="Create a password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
            
            <View className="mb-6">
              <Text className="text-gray-700 mb-2 font-medium">Confirm Password</Text>
              <TextInput
                className="bg-gray-100 p-4 rounded-lg text-gray-800"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>
            
            <TouchableOpacity 
              className="bg-primary-500 py-4 rounded-lg items-center mb-4"
              onPress={handleRegister}
            >
              <Text className="text-white font-bold text-lg">Register</Text>
            </TouchableOpacity>
            
            <View className="flex-row justify-center mt-4">
              <Text className="text-gray-600">Already have an account? </Text>
              <TouchableOpacity onPress={handleLogin}>
                <Text className="text-primary-500 font-semibold">Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen; 