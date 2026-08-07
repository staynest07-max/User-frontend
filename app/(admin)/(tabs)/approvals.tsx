import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Text, Button, Badge, colors, spacing, radius, elevation } from '@/design-system';
import { properties } from '@/data/mock';
import type { ListingStatus, Property } from '@/types';

type QueueItem = Property & { status: ListingStatus };

export default function AdminApprovals() {
  const insets = useSafeAreaInsets();
  const [queue, setQueue] = useState<QueueItem[]>(
    properties.map((p) => ({
      ...p,
      status: (p.verified ? 'live' : 'under_review') as ListingStatus,
    }))
  );
  const pending = queue.filter((p) => p.status === 'under_review' || p.status === 'submitted');

  return (
    <View style={[styles.root, { paddingTop: insets.top + spacing.lg }]}>
      <Text variant="h2" style={{ paddingHorizontal: spacing['2xl'] }}>
        Approval queue
      </Text>
      <Text variant="caption" color={colors.textSecondary} style={{ paddingHorizontal: spacing['2xl'], marginTop: 4 }}>
        Review property, rooms, prices, amenities, rules and photos
      </Text>
      <FlatList
        data={pending.length ? pending : queue.slice(0, 2)}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: spacing['2xl'], paddingBottom: 120 }}
        renderItem={({ item }) => (
          <View style={[styles.card, elevation.soft]}>
            <View style={{ flexDirection: 'row', gap: spacing.md }}>
              <Image source={{ uri: item.coverImage }} style={styles.img} contentFit="cover" />
              <View style={{ flex: 1 }}>
                <Text variant="bodySemiBold">{item.name}</Text>
                <Text variant="caption" color={colors.textSecondary}>
                  {item.area} · {item.merchantName}
                </Text>
                <View style={{ marginTop: spacing.sm }}>
                  <Badge label="Under review" tone="warning" />
                </View>
              </View>
            </View>
            <View style={styles.actions}>
              <Button
                title="Approve"
                size="sm"
                onPress={() =>
                  setQueue((q) => q.map((p) => (p.id === item.id ? { ...p, status: 'live', verified: true } : p)))
                }
              />
              <Button title="Request changes" size="sm" variant="soft" onPress={() => undefined} />
              <Button
                title="Reject"
                size="sm"
                variant="outline"
                onPress={() =>
                  setQueue((q) => q.map((p) => (p.id === item.id ? { ...p, status: 'rejected' } : p)))
                }
              />
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius['2xl'],
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  img: { width: 72, height: 72, borderRadius: radius.lg },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.lg },
});
