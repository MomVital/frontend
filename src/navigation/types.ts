import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Auth: undefined;
  Main: NavigatorScreenParams<MainTabParamList>;
  Scan: undefined;
  Analysis: { scanId: string };
  AISuggestions: { scanId: string };
};

export type MainTabParamList = {
  Home: undefined;
  History: undefined;
  Profile: undefined;
  Settings: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
}; 