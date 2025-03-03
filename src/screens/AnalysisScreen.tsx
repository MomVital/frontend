import React, { useState, useEffect } from 'react';
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
import { AnalysisResponse, getHeartBeatAnalysis, getHrvAnalysis, getStressAnalysis, getEmotionalStateAnalysis } from '../utils/apiService';

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

// Generate random variation within a range
const getRandomVariation = (base: number, range: number): number => {
  return Math.round(base + (Math.random() * range * 2 - range));
};

// Flag to toggle between mock data and real API data
const USE_MOCK_DATA = false;

const AnalysisScreen: React.FC = () => {
  const route = useRoute<AnalysisScreenRouteProp>();
  const navigation = useNavigation<AnalysisScreenNavigationProp>();
  const scanId = route.params?.scanId;
  const tempData = route.params?.tempData;

  const [loading, setLoading] = useState(true);
  const [healthData, setHealthData] = useState(mockHealthData);
  const [heartRateAnalysis, setHeartRateAnalysis] = useState("");
  const [hrvAnalysis, setHrvAnalysis] = useState("");
  const [stressAnalysis, setStressAnalysis] = useState("");
  const [emotionalAnalysis, setEmotionalAnalysis] = useState("");
  const [analysisData, setAnalysisData] = useState<AnalysisResponse | null>(null);

  // Generate fresh mock health data based on the scan
  const generateFreshMockHealthData = () => {
    // Create a copy of the mock data
    const freshData = JSON.parse(JSON.stringify(mockHealthData));
    
    // Update with random variations
    freshData.heartRate.current = getRandomVariation(80, 8);
    freshData.heartRate.min = getRandomVariation(65, 5);
    freshData.heartRate.max = getRandomVariation(95, 5);
    freshData.heartRate.average = getRandomVariation(78, 4);
    
    freshData.hrv.current = getRandomVariation(45, 10);
    freshData.hrv.min = getRandomVariation(30, 5);
    freshData.hrv.max = getRandomVariation(65, 5);
    freshData.hrv.average = getRandomVariation(48, 5);
    
    freshData.stress.level = getRandomVariation(65, 15);
    freshData.stress.current = freshData.stress.level < 40 ? 'Low' : freshData.stress.level < 70 ? 'Med' : 'High';
    
    const emotions = ['Calm', 'Happy', 'Anxious', 'Tired', 'Energetic', 'Relaxed', 'Stressed'];
    freshData.emotion.current = emotions[Math.floor(Math.random() * emotions.length)];
    
    return freshData;
  };

  // Fetch analysis data
  useEffect(() => {
    const fetchAnalysisData = async () => {
      setLoading(true);
      
      try {
        // In a real app, you would fetch the analysis data from your backend
        // For now, we'll use mock data
        if (USE_MOCK_DATA) {
          // Simulate API delay with random duration (1-3 seconds)
          const delay = 1000 + Math.random() * 2000;
          await new Promise(resolve => setTimeout(resolve, delay));
          
          // Generate fresh health data for this scan
          const freshHealthData = generateFreshMockHealthData();
          setHealthData(freshHealthData);
          
          // Set mock analysis data
          const mockAnalysis: AnalysisResponse = {
            timesES: [1, 2, 3, 4, 5],
            bpmES: [
              getRandomVariation(freshHealthData.heartRate.current - 3, 2),
              getRandomVariation(freshHealthData.heartRate.current - 1, 2),
              getRandomVariation(freshHealthData.heartRate.current, 2),
              getRandomVariation(freshHealthData.heartRate.current + 1, 2),
              getRandomVariation(freshHealthData.heartRate.current - 2, 2)
            ],
            nni_seq: [
              getRandomVariation(800, 20),
              getRandomVariation(810, 20),
              getRandomVariation(790, 20),
              getRandomVariation(805, 20),
              getRandomVariation(795, 20)
            ],
            hrv_results: {
              sdnn: freshHealthData.hrv.current,
              rmssd: getRandomVariation(42, 5),
              pnn50: getRandomVariation(30, 5),
              lf: getRandomVariation(1200, 100),
              hf: getRandomVariation(900, 100),
              lf_hf_ratio: parseFloat((getRandomVariation(133, 20) / 100).toFixed(2))
            },
            week: 24
          };
          
          setAnalysisData(mockAnalysis);
          
          // Get analyses
          const heartRate = await getHeartBeatAnalysis(mockAnalysis);
          const hrv = await getHrvAnalysis(mockAnalysis);
          const stress = await getStressAnalysis(mockAnalysis);
          const emotional = getEmotionalStateAnalysis();
          
          setHeartRateAnalysis(heartRate);
          setHrvAnalysis(hrv);
          setStressAnalysis(stress);
          setEmotionalAnalysis(emotional);
        } else {
          setAnalysisData(tempData.savedData);
          
          setHeartRateAnalysis(tempData.heartBeatAnalysis);
          setHrvAnalysis(tempData.hrvAnalysis);
          setStressAnalysis(tempData.stressAnalysis);
          setEmotionalAnalysis(getEmotionalStateAnalysis());
        }
      } catch (error) {
        console.error('Error fetching analysis data:', error);
        // Handle error
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalysisData();
  }, [scanId]);

  if (loading) {
    return <LoadingIndicator fullScreen color={theme.colors.primary} />;
  }

  // Calculate position percentage for heart rate
  const getHeartRatePosition = () => {
    const { min, max } = normalRanges.heartRate;
    const current = healthData.heartRate.current;
    const range = max - min;
    const position = ((current - min) / range) * 100;
    return Math.max(0, Math.min(100, position));
  };

  // Calculate position percentage for HRV
  const getHrvPosition = () => {
    const { min, max } = normalRanges.hrv;
    const current = healthData.hrv.current;
    const range = max - min;
    const position = ((current - min) / range) * 100;
    return Math.max(0, Math.min(100, position));
  };

  const handleViewSuggestions = () => {
    // Now that AiSuggestions is in the RootStack, we can navigate directly
    navigation.navigate('AiSuggestions', { scanId, tempData });
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
        {analysisData?.week && (
          <Typography variant="body2" color={theme.colors.text.light} align="center" marginTop="xs">
            Pregnancy Week: {analysisData.week}
          </Typography>
        )}
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
              {healthData.heartRate.current}
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
              <Typography variant="body1" weight="bold">{healthData.heartRate.min}</Typography>
            </MetricStat>
            <MetricStat>
              <Typography variant="caption" color={theme.colors.gray}>Max</Typography>
              <Typography variant="body1" weight="bold">{healthData.heartRate.max}</Typography>
            </MetricStat>
            <MetricStat>
              <Typography variant="caption" color={theme.colors.gray}>Avg</Typography>
              <Typography variant="body1" weight="bold">{healthData.heartRate.average}</Typography>
            </MetricStat>
          </MetricStatsRow>

          <Typography variant="body1" marginTop="md">
            {heartRateAnalysis || "Your heart rate is within the normal range for pregnant women in their second trimester. The slight elevation is normal and corresponds with your activity levels."}
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
              {healthData.hrv.current}
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
              <Typography variant="body1" weight="bold">{healthData.hrv.min}</Typography>
            </MetricStat>
            <MetricStat>
              <Typography variant="caption" color={theme.colors.gray}>Max</Typography>
              <Typography variant="body1" weight="bold">{healthData.hrv.max}</Typography>
            </MetricStat>
            <MetricStat>
              <Typography variant="caption" color={theme.colors.gray}>Avg</Typography>
              <Typography variant="body1" weight="bold">{healthData.hrv.average}</Typography>
            </MetricStat>
          </MetricStatsRow>

          <Typography variant="body1" marginTop="md">
            {hrvAnalysis || "Your HRV indicates a good balance between rest and activity. This suggests your autonomic nervous system is functioning well during pregnancy."}
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
              {healthData.stress.current}
            </Typography>
            <Typography variant="body1" align="center">
              Current Level
            </Typography>
          </CurrentMetricContainer>

          <StressLevelIndicator>
            <StressBar>
              <StressLevel level={healthData.stress.level} />
              <StressRangeLabels>
                <StressRangeLabel position="0%">Low</StressRangeLabel>
                <StressRangeLabel position="40%">Medium</StressRangeLabel>
                <StressRangeLabel position="70%">High</StressRangeLabel>
              </StressRangeLabels>
              <StressIndicatorDot position={`${healthData.stress.level}%`} />
            </StressBar>
            <StressLabels>
              <Typography variant="caption">0%</Typography>
              <Typography variant="caption">50%</Typography>
              <Typography variant="caption">100%</Typography>
            </StressLabels>
          </StressLevelIndicator>

          <Typography variant="body1" marginTop="md">
            {stressAnalysis || "Your current stress level is medium. We've noticed a pattern of increased stress levels in the mid-afternoon. This could be related to work activities or fatigue."}
          </Typography>
        </SectionCard>

        {/* Emotional State Section */}
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
            <Typography variant="h1" color={theme.colors.primary} align="center">
              {healthData.emotion.current}
            </Typography>
            <Typography variant="body1" align="center">
              Current State
            </Typography>
          </CurrentMetricContainer>

          <EmotionalScaleContainer>
            <EmotionalScale>
              <EmotionalScaleItem active={healthData.emotion.current === 'Anxious'}>
                <MaterialCommunityIcons name="emoticon-sad-outline" size={24} color={healthData.emotion.current === 'Anxious' ? theme.colors.primary : theme.colors.gray} />
                <Typography variant="caption" color={healthData.emotion.current === 'Anxious' ? theme.colors.primary : theme.colors.gray}>
                  Anxious
                </Typography>
              </EmotionalScaleItem>
              <EmotionalScaleItem active={healthData.emotion.current === 'Calm'}>
                <MaterialCommunityIcons name="emoticon-neutral-outline" size={24} color={healthData.emotion.current === 'Calm' ? theme.colors.primary : theme.colors.gray} />
                <Typography variant="caption" color={healthData.emotion.current === 'Calm' ? theme.colors.primary : theme.colors.gray}>
                  Calm
                </Typography>
              </EmotionalScaleItem>
              <EmotionalScaleItem active={healthData.emotion.current === 'Happy'}>
                <MaterialCommunityIcons name="emoticon-happy-outline" size={24} color={healthData.emotion.current === 'Happy' ? theme.colors.primary : theme.colors.gray} />
                <Typography variant="caption" color={healthData.emotion.current === 'Happy' ? theme.colors.primary : theme.colors.gray}>
                  Happy
                </Typography>
              </EmotionalScaleItem>
            </EmotionalScale>
          </EmotionalScaleContainer>

          <Typography variant="body1" marginTop="md">
            {emotionalAnalysis || "Your emotional state appears balanced. The data shows a healthy variation between calm and excited states, which is normal during pregnancy."}
          </Typography>
        </SectionCard>

        {/* AI Suggestions Button */}
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

const EmotionalScaleContainer = styled(View)`
  flex-direction: row;
  justify-content: space-around;
  margin-top: ${theme.spacing.md}px;
`;

const EmotionalScale = styled(View)`
  flex-direction: row;
  align-items: center;
`;

const EmotionalScaleItem = styled(View)<{ active: boolean }>`
  align-items: center;
`;

export default AnalysisScreen; 