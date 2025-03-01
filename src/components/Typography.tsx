import React, { ReactNode } from 'react';
import { Text } from 'react-native';
import styled from 'styled-components/native';
import { theme } from '../theme/theme';

interface TypographyProps {
  children: ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body1' | 'body2' | 'caption';
  color?: string;
  align?: 'left' | 'center' | 'right';
  weight?: keyof typeof theme.typography.fontWeight;
  marginBottom?: keyof typeof theme.spacing;
  marginTop?: keyof typeof theme.spacing;
  marginLeft?: keyof typeof theme.spacing;
  marginRight?: keyof typeof theme.spacing;
}

const Typography: React.FC<TypographyProps> = ({
  children,
  variant = 'body1',
  color,
  align = 'left',
  weight,
  marginBottom,
  marginTop,
  marginLeft,
  marginRight,
}) => {
  return (
    <StyledText
      variant={variant}
      color={color}
      align={align}
      weight={weight}
      marginBottom={marginBottom}
      marginTop={marginTop}
      marginLeft={marginLeft}
      marginRight={marginRight}
    >
      {children}
    </StyledText>
  );
};

const StyledText = styled(Text)<{
  variant: 'h1' | 'h2' | 'h3' | 'h4' | 'body1' | 'body2' | 'caption';
  color?: string;
  align: 'left' | 'center' | 'right';
  weight?: keyof typeof theme.typography.fontWeight;
  marginBottom?: keyof typeof theme.spacing;
  marginTop?: keyof typeof theme.spacing;
  marginLeft?: keyof typeof theme.spacing;
  marginRight?: keyof typeof theme.spacing;
}>`
  color: ${({ color }) => color || theme.colors.text.primary};
  text-align: ${({ align }) => align};
  margin-bottom: ${({ marginBottom }) => marginBottom ? `${theme.spacing[marginBottom]}px` : '0px'};
  margin-top: ${({ marginTop }) => marginTop ? `${theme.spacing[marginTop]}px` : '0px'};
  margin-left: ${({ marginLeft }) => marginLeft ? `${theme.spacing[marginLeft]}px` : '0px'};
  margin-right: ${({ marginRight }) => marginRight ? `${theme.spacing[marginRight]}px` : '0px'};
  
  ${({ variant, weight }) => {
    let fontSize;
    let fontWeight = weight ? theme.typography.fontWeight[weight] : undefined;
    
    switch (variant) {
      case 'h1':
        fontSize = theme.typography.fontSize.xxxl;
        fontWeight = fontWeight || theme.typography.fontWeight.bold;
        break;
      case 'h2':
        fontSize = theme.typography.fontSize.xxl;
        fontWeight = fontWeight || theme.typography.fontWeight.bold;
        break;
      case 'h3':
        fontSize = theme.typography.fontSize.xl;
        fontWeight = fontWeight || theme.typography.fontWeight.bold;
        break;
      case 'h4':
        fontSize = theme.typography.fontSize.lg;
        fontWeight = fontWeight || theme.typography.fontWeight.medium;
        break;
      case 'body1':
        fontSize = theme.typography.fontSize.md;
        fontWeight = fontWeight || theme.typography.fontWeight.regular;
        break;
      case 'body2':
        fontSize = theme.typography.fontSize.sm;
        fontWeight = fontWeight || theme.typography.fontWeight.regular;
        break;
      case 'caption':
        fontSize = theme.typography.fontSize.xs;
        fontWeight = fontWeight || theme.typography.fontWeight.regular;
        break;
      default:
        fontSize = theme.typography.fontSize.md;
        fontWeight = fontWeight || theme.typography.fontWeight.regular;
    }
    
    return `
      font-size: ${fontSize}px;
      font-weight: ${fontWeight};
    `;
  }}
`;

export default Typography; 