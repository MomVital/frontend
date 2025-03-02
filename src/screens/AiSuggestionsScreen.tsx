import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import styled from 'styled-components/native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

import Container from '../components/Container';
import Typography from '../components/Typography';
import Card from '../components/Card';
import Button from '../components/Button';
import { theme } from '../theme/theme';
import { RootStackParamList } from '../navigation/types';
import LoadingIndicator from '../components/LoadingIndicator';
import { getAiSuggestions, AiSuggestionResponse, AnalysisResponse } from '../utils/apiService';

type AiSuggestionsScreenRouteProp = RouteProp<RootStackParamList, 'AiSuggestions'>;
type AiSuggestionsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AiSuggestions'>;

// Flag to toggle between mock data and real API data
const USE_MOCK_DATA = true;

// Enhanced mock data with more comprehensive suggestions
const enhancedMockSuggestions = [
  {
    id: '1',
    category: 'Stress Management',
    title: 'Reduce Stress with Mindfulness',
    description: 'Your recent scan shows elevated cortisol levels. Try practicing mindfulness meditation for 10 minutes twice daily. Research shows this can reduce stress hormones by up to 23% in pregnant women.',
    importance: 'Medium',
    timestamp: '2025-03-02T14:30:00Z',
  },
  {
    id: '2',
    category: 'Physical Activity',
    title: 'Prenatal Yoga Benefits',
    description: 'Based on your heart rate variability and stress patterns, prenatal yoga would be particularly beneficial. Consider joining a class twice weekly or following online sessions designed specifically for your second trimester.',
    importance: 'High',
    timestamp: '2025-03-02T10:15:00Z',
  },
  {
    id: '3',
    category: 'Nutrition',
    title: 'Iron-Rich Foods for Energy',
    description: 'Your scan indicates slightly low hemoglobin levels. Increase your intake of iron-rich foods like spinach, lentils, and lean red meat. Pair these with vitamin C sources to improve absorption. This can help prevent pregnancy-related anemia and boost your energy levels.',
    importance: 'Medium',
    timestamp: '2025-03-02T16:45:00Z',
  },
  {
    id: '4',
    category: 'Sleep',
    title: 'Optimize Sleep Position',
    description: 'Your sleep data shows frequent position changes. Try sleeping on your left side with a pregnancy pillow between your knees and supporting your belly. This position maximizes blood flow to your baby and kidneys, potentially improving your sleep quality by 30%.',
    importance: 'Low',
    timestamp: '2025-03-02T08:20:00Z',
  }
];

// Mock analysis data for testing
const mockAnalysisData: AnalysisResponse = {
  timesES: [1, 2, 3, 4, 5],
  bpmES: [75, 78, 80, 82, 79],
  nni_seq: [800, 810, 790, 805, 795],
  hrv_results: {
    sdnn: 45,
    rmssd: 42,
    pnn50: 30,
    lf: 1200,
    hf: 900,
    lf_hf_ratio: 1.33
  },
  week: 24
};

// This would be replaced with an actual API call in the future
const fetchSuggestions = async (scanId?: string) => {
  if (USE_MOCK_DATA) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Get AI suggestions using our API service
    const historyResults = "Heart Rate: Normal\nHRV: Good\nStress: Medium\nEmotional: Balanced";
    const aiSuggestions = await getAiSuggestions(mockAnalysisData, historyResults);
    
    // Convert to the format expected by the UI
    return [
      {
        id: '1',
        category: 'Stress Management',
        title: 'Stress Management Recommendation',
        description: aiSuggestions.stress_management || enhancedMockSuggestions[0].description,
        importance: 'Medium',
        timestamp: new Date().toISOString(),
      },
      {
        id: '2',
        category: 'Physical Activity',
        title: 'Physical Activity Recommendation',
        description: aiSuggestions.physical_activity || enhancedMockSuggestions[1].description,
        importance: 'High',
        timestamp: new Date().toISOString(),
      },
      {
        id: '3',
        category: 'Nutrition',
        title: 'Nutrition Recommendation',
        description: aiSuggestions.nutrition || enhancedMockSuggestions[2].description,
        importance: 'Medium',
        timestamp: new Date().toISOString(),
      },
      {
        id: '4',
        category: 'Sleep',
        title: 'Sleep Recommendation',
        description: aiSuggestions.sleep || enhancedMockSuggestions[3].description,
        importance: 'Low',
        timestamp: new Date().toISOString(),
      }
    ];
  } else {
    // In a real app, you would fetch the suggestions from your backend
    // For example:
    // const response = await fetch(`http://your-api.com/suggestions/${scanId}`);
    // return await response.json();
    
    // For now, return the enhanced mock data
    return enhancedMockSuggestions;
  }
};

