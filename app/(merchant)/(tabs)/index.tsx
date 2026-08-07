import React from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, Button, colors, spacing, radius, elevation } from '@/design-system';
import { merchantStats, merchantEnquiries, visits } from '@/data/mock';
import { relativeTime } from '@/utils/format';

export default function MerchantDashboard() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const stats = [
    { label: 'Total PGs', value: merchantStats.totalPgs },
    { label: 'Live', value: merchantStats.liveListings },
    { label: 'Vacancies', value: merchantStats.vacancies },
    { label: 'Enquiries', value: merchantStats.enquiries },
    { label: 'Visits', value: merchantStats.upcomingVisits },
  ];

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
        OWNER DASHBOARD
      </Text>
      <Text variant="h2" style={{ marginTop: spacing.xs }}>
        Good day, Ananya
      </Text>
      <Text variant="body" color={colors.textSecondary} style={{ marginTop: spacing.sm }}>
        Keep vacancies fresh and respond to leads quickly.
      </Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: spacing.xl }}>
        {stats.map((s) => (
          <View key={s.label} style={[styles.stat, elevation.soft]}>
            <Text variant="numberLarge">{s.value}</Text>
            <Text variant="caption" color={colors.textSecondary}>
              {s.label}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View style={{ marginTop: spacing['2xl'], gap: spacing.sm }}>
        <Button title="Add new PG" fullWidth onPress={() => router.push('/(merchant)/add-pg')} />
        <Button
          title="Quick vacancy update"
          variant="soft"
          fullWidth
          onPress={() => router.push('/(merchant)/vacancy')}
        />
      </View>

      <Text variant="h4" style={{ marginTop: spacing['3xl'], marginBottom: spacing.md }}>
        New enquiries
      </Text>
      {merchantEnquiries.slice(0, 2).map((e) => (
        <Pressable
          key={e.id}
          style={[styles.card, elevation.soft]}
          onPress={() => router.push('/(merchant)/(tabs)/enquiries')}
        >
          <Text variant="bodySemiBold">{e.userName}</Text>
          <Text variant="caption" color={colors.textSecondary}>
            {e.propertyName} · {e.roomPreference}
          </Text>
          <Text variant="caption" color={colors.textSecondary} numberOfLines={2} style={{ marginTop: 4 }}>
            {e.message}
          </Text>
          <Text variant="small" color={colors.textTertiary} style={{ marginTop: spacing.sm }}>
            {relativeTime(e.createdAt)}
          </Text>
        </Pressable>
      ))}

      <Text variant="h4" style={{ marginTop: spacing.xl, marginBottom: spacing.md }}>
        Upcoming visits
      </Text>
      {visits.map((v) => (
        <View key={v.id} style={[styles.card, elevation.soft]}>
          <Text variant="bodySemiBold">{v.propertyName}</Text>
          <Text variant="caption" color={colors.textSecondary}>
            {v.date} · {v.time} · {v.status}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  stat: {
    width: 120,
    backgroundColor: colors.surface,
    borderRadius: radius['2xl'],
    padding: spacing.lg,
    marginRight: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius['2xl'],
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
});
