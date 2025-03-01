import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../App';

type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const handleLogin = () => {
    console.log('Login pressed with:', { email, password });
    // In a real app, you would validate and authenticate here
    // For now, we'll just navigate to the Main screen
    // @ts-ignore - Navigating to a screen outside the auth stack
    navigation.reset({
      index: 0,
      routes: [{ name: 'Main' }],
    });
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="flex-1 p-6 justify-center">
            <View className="items-center mb-10">
              <Image 
                source={require('../../assets/icon.png')}
                className="w-32 h-32"
                resizeMode="contain"
              />
              <Text className="text-3xl font-bold text-primary-600 mt-4">MomVital</Text>
              <Text className="text-lg text-gray-600 mt-2">Welcome back!</Text>
            </View>
            
            <View className="mb-6">
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
            
            <View className="mb-8">
              <Text className="text-gray-700 mb-2 font-medium">Password</Text>
              <TextInput
                className="bg-gray-100 p-4 rounded-lg text-gray-800"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <TouchableOpacity className="self-end mt-2">
                <Text className="text-primary-500">Forgot Password?</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              className="bg-primary-500 py-4 rounded-lg items-center mb-4"
              onPress={handleLogin}
            >
              <Text className="text-white font-bold text-lg">Login</Text>
            </TouchableOpacity>
            
            <View className="flex-row justify-center mt-6">
              <Text className="text-gray-600">Don't have an account? </Text>
              <TouchableOpacity onPress={handleRegister}>
                <Text className="text-primary-500 font-semibold">Register</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen; 