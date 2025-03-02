import React, { useState } from 'react';
import { View, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';

import Container from '../components/Container';
import Typography from '../components/Typography';
import Button from '../components/Button';
import { theme } from '../theme/theme';
import { RootStackParamList } from '../navigation/types';

type RegistrationScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Registration'>;

const RegistrationScreen: React.FC = () => {
  const navigation = useNavigation<RegistrationScreenNavigationProp>();
  
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [age, setAge] = useState('');
  const [pregnancyWeek, setPregnancyWeek] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  
  // Form validation
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const validateForm = () => {
    let isValid = true;
    
    // Validate name
    if (!name.trim()) {
      setNameError('Name is required');
      isValid = false;
    } else {
      setNameError('');
    }
    
    // Validate email
    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email');
      isValid = false;
    } else {
      setEmailError('');
    }
    
    // Validate password
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      isValid = false;
    } else {
      setPasswordError('');
    }
    
    // Validate confirm password
    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    } else {
      setConfirmPasswordError('');
    }
    
    // Validate terms agreement
    if (!agreeToTerms) {
      Alert.alert('Terms & Conditions', 'Please agree to the terms and conditions to continue.');
      isValid = false;
    }
    
    return isValid;
  };
  
  const handleRegister = () => {
    if (validateForm()) {
      // In a real app, this would call an API to register the user
      Alert.alert(
        "Registration Successful",
        "Your account has been created successfully!",
        [
          { 
            text: "Continue", 
            onPress: () => navigation.navigate('Home')
          }
        ]
      );
    }
  };

  return (
    <Container scroll>
      <ContentSection>
        <Typography variant="h2" color={theme.colors.primary} align="center" marginBottom="lg">
          Create Your Account
        </Typography>
        
        {/* Personal Information */}
        <SectionTitle>
          <Typography variant="h3" marginBottom="sm">
            Personal Information
          </Typography>
        </SectionTitle>
        
        <FormGroup>
          <InputLabel>
            <Typography variant="body2">Full Name</Typography>
          </InputLabel>
          <StyledInput
            placeholder="Enter your full name"
            value={name}
            onChangeText={setName}
            error={!!nameError}
          />
          {nameError ? (
            <ErrorText>
              <Typography variant="caption" color={theme.colors.error}>
                {nameError}
              </Typography>
            </ErrorText>
          ) : null}
        </FormGroup>
        
        <FormGroup>
          <InputLabel>
            <Typography variant="body2">Email</Typography>
          </InputLabel>
          <StyledInput
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            error={!!emailError}
          />
          {emailError ? (
            <ErrorText>
              <Typography variant="caption" color={theme.colors.error}>
                {emailError}
              </Typography>
            </ErrorText>
          ) : null}
        </FormGroup>
        
        <FormGroup>
          <InputLabel>
            <Typography variant="body2">Password</Typography>
          </InputLabel>
          <PasswordInputContainer error={!!passwordError}>
            <PasswordInput
              placeholder="Create a password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <PasswordToggle onPress={() => setShowPassword(!showPassword)}>
              <Ionicons 
                name={showPassword ? "eye-off" : "eye"} 
                size={24} 
                color={theme.colors.gray} 
              />
            </PasswordToggle>
          </PasswordInputContainer>
          {passwordError ? (
            <ErrorText>
              <Typography variant="caption" color={theme.colors.error}>
                {passwordError}
              </Typography>
            </ErrorText>
          ) : null}
        </FormGroup>
        
        <FormGroup>
          <InputLabel>
            <Typography variant="body2">Confirm Password</Typography>
          </InputLabel>
          <PasswordInputContainer error={!!confirmPasswordError}>
            <PasswordInput
              placeholder="Confirm your password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
            />
            <PasswordToggle onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Ionicons 
                name={showConfirmPassword ? "eye-off" : "eye"} 
                size={24} 
                color={theme.colors.gray} 
              />
            </PasswordToggle>
          </PasswordInputContainer>
          {confirmPasswordError ? (
            <ErrorText>
              <Typography variant="caption" color={theme.colors.error}>
                {confirmPasswordError}
              </Typography>
            </ErrorText>
          ) : null}
        </FormGroup>
        
        {/* Pregnancy Information */}
        <SectionTitle>
          <Typography variant="h3" marginBottom="sm">
            Pregnancy Information
          </Typography>
        </SectionTitle>
        
        <FormGroup>
          <InputLabel>
            <Typography variant="body2">Age</Typography>
          </InputLabel>
          <StyledInput
            placeholder="Enter your age"
            value={age}
            onChangeText={setAge}
            keyboardType="number-pad"
          />
        </FormGroup>
        
        <FormGroup>
          <InputLabel>
            <Typography variant="body2">Current Pregnancy Week</Typography>
          </InputLabel>
          <StyledInput
            placeholder="Enter current week of pregnancy"
            value={pregnancyWeek}
            onChangeText={setPregnancyWeek}
            keyboardType="number-pad"
          />
        </FormGroup>
        
        <FormGroup>
          <InputLabel>
            <Typography variant="body2">Expected Due Date</Typography>
          </InputLabel>
          <StyledInput
            placeholder="MM/DD/YYYY"
            value={dueDate}
            onChangeText={setDueDate}
          />
        </FormGroup>
        
        {/* Terms and Conditions */}
        <TermsContainer>
          <TermsCheckbox onPress={() => setAgreeToTerms(!agreeToTerms)}>
            <CheckboxBox isChecked={agreeToTerms}>
              {agreeToTerms && <Ionicons name="checkmark" size={16} color={theme.colors.white} />}
            </CheckboxBox>
          </TermsCheckbox>
          <TermsText>
            <Typography variant="body2">
              I agree to the 
            </Typography>
            <TouchableOpacity>
              <Typography variant="body2" color={theme.colors.primary}>
                Terms of Service
              </Typography>
            </TouchableOpacity>
            <Typography variant="body2">
              {' '}and{' '}
            </Typography>
            <TouchableOpacity>
              <Typography variant="body2" color={theme.colors.primary}>
                Privacy Policy
              </Typography>
            </TouchableOpacity>
          </TermsText>
        </TermsContainer>
        
        <Button 
          title="Create Account" 
          onPress={handleRegister}
          size="large"
          fullWidth
          marginTop="lg"
          marginBottom="md"
        />
        
        <AlreadyHaveAccount>
          <Typography variant="body2">
            Already have an account?{' '}
          </Typography>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Typography variant="body2" color={theme.colors.primary} weight="bold">
              Sign In
            </Typography>
          </TouchableOpacity>
        </AlreadyHaveAccount>
      </ContentSection>
    </Container>
  );
};

