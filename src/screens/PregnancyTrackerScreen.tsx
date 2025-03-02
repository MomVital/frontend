import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import styled from 'styled-components/native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

import Container from '../components/Container';
import Typography from '../components/Typography';
import Card from '../components/Card';
import Button from '../components/Button';
import { theme } from '../theme/theme';
import { RootStackParamList } from '../navigation/types';
import { mockUser, mockPregnancyMilestones } from '../utils/mockData';

type PregnancyTrackerScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PregnancyTracker'>;

const PregnancyTrackerScreen: React.FC = () => {
  const navigation = useNavigation<PregnancyTrackerScreenNavigationProp>();
  const [selectedTrimester, setSelectedTrimester] = useState<1 | 2 | 3>(
    mockUser.pregnancyWeek <= 12 ? 1 : mockUser.pregnancyWeek <= 27 ? 2 : 3
  );
  
  // Calculate total days of pregnancy (42 weeks = 294 days)
  const totalDays = 294;
  
  // Calculate current day based on pregnancy week
  const currentDay = mockUser.pregnancyWeek * 7;
  
  // Calculate progress percentage
  const progressPercentage = Math.min((currentDay / totalDays) * 100, 100);
  
  // Get milestones for the selected trimester
  const trimesterMilestones = mockPregnancyMilestones.filter(milestone => {
    if (selectedTrimester === 1) return milestone.week >= 4 && milestone.week <= 12;
    if (selectedTrimester === 2) return milestone.week >= 13 && milestone.week <= 27;
    return milestone.week >= 28 && milestone.week <= 42;
  });

  const handleWeekPress = (week: number) => {
    const url = `https://www.babylist.com/hello-baby/${week}-weeks-pregnant`;
    
    Alert.alert(
      `Week ${week} Details`,
      `Would you like to view detailed information about week ${week} of pregnancy?`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'View',
          onPress: () => {
            Linking.canOpenURL(url).then(supported => {
              if (supported) {
                Linking.openURL(url);
              } else {
                Alert.alert('Error', `Cannot open URL: ${url}`);
              }
            });
          }
        }
      ]
    );
  };

  return (
    <Container scroll>
      <HeaderSection>
        <Typography variant="h2" color={theme.colors.text.light} align="center">
          Pregnancy Tracker
        </Typography>
        <Typography variant="body1" color={theme.colors.text.light} align="center" marginTop="xs">
          Week {mockUser.pregnancyWeek} of 40
        </Typography>
      </HeaderSection>

      <ContentSection>
        {/* Progress Overview */}
        <Card marginBottom="md">
          <Typography variant="h3" color={theme.colors.primary} marginBottom="sm">
            Your Pregnancy Journey
          </Typography>
          
          <ProgressContainer>
            <ProgressBar>
              <Progress percentage={progressPercentage} />
            </ProgressBar>
            <ProgressLabels>
              <Typography variant="caption">Day 1</Typography>
              <Typography variant="caption">Day {currentDay}</Typography>
              <Typography variant="caption">Day 280</Typography>
            </ProgressLabels>
          </ProgressContainer>
          
          <StatsRow>
            <StatItem>
              <Typography variant="h3" color={theme.colors.primary} align="center">
                {currentDay}
              </Typography>
              <Typography variant="caption" align="center">
                Days Completed
              </Typography>
            </StatItem>
            
            <StatItem>
              <Typography variant="h3" color={theme.colors.primary} align="center">
                {totalDays - currentDay}
              </Typography>
              <Typography variant="caption" align="center">
                Days Remaining
              </Typography>
            </StatItem>
            
            <StatItem>
              <Typography variant="h3" color={theme.colors.primary} align="center">
                {Math.round(progressPercentage)}%
              </Typography>
              <Typography variant="caption" align="center">
                Progress
              </Typography>
            </StatItem>
          </StatsRow>
          
          <DueDateContainer>
            <Ionicons name="calendar" size={24} color={theme.colors.primary} />
            <Typography variant="body1" marginLeft="sm">
              <Typography variant="body1" weight="bold">Due Date: </Typography>
              {new Date(mockUser.dueDate).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Typography>
          </DueDateContainer>
        </Card>

        {/* Trimester Selector */}
        <Typography variant="h3" color={theme.colors.primary} marginBottom="sm">
          Milestones by Trimester
        </Typography>
        
        <TrimesterSelector>
          <TrimesterButton 
            isSelected={selectedTrimester === 1}
            onPress={() => setSelectedTrimester(1)}
          >
            <Typography 
              variant="body1" 
              color={selectedTrimester === 1 ? theme.colors.white : theme.colors.text.primary}
              weight={selectedTrimester === 1 ? "bold" : "regular"}
            >
              First (4-12)
            </Typography>
          </TrimesterButton>
          
          <TrimesterButton 
            isSelected={selectedTrimester === 2}
            onPress={() => setSelectedTrimester(2)}
          >
            <Typography 
              variant="body1" 
              color={selectedTrimester === 2 ? theme.colors.white : theme.colors.text.primary}
              weight={selectedTrimester === 2 ? "bold" : "regular"}
            >
              Second (13-27)
            </Typography>
          </TrimesterButton>
          
          <TrimesterButton 
            isSelected={selectedTrimester === 3}
            onPress={() => setSelectedTrimester(3)}
          >
            <Typography 
              variant="body1" 
              color={selectedTrimester === 3 ? theme.colors.white : theme.colors.text.primary}
              weight={selectedTrimester === 3 ? "bold" : "regular"}
            >
              Third (28-42)
            </Typography>
          </TrimesterButton>
        </TrimesterSelector>

        {/* Milestones */}
        {trimesterMilestones.map((milestone) => (
          <MilestoneCard 
            key={milestone.week} 
            isCurrentWeek={milestone.week === mockUser.pregnancyWeek}
            isPastWeek={milestone.week < mockUser.pregnancyWeek}
            onPress={() => handleWeekPress(milestone.week)}
          >
            <MilestoneHeader>
              <WeekBadge isCurrentWeek={milestone.week === mockUser.pregnancyWeek}>
                <Typography variant="body1" color={theme.colors.text.light} weight="bold">
                  Week {milestone.week}
                </Typography>
              </WeekBadge>
              
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {milestone.week <= mockUser.pregnancyWeek && (
                  <Ionicons 
                    name="checkmark-circle" 
                    size={24} 
                    color={milestone.week === mockUser.pregnancyWeek ? theme.colors.warning : theme.colors.success} 
                  />
                )}
                <Ionicons 
                  name="open-outline" 
                  size={20} 
                  color={theme.colors.primary}
                  style={{ marginLeft: 8 }}
                />
              </View>
            </MilestoneHeader>
            
            <Typography variant="h4" marginTop="sm" marginBottom="xs">
              {milestone.title}
            </Typography>
            
            <Typography variant="body1" marginBottom="md">
              {milestone.description}
            </Typography>
            
            <TipContainer>
              <Ionicons name="bulb-outline" size={24} color={theme.colors.primary} />
              <Typography variant="body2" marginLeft="sm">
                <Typography variant="body2" weight="bold">Tip: </Typography>
                {milestone.tips}
              </Typography>
            </TipContainer>
          </MilestoneCard>
        ))}

        {trimesterMilestones.length === 0 && (
          <EmptyStateContainer>
            <Ionicons name="calendar-outline" size={48} color={theme.colors.lightGray} />
            <Typography variant="body1" align="center" marginTop="md">
              No milestones available for this trimester.
            </Typography>
          </EmptyStateContainer>
        )}
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

const ProgressContainer = styled(View)`
  margin-vertical: ${theme.spacing.md}px;
`;

const ProgressBar = styled(View)`
  height: 12px;
  background-color: ${theme.colors.lightGray};
  border-radius: ${theme.borderRadius.round}px;
  overflow: hidden;
`;

const Progress = styled(View)<{ percentage: number }>`
  height: 100%;
  width: ${({ percentage }) => `${percentage}%`};
  background-color: ${theme.colors.primary};
  border-radius: ${theme.borderRadius.round}px;
`;

const ProgressLabels = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  margin-top: ${theme.spacing.xs}px;
`;

const StatsRow = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  margin-vertical: ${theme.spacing.md}px;
`;

const StatItem = styled(View)`
  align-items: center;
  width: 30%;
`;

const DueDateContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  background-color: ${theme.colors.background};
  padding: ${theme.spacing.md}px;
  border-radius: ${theme.borderRadius.md}px;
  margin-top: ${theme.spacing.sm}px;
`;

const TrimesterSelector = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: ${theme.spacing.md}px;
`;

const TrimesterButton = styled(TouchableOpacity)<{ isSelected: boolean }>`
  background-color: ${({ isSelected }) => isSelected ? theme.colors.primary : theme.colors.background};
  padding: ${theme.spacing.sm}px ${theme.spacing.md}px;
  border-radius: ${theme.borderRadius.md}px;
  flex: 1;
  margin-horizontal: ${theme.spacing.xs}px;
  align-items: center;
`;

const MilestoneCard = styled(TouchableOpacity)<{ isCurrentWeek: boolean; isPastWeek: boolean }>`
  margin-bottom: ${theme.spacing.md}px;
  border-left-width: 4px;
  border-left-color: ${({ isCurrentWeek, isPastWeek }) => {
    if (isCurrentWeek) return theme.colors.warning;
    if (isPastWeek) return theme.colors.success;
    return theme.colors.lightGray;
  }};
  opacity: ${({ isPastWeek, isCurrentWeek }) => {
    if (isPastWeek || isCurrentWeek) return 1;
    return 0.7;
  }};
  background-color: ${theme.colors.white};
  border-radius: ${theme.borderRadius.md}px;
  padding: ${theme.spacing.md}px;
  ${theme.shadows.small};
`;

const MilestoneHeader = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const WeekBadge = styled(View)<{ isCurrentWeek: boolean }>`
  background-color: ${({ isCurrentWeek }) => isCurrentWeek ? theme.colors.warning : theme.colors.primary};
  padding: ${theme.spacing.xs}px ${theme.spacing.sm}px;
  border-radius: ${theme.borderRadius.round}px;
`;

const TipContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  background-color: ${theme.colors.background};
  padding: ${theme.spacing.sm}px;
  border-radius: ${theme.borderRadius.sm}px;
`;

const EmptyStateContainer = styled(View)`
  padding: ${theme.spacing.xl}px;
  align-items: center;
  justify-content: center;
  background-color: ${theme.colors.white};
  border-radius: ${theme.borderRadius.md}px;
  margin-top: ${theme.spacing.md}px;
`;

export default PregnancyTrackerScreen; 