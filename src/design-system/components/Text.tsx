import React from 'react';
import {
  Text as RNText,
  TextProps as RNTextProps,
  StyleSheet,
  TextStyle,
} from 'react-native';
import { colors, typography } from '../tokens';

type Variant = keyof typeof typography;

export interface TextProps extends RNTextProps {
  variant?: Variant;
  color?: string;
  align?: TextStyle['textAlign'];
  children: React.ReactNode;
}

export function Text({
  variant = 'body',
  color = colors.textPrimary,
  align,
  style,
  children,
  ...rest
}: TextProps) {
  return (
    <RNText
      style={[typography[variant], { color, textAlign: align }, style]}
      {...rest}
    >
      {children}
    </RNText>
  );
}

export function PriceText({
  amount,
  suffix = '/mo',
  size = 'default',
  style,
}: {
  amount: number;
  suffix?: string;
  size?: 'default' | 'large' | 'small';
  style?: TextStyle;
}) {
  const formatted = `₹${amount.toLocaleString('en-IN')}`;
  return (
    <RNText
      style={[
        size === 'large' ? typography.numberLarge : size === 'small' ? typography.number : typography.numberPrice,
        { color: colors.textPrimary },
        style,
      ]}
    >
      {formatted}
      {suffix ? (
        <RNText style={[typography.caption, { color: colors.textSecondary }]}>
          {` ${suffix}`}
        </RNText>
      ) : null}
    </RNText>
  );
}

const styles = StyleSheet.create({});
