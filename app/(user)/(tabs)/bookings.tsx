import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, Badge, Chip, EmptyState, colors, spacing, radius, elevation } from '@/design-system';
import { visits, bookings } from '@/data/mock';
import { formatDate, visitStatusLabel, bookingStatusLabel } from '@/utils/format';
import { CalendarDays } from 'lucide-react-native';

export default function BookingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<'visits' | 'bookings'>('visits');

  return (
    <View style={[styles.root, { paddingTop: insets.top + spacing.lg }]}>
      <Text variant="h2" style={{ paddingHorizontal: spacing['2xl'] }}>
        Visits & bookings
      </Text>
      <View style={styles.tabs}>
        <Chip label="Visits" selected={tab === 'visits'} onPress={() => setTab('visits')} />
        <Chip label="Bookings" selected={tab === 'bookings'} onPress={() => setTab('bookings')} />
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing['2xl'], paddingBottom: 120 }}>
        {tab === 'visits' ? (
          visits.length ? (
            visits.map((v) => (
              <Pressable
                key={v.id}
                style={[styles.card, elevation.soft]}
                onPress={() => router.push(`/(user)/property/${v.propertyId}`)}
              >
                <Image source={{ uri: v.propertyImage }} style={styles.thumb} />
                <View style={{ flex: 1 }}>
                  <Text variant="bodySemiBold" numberOfLines={1}>
                    {v.propertyName}
                  </Text>
                  <Text variant="caption" color={colors.textSecondary}>
                    {v.propertyArea} · {formatDate(v.date)} · {v.time}
                  </Text>
                  <View style={{ marginTop: spacing.sm }}>
                    <Badge
                      label={visitStatusLabel(v.status)}
                      tone={v.status === 'accepted' ? 'success' : v.status === 'suggested' ? 'warning' : 'neutral'}
                    />
                  </View>
                  {v.status === 'suggested' ? (
                    <Text variant="small" color={colors.textSecondary} style={{ marginTop: spacing.sm }}>
                      Owner suggested {formatDate(v.suggestedDate!)} at {v.suggestedTime}
                    </Text>
                  ) : null}
                </View>
              </Pressable>
            ))
          ) : (
            <EmptyState
              title="No visits yet"
              description="Book a visit from any listing to see it here."
              icon={<CalendarDays size={28} color={colors.primaryDark} strokeWidth={2} />}
            />
          )
        ) : bookings.length ? (
          bookings.map((b) => (
            <View key={b.id} style={[styles.card, elevation.soft]}>
              <Image source={{ uri: b.propertyImage }} style={styles.thumb} />
              <View style={{ flex: 1 }}>
                <Text variant="bodySemiBold">{b.propertyName}</Text>
                <Text variant="caption" color={colors.textSecondary}>
                  {b.roomTypeName} · Move-in {formatDate(b.moveInDate)}
                </Text>
                <View style={{ marginTop: spacing.sm }}>
                  <Badge label={bookingStatusLabel(b.status)} tone="warning" />
                </View>
              </View>
            </View>
          ))
        ) : (
          <EmptyState title="No bookings" description="Booking requests will appear here." />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: spacing['2xl'],
    marginTop: spacing.lg,
  },
  card: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius['2xl'],
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  thumb: { width: 72, height: 72, borderRadius: radius.lg },
});
