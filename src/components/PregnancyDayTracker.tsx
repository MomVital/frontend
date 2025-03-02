import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';

import Typography from './Typography';
import Card from './Card';
import { theme } from '../theme/theme';
import { RootStackParamList } from '../navigation/types';

interface PregnancyDayTrackerProps {
  currentWeek: number;
  dueDate: string;
}

type NavigationProp = StackNavigationProp<RootStackParamList>;

const PregnancyDayTracker: React.FC<PregnancyDayTrackerProps> = ({ currentWeek, dueDate }) => {
  const navigation = useNavigation<NavigationProp>();
  
  // Calculate total days of pregnancy (42 weeks = 294 days)
  const totalDays = 294;
  
  // Calculate current day based on pregnancy week
  const currentDay = currentWeek * 7;
  
  // Calculate progress percentage
  const progressPercentage = Math.min((currentDay / totalDays) * 100, 100);

  return (
    <Card variant="elevated" marginBottom="md">
      <HeaderRow>
        <Typography variant="h3" color={theme.colors.primary}>
          Pregnancy Tracker
        </Typography>
        <TouchableOpacity onPress={() => navigation.navigate('PregnancyTracker')}>
          <Typography variant="body2" color={theme.colors.primary}>
            View Details →
          </Typography>
        </TouchableOpacity>
      </HeaderRow>
      
      <WeekInfo>
        <Typography variant="h2" color={theme.colors.primaryDark}>
          Week {currentWeek}
        </Typography>
        <Typography variant="body2">
          of 42 weeks
        </Typography>
      </WeekInfo>
      
      <ProgressContainer>
        <ProgressBar>
          <Progress percentage={progressPercentage} />
        </ProgressBar>
        <ProgressLabels>
          <Typography variant="caption">Day 1</Typography>
          <Typography variant="caption">Day {currentDay}</Typography>
          <Typography variant="caption">Day 294</Typography>
        </ProgressLabels>
      </ProgressContainer>
      
      <DueDateContainer>
        <Ionicons name="calendar" size={24} color={theme.colors.primary} />
        <Typography variant="body1" marginLeft="sm">
          <Typography variant="body1" weight="bold">Due Date: </Typography>
          {new Date(dueDate).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </Typography>
      </DueDateContainer>
    </Card>
  );
};

const HeaderRow = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.sm}px;
`;

const WeekInfo = styled(View)`
  margin-bottom: ${theme.spacing.md}px;
`;

const ProgressContainer = styled(View)`
  margin-bottom: ${theme.spacing.md}px;
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

const DueDateContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  background-color: ${theme.colors.background};
  padding: ${theme.spacing.sm}px;
  border-radius: ${theme.borderRadius.sm}px;
`;

export default PregnancyDayTracker; 