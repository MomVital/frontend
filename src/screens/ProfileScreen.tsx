import React from 'react';
import { View, Image, ScrollView, TouchableOpacity } from 'react-native';
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
import { mockUser } from '../utils/mockData';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();

  // Function to navigate to settings
  const navigateToSettings = () => {
    // Navigate to the Settings screen in the root navigator
    navigation.getParent()?.navigate('Settings');
  };

  return (
    <Container scroll>
      <ProfileHeader>
        <ProfileImageContainer>
          <ProfileImage source={{ uri: mockUser.profileImage }} />
          <EditProfileButton>
            <Ionicons name="pencil" size={16} color={theme.colors.white} />
          </EditProfileButton>
        </ProfileImageContainer>
        
        <Typography variant="h2" color={theme.colors.text.light} align="center" marginTop="md">
          {mockUser.name}
        </Typography>
        
        <Typography variant="body1" color={theme.colors.text.light} align="center" marginTop="xs">
          {mockUser.email}
        </Typography>
        
        <PregnancyInfoContainer>
          <PregnancyInfoItem>
            <Typography variant="h3" color={theme.colors.text.light} align="center">
              {mockUser.pregnancyWeek}
            </Typography>
            <Typography variant="caption" color={theme.colors.text.light} align="center">
              Weeks
            </Typography>
          </PregnancyInfoItem>
          
          <PregnancyInfoDivider />
          
          <PregnancyInfoItem>
            <Typography variant="h3" color={theme.colors.text.light} align="center">
              {new Date(mockUser.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </Typography>
            <Typography variant="caption" color={theme.colors.text.light} align="center">
              Due Date
            </Typography>
          </PregnancyInfoItem>
        </PregnancyInfoContainer>
      </ProfileHeader>

      <ContentSection>
        {/* Health Information */}
        <SectionTitle>
          <SectionIcon>
            <MaterialCommunityIcons name="heart-pulse" size={24} color={theme.colors.primary} />
          </SectionIcon>
          <Typography variant="h3" marginLeft="sm">
            Health Information
          </Typography>
        </SectionTitle>
        
        <Card marginBottom="md">
          <InfoRow>
            <InfoLabel>
              <Typography variant="body2" color={theme.colors.text.secondary}>
                Age
              </Typography>
            </InfoLabel>
            <Typography variant="body1">
              {mockUser.age} years
            </Typography>
          </InfoRow>
          
          <InfoRow>
            <InfoLabel>
              <Typography variant="body2" color={theme.colors.text.secondary}>
                Blood Type
              </Typography>
            </InfoLabel>
            <Typography variant="body1">
              A+
            </Typography>
          </InfoRow>
          
          <InfoRow>
            <InfoLabel>
              <Typography variant="body2" color={theme.colors.text.secondary}>
                Height
              </Typography>
            </InfoLabel>
            <Typography variant="body1">
              165 cm
            </Typography>
          </InfoRow>
          
          <InfoRow>
            <InfoLabel>
              <Typography variant="body2" color={theme.colors.text.secondary}>
                Pre-pregnancy Weight
              </Typography>
            </InfoLabel>
            <Typography variant="body1">
              58 kg
            </Typography>
          </InfoRow>
          
          <InfoRow>
            <InfoLabel>
              <Typography variant="body2" color={theme.colors.text.secondary}>
                Current Weight
              </Typography>
            </InfoLabel>
            <Typography variant="body1">
              64 kg
            </Typography>
          </InfoRow>
        </Card>

        {/* Medical History */}
        <SectionTitle>
          <SectionIcon>
            <FontAwesome5 name="file-medical" size={20} color={theme.colors.primary} />
          </SectionIcon>
          <Typography variant="h3" marginLeft="sm">
            Medical History
          </Typography>
        </SectionTitle>
        
        <Card marginBottom="md">
          <InfoRow>
            <InfoLabel>
              <Typography variant="body2" color={theme.colors.text.secondary}>
                Allergies
              </Typography>
            </InfoLabel>
            <Typography variant="body1">
              None
            </Typography>
          </InfoRow>
          
          <InfoRow>
            <InfoLabel>
              <Typography variant="body2" color={theme.colors.text.secondary}>
                Chronic Conditions
              </Typography>
            </InfoLabel>
            <Typography variant="body1">
              None
            </Typography>
          </InfoRow>
          
          <InfoRow>
            <InfoLabel>
              <Typography variant="body2" color={theme.colors.text.secondary}>
                Previous Pregnancies
              </Typography>
            </InfoLabel>
            <Typography variant="body1">
              0
            </Typography>
          </InfoRow>
          
          <InfoRow>
            <InfoLabel>
              <Typography variant="body2" color={theme.colors.text.secondary}>
                Family History
              </Typography>
            </InfoLabel>
            <Typography variant="body1">
              Hypertension (maternal)
            </Typography>
          </InfoRow>
        </Card>

        {/* Healthcare Providers */}
        <SectionTitle>
          <SectionIcon>
            <Ionicons name="medkit" size={22} color={theme.colors.primary} />
          </SectionIcon>
          <Typography variant="h3" marginLeft="sm">
            Healthcare Providers
          </Typography>
        </SectionTitle>
        
        <Card marginBottom="md">
          <InfoRow>
            <InfoLabel>
              <Typography variant="body2" color={theme.colors.text.secondary}>
                OB/GYN
              </Typography>
            </InfoLabel>
            <Typography variant="body1">
              Dr. Emily Chen
            </Typography>
          </InfoRow>
          
          <InfoRow>
            <InfoLabel>
              <Typography variant="body2" color={theme.colors.text.secondary}>
                Hospital
              </Typography>
            </InfoLabel>
            <Typography variant="body1">
              Memorial Women's Center
            </Typography>
          </InfoRow>
          
          <InfoRow>
            <InfoLabel>
              <Typography variant="body2" color={theme.colors.text.secondary}>
                Next Appointment
              </Typography>
            </InfoLabel>
            <Typography variant="body1">
              June 15, 2023 - 10:30 AM
            </Typography>
          </InfoRow>
        </Card>

        {/* Settings Button */}
        <Button 
          title="Settings" 
          onPress={() => navigation.getParent()?.navigate('Settings')} 
          variant="outline"
          fullWidth
          marginTop="md"
          marginBottom="xl"
        />
      </ContentSection>
    </Container>
  );
};

const ProfileHeader = styled(View)`
  background-color: ${theme.colors.primary};
  padding: ${theme.spacing.lg}px;
  padding-top: ${theme.spacing.xl}px;
  padding-bottom: ${theme.spacing.xl}px;
  border-bottom-left-radius: ${theme.borderRadius.lg}px;
  border-bottom-right-radius: ${theme.borderRadius.lg}px;
  align-items: center;
`;

const ProfileImageContainer = styled(View)`
  width: 120px;
  height: 120px;
  border-radius: 60px;
  overflow: hidden;
  border-width: 3px;
  border-color: ${theme.colors.white};
  position: relative;
`;

const ProfileImage = styled(Image)`
  width: 100%;
  height: 100%;
`;

const EditProfileButton = styled(TouchableOpacity)`
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: ${theme.colors.primary};
  width: 36px;
  height: 36px;
  border-radius: 18px;
  justify-content: center;
  align-items: center;
  border-width: 2px;
  border-color: ${theme.colors.white};
`;

const PregnancyInfoContainer = styled(View)`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: ${theme.spacing.md}px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: ${theme.borderRadius.md}px;
  padding: ${theme.spacing.md}px;
  width: 80%;
`;

const PregnancyInfoItem = styled(View)`
  flex: 1;
  align-items: center;
`;

const PregnancyInfoDivider = styled(View)`
  width: 1px;
  height: 40px;
  background-color: rgba(255, 255, 255, 0.5);
  margin-horizontal: ${theme.spacing.md}px;
`;

const ContentSection = styled(View)`
  padding: ${theme.spacing.md}px;
`;

const SectionTitle = styled(View)`
  flex-direction: row;
  align-items: center;
  margin-top: ${theme.spacing.lg}px;
  margin-bottom: ${theme.spacing.sm}px;
`;

const SectionIcon = styled(View)`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: ${theme.colors.background};
  justify-content: center;
  align-items: center;
`;

const InfoRow = styled(View)<{ isLast?: boolean }>`
  flex-direction: row;
  justify-content: space-between;
  padding-vertical: ${theme.spacing.sm}px;
  border-bottom-width: ${({ isLast }) => isLast ? 0 : 1}px;
  border-bottom-color: ${theme.colors.lightGray};
`;

const InfoLabel = styled(View)`
  flex: 1;
`;

export default ProfileScreen; 