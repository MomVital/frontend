import React, { ReactNode } from 'react';
import { View, ScrollView, SafeAreaView } from 'react-native';
import styled from 'styled-components/native';
import { theme } from '../theme/theme';

interface ContainerProps {
  children: ReactNode;
  scroll?: boolean;
  center?: boolean;
  backgroundColor?: string;
  safeArea?: boolean;
  padding?: keyof typeof theme.spacing;
}

const Container: React.FC<ContainerProps> = ({
  children,
  scroll = false,
  center = false,
  backgroundColor = theme.colors.background,
  safeArea = true,
  padding,
}) => {
  const content = (
    <ContainerView
      center={center}
      backgroundColor={backgroundColor}
      padding={padding}
    >
      {children}
    </ContainerView>
  );

  if (scroll) {
    return safeArea ? (
      <StyledSafeAreaView backgroundColor={backgroundColor}>
        <ScrollContainer showsVerticalScrollIndicator={false}>
          {content}
        </ScrollContainer>
      </StyledSafeAreaView>
    ) : (
      <ScrollContainer 
        showsVerticalScrollIndicator={false}
        backgroundColor={backgroundColor}
      >
        {content}
      </ScrollContainer>
    );
  }

  return safeArea ? (
    <StyledSafeAreaView backgroundColor={backgroundColor}>
      {content}
    </StyledSafeAreaView>
  ) : (
    content
  );
};

const StyledSafeAreaView = styled(SafeAreaView)<{
  backgroundColor: string;
}>`
  flex: 1;
  background-color: ${({ backgroundColor }) => backgroundColor};
`;

const ScrollContainer = styled(ScrollView)<{
  backgroundColor?: string;
}>`
  flex: 1;
  background-color: ${({ backgroundColor }) => backgroundColor || theme.colors.background};
`;

const ContainerView = styled(View)<{
  center: boolean;
  backgroundColor: string;
  padding?: keyof typeof theme.spacing;
}>`
  flex: 1;
  background-color: ${({ backgroundColor }) => backgroundColor};
  justify-content: ${({ center }) => (center ? 'center' : 'flex-start')};
  align-items: ${({ center }) => (center ? 'center' : 'stretch')};
  padding: ${({ padding }) => padding ? `${theme.spacing[padding]}px` : '0px'};
`;

export default Container; 