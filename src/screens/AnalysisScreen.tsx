import React from 'react';
import { View, ScrollView, Dimensions } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import styled from 'styled-components/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native';

import Container from '../components/Container';
import Typography from '../components/Typography';
import Card from '../components/Card';
import Button from '../components/Button';
import { theme } from '../theme/theme';
import { RootStackParamList } from '../navigation/types';
import { mockHealthData } from '../utils/mockData';
import LoadingIndicator from '../components/LoadingIndicator';

type AnalysisScreenRouteProp = RouteProp<RootStackParamList, 'Analysis'>;
type AnalysisScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Analysis'>;

const { width } = Dimensions.get('window');

// Define normal ranges for each metric
const normalRanges = {
  heartRate: {
    min: 60,
    max: 100,
    pregnantMin: 70,
    pregnantMax: 90,
    unit: 'BPM'
  },
  hrv: {
    min: 20,
    max: 70,
    pregnantMin: 30,
    pregnantMax: 60,
    unit: 'ms'
  }
};

const AnalysisScreen: React.FC = () => {
  const route = useRoute<AnalysisScreenRouteProp>();
  const navigation = useNavigation<AnalysisScreenNavigationProp>();
  const scanId = route.params?.scanId;

  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingIndicator fullScreen color={theme.colors.primary} />;
  }

  // Calculate position percentage for heart rate
  const getHeartRatePosition = () => {
    const { min, max } = normalRanges.heartRate;
    const current = mockHealthData.heartRate.current;
    const range = max - min;
    const position = ((current - min) / range) * 100;
    return Math.max(0, Math.min(100, position));
  };

  // Calculate position percentage for HRV
  const getHrvPosition = () => {
    const { min, max } = normalRanges.hrv;
    const current = mockHealthData.hrv.current;
    const range = max - min;
    const position = ((current - min) / range) * 100;
    return Math.max(0, Math.min(100, position));
  };

  const handleViewSuggestions = () => {
    // Now that AiSuggestions is in the RootStack, we can navigate directly
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

          <CurrentMetricContainer>
            <Typography variant="h1" color={theme.colors.primary} align="center">
              {mockHealthData.heartRate.current}
            </Typography>
            <Typography variant="body1" align="center">
              Current BPM
            </Typography>
          </CurrentMetricContainer>

          <RangeContainer>
            <RangeBar>
              <PregnantRange 
                left={`${(normalRanges.heartRate.pregnantMin - normalRanges.heartRate.min) / (normalRanges.heartRate.max - normalRanges.heartRate.min) * 100}%`} 
                width={`${(normalRanges.heartRate.pregnantMax - normalRanges.heartRate.pregnantMin) / (normalRanges.heartRate.max - normalRanges.heartRate.min) * 100}%`}
              />
              <IndicatorDot position={`${getHeartRatePosition()}%`} />
            </RangeBar>
            <RangeLabels>
              <Typography variant="caption">{normalRanges.heartRate.min}</Typography>
              <Typography variant="caption" color={theme.colors.primary}>Pregnant Normal</Typography>
              <Typography variant="caption">{normalRanges.heartRate.max}</Typography>
            </RangeLabels>
          </RangeContainer>

          <MetricStatsRow>
            <MetricStat>
              <Typography variant="caption" color={theme.colors.gray}>Min</Typography>
              <Typography variant="body1" weight="bold">{mockHealthData.heartRate.min}</Typography>
            </MetricStat>
            <MetricStat>
              <Typography variant="caption" color={theme.colors.gray}>Max</Typography>
              <Typography variant="body1" weight="bold">{mockHealthData.heartRate.max}</Typography>
            </MetricStat>
            <MetricStat>
              <Typography variant="caption" color={theme.colors.gray}>Avg</Typography>
              <Typography variant="body1" weight="bold">{mockHealthData.heartRate.average}</Typography>
            </MetricStat>
          </MetricStatsRow>

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

          <CurrentMetricContainer>
            <Typography variant="h1" color={theme.colors.primary} align="center">
              {mockHealthData.hrv.current}
            </Typography>
            <Typography variant="body1" align="center">
              Current ms
            </Typography>
          </CurrentMetricContainer>

          <RangeContainer>
            <RangeBar>
              <PregnantRange 
                left={`${(normalRanges.hrv.pregnantMin - normalRanges.hrv.min) / (normalRanges.hrv.max - normalRanges.hrv.min) * 100}%`} 
                width={`${(normalRanges.hrv.pregnantMax - normalRanges.hrv.pregnantMin) / (normalRanges.hrv.max - normalRanges.hrv.min) * 100}%`}
              />
              <IndicatorDot position={`${getHrvPosition()}%`} />
            </RangeBar>
            <RangeLabels>
              <Typography variant="caption">{normalRanges.hrv.min}</Typography>
              <Typography variant="caption" color={theme.colors.primary}>Pregnant Normal</Typography>
              <Typography variant="caption">{normalRanges.hrv.max}</Typography>
            </RangeLabels>
          </RangeContainer>

          <MetricStatsRow>
            <MetricStat>
              <Typography variant="caption" color={theme.colors.gray}>Min</Typography>
              <Typography variant="body1" weight="bold">{mockHealthData.hrv.min}</Typography>
            </MetricStat>
            <MetricStat>
              <Typography variant="caption" color={theme.colors.gray}>Max</Typography>
              <Typography variant="body1" weight="bold">{mockHealthData.hrv.max}</Typography>
            </MetricStat>
            <MetricStat>
              <Typography variant="caption" color={theme.colors.gray}>Avg</Typography>
              <Typography variant="body1" weight="bold">{mockHealthData.hrv.average}</Typography>
            </MetricStat>
          </MetricStatsRow>

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

          <CurrentMetricContainer>
            <Typography variant="h1" color={theme.colors.primary} align="center">
              {mockHealthData.stress.current}
            </Typography>
            <Typography variant="body1" align="center">
              Current Level
            </Typography>
          </CurrentMetricContainer>

          <StressLevelIndicator>
            <StressBar>
              <StressLevel level={mockHealthData.stress.level} />
              <StressRangeLabels>
                <StressRangeLabel position="0%">Low</StressRangeLabel>
                <StressRangeLabel position="40%">Medium</StressRangeLabel>
                <StressRangeLabel position="70%">High</StressRangeLabel>
              </StressRangeLabels>
              <StressIndicatorDot position={`${mockHealthData.stress.level}%`} />
            </StressBar>
            <StressLabels>
              <Typography variant="caption">0%</Typography>
              <Typography variant="caption">50%</Typography>
              <Typography variant="caption">100%</Typography>
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

          <CurrentMetricContainer>
            <Typography variant="h1" color={theme.colors.primary} align="center" marginBottom="sm">
              {mockHealthData.emotion.current}
            </Typography>
          </CurrentMetricContainer>

          <EmotionContainer>
            <EmotionBubble emotion={mockHealthData.emotion.current}>
              <Typography variant="h3" color={theme.colors.text.light} align="center">
                {mockHealthData.emotion.current}
              </Typography>
            </EmotionBubble>
          </EmotionContainer>

          <EmotionScaleContainer>
            <EmotionScaleItem emotion="Happy">
              <EmotionDot emotion="Happy" active={mockHealthData.emotion.current === 'Happy'} />
              <Typography variant="caption">Happy</Typography>
            </EmotionScaleItem>
            <EmotionScaleItem emotion="Calm">
              <EmotionDot emotion="Calm" active={mockHealthData.emotion.current === 'Calm'} />
              <Typography variant="caption">Calm</Typography>
            </EmotionScaleItem>
            <EmotionScaleItem emotion="Anxious">
              <EmotionDot emotion="Anxious" active={mockHealthData.emotion.current === 'Anxious'} />
              <Typography variant="caption">Anxious</Typography>
            </EmotionScaleItem>
            <EmotionScaleItem emotion="Stressed">
              <EmotionDot emotion="Stressed" active={mockHealthData.emotion.current === 'Stressed'} />
              <Typography variant="caption">Stressed</Typography>
            </EmotionScaleItem>
          </EmotionScaleContainer>

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

const CurrentMetricContainer = styled(View)`
  align-items: center;
  margin-bottom: ${theme.spacing.md}px;
`;

const RangeContainer = styled(View)`
  margin-vertical: ${theme.spacing.md}px;
`;

const RangeBar = styled(View)`
  height: 20px;
  background-color: ${theme.colors.lightGray};
  border-radius: ${theme.borderRadius.round}px;
  overflow: visible;
  position: relative;
`;

const PregnantRange = styled(View)<{ left: string; width: string }>`
  position: absolute;
  height: 100%;
  left: ${({ left }) => left};
  width: ${({ width }) => width};
  background-color: ${theme.colors.primaryLight};
  border-radius: ${theme.borderRadius.round}px;
`;

const IndicatorDot = styled(View)<{ position: string }>`
  position: absolute;
  width: 24px;
  height: 24px;
  border-radius: 12px;
  background-color: ${theme.colors.primary};
  top: -2px;
  left: ${({ position }) => position};
  transform: translateX(-12px);
  border-width: 3px;
  border-color: ${theme.colors.white};
  ${theme.shadows.medium};
`;

const RangeLabels = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  margin-top: ${theme.spacing.sm}px;
`;

const MetricStatsRow = styled(View)`
  flex-direction: row;
  justify-content: space-around;
  margin-top: ${theme.spacing.md}px;
  margin-bottom: ${theme.spacing.sm}px;
  background-color: ${theme.colors.background};
  padding: ${theme.spacing.sm}px;
  border-radius: ${theme.borderRadius.md}px;
`;

const MetricStat = styled(View)`
  align-items: center;
`;

const StressLevelIndicator = styled(View)`
  margin-vertical: ${theme.spacing.md}px;
`;

const StressBar = styled(View)`
  height: 20px;
  background-color: ${theme.colors.lightGray};
  border-radius: ${theme.borderRadius.round}px;
  overflow: visible;
  position: relative;
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

const StressRangeLabels = styled(View)`
  position: absolute;
  width: 100%;
  height: 100%;
`;

const StressRangeLabel = styled(Typography).attrs({
  variant: 'caption',
  color: theme.colors.white,
})<{ position: string }>`
  position: absolute;
  left: ${({ position }) => position};
  top: 0;
  marginLeft: -25px;
`;

const StressIndicatorDot = styled(View)<{ position: string }>`
  position: absolute;
  width: 24px;
  height: 24px;
  border-radius: 12px;
  background-color: ${theme.colors.primary};
  top: -2px;
  left: ${({ position }) => position};
  transform: translateX(-12px);
  border-width: 3px;
  border-color: ${theme.colors.white};
  ${theme.shadows.medium};
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
  ${theme.shadows.medium};
`;

const EmotionScaleContainer = styled(View)`
  flex-direction: row;
  justify-content: space-around;
  margin-top: ${theme.spacing.md}px;
`;

const EmotionScaleItem = styled(View)<{ emotion: string }>`
  align-items: center;
`;

const EmotionDot = styled(View)<{ emotion: string; active: boolean }>`
  width: ${({ active }) => active ? '20px' : '12px'};
  height: ${({ active }) => active ? '20px' : '12px'};
  border-radius: ${({ active }) => active ? '10px' : '6px'};
  margin-bottom: ${theme.spacing.xs}px;
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
  ${({ active }) => active ? theme.shadows.small : ''};
  border-width: ${({ active }) => active ? '2px' : '0'};
  border-color: ${theme.colors.white};
`;

export default AnalysisScreen; 