import React from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { Text, Button, PriceText, Badge, colors, spacing, radius, elevation } from '@/design-system';
import { properties } from '@/data/mock';
import { formatCurrency, formatDate } from '@/utils/format';

export default function RoomsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const property = properties.find((p) => p.id === id);
  if (!property) return null;

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={{
        paddingTop: insets.top + spacing.md,
        paddingBottom: spacing['5xl'],
        paddingHorizontal: spacing['2xl'],
      }}
    >
      <Pressable onPress={() => router.back()} style={styles.back}>
        <ArrowLeft size={22} color={colors.textPrimary} strokeWidth={2} />
      </Pressable>
      <Text variant="h2">Room types</Text>
      <Text variant="body" color={colors.textSecondary} style={{ marginTop: spacing.sm, marginBottom: spacing.xl }}>
        Rent, deposit, features and available beds
      </Text>
      {property.roomTypes.map((room) => (
        <View key={room.id} style={[styles.card, elevation.card]}>
          <View style={styles.row}>
            <Text variant="h4">{room.name}</Text>
            <Badge label={`${room.availableBeds} free`} tone={room.availableBeds ? 'success' : 'error'} />
          </View>
          <Text variant="caption" color={colors.textSecondary} style={{ marginTop: spacing.xs }}>
            {room.sharing} · {room.totalBeds} total beds
            {room.availableFrom ? ` · From ${formatDate(room.availableFrom)}` : ''}
          </Text>
          <View style={styles.priceRow}>
            <View>
              <Text variant="small" color={colors.textTertiary}>
                Rent
              </Text>
              <PriceText amount={room.rent} />
            </View>
            <View>
              <Text variant="small" color={colors.textTertiary}>
                Deposit
              </Text>
              <Text variant="number">{formatCurrency(room.deposit)}</Text>
            </View>
          </View>
          <Text variant="caption" color={colors.textSecondary} style={{ marginTop: spacing.md }}>
            {room.features.join(' · ')}
          </Text>
          <Button
            title="Book visit for this room"
            variant="soft"
            fullWidth
            style={{ marginTop: spacing.lg }}
            onPress={() => router.push(`/(user)/book-visit/${property.id}?room=${room.id}`)}
          />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  back: { width: 44, height: 44, justifyContent: 'center', marginBottom: spacing.sm },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius['2xl'],
    padding: spacing.xl,
    marginBottom: spacing.lg,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  priceRow: { flexDirection: 'row', gap: spacing['4xl'], marginTop: spacing.lg },
});
