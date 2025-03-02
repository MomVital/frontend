export const theme = {
  colors: {
    primary: '#FF69B4', // Hot Pink
    primaryLight: '#FFB6C1', // Light Pink
    primaryDark: '#C71585', // Medium Violet Red
    secondary: '#FFC0CB', // Pink
    accent: '#FF1493', // Deep Pink
    background: '#FFF0F5', // Lavender Blush
    white: '#FFFFFF',
    black: '#000000',
    gray: '#808080',
    lightGray: '#D3D3D3',
    error: '#FF0000',
    success: '#4CAF50',
    warning: '#FFC107',
    text: {
      primary: '#333333',
      secondary: '#666666',
      light: '#FFFFFF',
    }
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
    xl: 24,
    round: 9999,
  },
  typography: {
    fontFamily: {
      regular: 'System',
      bold: 'System',
    },
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 32,
    },
    fontWeight: {
      light: '300',
      regular: '400',
      medium: '500',
      bold: '700',
    },
  },
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
      elevation: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      elevation: 8,
    },
  },
};

export type Theme = typeof theme; 