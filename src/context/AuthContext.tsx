import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

// Define the shape of the user object
interface User {
  id: string;
  name: string;
  email: string;
  pregnancyWeek: number;
  dueDate: string;
  profilePicture?: string;
}

// Define the shape of the context
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isSignedIn: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string, pregnancyWeek: number, dueDate: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  isSignedIn: false,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  updateUser: async () => {},
});

// Mock user data
const MOCK_USER: User = {
  id: '1',
  name: 'Sarah Johnson',
  email: 'sarah@example.com',
  pregnancyWeek: 24,
  dueDate: '2023-12-15',
  profilePicture: 'https://randomuser.me/api/portraits/women/44.jpg',
};

// Create a provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(MOCK_USER); // Set mock user by default
  const [isLoading, setIsLoading] = useState(false);

  // Mock login function
  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // In a real app, you would make an API call here
      console.log('Logging in with:', { email, password });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Set mock user data
      setUser(MOCK_USER);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Mock register function
  const signUp = async (name: string, email: string, password: string, pregnancyWeek: number, dueDate: string) => {
    setIsLoading(true);
    try {
      // In a real app, you would make an API call here
      console.log('Registering with:', { name, email, password, pregnancyWeek, dueDate });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Set mock user data
      const newUser: User = {
        id: '2', // In a real app, this would come from the backend
        name,
        email,
        pregnancyWeek,
        dueDate,
      };
      
      await SecureStore.setItemAsync('user', JSON.stringify(newUser));
      setUser(newUser);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const signOut = async () => {
    setIsLoading(true);
    try {
      await SecureStore.deleteItemAsync('user');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    if (!user) return;
    
    try {
      const updatedUser = { ...user, ...userData };
      await SecureStore.setItemAsync('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isSignedIn: !!user, signIn, signUp, signOut, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a hook to use the auth context
export const useAuth = () => useContext(AuthContext); 