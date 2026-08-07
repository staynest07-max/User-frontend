import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, Button, Badge, Chip, colors, spacing, radius, elevation } from '@/design-system';

const seed = [
  {
    id: 'r1',
    type: 'Wrong price',
    property: 'Sakura House Men’s PG',
    user: 'Nikhil T.',
    priority: 'high',
    status: 'open',
  },
  {
    id: 'r2',
    type: 'Fake photos',
    property: 'Cedar & Clay Residence',
    user: 'Parent account',
    priority: 'medium',
    status: 'assigned',
  },
  {
    id: 'r3',
    type: 'Safety',
    property: 'Muji Lane Girls Hostel',
    user: 'Anonymous',
    priority: 'urgent',
    status: 'open',
  },
];

export default function AdminReports() {
  const insets = useSafeAreaInsets();
  const [items, setItems] = useState(seed);

  return (
    <View style={[styles.root, { paddingTop: insets.top + spacing.lg }]}>
      <Text variant="h2" style={{ paddingHorizontal: spacing['2xl'] }}>
        Reports
      </Text>
      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: spacing['2xl'], paddingBottom: 120 }}
        renderItem={({ item }) => (
          <View style={[styles.card, elevation.soft]}>
            <View style={styles.row}>
              <Text variant="bodySemiBold">{item.type}</Text>
              <Badge
                label={item.priority}
                tone={item.priority === 'urgent' ? 'error' : item.priority === 'high' ? 'warning' : 'neutral'}
              />
            </View>
            <Text variant="caption" color={colors.textSecondary}>
              {item.property} · reported by {item.user}
            </Text>
            <View style={styles.actions}>
              <Button title="Assign" size="sm" variant="soft" onPress={() => undefined} />
              <Button
                title="Hide listing"
                size="sm"
                variant="outline"
                onPress={() => setItems((prev) => prev.map((r) => (r.id === item.id ? { ...r, status: 'hidden' } : r)))}
              />
              <Button
                title="Resolve"
                size="sm"
                onPress={() => setItems((prev) => prev.filter((r) => r.id !== item.id))}
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
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.lg },
});
