import React, { ReactNode } from 'react';
import { View, SafeAreaView, ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { theme } from '../theme/theme';

interface ContainerProps {
  children: ReactNode;
  padding?: keyof typeof theme.spacing;
  backgroundColor?: string;
  scroll?: boolean;
  safeArea?: boolean;
  center?: boolean;
}

const Container: React.FC<ContainerProps> = ({
  children,
  padding = 'md',
  backgroundColor = theme.colors.background,
  scroll = false,
  safeArea = true,
  center = false,
}) => {
  const content = (
    <StyledView padding={padding} backgroundColor={backgroundColor} center={center}>
      {children}
    </StyledView>
  );

  if (safeArea && scroll) {
    return (
      <StyledSafeAreaView backgroundColor={backgroundColor}>
        <StyledScrollView>{content}</StyledScrollView>
      </StyledSafeAreaView>
    );
  }

  if (safeArea) {
    return (
      <StyledSafeAreaView backgroundColor={backgroundColor}>
        {content}
      </StyledSafeAreaView>
    );
  }

  if (scroll) {
    return <StyledScrollView backgroundColor={backgroundColor}>{content}</StyledScrollView>;
  }

  return content;
};

const StyledView = styled(View)<{
  padding: keyof typeof theme.spacing;
  backgroundColor: string;
  center: boolean;
}>`
  flex: 1;
  padding: ${({ padding }) => `${theme.spacing[padding]}px`};
  background-color: ${({ backgroundColor }) => backgroundColor};
  ${({ center }) => center && 'justify-content: center; align-items: center;'}
`;

const StyledSafeAreaView = styled(SafeAreaView)<{
  backgroundColor: string;
}>`
  flex: 1;
  background-color: ${({ backgroundColor }) => backgroundColor};
`;

const StyledScrollView = styled(ScrollView)<{
  backgroundColor?: string;
}>`
  flex: 1;
  background-color: ${({ backgroundColor }) => backgroundColor || 'transparent'};
`;

export default Container; 