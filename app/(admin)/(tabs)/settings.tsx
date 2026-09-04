import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, colors, spacing, radius, elevation } from '@/design-system';

export default function AdminSettings() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={{
        paddingTop: insets.top + spacing.lg,
        paddingHorizontal: spacing['2xl'],
        paddingBottom: 120,
      }}
    >
      <Text variant="h2">Operations</Text>
      <View style={[styles.card, elevation.soft, { marginTop: spacing.xl }]}>
        <Text variant="bodySemiBold">Master data</Text>
        <Text variant="caption" color={colors.textSecondary} style={{ marginTop: 4 }}>
          PG types · Room types · Amenities · Rules · Locations
        </Text>
      </View>
      <View style={[styles.card, elevation.soft, { marginTop: spacing.md }]}>
        <Text variant="bodySemiBold">Audit log</Text>
        <Text variant="caption" color={colors.textSecondary} style={{ marginTop: 4 }}>
          Approvals, rejections, suspensions and refunds are recorded with reason codes.
        </Text>
      </View>
      <View style={[styles.card, elevation.soft, { marginTop: spacing.md }]}>
        <Text variant="bodySemiBold">Broadcast notifications</Text>
        <Text variant="caption" color={colors.textSecondary} style={{ marginTop: 4 }}>
          Send platform or city-level messages to seekers and owners.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius['2xl'],
    padding: spacing.xl,
  },
});
