import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Pressable, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, Badge, Chip, Button, colors, spacing, radius, elevation } from '@/design-system';
import { merchantEnquiries } from '@/data/mock';
import { relativeTime } from '@/utils/format';
import type { EnquiryStatus } from '@/types';

export default function MerchantEnquiries() {
  const insets = useSafeAreaInsets();
  const [items, setItems] = useState(merchantEnquiries);
  const [filter, setFilter] = useState<EnquiryStatus | 'all'>('all');

  const visible = filter === 'all' ? items : items.filter((i) => i.status === filter);

  const setStatus = (id: string, status: EnquiryStatus) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top + spacing.lg }]}>
      <Text variant="h2" style={{ paddingHorizontal: spacing['2xl'] }}>
        Enquiries
      </Text>
      <View style={styles.filters}>
        {(['all', 'new', 'contacted', 'visit_scheduled', 'booked', 'lost'] as const).map((f) => (
          <Chip key={f} label={f.replace('_', ' ')} selected={filter === f} onPress={() => setFilter(f)} />
        ))}
      </View>
      <FlatList
        data={visible}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: spacing['2xl'], paddingBottom: 120 }}
        renderItem={({ item }) => (
          <View style={[styles.card, elevation.soft]}>
            <View style={styles.row}>
              <Text variant="bodySemiBold">{item.userName}</Text>
              <Badge
                label={item.status.replace('_', ' ')}
                tone={item.status === 'new' ? 'info' : 'neutral'}
              />
            </View>
            <Text variant="caption" color={colors.textSecondary}>
              {item.propertyName} · {item.roomPreference} · Move-in {item.moveInDate}
            </Text>
            <Text variant="body" style={{ marginTop: spacing.sm }}>
              {item.message}
            </Text>
            <Text variant="small" color={colors.textTertiary} style={{ marginTop: spacing.sm }}>
              {relativeTime(item.createdAt)} · {item.duration}
            </Text>
            <View style={styles.actions}>
              <Button title="Call" size="sm" variant="outline" onPress={() => Linking.openURL(`tel:${item.userPhone}`)} />
              <Button title="Contacted" size="sm" variant="soft" onPress={() => setStatus(item.id, 'contacted')} />
              <Button title="Schedule" size="sm" onPress={() => setStatus(item.id, 'visit_scheduled')} />
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  filters: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: spacing['2xl'], marginTop: spacing.md },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius['2xl'],
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.lg },
});
