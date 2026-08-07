import React from 'react';
import {
  TextInput,
  View,
  StyleSheet,
  TextInputProps,
  Pressable,
} from 'react-native';
import { colors, radius, spacing, typography, touchTarget } from '../tokens';
import { Text } from './Text';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightPress?: () => void;
}

export function Input({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  onRightPress,
  style,
  ...rest
}: InputProps) {
  return (
    <View style={styles.wrap}>
      {label ? (
        <Text variant="captionMedium" color={colors.textSecondary} style={styles.label}>
          {label}
        </Text>
      ) : null}
      <View
        style={[
          styles.field,
          error ? styles.fieldError : null,
          rest.editable === false ? styles.fieldDisabled : null,
        ]}
      >
        {leftIcon ? <View style={styles.icon}>{leftIcon}</View> : null}
        <TextInput
          placeholderTextColor={colors.textTertiary}
          style={[styles.input, style]}
          {...rest}
        />
        {rightIcon ? (
          <Pressable
            onPress={onRightPress}
            hitSlop={8}
            style={styles.icon}
            accessibilityRole="button"
          >
            {rightIcon}
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <Text variant="small" color={colors.error} style={styles.meta}>
          {error}
        </Text>
      ) : hint ? (
        <Text variant="small" color={colors.textTertiary} style={styles.meta}>
          {hint}
        </Text>
      ) : null}
    </View>
  );
}

export function SearchBar({
  value,
  onChangeText,
  onPress,
  onFilterPress,
  placeholder = 'Search city, college, or area…',
  showFilter,
}: {
  value?: string;
  onChangeText?: (t: string) => void;
  onPress?: () => void;
  onFilterPress?: () => void;
  placeholder?: string;
  showFilter?: boolean;
}) {
  const content = (
    <View style={styles.searchRow}>
      <View style={styles.searchField}>
        <Text
          variant="body"
          color={value ? colors.textPrimary : colors.textTertiary}
          numberOfLines={1}
          style={{ flex: 1 }}
        >
          {value || placeholder}
        </Text>
      </View>
      {showFilter ? (
        <Pressable
          onPress={onFilterPress}
          style={styles.filterBtn}
          accessibilityLabel="Open filters"
          accessibilityRole="button"
        >
          <Text variant="captionMedium" color={colors.primaryDark}>
            Filters
          </Text>
        </Pressable>
      ) : null}
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} accessibilityRole="search">
        {content}
      </Pressable>
    );
  }

  return (
    <View style={styles.searchRow}>
      <View style={[styles.searchField, { flex: 1 }]}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textTertiary}
          style={styles.searchInput}
          returnKeyType="search"
        />
      </View>
      {showFilter ? (
        <Pressable onPress={onFilterPress} style={styles.filterBtn}>
          <Text variant="captionMedium" color={colors.primaryDark}>
            Filters
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.xs },
  label: { marginBottom: spacing.xs, marginLeft: spacing.xs },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.control,
    minHeight: touchTarget.min,
    paddingHorizontal: spacing.lg,
  },
  fieldError: { borderColor: colors.error },
  fieldDisabled: { backgroundColor: colors.disabledBg },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
    paddingVertical: spacing.md,
  },
  icon: { marginHorizontal: spacing.xs },
  meta: { marginLeft: spacing.xs, marginTop: 2 },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  searchField: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius['2xl'],
    minHeight: 56,
    paddingHorizontal: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#2F3A35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
  },
  filterBtn: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.lg,
    minHeight: 56,
    borderRadius: radius['2xl'],
    alignItems: 'center',
    justifyContent: 'center',
  },
});
