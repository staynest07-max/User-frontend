import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, colors, spacing, radius, elevation } from '@/design-system';

const stats = [
  { label: 'Users', value: '12.4k' },
  { label: 'Merchants', value: '860' },
  { label: 'Live PGs', value: '2.1k' },
  { label: 'Pending', value: '34' },
  { label: 'Reports', value: '12' },
  { label: 'Enquiries', value: '418' },
];

export default function AdminDashboard() {
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
      <Text variant="captionMedium" color={colors.primaryDark}>
        SUPER ADMIN
      </Text>
      <Text variant="h2" style={{ marginTop: spacing.xs }}>
        Platform pulse
      </Text>
      <Text variant="body" color={colors.textSecondary} style={{ marginTop: spacing.sm }}>
        Approvals, trust & safety, and marketplace health in one calm view.
      </Text>
      <View style={styles.grid}>
        {stats.map((s) => (
          <View key={s.label} style={[styles.card, elevation.soft]}>
            <Text variant="numberLarge">{s.value}</Text>
            <Text variant="caption" color={colors.textSecondary}>
              {s.label}
            </Text>
          </View>
        ))}
      </View>
      <View style={[styles.panel, elevation.soft, { marginTop: spacing.xl }]}>
        <Text variant="h4">Needs attention</Text>
        <Text variant="body" color={colors.textSecondary} style={{ marginTop: spacing.sm }}>
          18 listings awaiting review · 6 owner verifications · 3 urgent safety reports
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginTop: spacing.xl },
  card: {
    width: '47%',
    backgroundColor: colors.surface,
    borderRadius: radius['2xl'],
    padding: spacing.lg,
  },
  panel: {
    backgroundColor: colors.surface,
    borderRadius: radius['2xl'],
    padding: spacing.xl,
  },
});
