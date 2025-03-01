import React from 'react';
import { View, ScrollView, TouchableOpacity, Image } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

import Container from '../components/Container';
import Typography from '../components/Typography';
import Card from '../components/Card';
import Button from '../components/Button';
import { theme } from '../theme/theme';
import { RootStackParamList } from '../navigation/types';
import { mockUser, mockHealthData, mockAiSuggestions, mockPregnancyMilestones } from '../utils/mockData';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const currentMilestone = mockPregnancyMilestones.find(
    milestone => milestone.week === mockUser.pregnancyWeek
  );

  return (
    <Container scroll>
      <Header>
        <WelcomeSection>
          <Typography variant="h2" color={theme.colors.text.light}>
            Hello, {mockUser.name.split(' ')[0]}
          </Typography>
          <Typography variant="body1" color={theme.colors.text.light} marginTop="xs">
            Week {mockUser.pregnancyWeek} of Pregnancy
          </Typography>
        </WelcomeSection>
        <ProfileImageContainer>
          <ProfileImage source={{ uri: mockUser.profileImage }} />
        </ProfileImageContainer>
      </Header>

      <ContentContainer>
        {/* Pregnancy Milestone Card */}
        <Card variant="elevated" marginBottom="md">
          <Typography variant="h3" color={theme.colors.primary} marginBottom="sm">
            This Week's Milestone
          </Typography>
          <Typography variant="h4" marginBottom="xs">
            {currentMilestone?.title}
          </Typography>
          <Typography variant="body1" marginBottom="md">
            {currentMilestone?.description}
          </Typography>
          <TipContainer>
            <Ionicons name="bulb-outline" size={24} color={theme.colors.primary} />
            <Typography variant="body2" marginLeft="sm">
              <Typography variant="body2" weight="bold">Tip: </Typography>
              {currentMilestone?.tips}
            </Typography>
          </TipContainer>
        </Card>

        {/* Quick Health Stats */}
        <Typography variant="h3" color={theme.colors.primary} marginBottom="sm">
          Your Health Today
        </Typography>
        <StatsContainer>
          <StatCard>
            <StatIconContainer>
              <FontAwesome5 name="heartbeat" size={24} color={theme.colors.primary} />
            </StatIconContainer>
            <Typography variant="h4" align="center">
              {mockHealthData.heartRate.current}
            </Typography>
            <Typography variant="caption" align="center">
              Heart Rate
            </Typography>
          </StatCard>

          <StatCard>
            <StatIconContainer>
              <MaterialCommunityIcons name="heart-pulse" size={24} color={theme.colors.primary} />
            </StatIconContainer>
            <Typography variant="h4" align="center">
              {mockHealthData.hrv.current}
            </Typography>
            <Typography variant="caption" align="center">
              HRV
            </Typography>
          </StatCard>

          <StatCard>
            <StatIconContainer>
              <MaterialCommunityIcons name="emoticon-outline" size={24} color={theme.colors.primary} />
            </StatIconContainer>
            <Typography variant="h4" align="center">
              {mockHealthData.emotion.current}
            </Typography>
            <Typography variant="caption" align="center">
              Mood
            </Typography>
          </StatCard>

          <StatCard>
            <StatIconContainer>
              <MaterialCommunityIcons name="lightning-bolt-outline" size={24} color={theme.colors.primary} />
            </StatIconContainer>
            <Typography variant="h4" align="center">
              {mockHealthData.stress.current}
            </Typography>
            <Typography variant="caption" align="center">
              Stress
            </Typography>
          </StatCard>
        </StatsContainer>

        <TouchableOpacity onPress={() => navigation.navigate('Analysis')}>
          <Typography variant="body2" color={theme.colors.primary} align="right" marginBottom="md">
            View Detailed Analysis →
          </Typography>
        </TouchableOpacity>

        {/* AI Suggestions */}
        <Typography variant="h3" color={theme.colors.primary} marginBottom="sm">
          AI Suggestions
        </Typography>
        {mockAiSuggestions.slice(0, 2).map((suggestion) => (
          <SuggestionCard key={suggestion.id} importance={suggestion.importance}>
            <SuggestionHeader>
              <Typography variant="h4" color={theme.colors.text.light}>
                {suggestion.title}
              </Typography>
              <ImportanceBadge importance={suggestion.importance}>
                <Typography variant="caption" color={theme.colors.text.light}>
                  {suggestion.importance}
                </Typography>
              </ImportanceBadge>
            </SuggestionHeader>
            <Typography variant="body1" color={theme.colors.text.light} marginTop="sm">
              {suggestion.description}
            </Typography>
          </SuggestionCard>
        ))}

        <TouchableOpacity onPress={() => navigation.navigate('AiSuggestions')}>
          <Typography variant="body2" color={theme.colors.primary} align="right" marginBottom="md">
            View All Suggestions →
          </Typography>
        </TouchableOpacity>

        {/* Scan Button */}
        <ScanButtonContainer>
          <Button 
            title="Scan Now" 
            onPress={() => navigation.navigate('Scan')} 
            size="large"
            fullWidth
          />
          <Typography variant="body2" align="center" marginTop="sm">
            Scan to get personalized health insights
          </Typography>
        </ScanButtonContainer>
      </ContentContainer>
    </Container>
  );
};

const Header = styled(View)`
  background-color: ${theme.colors.primary};
  padding: ${theme.spacing.lg}px;
  border-bottom-left-radius: ${theme.borderRadius.lg}px;
  border-bottom-right-radius: ${theme.borderRadius.lg}px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const WelcomeSection = styled(View)`
  flex: 1;
`;

const ProfileImageContainer = styled(View)`
  width: 60px;
  height: 60px;
  border-radius: 30px;
  overflow: hidden;
  border-width: 2px;
  border-color: ${theme.colors.white};
`;

const ProfileImage = styled(Image)`
  width: 100%;
  height: 100%;
`;

const ContentContainer = styled(View)`
  padding: ${theme.spacing.md}px;
`;

const TipContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  background-color: ${theme.colors.background};
  padding: ${theme.spacing.sm}px;
  border-radius: ${theme.borderRadius.sm}px;
`;

const StatsContainer = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-bottom: ${theme.spacing.md}px;
`;

const StatCard = styled(View)`
  width: 48%;
  background-color: ${theme.colors.white};
  border-radius: ${theme.borderRadius.md}px;
  padding: ${theme.spacing.md}px;
  margin-bottom: ${theme.spacing.sm}px;
  align-items: center;
  ${theme.shadows.small};
`;

const StatIconContainer = styled(View)`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background-color: ${theme.colors.background};
  justify-content: center;
  align-items: center;
  margin-bottom: ${theme.spacing.sm}px;
`;

const SuggestionCard = styled(Card)<{ importance: string }>`
  background-color: ${({ importance }) => {
    if (importance === 'High') return theme.colors.primaryDark;
    if (importance === 'Medium') return theme.colors.primary;
    return theme.colors.primaryLight;
  }};
  margin-bottom: ${theme.spacing.sm}px;
`;

const SuggestionHeader = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
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

const ScanButtonContainer = styled(View)`
  margin-top: ${theme.spacing.lg}px;
  margin-bottom: ${theme.spacing.xl}px;
`;

export default HomeScreen; 