import React from 'react';
import { View, Image } from 'react-native';
import styled from 'styled-components/native';
import { SvgXml } from 'react-native-svg';

import Typography from './Typography';
import { theme } from '../theme/theme';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  color?: string;
}

const momVitalLogo = `
<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M32.25 6C35.5833 6 38.3753 7.23333 40.626 9.7C42.8767 12.1667 44.0013 15.1 44 18.5C44 19.1 43.9667 19.692 43.9 20.276C43.8333 20.86 43.7167 21.4347 43.55 22H31.05L27.65 16.9C27.4833 16.6333 27.25 16.4167 26.95 16.25C26.65 16.0833 26.3333 16 26 16C25.5667 16 25.1753 16.1333 24.826 16.4C24.4767 16.6667 24.2347 17 24.1 17.4L21.4 25.5L19.65 22.9C19.4833 22.6333 19.25 22.4167 18.95 22.25C18.65 22.0833 18.3333 22 18 22H4.45C4.28333 21.4333 4.16667 20.8587 4.1 20.276C4.03333 19.6933 4 19.118 4 18.55C4 15.1167 5.11667 12.1667 7.35 9.7C9.58333 7.23333 12.3667 6 15.7 6C17.3 6 18.8087 6.31667 20.226 6.95C21.6433 7.58333 22.9013 8.46667 24 9.6C25.0667 8.46667 26.3087 7.58333 27.726 6.95C29.1433 6.31667 30.6513 6 32.25 6ZM24 42C23.4 42 22.8253 41.892 22.276 41.676C21.7267 41.46 21.2347 41.1347 20.8 40.7L7.4 27.25C7.2 27.05 7.01667 26.85 6.85 26.65C6.68333 26.45 6.51667 26.2333 6.35 26H16.9L20.3 31.1C20.4667 31.3667 20.7 31.5833 21 31.75C21.3 31.9167 21.6167 32 21.95 32C22.3833 32 22.7833 31.8667 23.15 31.6C23.5167 31.3333 23.7667 31 23.9 30.6L26.6 22.5L28.3 25.1C28.5 25.3667 28.75 25.5833 29.05 25.75C29.35 25.9167 29.6667 26 30 26H41.6L41.1 26.6L40.6 27.2L27.15 40.7C26.7167 41.1333 26.2333 41.4587 25.7 41.676C25.1667 41.8933 24.6 42.0013 24 42Z" fill="currentColor"/>
</svg>
`;

const Logo: React.FC<LogoProps> = ({ 
  size = 'medium', 
  showText = true,
  color = theme.colors.primary
}) => {
  const logoSize = size === 'small' ? 32 : size === 'medium' ? 48 : 64;
  
  return (
    <LogoContainer>
      <SvgXml 
        xml={momVitalLogo.replace('currentColor', color)} 
        width={logoSize} 
        height={logoSize} 
      />
      {showText && (
        <LogoText size={size} color={color}>
          <Typography 
            variant={size === 'small' ? 'h4' : size === 'medium' ? 'h3' : 'h2'} 
            color={color}
            weight="bold"
          >
            MomVital
          </Typography>
        </LogoText>
      )}
    </LogoContainer>
  );
};

const LogoContainer = styled(View)`
  flex-direction: row;
  align-items: center;
`;

const LogoText = styled(View)<{ size: 'small' | 'medium' | 'large', color: string }>`
  margin-left: ${({ size }) => size === 'small' ? '8px' : size === 'medium' ? '12px' : '16px'};
`;

export default Logo; 