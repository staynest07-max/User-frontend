import React from 'react';
import { View, StyleSheet, FlatList, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Plus } from 'lucide-react-native';
import { Text, Button, Badge, colors, spacing, radius, elevation } from '@/design-system';
import { properties } from '@/data/mock';
import { formatCurrency } from '@/utils/format';

export default function MerchantListings() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const mine = properties.filter((p) => p.merchantId === 'm1' || p.id === 'pg-1' || p.id === 'pg-3');

  return (
    <View style={[styles.root, { paddingTop: insets.top + spacing.lg }]}>
      <View style={styles.header}>
        <Text variant="h2">Your PGs</Text>
        <Pressable style={styles.add} onPress={() => router.push('/(merchant)/add-pg')}>
          <Plus size={20} color={colors.textInverse} strokeWidth={2} />
        </Pressable>
      </View>
      <FlatList
        data={mine}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: spacing['2xl'], paddingBottom: 120 }}
        renderItem={({ item }) => (
          <Pressable style={[styles.card, elevation.soft]} onPress={() => router.push(`/(merchant)/listing/${item.id}`)}>
            <Image source={{ uri: item.coverImage }} style={styles.img} contentFit="cover" />
            <View style={{ flex: 1 }}>
              <Text variant="bodySemiBold" numberOfLines={1}>
                {item.name}
              </Text>
              <Text variant="caption" color={colors.textSecondary}>
                {item.area} · from {formatCurrency(item.startingRent)}
              </Text>
              <View style={{ marginTop: spacing.sm }}>
                <Badge
                  label={item.status}
                  tone={item.status === 'live' ? 'success' : item.status === 'draft' ? 'neutral' : 'warning'}
                />
              </View>
            </View>
          </Pressable>
        )}
        ListFooterComponent={
          <Button title="Add another PG" variant="outline" fullWidth onPress={() => router.push('/(merchant)/add-pg')} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing['2xl'],
  },
  add: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius['2xl'],
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  img: { width: 80, height: 80, borderRadius: radius.lg },
});
