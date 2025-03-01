import React from 'react';
import { View, ScrollView, Dimensions } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import styled from 'styled-components/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import Container from '../components/Container';
import Typography from '../components/Typography';
import Card from '../components/Card';
import Button from '../components/Button';
import { theme } from '../theme/theme';
import { RootStackParamList } from '../navigation/types';
import { mockHealthData } from '../utils/mockData';

type AnalysisScreenRouteProp = RouteProp<RootStackParamList, 'Analysis'>;
type AnalysisScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Analysis'>;

const { width } = Dimensions.get('window');

const AnalysisScreen: React.FC = () => {
  const route = useRoute<AnalysisScreenRouteProp>();
  const navigation = useNavigation<AnalysisScreenNavigationProp>();
  const scanId = route.params?.scanId;

  const handleViewSuggestions = () => {
    navigation.navigate('AiSuggestions', { scanId });
  };

  return (
    <Container scroll>
      <HeaderSection>
        <Typography variant="h2" color={theme.colors.text.light} align="center">
          Health Analysis
        </Typography>
        <Typography variant="body1" color={theme.colors.text.light} align="center" marginTop="xs">
          {scanId ? 'Based on your recent scan' : 'Your current health status'}
        </Typography>
      </HeaderSection>

      <ContentSection>
        {/* Heart Rate Section */}
        <SectionCard>
          <SectionHeader>
            <IconContainer>
              <MaterialCommunityIcons name="heart-pulse" size={24} color={theme.colors.primary} />
            </IconContainer>
            <Typography variant="h3" marginLeft="sm">
              Heart Rate
            </Typography>
          </SectionHeader>

          <MetricRow>
            <MetricItem>
              <Typography variant="h2" color={theme.colors.primary}>
                {mockHealthData.heartRate.current}
              </Typography>
              <Typography variant="caption">Current BPM</Typography>
            </MetricItem>
            <MetricDivider />
            <MetricItem>
              <Typography variant="body1">
                <Typography variant="body1" weight="bold">Min:</Typography> {mockHealthData.heartRate.min}
              </Typography>
              <Typography variant="body1">
                <Typography variant="body1" weight="bold">Max:</Typography> {mockHealthData.heartRate.max}
              </Typography>
              <Typography variant="body1">
                <Typography variant="body1" weight="bold">Avg:</Typography> {mockHealthData.heartRate.average}
              </Typography>
            </MetricItem>
          </MetricRow>

          <Typography variant="body1" marginTop="md">
            Your heart rate is within the normal range for pregnant women in their second trimester. 
            The slight elevation is normal and corresponds with your activity levels.
          </Typography>
        </SectionCard>

        {/* HRV Section */}
        <SectionCard>
          <SectionHeader>
            <IconContainer>
              <MaterialCommunityIcons name="heart" size={24} color={theme.colors.primary} />
            </IconContainer>
            <Typography variant="h3" marginLeft="sm">
              Heart Rate Variability
            </Typography>
          </SectionHeader>

          <MetricRow>
            <MetricItem>
              <Typography variant="h2" color={theme.colors.primary}>
                {mockHealthData.hrv.current}
              </Typography>
              <Typography variant="caption">Current ms</Typography>
            </MetricItem>
            <MetricDivider />
            <MetricItem>
              <Typography variant="body1">
                <Typography variant="body1" weight="bold">Min:</Typography> {mockHealthData.hrv.min}
              </Typography>
              <Typography variant="body1">
                <Typography variant="body1" weight="bold">Max:</Typography> {mockHealthData.hrv.max}
              </Typography>
              <Typography variant="body1">
                <Typography variant="body1" weight="bold">Avg:</Typography> {mockHealthData.hrv.average}
              </Typography>
            </MetricItem>
          </MetricRow>

          <Typography variant="body1" marginTop="md">
            Your HRV indicates a good balance between rest and activity. 
            This suggests your autonomic nervous system is functioning well during pregnancy.
          </Typography>
        </SectionCard>

        {/* Stress Section */}
        <SectionCard>
          <SectionHeader>
            <IconContainer>
              <MaterialCommunityIcons name="lightning-bolt" size={24} color={theme.colors.primary} />
            </IconContainer>
            <Typography variant="h3" marginLeft="sm">
              Stress Level
            </Typography>
          </SectionHeader>

          <StressLevelIndicator>
            <StressBar>
              <StressLevel level={mockHealthData.stress.level} />
            </StressBar>
            <StressLabels>
              <Typography variant="caption">Low</Typography>
              <Typography variant="caption">Medium</Typography>
              <Typography variant="caption">High</Typography>
            </StressLabels>
          </StressLevelIndicator>

          <Typography variant="body1" marginTop="md">
            Your current stress level is {mockHealthData.stress.current.toLowerCase()}. 
            We've noticed a pattern of increased stress levels in the mid-afternoon. 
            This could be related to work activities or fatigue.
          </Typography>
        </SectionCard>

        {/* Emotional State */}
        <SectionCard>
          <SectionHeader>
            <IconContainer>
              <MaterialCommunityIcons name="emoticon-outline" size={24} color={theme.colors.primary} />
            </IconContainer>
            <Typography variant="h3" marginLeft="sm">
              Emotional State
            </Typography>
          </SectionHeader>

          <EmotionContainer>
            <EmotionBubble emotion={mockHealthData.emotion.current}>
              <Typography variant="h3" color={theme.colors.text.light} align="center">
                {mockHealthData.emotion.current}
              </Typography>
            </EmotionBubble>
          </EmotionContainer>

          <Typography variant="body1" marginTop="md">
            Your emotional state has been predominantly positive, with occasional periods of anxiety. 
            This is common during pregnancy, but do reach out to your healthcare provider if anxiety persists.
          </Typography>
        </SectionCard>

        <Button 
          title="View AI Suggestions" 
          onPress={handleViewSuggestions} 
          size="large"
          fullWidth
          marginTop="lg"
          marginBottom="xl"
        />
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

const SectionCard = styled(Card)`
  margin-top: ${theme.spacing.lg}px;
`;

const SectionHeader = styled(View)`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${theme.spacing.md}px;
`;

const IconContainer = styled(View)`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: ${theme.colors.background};
  justify-content: center;
  align-items: center;
`;

const MetricRow = styled(View)`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${theme.spacing.md}px;
`;

const MetricItem = styled(View)`
  flex: 1;
  align-items: center;
`;

const MetricDivider = styled(View)`
  width: 1px;
  height: 50px;
  background-color: ${theme.colors.lightGray};
  margin-horizontal: ${theme.spacing.md}px;
`;

const StressLevelIndicator = styled(View)`
  margin-vertical: ${theme.spacing.md}px;
`;

const StressBar = styled(View)`
  height: 20px;
  background-color: ${theme.colors.lightGray};
  border-radius: ${theme.borderRadius.round}px;
  overflow: hidden;
`;

const StressLevel = styled(View)<{ level: number }>`
  height: 100%;
  width: ${({ level }) => `${level}%`};
  background-color: ${({ level }) => {
    if (level < 40) return theme.colors.success;
    if (level < 70) return theme.colors.warning;
    return theme.colors.error;
  }};
  border-radius: ${theme.borderRadius.round}px;
`;

const StressLabels = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  margin-top: ${theme.spacing.xs}px;
`;

const EmotionContainer = styled(View)`
  align-items: center;
  margin-vertical: ${theme.spacing.md}px;
`;

const EmotionBubble = styled(View)<{ emotion: string }>`
  width: 120px;
  height: 120px;
  border-radius: 60px;
  justify-content: center;
  align-items: center;
  background-color: ${({ emotion }) => {
    switch (emotion.toLowerCase()) {
      case 'happy':
        return theme.colors.success;
      case 'calm':
        return theme.colors.primary;
      case 'anxious':
        return theme.colors.warning;
      case 'stressed':
        return theme.colors.error;
      default:
        return theme.colors.secondary;
    }
  }};
`;

export default AnalysisScreen; 