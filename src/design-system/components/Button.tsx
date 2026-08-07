import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { colors, radius, spacing, touchTarget, motion } from '../tokens';
import { Text } from './Text';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger' | 'soft';
type Size = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  style,
}: ButtonProps) {
  const scale = useSharedValue(1);
  const isDisabled = disabled || loading;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, motion.spring.gentle);
  };
  const handlePressOut = () => {
    scale.value = withSpring(1, motion.spring.soft);
  };
  const handlePress = () => {
    if (isDisabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };

  const sizeStyle = sizeStyles[size];
  const variantStyle = variantStyles[variant];

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      style={[
        styles.base,
        sizeStyle,
        variantStyle.container,
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        animatedStyle,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' || variant === 'danger' ? colors.textInverse : colors.primary}
        />
      ) : (
        <>
          {leftIcon}
          <Text
            variant={size === 'sm' ? 'buttonSmall' : 'button'}
            color={isDisabled ? colors.disabled : variantStyle.text}
            style={leftIcon || rightIcon ? { marginHorizontal: spacing.sm } : undefined}
          >
            {title}
          </Text>
          {rightIcon}
        </>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.control,
    minHeight: touchTarget.min,
  },
  fullWidth: { width: '100%' },
  disabled: { opacity: 0.55 },
});

const sizeStyles = StyleSheet.create({
  sm: { paddingHorizontal: spacing.lg, minHeight: 40, borderRadius: radius.md },
  md: { paddingHorizontal: spacing['2xl'], minHeight: touchTarget.min },
  lg: { paddingHorizontal: spacing['3xl'], minHeight: 56, borderRadius: radius.lg },
});

const variantStyles: Record<Variant, { container: ViewStyle; text: string }> = {
  primary: {
    container: { backgroundColor: colors.primary },
    text: colors.textOnPrimary,
  },
  secondary: {
    container: { backgroundColor: colors.textPrimary },
    text: colors.textInverse,
  },
  soft: {
    container: { backgroundColor: colors.primaryLight },
    text: colors.primaryDark,
  },
  outline: {
    container: {
      backgroundColor: colors.surface,
      borderWidth: 1.5,
      borderColor: colors.borderStrong,
    },
    text: colors.textPrimary,
  },
  ghost: {
    container: { backgroundColor: 'transparent' },
    text: colors.primaryDark,
  },
  danger: {
    container: { backgroundColor: colors.error },
    text: colors.textInverse,
  },
};
