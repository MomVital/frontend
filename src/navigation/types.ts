import { TempData } from "../utils/apiService";

export type RootStackParamList = {
  Home: undefined;
  Scan: undefined;
  Analysis: { scanId?: string, tempData?: TempData };
  AiSuggestions: { scanId?: string, tempData?: TempData  };
  Profile: undefined;
  Registration: undefined;
  Settings: undefined;
  Main: undefined;
  PregnancyTracker: undefined;
};

export type TabParamList = {
  HomeTab: undefined;
  ScanTab: undefined;
  TrackerTab: undefined;
  ProfileTab: undefined;
}; 