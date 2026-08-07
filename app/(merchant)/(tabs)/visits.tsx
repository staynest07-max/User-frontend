import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Text, Badge, Button, Chip, colors, spacing, radius, elevation } from '@/design-system';
import { visits as seedVisits } from '@/data/mock';
import type { VisitStatus } from '@/types';
import { visitStatusLabel } from '@/utils/format';

export default function MerchantVisits() {
  const insets = useSafeAreaInsets();
  const [visits, setVisits] = useState(seedVisits);

  const update = (id: string, status: VisitStatus) => {
    setVisits((prev) => prev.map((v) => (v.id === id ? { ...v, status } : v)));
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top + spacing.lg }]}>
      <Text variant="h2" style={{ paddingHorizontal: spacing['2xl'] }}>
        Visit calendar
      </Text>
      <FlatList
        data={visits}
        keyExtractor={(v) => v.id}
        contentContainerStyle={{ padding: spacing['2xl'], paddingBottom: 120 }}
        renderItem={({ item }) => (
          <View style={[styles.card, elevation.soft]}>
            <View style={{ flexDirection: 'row', gap: spacing.md }}>
              <Image source={{ uri: item.propertyImage }} style={styles.img} contentFit="cover" />
              <View style={{ flex: 1 }}>
                <Text variant="bodySemiBold">{item.propertyName}</Text>
                <Text variant="caption" color={colors.textSecondary}>
                  {item.date} · {item.time}
                </Text>
                <View style={{ marginTop: spacing.sm }}>
                  <Badge label={visitStatusLabel(item.status)} tone="primary" />
                </View>
              </View>
            </View>
            {item.status === 'requested' || item.status === 'suggested' ? (
              <View style={styles.actions}>
                <Button title="Accept" size="sm" onPress={() => update(item.id, 'accepted')} />
                <Button title="Suggest time" size="sm" variant="soft" onPress={() => update(item.id, 'suggested')} />
                <Button title="Reject" size="sm" variant="outline" onPress={() => update(item.id, 'cancelled')} />
              </View>
            ) : item.status === 'accepted' ? (
              <View style={styles.actions}>
                <Chip label="Completed" onPress={() => update(item.id, 'completed')} />
                <Chip label="No-show" onPress={() => update(item.id, 'no_show')} />
                <Chip label="Interested" onPress={() => update(item.id, 'interested')} />
              </View>
            ) : null}
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
  img: { width: 64, height: 64, borderRadius: radius.lg },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.lg },
});
