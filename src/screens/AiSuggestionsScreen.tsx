import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
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
import { mockAiSuggestions } from '../utils/mockData';
import LoadingIndicator from '../components/LoadingIndicator';

type AiSuggestionsScreenRouteProp = RouteProp<RootStackParamList, 'AiSuggestions'>;
type AiSuggestionsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AiSuggestions'>;

// This would be replaced with an actual API call in the future
const fetchSuggestions = async (scanId?: string) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return mock data
  return mockAiSuggestions;
};

const AiSuggestionsScreen: React.FC = () => {
  const route = useRoute<AiSuggestionsScreenRouteProp>();
  const navigation = useNavigation<AiSuggestionsScreenNavigationProp>();
  const scanId = route.params?.scanId;
  
  const [suggestions, setSuggestions] = useState(mockAiSuggestions);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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

  // Get unique categories from suggestions
  const categories = [...new Set(suggestions.map(suggestion => suggestion.category))];

  // Filter suggestions by selected category
  const filteredSuggestions = selectedCategory
    ? suggestions.filter(suggestion => suggestion.category === selectedCategory)
    : suggestions;

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(selectedCategory === category ? null : category);
  };

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
        {/* Categories Filter */}
        <Typography variant="h3" color={theme.colors.primary} marginBottom="sm">
          Filter by Category
        </Typography>
        
        <CategoriesContainer horizontal showsHorizontalScrollIndicator={false}>
          {categories.map(category => (
            <CategoryButton 
              key={category} 
              onPress={() => handleCategorySelect(category)}
              isSelected={selectedCategory === category}
            >
              {getCategoryIcon(category)}
              <Typography 
                variant="body2" 
                color={selectedCategory === category ? theme.colors.white : theme.colors.text.primary}
                marginTop="xs"
              >
                {category}
              </Typography>
            </CategoryButton>
          ))}
        </CategoriesContainer>

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
            <Typography variant="h3" color={theme.colors.primary} marginTop="lg" marginBottom="sm">
              {selectedCategory || 'All Suggestions'}
            </Typography>
            
            {filteredSuggestions.map(suggestion => (
              <SuggestionCard key={suggestion.id} importance={suggestion.importance}>
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
                
                <Typography variant="h4" color={theme.colors.text.light} marginTop="sm">
                  {suggestion.title}
                </Typography>
                
                <Typography variant="body1" color={theme.colors.text.light} marginTop="sm">
                  {suggestion.description}
                </Typography>
                
                <SuggestionFooter>
                  <Typography variant="caption" color={theme.colors.text.light}>
                    {new Date(suggestion.timestamp).toLocaleDateString()}
                  </Typography>
                  
                  <TouchableOpacity>
                    <Ionicons name="bookmark-outline" size={24} color={theme.colors.white} />
                  </TouchableOpacity>
                </SuggestionFooter>
              </SuggestionCard>
            ))}
            
            {filteredSuggestions.length === 0 && (
              <EmptyStateContainer>
                <Ionicons name="search" size={48} color={theme.colors.lightGray} />
                <Typography variant="body1" align="center" marginTop="md">
                  No suggestions found for this category.
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

const CategoriesContainer = styled(ScrollView)`
  margin-bottom: ${theme.spacing.md}px;
`;

const CategoryButton = styled(TouchableOpacity)<{ isSelected: boolean }>`
  padding: ${theme.spacing.sm}px ${theme.spacing.md}px;
  background-color: ${({ isSelected }) => isSelected ? theme.colors.primary : theme.colors.background};
  border-radius: ${theme.borderRadius.md}px;
  margin-right: ${theme.spacing.sm}px;
  align-items: center;
  justify-content: center;
  min-width: 100px;
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

const SuggestionCard = styled(Card)<{ importance: string }>`
  background-color: ${({ importance }) => {
    if (importance === 'High') return theme.colors.primaryDark;
    if (importance === 'Medium') return theme.colors.primary;
    return theme.colors.primaryLight;
  }};
  margin-bottom: ${theme.spacing.md}px;
`;

const SuggestionHeader = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
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
`;

const SuggestionFooter = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: ${theme.spacing.md}px;
  padding-top: ${theme.spacing.sm}px;
  border-top-width: 1px;
  border-top-color: rgba(255, 255, 255, 0.2);
`;

const ScanButtonContainer = styled(View)`
  margin-top: ${theme.spacing.lg}px;
`;

export default AiSuggestionsScreen; 