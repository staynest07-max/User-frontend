import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, Skeleton, colors, spacing, radius } from '@/design-system';

export default function LoadingScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.root, { paddingTop: insets.top + spacing.xl }]}>
      <ActivityIndicator color={colors.primary} size="large" />
      <Text variant="body" color={colors.textSecondary} style={{ marginTop: spacing.lg }}>
        Finding calm spaces near you…
      </Text>
      <View style={{ width: '100%', marginTop: spacing['3xl'], gap: spacing.lg }}>
        <Skeleton height={200} radius={radius.card} />
        <Skeleton height={24} width="70%" />
        <Skeleton height={16} width="45%" />
        <Skeleton height={200} radius={radius.card} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    paddingHorizontal: spacing['2xl'],
  },
});
