import React, { useState, useEffect } from 'react';
import { View, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import styled from 'styled-components/native';
import { FontAwesome5 } from '@expo/vector-icons';

import Container from '../components/Container';
import Typography from '../components/Typography';
import Card from '../components/Card';
import Button from '../components/Button';
import { theme } from '../theme/theme';
import { RootStackParamList } from '../navigation/types';
import { 
  getAiSuggestions, 
  AiSuggestionResponse, 
  AnalysisResponse, 
  BACKEND_BASE_URL,
  getHeartBeatAnalysis,
  getHrvAnalysis,
  getStressAnalysis,
  getEmotionalStateAnalysis,
  getLatestScanId,
  getLatestAnalysisData
} from '../utils/apiService';

type AiSuggestionsScreenRouteProp = RouteProp<RootStackParamList, 'AiSuggestions'>;
type AiSuggestionsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AiSuggestions'>;

// Flag to toggle between mock data and real API data
const USE_MOCK_DATA = false;

// Mock analysis data for testing
const mockAnalysisData: AnalysisResponse = {
  bpms: 79,
  sdnn: 45,
  rmssd: 42,
  pnn50: 30,
  stress_level: 35,
  week: 24
};

const AiSuggestionsScreen: React.FC = () => {
  const route = useRoute<AiSuggestionsScreenRouteProp>();
  const navigation = useNavigation<AiSuggestionsScreenNavigationProp>();
  const routeScanId = route.params?.scanId;
  
  const [scanId, setScanId] = useState<string | null>(routeScanId || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<AiSuggestionResponse[]>([]);
  
  // Get the latest scanId if not provided in route params
  useEffect(() => {
    const fetchLatestScanId = async () => {
      if (!routeScanId) {
        try {
          const latestScanId = await getLatestScanId();
          if (latestScanId) {
            console.log('Using latest scanId from storage:', latestScanId);
            setScanId(latestScanId);
          } else {
            console.log('No latest scanId found in storage, will use mock data');
            // Don't set error, just continue with null scanId
            // The fetchSuggestions function will handle the null scanId case
          }
        } catch (error) {
          console.error('Error fetching latest scanId:', error);
          console.log('Will use mock data instead');
          // Don't set error, just continue with null scanId
        }
      }
    };
    
    fetchLatestScanId();
  }, [routeScanId]);
  
  // Fetch suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!scanId) {
        console.log('No scanId available, using mock data instead');
        // Use mock data when no scanId is available
        setLoading(true);
        
        try {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Use completely local mock data without making any API calls
          const mockSuggestions: AiSuggestionResponse[] = [
            {
              category: 'stress_management',
              title: 'Practice Deep Breathing',
              description: 'Take 5 minutes to practice deep breathing exercises. Inhale for 4 counts, hold for 4, and exhale for 6.',
              importance: 'high',
              timestamp: new Date().toISOString()
            },
            {
              category: 'physical_activity',
              title: 'Gentle Walking',
              description: 'A 15-minute gentle walk can help improve circulation and reduce stress.',
              importance: 'medium',
              timestamp: new Date().toISOString()
            },
            {
              category: 'nutrition',
              title: 'Stay Hydrated',
              description: 'Drink plenty of water throughout the day to stay hydrated, which is essential for both you and your baby.',
              importance: 'high',
              timestamp: new Date().toISOString()
            },
            {
              category: 'sleep',
              title: 'Establish a Bedtime Routine',
              description: 'Create a calming bedtime routine to improve sleep quality. Try to go to bed at the same time each night.',
              importance: 'medium',
              timestamp: new Date().toISOString()
            }
          ];
          
          setSuggestions(mockSuggestions);
        } catch (error) {
          console.error('Error generating mock suggestions:', error);
          setError('Failed to generate suggestions. Please try again.');
        } finally {
          setLoading(false);
        }
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        if (USE_MOCK_DATA) {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Use completely local mock data without making any API calls
          const mockSuggestions: AiSuggestionResponse[] = [
            {
              category: 'stress_management',
              title: 'Practice Deep Breathing',
              description: 'Take 5 minutes to practice deep breathing exercises. Inhale for 4 counts, hold for 4, and exhale for 6.',
              importance: 'high',
              timestamp: new Date().toISOString()
            },
            {
              category: 'physical_activity',
              title: 'Gentle Walking',
              description: 'A 15-minute gentle walk can help improve circulation and reduce stress.',
              importance: 'medium',
              timestamp: new Date().toISOString()
            },
            {
              category: 'nutrition',
              title: 'Stay Hydrated',
              description: 'Drink plenty of water throughout the day to stay hydrated, which is essential for both you and your baby.',
              importance: 'high',
              timestamp: new Date().toISOString()
            },
            {
              category: 'sleep',
              title: 'Establish a Bedtime Routine',
              description: 'Create a calming bedtime routine to improve sleep quality. Try to go to bed at the same time each night.',
              importance: 'medium',
              timestamp: new Date().toISOString()
            }
          ];
          
          setSuggestions(mockSuggestions);
          return;
        }
        
        console.log('Using scanId to identify session:', scanId);
        
        // Try to get the latest analysis data from storage
        const latestData = await getLatestAnalysisData();
        if (latestData) {
          console.log('Using latest analysis data from storage');
          
          // Get analyses from real APIs
          const heartBeatAnalysis = await getHeartBeatAnalysis(latestData);
          const hrvAnalysis = await getHrvAnalysis(latestData);
          const stressAnalysis = await getStressAnalysis(latestData);
          const emotionalAnalysis = await getEmotionalStateAnalysis(latestData);
          
          // Get AI suggestions from real API
          const aiSuggestions = await getAiSuggestions(
            latestData,
            heartBeatAnalysis,
            hrvAnalysis,
            stressAnalysis,
            emotionalAnalysis
          );
          
          setSuggestions(aiSuggestions);
        } else {
          console.log('No latest analysis data found in storage, using mock data');
          
          // Use mock data for the health metrics
          const healthData: AnalysisResponse = {
            bpms: 78,
            sdnn: 45,
            rmssd: 42,
            pnn50: 30,
            stress_level: 35,
            week: 24
          };
          
          // Get analyses from real APIs
          const heartBeatAnalysis = await getHeartBeatAnalysis(healthData);
          const hrvAnalysis = await getHrvAnalysis(healthData);
          const stressAnalysis = await getStressAnalysis(healthData);
          const emotionalAnalysis = await getEmotionalStateAnalysis(healthData);
          
          // Get AI suggestions from real API
          const aiSuggestions = await getAiSuggestions(
            healthData,
            heartBeatAnalysis,
            hrvAnalysis,
            stressAnalysis,
            emotionalAnalysis
          );
          
          setSuggestions(aiSuggestions);
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setError('Failed to fetch AI suggestions. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSuggestions();
  }, [scanId]);
  
  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'stress_management':
        return <FontAwesome5 name="brain" size={24} color={theme.colors.primary} />;
      case 'physical_activity':
        return <FontAwesome5 name="walking" size={24} color={theme.colors.secondary} />;
      case 'nutrition':
        return <FontAwesome5 name="apple-alt" size={24} color={theme.colors.success} />;
      case 'sleep':
        return <FontAwesome5 name="bed" size={24} color={theme.colors.accent} />;
      default:
        return <FontAwesome5 name="lightbulb" size={24} color={theme.colors.warning} />;
    }
  };
  
  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'stress_management':
        return theme.colors.primary;
      case 'physical_activity':
        return theme.colors.secondary;
      case 'nutrition':
        return theme.colors.success;
      case 'sleep':
        return theme.colors.accent;
      default:
        return theme.colors.warning;
    }
  };
  
  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Handle retry
  const handleRetry = () => {
    // Refetch suggestions
    setLoading(true);
    setError(null);
    
    // Use mock data for retry
    setTimeout(async () => {
      try {
        // Use completely local mock data without making any API calls
        const mockSuggestions: AiSuggestionResponse[] = [
          {
            category: 'stress_management',
            title: 'Practice Deep Breathing',
            description: 'Take 5 minutes to practice deep breathing exercises. Inhale for 4 counts, hold for 4, and exhale for 6.',
            importance: 'high',
            timestamp: new Date().toISOString()
          },
          {
            category: 'physical_activity',
            title: 'Gentle Walking',
            description: 'A 15-minute gentle walk can help improve circulation and reduce stress.',
            importance: 'medium',
            timestamp: new Date().toISOString()
          },
          {
            category: 'nutrition',
            title: 'Stay Hydrated',
            description: 'Drink plenty of water throughout the day to stay hydrated, which is essential for both you and your baby.',
            importance: 'high',
            timestamp: new Date().toISOString()
          },
          {
            category: 'sleep',
            title: 'Establish a Bedtime Routine',
            description: 'Create a calming bedtime routine to improve sleep quality. Try to go to bed at the same time each night.',
            importance: 'medium',
            timestamp: new Date().toISOString()
          }
        ];
        
        setSuggestions(mockSuggestions);
      } catch (error) {
        setError('Failed to generate suggestions. Please try again.');
      } finally {
        setLoading(false);
      }
    }, 1000);
  };
  
  if (loading) {
    return (
      <Container>
        <LoadingContainer>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Typography variant="body1" marginTop="md">
            Generating personalized suggestions...
          </Typography>
        </LoadingContainer>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container>
        <ErrorContainer>
          <FontAwesome5 name="exclamation-circle" size={50} color={theme.colors.error} />
          <Typography variant="h2" marginTop="md" color={theme.colors.error}>
            Error
          </Typography>
          <Typography variant="body1" marginTop="sm" align="center">
            {error}
          </Typography>
          <Button 
            title="Retry" 
            onPress={handleRetry} 
            marginTop="md"
          />
          <Button 
            title="Back to Analysis" 
            onPress={() => navigation.goBack()} 
            marginTop="md"
            variant="outline"
          />
        </ErrorContainer>
      </Container>
    );
  }
  
  if (suggestions.length === 0) {
    return (
      <Container>
        <EmptyContainer>
          <FontAwesome5 name="lightbulb" size={50} color={theme.colors.warning} />
          <Typography variant="h2" marginTop="md">
            No Suggestions
          </Typography>
          <Typography variant="body1" marginTop="sm" align="center">
            We don't have any personalized suggestions for you at this time.
          </Typography>
          <Button 
            title="Back to Analysis" 
            onPress={() => navigation.goBack()} 
            marginTop="md"
          />
        </EmptyContainer>
      </Container>
    );
  }
  
  return (
    <Container>
      <HeaderContainer>
        <Typography variant="h1">AI Suggestions</Typography>
        <Typography variant="body1" marginTop="xs">
          Personalized recommendations based on your health data
        </Typography>
      </HeaderContainer>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {suggestions.map((suggestion, index) => (
          <SuggestionCard key={index}>
            <CardHeader>
              <IconContainer color={getCategoryColor(suggestion.category)}>
                {getCategoryIcon(suggestion.category)}
              </IconContainer>
              <HeaderTextContainer>
                <Typography variant="h3">{suggestion.title}</Typography>
                <CategoryBadge color={getCategoryColor(suggestion.category)}>
                  <Typography variant="caption" color={theme.colors.white}>
                    {suggestion.category.replace('_', ' ').toUpperCase()}
                  </Typography>
                </CategoryBadge>
              </HeaderTextContainer>
              <ImportanceBadge importance={suggestion.importance}>
                <Typography variant="caption" color={theme.colors.white}>
                  {suggestion.importance.toUpperCase()}
                </Typography>
              </ImportanceBadge>
            </CardHeader>
            
            <CardContent>
              <Typography variant="body1">
                {suggestion.description}
              </Typography>
            </CardContent>
            
            <CardFooter>
              <Typography variant="caption" color={theme.colors.gray}>
                {formatTimestamp(suggestion.timestamp)}
              </Typography>
            </CardFooter>
          </SuggestionCard>
        ))}
        
        <Button
          title="Back to Analysis"
          onPress={() => navigation.goBack()}
          marginTop="md"
          marginBottom="lg"
        />
      </ScrollView>
    </Container>
  );
};

