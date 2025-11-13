export const theme = {
  colors: {
    // Primária - Azul Tech
    primary: '#2D6CDF',
    primaryDark: '#1B4FB8',
    primaryLight: '#6FA2FF',
    
    // Secundária - Roxo SoftSkill
    secondary: '#8458FF',
    secondaryDark: '#6E3FFF',
    secondaryLight: '#CAB7FF',
    
    // Neutros
    white: '#FFFFFF',
    background: '#F5F7FA',
    border: '#E4E7EB',
    textSecondary: '#9AA5B1',
    textPrimary: '#323F4B',
    textStrong: '#0F1419',
    
    // Estados
    success: '#2ECC71',
    warning: '#F39C12',
    error: '#E74C3C',
    
    // Transparências
    overlay: 'rgba(15, 20, 25, 0.5)',
  },
  
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: '700' as const,
      lineHeight: 40,
      color: '#0F1419',
    },
    h2: {
      fontSize: 24,
      fontWeight: '600' as const,
      lineHeight: 32,
      color: '#0F1419',
    },
    h3: {
      fontSize: 20,
      fontWeight: '600' as const,
      lineHeight: 28,
      color: '#323F4B',
    },
    body: {
      fontSize: 16,
      fontWeight: '400' as const,
      lineHeight: 24,
      color: '#323F4B',
    },
    small: {
      fontSize: 14,
      fontWeight: '400' as const,
      lineHeight: 20,
      color: '#323F4B',
    },
    caption: {
      fontSize: 12,
      fontWeight: '400' as const,
      lineHeight: 16,
      color: '#9AA5B1',
    },
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
  },
  
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
  },
  
  shadows: {
    card: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 6,
      elevation: 2,
    },
  },
};

export type Theme = typeof theme;

