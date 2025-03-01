import React, { createContext, useState, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

type User = {
  id: string;
  name: string;
  email: string;
  pregnancyWeek: number;
  dueDate: string;
  profilePicture?: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isSignedIn: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string, pregnancyWeek: number, dueDate: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data
const MOCK_USER: User = {
  id: '1',
  name: 'Sarah Johnson',
  email: 'sarah@example.com',
  pregnancyWeek: 24,
  dueDate: '2023-12-15',
  profilePicture: 'https://randomuser.me/api/portraits/women/44.jpg',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const bootstrapAsync = async () => {
      try {
        const userJson = await SecureStore.getItemAsync('user');
        if (userJson) {
          setUser(JSON.parse(userJson));
        }
      } catch (e) {
        console.error('Failed to load user from storage', e);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  const signIn = async (email: string, password: string) => {
    // In a real app, you would validate credentials with your API
    setIsLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, we'll just set the mock user
      await SecureStore.setItemAsync('user', JSON.stringify(MOCK_USER));
      setUser(MOCK_USER);
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (name: string, email: string, password: string, pregnancyWeek: number, dueDate: string) => {
    // In a real app, you would register the user with your API
    setIsLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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
      console.error('Sign up error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await SecureStore.deleteItemAsync('user');
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
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
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isSignedIn: !!user,
        signIn,
        signUp,
        signOut,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 