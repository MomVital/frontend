import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import styled from 'styled-components/native';
import { theme } from '../theme/theme';

interface LoadingIndicatorProps {
  size?: 'small' | 'large';
  color?: string;
  fullScreen?: boolean;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  size = 'large',
  color = theme.colors.primary,
  fullScreen = false,
}) => {
  if (fullScreen) {
    return (
      <FullScreenContainer>
        <ActivityIndicator size={size} color={color} />
      </FullScreenContainer>
    );
  }

  return (
    <Container>
      <ActivityIndicator size={size} color={color} />
    </Container>
  );
};

const Container = styled(View)`
  padding: ${theme.spacing.md}px;
  justify-content: center;
  align-items: center;
`;

const FullScreenContainer = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${theme.colors.white}80;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
`;

export default LoadingIndicator; 