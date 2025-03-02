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

// Additional suggestion templates for variety
const suggestionTemplates = {
  stress: [
    {
      title: 'Reduce Stress with Mindfulness',
      description: 'Your recent scan shows elevated cortisol levels. Try practicing mindfulness meditation for 10 minutes twice daily. Research shows this can reduce stress hormones by up to 23% in pregnant women.'
    },
    {
      title: 'Stress Management Through Breathing',
      description: 'Your heart rate variability indicates increased stress. Practice 4-7-8 breathing (inhale for 4 seconds, hold for 7, exhale for 8) several times daily to activate your parasympathetic nervous system and reduce stress hormones.'
    },
    {
      title: 'Nature Therapy for Stress Reduction',
      description: 'Your stress markers are slightly elevated. Studies show that spending 20-30 minutes in nature daily can reduce cortisol levels by up to 20%. Try a daily walk in a park or garden to improve your mood and reduce pregnancy-related stress.'
    }
  ],
  activity: [
    {
      title: 'Prenatal Yoga Benefits',
      description: 'Based on your heart rate variability and stress patterns, prenatal yoga would be particularly beneficial. Consider joining a class twice weekly or following online sessions designed specifically for your second trimester.'
    },
    {
      title: 'Swimming for Pregnancy Fitness',
      description: 'Your cardiovascular metrics suggest you would benefit from low-impact exercise. Swimming is ideal during pregnancy as it supports your weight, reduces swelling, and improves circulation without stressing your joints.'
    },
    {
      title: 'Walking Routine Recommendation',
      description: 'Your heart rate data indicates you could benefit from regular moderate exercise. A 20-30 minute walk each morning can improve circulation, reduce swelling, and help maintain healthy blood pressure during your second trimester.'
    }
  ],
  nutrition: [
    {
      title: 'Iron-Rich Foods for Energy',
      description: 'Your scan indicates slightly low hemoglobin levels. Increase your intake of iron-rich foods like spinach, lentils, and lean red meat. Pair these with vitamin C sources to improve absorption. This can help prevent pregnancy-related anemia and boost your energy levels.'
    },
    {
      title: 'Omega-3 for Baby\'s Brain Development',
      description: 'Based on your current health metrics, increasing omega-3 fatty acids would be beneficial. Aim for 2-3 servings of fatty fish like salmon weekly, or consider a DHA supplement to support your baby\'s brain and eye development.'
    },
    {
      title: 'Hydration Strategy',
      description: 'Your physiological data suggests mild dehydration. Aim for at least 10 cups (2.5 liters) of fluid daily. Try keeping a water bottle with you and drinking a full glass with each meal and snack to maintain optimal amniotic fluid levels.'
    }
  ],
  sleep: [
    {
      title: 'Optimize Sleep Position',
      description: 'Your sleep data shows frequent position changes. Try sleeping on your left side with a pregnancy pillow between your knees and supporting your belly. This position maximizes blood flow to your baby and kidneys, potentially improving your sleep quality by 30%.'
    },
    {
      title: 'Evening Routine for Better Sleep',
      description: 'Your heart rate variability indicates disrupted sleep patterns. Establish a calming bedtime routine: dim lights 1-2 hours before bed, avoid screens, try a warm bath with lavender, and practice gentle stretching to improve sleep quality during pregnancy.'
    },
    {
      title: 'Managing Nighttime Discomfort',
      description: 'Your sleep metrics show interrupted sleep. To reduce nighttime awakening, avoid large meals 3 hours before bedtime, elevate your upper body slightly with pillows if experiencing heartburn, and use a humidifier if nasal congestion is disrupting your sleep.'
    }
  ]
};

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

// Generate random variation within a range
const getRandomVariation = (base: number, range: number): number => {
  return Math.round(base + (Math.random() * range * 2 - range));
};

// Generate fresh suggestions with random variations
const generateFreshSuggestions = () => {
  // Get current timestamp
  const now = new Date().toISOString();
  
  // Randomly select templates
  const stressTemplate = suggestionTemplates.stress[Math.floor(Math.random() * suggestionTemplates.stress.length)];
  const activityTemplate = suggestionTemplates.activity[Math.floor(Math.random() * suggestionTemplates.activity.length)];
  const nutritionTemplate = suggestionTemplates.nutrition[Math.floor(Math.random() * suggestionTemplates.nutrition.length)];
  const sleepTemplate = suggestionTemplates.sleep[Math.floor(Math.random() * suggestionTemplates.sleep.length)];
  
  // Randomly assign importance levels
  const importanceLevels = ['Low', 'Medium', 'High'];
  const getRandomImportance = () => importanceLevels[Math.floor(Math.random() * importanceLevels.length)];
  
  return [
    {
      id: '1',
      category: 'Stress Management',
      title: stressTemplate.title,
      description: stressTemplate.description,
      importance: getRandomImportance(),
      timestamp: now,
    },
    {
      id: '2',
      category: 'Physical Activity',
      title: activityTemplate.title,
      description: activityTemplate.description,
      importance: getRandomImportance(),
      timestamp: now,
    },
    {
      id: '3',
      category: 'Nutrition',
      title: nutritionTemplate.title,
      description: nutritionTemplate.description,
      importance: getRandomImportance(),
      timestamp: now,
    },
    {
      id: '4',
      category: 'Sleep',
      title: sleepTemplate.title,
      description: sleepTemplate.description,
      importance: getRandomImportance(),
      timestamp: now,
    }
  ];
};

// This would be replaced with an actual API call in the future
const fetchSuggestions = async (scanId?: string) => {
  if (USE_MOCK_DATA) {
    // Simulate API call delay with random duration (1-3 seconds)
    const delay = 1000 + Math.random() * 2000;
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Generate fresh suggestions
    const freshSuggestions = generateFreshSuggestions();
    
    // Get AI suggestions using our API service
    const historyResults = "Heart Rate: Normal\nHRV: Good\nStress: Medium\nEmotional: Balanced";
    const aiSuggestions = await getAiSuggestions(mockAnalysisData, historyResults);
    
    // Merge AI suggestions with our templates if available
    if (aiSuggestions.stress_management || aiSuggestions.physical_activity || 
        aiSuggestions.nutrition || aiSuggestions.sleep) {
      
      if (aiSuggestions.stress_management) {
        freshSuggestions[0].description = aiSuggestions.stress_management;
      }
      
      if (aiSuggestions.physical_activity) {
        freshSuggestions[1].description = aiSuggestions.physical_activity;
      }
      
      if (aiSuggestions.nutrition) {
        freshSuggestions[2].description = aiSuggestions.nutrition;
      }
      
      if (aiSuggestions.sleep) {
        freshSuggestions[3].description = aiSuggestions.sleep;
      }
    }
    
    return freshSuggestions;
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