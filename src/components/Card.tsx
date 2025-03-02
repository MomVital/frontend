import React, { ReactNode } from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { theme } from '../theme/theme';

interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: keyof typeof theme.spacing;
  margin?: keyof typeof theme.spacing;
  marginTop?: keyof typeof theme.spacing;
  marginBottom?: keyof typeof theme.spacing;
  marginLeft?: keyof typeof theme.spacing;
  marginRight?: keyof typeof theme.spacing;
  borderRadius?: keyof typeof theme.borderRadius;
  width?: string | number;
  backgroundColor?: string;
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  margin,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
  borderRadius = 'md',
  width = '100%',
  backgroundColor,
}) => {
  return (
    <StyledCard
      variant={variant}
      padding={padding}
      margin={margin}
      marginTop={marginTop}
      marginBottom={marginBottom}
      marginLeft={marginLeft}
      marginRight={marginRight}
      borderRadius={borderRadius}
      width={width}
      backgroundColor={backgroundColor}
    >
      {children}
    </StyledCard>
  );
};

const StyledCard = styled(View)<{
  variant: 'default' | 'outlined' | 'elevated';
  padding: keyof typeof theme.spacing;
  margin?: keyof typeof theme.spacing;
  marginTop?: keyof typeof theme.spacing;
  marginBottom?: keyof typeof theme.spacing;
  marginLeft?: keyof typeof theme.spacing;
  marginRight?: keyof typeof theme.spacing;
  borderRadius: keyof typeof theme.borderRadius;
  width: string | number;
  backgroundColor?: string;
}>`
  background-color: ${({ backgroundColor }) => backgroundColor || theme.colors.white};
  padding: ${({ padding }) => `${theme.spacing[padding]}px`};
  margin: ${({ margin }) => margin ? `${theme.spacing[margin]}px` : '0px'};
  margin-top: ${({ marginTop }) => marginTop ? `${theme.spacing[marginTop]}px` : '0px'};
  margin-bottom: ${({ marginBottom }) => marginBottom ? `${theme.spacing[marginBottom]}px` : '0px'};
  margin-left: ${({ marginLeft }) => marginLeft ? `${theme.spacing[marginLeft]}px` : '0px'};
  margin-right: ${({ marginRight }) => marginRight ? `${theme.spacing[marginRight]}px` : '0px'};
  border-radius: ${({ borderRadius }) => `${theme.borderRadius[borderRadius]}px`};
  width: ${({ width }) => (typeof width === 'number' ? `${width}px` : width)};
  
  ${({ variant }) => {
    if (variant === 'outlined') {
      return `
        border-width: 1px;
        border-color: ${theme.colors.lightGray};
      `;
    }
    
    if (variant === 'elevated') {
      return `
        shadow-color: ${theme.shadows.medium.shadowColor};
        shadow-offset: ${theme.shadows.medium.shadowOffset.width}px ${theme.shadows.medium.shadowOffset.height}px;
        shadow-opacity: ${theme.shadows.medium.shadowOpacity};
        shadow-radius: ${theme.shadows.medium.shadowRadius}px;
        elevation: ${theme.shadows.medium.elevation};
      `;
    }
    
    return '';
  }}
`;

export default Card; 