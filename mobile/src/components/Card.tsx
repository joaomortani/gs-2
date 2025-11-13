import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '../theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'success';
}

export const Card: React.FC<CardProps> = ({ children, style, variant = 'default' }) => {
  const cardStyle = variant === 'success' 
    ? [styles.card, styles.cardSuccess, style]
    : [styles.card, style];

  return (
    <View 
      style={cardStyle}
      accessible
      accessibilityRole="none"
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    ...theme.shadows.card,
  },
  cardSuccess: {
    backgroundColor: '#F0FDF4',
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.success,
  },
});

