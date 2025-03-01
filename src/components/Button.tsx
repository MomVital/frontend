import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import { theme } from '../theme/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  marginTop?: keyof typeof theme.spacing;
  marginBottom?: keyof typeof theme.spacing;
  marginLeft?: keyof typeof theme.spacing;
  marginRight?: keyof typeof theme.spacing;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
}) => {
  return (
    <StyledButton
      onPress={onPress}
      variant={variant}
      size={size}
      disabled={disabled || loading}
      fullWidth={fullWidth}
      marginTop={marginTop}
      marginBottom={marginBottom}
      marginLeft={marginLeft}
      marginRight={marginRight}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? theme.colors.primary : theme.colors.white} />
      ) : (
        <ButtonText variant={variant} size={size}>
          {title}
        </ButtonText>
      )}
    </StyledButton>
  );
};

const StyledButton = styled(TouchableOpacity)<{
  variant: 'primary' | 'secondary' | 'outline';
  size: 'small' | 'medium' | 'large';
  disabled: boolean;
  fullWidth: boolean;
  marginTop?: keyof typeof theme.spacing;
  marginBottom?: keyof typeof theme.spacing;
  marginLeft?: keyof typeof theme.spacing;
  marginRight?: keyof typeof theme.spacing;
}>`
  background-color: ${({ variant, disabled }) => {
    if (disabled) return theme.colors.lightGray;
    if (variant === 'primary') return theme.colors.primary;
    if (variant === 'secondary') return theme.colors.secondary;
    return 'transparent';
  }};
  
  border-radius: ${({ size }) => {
    if (size === 'small') return `${theme.borderRadius.sm}px`;
    if (size === 'medium') return `${theme.borderRadius.md}px`;
    return `${theme.borderRadius.lg}px`;
  }};
  
  padding: ${({ size }) => {
    if (size === 'small') return `${theme.spacing.xs}px ${theme.spacing.sm}px`;
    if (size === 'medium') return `${theme.spacing.sm}px ${theme.spacing.md}px`;
    return `${theme.spacing.md}px ${theme.spacing.lg}px`;
  }};
  
  border-width: ${({ variant }) => (variant === 'outline' ? '2px' : '0')};
  border-color: ${({ disabled }) => disabled ? theme.colors.lightGray : theme.colors.primary};
  
  align-items: center;
  justify-content: center;
  opacity: ${({ disabled }) => (disabled ? 0.7 : 1)};
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
  
  margin-top: ${({ marginTop }) => marginTop ? `${theme.spacing[marginTop]}px` : '0px'};
  margin-bottom: ${({ marginBottom }) => marginBottom ? `${theme.spacing[marginBottom]}px` : '0px'};
  margin-left: ${({ marginLeft }) => marginLeft ? `${theme.spacing[marginLeft]}px` : '0px'};
  margin-right: ${({ marginRight }) => marginRight ? `${theme.spacing[marginRight]}px` : '0px'};
`;

const ButtonText = styled(Text)<{
  variant: 'primary' | 'secondary' | 'outline';
  size: 'small' | 'medium' | 'large';
}>`
  color: ${({ variant }) => {
    if (variant === 'outline') return theme.colors.primary;
    return theme.colors.white;
  }};
  
  font-size: ${({ size }) => {
    if (size === 'small') return `${theme.typography.fontSize.sm}px`;
    if (size === 'medium') return `${theme.typography.fontSize.md}px`;
    return `${theme.typography.fontSize.lg}px`;
  }};
  
  font-weight: ${theme.typography.fontWeight.medium};
`;

export default Button; 