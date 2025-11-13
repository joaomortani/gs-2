import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ViewStyle, Animated } from 'react-native';
import { theme } from '../theme';

interface ProgressBarProps {
  progress: number; // 0-100
  showLabel?: boolean;
  style?: ViewStyle;
  height?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  showLabel = false,
  style,
  height = 8,
}) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: clampedProgress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [clampedProgress]);

  const widthInterpolation = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={style} accessible accessibilityLabel={`Progresso: ${Math.round(clampedProgress)} por cento`} accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: clampedProgress }}>
      {showLabel && (
        <Text style={styles.label}>{Math.round(clampedProgress)}%</Text>
      )}
      <View style={[styles.container, { height }]}>
        <Animated.View
          style={[
            styles.fill,
            { width: widthInterpolation, height },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    overflow: 'hidden',
  },
  fill: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.sm,
  },
  label: {
    ...theme.typography.caption,
    marginBottom: theme.spacing.xs,
    textAlign: 'right',
  },
});

