import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, Badge, Input, colors, spacing, radius, elevation } from '@/design-system';

const users = [
  { id: 'u1', name: 'Priya Sharma', phone: '98001 11223', role: 'Seeker', status: 'active' },
  { id: 'u2', name: 'Ananya Desai', phone: '98765 43210', role: 'Merchant', status: 'verified' },
  { id: 'u3', name: 'Rahul Mehta', phone: '98111 22233', role: 'Merchant', status: 'pending' },
  { id: 'u4', name: 'Guest browser', phone: '—', role: 'Guest', status: 'active' },
];

export default function AdminUsers() {
  const insets = useSafeAreaInsets();
  const [q, setQ] = React.useState('');
  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(q.toLowerCase()) ||
      u.phone.includes(q) ||
      u.role.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <View style={[styles.root, { paddingTop: insets.top + spacing.lg }]}>
      <Text variant="h2" style={{ paddingHorizontal: spacing['2xl'] }}>
        Users & merchants
      </Text>
      <View style={{ paddingHorizontal: spacing['2xl'], marginTop: spacing.lg }}>
        <Input placeholder="Search name, phone or role" value={q} onChangeText={setQ} />
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(u) => u.id}
        contentContainerStyle={{ padding: spacing['2xl'], paddingBottom: 120 }}
        renderItem={({ item }) => (
          <View style={[styles.card, elevation.soft]}>
            <View style={styles.row}>
              <View>
                <Text variant="bodySemiBold">{item.name}</Text>
                <Text variant="caption" color={colors.textSecondary}>
                  {item.phone} · {item.role}
                </Text>
              </View>
              <Badge
                label={item.status}
                tone={item.status === 'verified' ? 'success' : item.status === 'pending' ? 'warning' : 'neutral'}
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
});