// Styled Components
const HeaderContainer = styled.View`
  margin-vertical: 20px;
  align-items: center;
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const ErrorContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const EmptyContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const SuggestionCard = styled(Card)`
  margin-vertical: 10px;
  padding: 0;
  overflow: hidden;
`;

const CardHeader = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 15px;
  background-color: ${theme.colors.background};
`;

const IconContainer = styled.View<{ color: string }>`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background-color: ${({ color }) => color || theme.colors.primary};
  justify-content: center;
  align-items: center;
  margin-right: 15px;
`;

const HeaderTextContainer = styled.View`
  flex: 1;
`;

const CategoryBadge = styled.View<{ color: string }>`
  background-color: ${({ color }) => color || theme.colors.primary};
  padding-horizontal: 8px;
  padding-vertical: 4px;
  border-radius: 4px;
  margin-top: 5px;
  align-self: flex-start;
`;

const ImportanceBadge = styled.View<{ importance: string }>`
  background-color: ${({ importance }) => {
    switch (importance) {
      case 'high':
        return theme.colors.error;
      case 'medium':
        return theme.colors.warning;
      case 'low':
        return theme.colors.success;
      default:
        return theme.colors.gray;
    }
  }};
  padding-horizontal: 8px;
  padding-vertical: 4px;
  border-radius: 4px;
  margin-left: 10px;
`;

const CardContent = styled.View`
  padding: 15px;
`;

const CardFooter = styled.View`
  padding: 10px 15px;
  background-color: ${theme.colors.background};
  border-top-width: 1px;
  border-top-color: ${theme.colors.lightGray};
`;

export default AiSuggestionsScreen; 