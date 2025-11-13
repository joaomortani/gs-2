import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { theme } from '../theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  textStyle,
  accessibilityLabel,
  accessibilityHint,
}) => {
  const getButtonStyle = () => {
    if (disabled || loading) {
      return [styles.button, styles.disabled, style];
    }
    
    switch (variant) {
      case 'primary':
        return [styles.button, styles.primary, style];
      case 'secondary':
        return [styles.button, styles.secondary, style];
      case 'outline':
        return [styles.button, styles.outline, style];
      default:
        return [styles.button, styles.primary, style];
    }
  };

  const getTextStyle = () => {
    if (disabled || loading) {
      return [styles.text, styles.textDisabled, textStyle];
    }
    
    switch (variant) {
      case 'primary':
        return [styles.text, styles.textPrimary, textStyle];
      case 'secondary':
        return [styles.text, styles.textSecondary, textStyle];
      case 'outline':
        return [styles.text, styles.textOutline, textStyle];
      default:
        return [styles.text, styles.textPrimary, textStyle];
    }
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      accessible
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: disabled || loading }}
    >
      {loading ? (
        <ActivityIndicator color={theme.colors.white} />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  primary: {
    backgroundColor: theme.colors.primary,
  },
  secondary: {
    backgroundColor: theme.colors.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  disabled: {
    backgroundColor: theme.colors.border,
  },
  text: {
    ...theme.typography.body,
    fontWeight: '600',
  },
  textPrimary: {
    color: theme.colors.white,
  },
  textSecondary: {
    color: theme.colors.white,
  },
  textOutline: {
    color: theme.colors.primary,
  },
  textDisabled: {
    color: theme.colors.textSecondary,
  },
});