const AiSuggestionsScreen: React.FC = () => {
  const route = useRoute<AiSuggestionsScreenRouteProp>();
  const navigation = useNavigation<AiSuggestionsScreenNavigationProp>();
  const scanId = route.params?.scanId;
  
  const [suggestions, setSuggestions] = useState(enhancedMockSuggestions);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSuggestions = async () => {
      try {
        setLoading(true);
        const data = await fetchSuggestions(scanId);
        setSuggestions(data);
        setError(null);
      } catch (err) {
        setError('Failed to load suggestions. Please try again.');
        console.error('Error fetching suggestions:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSuggestions();
  }, [scanId]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Stress Management':
        return <MaterialCommunityIcons name="meditation" size={24} color={theme.colors.primary} />;
      case 'Physical Activity':
        return <MaterialCommunityIcons name="run" size={24} color={theme.colors.primary} />;
      case 'Nutrition':
        return <MaterialCommunityIcons name="food-apple" size={24} color={theme.colors.primary} />;
      case 'Sleep':
        return <MaterialCommunityIcons name="sleep" size={24} color={theme.colors.primary} />;
      case 'Emotional Wellbeing':
        return <MaterialCommunityIcons name="emoticon-outline" size={24} color={theme.colors.primary} />;
      case 'Hydration':
        return <MaterialCommunityIcons name="water" size={24} color={theme.colors.primary} />;
      case 'Baby Development':
        return <MaterialCommunityIcons name="baby-face-outline" size={24} color={theme.colors.primary} />;
      case 'Posture':
        return <MaterialCommunityIcons name="human-handsup" size={24} color={theme.colors.primary} />;
      default:
        return <MaterialCommunityIcons name="heart-pulse" size={24} color={theme.colors.primary} />;
    }
  };

  if (loading) {
    return <LoadingIndicator fullScreen color={theme.colors.primary} />;
  }

  return (
    <Container scroll>
      <HeaderSection>
        <Typography variant="h2" color={theme.colors.text.light} align="center">
          AI Suggestions
        </Typography>
        <Typography variant="body1" color={theme.colors.text.light} align="center" marginTop="xs">
          Personalized health recommendations
        </Typography>
      </HeaderSection>

      <ContentSection>
        {/* Loading State */}
        {error ? (
          <ErrorContainer>
            <Ionicons name="alert-circle-outline" size={48} color={theme.colors.error} />
            <Typography variant="body1" marginTop="md">
              {error}
            </Typography>
            <Button 
              title="Retry" 
              onPress={() => fetchSuggestions(scanId)} 
              marginTop="md"
            />
          </ErrorContainer>
        ) : (
          <>
            <Typography variant="h3" color={theme.colors.primary} marginTop="lg" marginBottom="md">
              Your Personalized Suggestions
            </Typography>
            
            {suggestions.map(suggestion => (
              <Card 
                key={suggestion.id} 
                variant="elevated"
                borderRadius="lg"
                padding="md"
                marginBottom="md"
              >
                <CardContent importance={suggestion.importance}>
                  <SuggestionHeader>
                    <CategoryBadge>
                      {getCategoryIcon(suggestion.category)}
                      <Typography variant="caption" color={theme.colors.text.primary} marginLeft="xs">
                        {suggestion.category}
                      </Typography>
                    </CategoryBadge>
                    <ImportanceBadge importance={suggestion.importance}>
                      <Typography variant="caption" color={theme.colors.text.light}>
                        {suggestion.importance}
                      </Typography>
                    </ImportanceBadge>
                  </SuggestionHeader>
                  
                  <Typography variant="h4" color={theme.colors.white} marginTop="md" weight="bold">
                    {suggestion.title}
                  </Typography>
                  
                  <DescriptionText>
                    {suggestion.description}
                  </DescriptionText>
                  
                  <SuggestionFooter>
                    <Typography variant="caption" color={theme.colors.white}>
                      {new Date(suggestion.timestamp).toLocaleDateString()}
                    </Typography>
                    
                    <TouchableOpacity>
                      <Ionicons name="bookmark-outline" size={24} color={theme.colors.white} />
                    </TouchableOpacity>
                  </SuggestionFooter>
                </CardContent>
              </Card>
            ))}
            
            {suggestions.length === 0 && (
              <EmptyStateContainer>
                <Ionicons name="search" size={48} color={theme.colors.lightGray} />
                <Typography variant="body1" align="center" marginTop="md">
                  No suggestions available at this time.
                </Typography>
              </EmptyStateContainer>
            )}
          </>
        )}

        {/* Scan Button */}
        <ScanButtonContainer>
          <Button 
            title="New Health Scan" 
            onPress={() => navigation.navigate('Scan')} 
            size="large"
            fullWidth
            marginTop="lg"
            marginBottom="xl"
          />
        </ScanButtonContainer>
      </ContentSection>
    </Container>
  );
};