const ContentSection = styled(View)`
  padding: ${theme.spacing.md}px;
  padding-top: ${theme.spacing.xl}px;
`;

const SectionTitle = styled(View)`
  margin-top: ${theme.spacing.lg}px;
`;

const FormGroup = styled(View)`
  margin-bottom: ${theme.spacing.md}px;
`;

const InputLabel = styled(View)`
  margin-bottom: ${theme.spacing.xs}px;
`;

const StyledInput = styled(TextInput)<{ error?: boolean }>`
  background-color: ${theme.colors.white};
  padding: ${theme.spacing.sm}px ${theme.spacing.md}px;
  border-radius: ${theme.borderRadius.md}px;
  border-width: 1px;
  border-color: ${({ error }) => error ? theme.colors.error : theme.colors.lightGray};
  font-size: ${theme.typography.fontSize.md}px;
`;

const PasswordInputContainer = styled(View)<{ error?: boolean }>`
  flex-direction: row;
  align-items: center;
  background-color: ${theme.colors.white};
  border-radius: ${theme.borderRadius.md}px;
  border-width: 1px;
  border-color: ${({ error }) => error ? theme.colors.error : theme.colors.lightGray};
`;

const PasswordInput = styled(TextInput)`
  flex: 1;
  padding: ${theme.spacing.sm}px ${theme.spacing.md}px;
  font-size: ${theme.typography.fontSize.md}px;
`;

const PasswordToggle = styled(TouchableOpacity)`
  padding: ${theme.spacing.sm}px;
`;

const ErrorText = styled(View)`
  margin-top: ${theme.spacing.xs}px;
`;

const TermsContainer = styled(View)`
  flex-direction: row;
  align-items: flex-start;
  margin-top: ${theme.spacing.md}px;
  margin-bottom: ${theme.spacing.md}px;
`;

const TermsCheckbox = styled(TouchableOpacity)`
  padding: ${theme.spacing.xs}px;
  margin-right: ${theme.spacing.xs}px;
`;

const CheckboxBox = styled(View)<{ isChecked: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: ${theme.borderRadius.sm}px;
  border-width: 1px;
  border-color: ${({ isChecked }) => isChecked ? theme.colors.primary : theme.colors.gray};
  background-color: ${({ isChecked }) => isChecked ? theme.colors.primary : 'transparent'};
  justify-content: center;
  align-items: center;
`;

const TermsText = styled(View)`
  flex: 1;
  flex-direction: row;
  flex-wrap: wrap;
`;

const AlreadyHaveAccount = styled(View)`
  flex-direction: row;
  justify-content: center;
  margin-bottom: ${theme.spacing.xl}px;
`;

export default RegistrationScreen;