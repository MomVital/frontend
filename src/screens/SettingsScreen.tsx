import React, { useState } from 'react';
import { View, Switch, TouchableOpacity, Alert } from 'react-native';
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

type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Settings'>;

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  
  // Settings state
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [healthRemindersEnabled, setHealthRemindersEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [biometricAuthEnabled, setBiometricAuthEnabled] = useState(false);
  const [dataBackupEnabled, setDataBackupEnabled] = useState(true);
  
  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Logout", 
          onPress: () => {
            // In a real app, this would clear auth tokens and navigate to login
            Alert.alert("Logged out successfully");
          },
          style: "destructive"
        }
      ]
    );
  };
  
  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete", 
          onPress: () => {
            // In a real app, this would call an API to delete the account
            Alert.alert("Account deleted");
          },
          style: "destructive"
        }
      ]
    );
  };

  return (
    <Container scroll>
      <HeaderSection>
        <Typography variant="h2" color={theme.colors.text.light} align="center">
          Settings
        </Typography>
      </HeaderSection>

      <ContentSection>
        {/* Notifications */}
        <SectionTitle>
          <Typography variant="h3">
            Notifications
          </Typography>
        </SectionTitle>
        
        <Card marginBottom="md">
          <SettingRow>
            <SettingInfo>
              <SettingIcon>
                <Ionicons name="notifications" size={20} color={theme.colors.primary} />
              </SettingIcon>
              <Typography variant="body1">
                Push Notifications
              </Typography>
            </SettingInfo>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: theme.colors.lightGray, true: theme.colors.primaryLight }}
              thumbColor={notificationsEnabled ? theme.colors.primary : theme.colors.gray}
            />
          </SettingRow>
          
          <SettingRow>
            <SettingInfo>
              <SettingIcon>
                <MaterialCommunityIcons name="bell-ring" size={20} color={theme.colors.primary} />
              </SettingIcon>
              <Typography variant="body1">
                Health Reminders
              </Typography>
            </SettingInfo>
            <Switch
              value={healthRemindersEnabled}
              onValueChange={setHealthRemindersEnabled}
              trackColor={{ false: theme.colors.lightGray, true: theme.colors.primaryLight }}
              thumbColor={healthRemindersEnabled ? theme.colors.primary : theme.colors.gray}
            />
          </SettingRow>
        </Card>

        {/* Appearance */}
        <SectionTitle>
          <Typography variant="h3">
            Appearance
          </Typography>
        </SectionTitle>
        
        <Card marginBottom="md">
          <SettingRow>
            <SettingInfo>
              <SettingIcon>
                <Ionicons name="moon" size={20} color={theme.colors.primary} />
              </SettingIcon>
              <Typography variant="body1">
                Dark Mode
              </Typography>
            </SettingInfo>
            <Switch
              value={darkModeEnabled}
              onValueChange={setDarkModeEnabled}
              trackColor={{ false: theme.colors.lightGray, true: theme.colors.primaryLight }}
              thumbColor={darkModeEnabled ? theme.colors.primary : theme.colors.gray}
            />
          </SettingRow>
        </Card>

        {/* Security */}
        <SectionTitle>
          <Typography variant="h3">
            Security
          </Typography>
        </SectionTitle>
        
        <Card marginBottom="md">
          <SettingRow>
            <SettingInfo>
              <SettingIcon>
                <Ionicons name="finger-print" size={20} color={theme.colors.primary} />
              </SettingIcon>
              <Typography variant="body1">
                Biometric Authentication
              </Typography>
            </SettingInfo>
            <Switch
              value={biometricAuthEnabled}
              onValueChange={setBiometricAuthEnabled}
              trackColor={{ false: theme.colors.lightGray, true: theme.colors.primaryLight }}
              thumbColor={biometricAuthEnabled ? theme.colors.primary : theme.colors.gray}
            />
          </SettingRow>
          
          <SettingRow>
            <SettingInfo>
              <SettingIcon>
                <Ionicons name="lock-closed" size={20} color={theme.colors.primary} />
              </SettingIcon>
              <Typography variant="body1">
                Change Password
              </Typography>
            </SettingInfo>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.gray} />
          </SettingRow>
        </Card>

        {/* Data */}
        <SectionTitle>
          <Typography variant="h3">
            Data
          </Typography>
        </SectionTitle>
        
        <Card marginBottom="md">
          <SettingRow>
            <SettingInfo>
              <SettingIcon>
                <Ionicons name="cloud-upload" size={20} color={theme.colors.primary} />
              </SettingIcon>
              <Typography variant="body1">
                Automatic Backup
              </Typography>
            </SettingInfo>
            <Switch
              value={dataBackupEnabled}
              onValueChange={setDataBackupEnabled}
              trackColor={{ false: theme.colors.lightGray, true: theme.colors.primaryLight }}
              thumbColor={dataBackupEnabled ? theme.colors.primary : theme.colors.gray}
            />
          </SettingRow>
          
          <SettingRow>
            <SettingInfo>
              <SettingIcon>
                <Ionicons name="download" size={20} color={theme.colors.primary} />
              </SettingIcon>
              <Typography variant="body1">
                Export Health Data
              </Typography>
            </SettingInfo>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.gray} />
          </SettingRow>
        </Card>

        {/* About */}
        <SectionTitle>
          <Typography variant="h3">
            About
          </Typography>
        </SectionTitle>
        
        <Card marginBottom="md">
          <SettingRow>
            <SettingInfo>
              <SettingIcon>
                <Ionicons name="information-circle" size={20} color={theme.colors.primary} />
              </SettingIcon>
              <Typography variant="body1">
                App Version
              </Typography>
            </SettingInfo>
            <Typography variant="body2" color={theme.colors.text.secondary}>
              1.0.0
            </Typography>
          </SettingRow>
          
          <SettingRow>
            <SettingInfo>
              <SettingIcon>
                <Ionicons name="document-text" size={20} color={theme.colors.primary} />
              </SettingIcon>
              <Typography variant="body1">
                Terms of Service
              </Typography>
            </SettingInfo>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.gray} />
          </SettingRow>
          
          <SettingRow>
            <SettingInfo>
              <SettingIcon>
                <Ionicons name="shield" size={20} color={theme.colors.primary} />
              </SettingIcon>
              <Typography variant="body1">
                Privacy Policy
              </Typography>
            </SettingInfo>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.gray} />
          </SettingRow>
        </Card>

        {/* Account Actions */}
        <Button 
          title="Logout" 
          onPress={handleLogout}
          variant="outline"
          fullWidth
          marginTop="lg"
          marginBottom="md"
        />
        
        <Button 
          title="Delete Account" 
          onPress={handleDeleteAccount}
          variant="outline"
          fullWidth
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

const SectionTitle = styled(View)`
  margin-top: ${theme.spacing.lg}px;
  margin-bottom: ${theme.spacing.sm}px;
`;

const SettingRow = styled(TouchableOpacity)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-vertical: ${theme.spacing.md}px;
  border-bottom-width: 1px;
  border-bottom-color: ${theme.colors.lightGray};
  
  &:last-child {
    border-bottom-width: 0;
  }
`;

const SettingInfo = styled(View)`
  flex-direction: row;
  align-items: center;
`;

const SettingIcon = styled(View)`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  background-color: ${theme.colors.background};
  justify-content: center;
  align-items: center;
  margin-right: ${theme.spacing.sm}px;
`;

export default SettingsScreen; 