const HeaderSection = styled(View)`
  background-color: ${theme.colors.primary};
  padding: ${theme.spacing.lg}px;
  padding-top: ${theme.spacing.xl}px;
  border-bottom-left-radius: ${theme.borderRadius.lg}px;
  border-bottom-right-radius: ${theme.borderRadius.lg}px;
`;

const ContentSection = styled(View)`
  padding: ${theme.spacing.md}px;
`;

const ErrorContainer = styled(View)`
  padding: ${theme.spacing.xl}px;
  align-items: center;
  justify-content: center;
`;

const EmptyStateContainer = styled(View)`
  padding: ${theme.spacing.xl}px;
  align-items: center;
  justify-content: center;
`;

const SuggestionHeader = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  margin-bottom: ${theme.spacing.md}px;
`;

const CategoryBadge = styled(View)`
  flex-direction: row;
  align-items: center;
  background-color: ${theme.colors.white};
  padding: ${theme.spacing.xs}px ${theme.spacing.sm}px;
  border-radius: ${theme.borderRadius.round}px;
`;

const ImportanceBadge = styled(View)<{ importance: string }>`
  background-color: ${({ importance }) => {
    if (importance === 'High') return theme.colors.error;
    if (importance === 'Medium') return theme.colors.warning;
    return theme.colors.success;
  }};
  padding: ${theme.spacing.xs}px ${theme.spacing.sm}px;
  border-radius: ${theme.borderRadius.round}px;
  align-self: flex-start;
  margin-left: ${theme.spacing.sm}px;
`;

const SuggestionFooter = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: ${theme.spacing.md}px;
`;

const ScanButtonContainer = styled(View)`
  margin-top: ${theme.spacing.lg}px;
  margin-bottom: ${theme.spacing.xl}px;
`;

const CardContent = styled(View)<{ importance: string }>`
  background-color: ${({ importance }) => {
    if (importance === 'High') return theme.colors.primaryDark;
    if (importance === 'Medium') return theme.colors.primary;
    return theme.colors.accent;
  }};
  border-radius: ${theme.borderRadius.lg}px;
  padding: ${theme.spacing.lg}px;
  width: 100%;
  min-height: 200px;
`;

const DescriptionText = styled(Typography).attrs({
  variant: 'body1',
  color: theme.colors.white,
  marginTop: 'md',
})`
  line-height: 22px;
  opacity: 0.9;
  letter-spacing: 0.3px;
`;

export default AiSuggestionsScreen; 