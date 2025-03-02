import React, { useState, useEffect } from 'react';
import { View, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import styled from 'styled-components/native';
import { FontAwesome5 } from '@expo/vector-icons';

import Container from '../components/Container';
import Typography from '../components/Typography';
import Button from '../components/Button';
import Card from '../components/Card';
import { theme } from '../theme/theme';
import { RootStackParamList } from '../navigation/types';
import { 
  AnalysisResponse, 
  processVideoAnalysis, 
  BACKEND_BASE_URL, 
  getLatestScanId,
  getLatestAnalysisData
} from '../utils/apiService';
import { mockUser } from '../utils/mockData';

type AnalysisScreenRouteProp = RouteProp<RootStackParamList, 'Analysis'>;
type AnalysisScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Analysis'>;

// Flag to toggle between mock data and real API data
const USE_MOCK_DATA = false;

// Mock analysis data for testing
const mockAnalysis: AnalysisResponse = {
  bpms: 79,
  sdnn: 45,
  rmssd: 42,
  pnn50: 30,
  stress_level: 35,
  week: 24
};

const AnalysisScreen: React.FC = () => {
  const route = useRoute<AnalysisScreenRouteProp>();
  const navigation = useNavigation<AnalysisScreenNavigationProp>();
  const routeScanId = route.params?.scanId;
  
  const [scanId, setScanId] = useState<string | null>(routeScanId || null);
  const [loading, setLoading] = useState(true);
  const [healthData, setHealthData] = useState<AnalysisResponse | null>(null);
  const [heartRateAnalysis, setHeartRateAnalysis] = useState('');
  const [hrvAnalysis, setHrvAnalysis] = useState('');
  const [stressAnalysis, setStressAnalysis] = useState('');
  const [emotionalAnalysis, setEmotionalAnalysis] = useState('');
  
  // Helper function to simulate API delay and set mock data
  const useMockDataFallback = async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      // Use completely local mock data without making any API calls
      const mockHeartBeatAnalysis = "Your heart rate is within the normal range for pregnant women. This indicates good cardiovascular health.";
      const mockHrvAnalysis = "Your heart rate variability is within the normal range, indicating a good balance between your sympathetic and parasympathetic nervous systems.";
      const mockStressAnalysis = "Your stress levels are moderate. This is common during pregnancy, but consider incorporating more relaxation techniques into your routine.";
      const mockEmotionalAnalysis = "Your emotional state shows some signs of stress, which is common during pregnancy. Consider mindfulness practices or gentle exercise to help maintain emotional balance.";
      
      // Set the data directly without calling processVideoAnalysis
      setHealthData(mockAnalysis);
      setHeartRateAnalysis(mockHeartBeatAnalysis);
      setHrvAnalysis(mockHrvAnalysis);
      setStressAnalysis(mockStressAnalysis);
      setEmotionalAnalysis(mockEmotionalAnalysis);
    } catch (error) {
      console.error('Error processing mock data:', error);
      Alert.alert('Error', 'Failed to process analysis data. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
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
            console.log('No latest scanId found in storage');
          }
        } catch (error) {
          console.error('Error fetching latest scanId:', error);
        }
      }
    };
    
    fetchLatestScanId();
  }, [routeScanId]);
  
  // Fetch analysis data
  useEffect(() => {
    const fetchAnalysisData = async () => {
      if (!scanId) {
        console.log('No scanId available, using mock data instead');
        await useMockDataFallback();
        return;
      }
      
      setLoading(true);
      
      try {
        if (USE_MOCK_DATA) {
          await useMockDataFallback();
          return;
        }
        
        console.log('Using scanId to identify session:', scanId);
        
        // Try to get the latest analysis data from storage
        const latestData = await getLatestAnalysisData();
        if (latestData) {
          console.log('Using latest analysis data from storage');
          
          // Process the data to get the analyses
          const results = await processVideoAnalysis(latestData, scanId);
          
          // Set the data from the results
          setHealthData(results.savedData);
          setHeartRateAnalysis(results.heartBeatAnalysis);
          setHrvAnalysis(results.hrvAnalysis);
          setStressAnalysis(results.stressAnalysis);
          setEmotionalAnalysis(results.emotionalAnalysis);
        } else {
          console.log('No latest analysis data found in storage, using mock data');
          await useMockDataFallback();
        }
      } catch (error) {
        console.error('Error fetching analysis data:', error);
        // Fall back to mock data if there's an error
        Alert.alert(
          'Data Fetch Error',
          'Failed to fetch analysis data. Would you like to use mock data instead?',
          [
            { text: 'No', style: 'cancel', onPress: () => setLoading(false) },
            { text: 'Yes', onPress: () => useMockDataFallback() }
          ]
        );
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalysisData();
  }, [scanId]);
  
  // Navigate to AI suggestions screen
  const handleViewSuggestions = () => {
    // Always navigate to AiSuggestions, even with null scanId
    // The AiSuggestionsScreen will handle the null scanId case
    navigation.navigate('AiSuggestions', { scanId });
  };
  
  if (loading) {
    return (
      <Container>
        <LoadingContainer>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Typography variant="body1" marginTop="md">
            Analyzing your health data...
          </Typography>
        </LoadingContainer>
      </Container>
    );
  }
  
  // Ensure we have health data before rendering
  if (!healthData) {
    return (
      <Container>
        <ErrorContainer>
          <FontAwesome5 name="exclamation-circle" size={50} color={theme.colors.error} />
          <Typography variant="h2" marginTop="md" color={theme.colors.error}>
            Data Error
          </Typography>
          <Typography variant="body1" marginTop="sm" align="center">
            We couldn't retrieve your health data. Please try scanning again.
          </Typography>
          <Button 
            title="Back to Scan" 
            onPress={() => navigation.navigate('Scan')} 
            marginTop="md"
          />
        </ErrorContainer>
      </Container>
    );
  }
  
  return (
    <Container>
      <ScrollView showsVerticalScrollIndicator={false}>
        <HeaderContainer>
          <Typography variant="h1">Health Analysis</Typography>
          <Typography variant="body1">
            Week {healthData.week || mockUser.pregnancyWeek} of Pregnancy
          </Typography>
        </HeaderContainer>
        
        {/* Heart Rate Section */}
        <MetricCard>
          <MetricHeader>
            <FontAwesome5 name="heartbeat" size={24} color={theme.colors.primary} />
            <Typography variant="h2" marginLeft="sm">Heart Rate</Typography>
          </MetricHeader>
          
          <MetricValue>
            <Typography variant="h1">{healthData.bpms}</Typography>
            <Typography variant="body1">BPM</Typography>
          </MetricValue>
          
          <MetricRange>
            <Typography variant="caption">Normal range: 60-100 BPM</Typography>
          </MetricRange>
          
          <AnalysisText>
            <Typography variant="body1">{heartRateAnalysis}</Typography>
          </AnalysisText>
        </MetricCard>
        
        {/* HRV Section */}
        <MetricCard>
          <MetricHeader>
            <FontAwesome5 name="wave-square" size={24} color={theme.colors.secondary} />
            <Typography variant="h2" marginLeft="sm">Heart Rate Variability</Typography>
          </MetricHeader>
          
          <MetricsRow>
            <MetricColumn>
              <Typography variant="caption">SDNN</Typography>
              <Typography variant="h2">{healthData.sdnn}</Typography>
              <Typography variant="caption">ms</Typography>
            </MetricColumn>
            
            <MetricColumn>
              <Typography variant="caption">RMSSD</Typography>
              <Typography variant="h2">{healthData.rmssd}</Typography>
              <Typography variant="caption">ms</Typography>
            </MetricColumn>
            
            <MetricColumn>
              <Typography variant="caption">pNN50</Typography>
              <Typography variant="h2">{healthData.pnn50}</Typography>
              <Typography variant="caption">%</Typography>
            </MetricColumn>
          </MetricsRow>
          
          <AnalysisText>
            <Typography variant="body1">{hrvAnalysis}</Typography>
          </AnalysisText>
        </MetricCard>
        
        {/* Stress Level Section */}
        <MetricCard>
          <MetricHeader>
            <FontAwesome5 name="brain" size={24} color={theme.colors.accent} />
            <Typography variant="h2" marginLeft="sm">Stress Level</Typography>
          </MetricHeader>
          
          <MetricValue>
            <Typography variant="h1">{healthData.stress_level}</Typography>
            <Typography variant="body1">/100</Typography>
          </MetricValue>
          
          <StressBar>
            <StressBarFill style={{ width: `${healthData.stress_level}%` }} />
          </StressBar>
          
          <AnalysisText>
            <Typography variant="body1">{stressAnalysis}</Typography>
          </AnalysisText>
        </MetricCard>
        
        {/* Emotional State Section */}
        <MetricCard>
          <MetricHeader>
            <FontAwesome5 name="smile" size={24} color={theme.colors.success} />
            <Typography variant="h2" marginLeft="sm">Emotional State</Typography>
          </MetricHeader>
          
          <AnalysisText>
            <Typography variant="body1">{emotionalAnalysis}</Typography>
          </AnalysisText>
        </MetricCard>
        
        <Button
          title="View AI Suggestions"
          onPress={handleViewSuggestions}
          marginTop="md"
          marginBottom="md"
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

const MetricCard = styled(Card)`
  margin-vertical: 10px;
  padding: 15px;
`;

const MetricHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
`;

const MetricValue = styled.View`
  flex-direction: row;
  align-items: baseline;
  justify-content: center;
  margin-vertical: 10px;
`;

const MetricRange = styled.View`
  align-items: center;
  margin-bottom: 10px;
`;

const MetricsRow = styled.View`
  flex-direction: row;
  justify-content: space-around;
  margin-vertical: 10px;
`;

const MetricColumn = styled.View`
  align-items: center;
`;

const AnalysisText = styled.View`
  margin-top: 10px;
  padding: 10px;
  background-color: ${theme.colors.background};
  border-radius: 8px;
`;

const StressBar = styled.View`
  height: 10px;
  background-color: ${theme.colors.lightGray};
  border-radius: 5px;
  margin-vertical: 10px;
  overflow: hidden;
`;

const StressBarFill = styled.View`
  height: 100%;
  background-color: ${theme.colors.accent};
  border-radius: 5px;
`;

export default AnalysisScreen; 