import React from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { ArrowLeft } from 'lucide-react-native';
import { Text, Button, Badge, colors, spacing, radius, elevation } from '@/design-system';
import { properties } from '@/data/mock';

export default function MerchantListingDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const property = properties.find((p) => p.id === id);
  if (!property) return null;

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={{ paddingBottom: spacing['5xl'] }}
    >
      <Image source={{ uri: property.coverImage }} style={{ height: 240 }} contentFit="cover" />
      <Pressable
        style={[styles.back, { top: insets.top + spacing.sm }]}
        onPress={() => router.back()}
      >
        <ArrowLeft size={20} color={colors.textPrimary} strokeWidth={2} />
      </Pressable>
      <View style={{ padding: spacing['2xl'] }}>
        <Badge label={property.status} tone="success" />
        <Text variant="h2" style={{ marginTop: spacing.md }}>
          {property.name}
        </Text>
        <Text variant="body" color={colors.textSecondary} style={{ marginTop: spacing.sm }}>
          {property.area}, {property.city}
        </Text>
        <View style={[styles.card, elevation.soft, { marginTop: spacing.xl }]}>
          <Text variant="caption" color={colors.textSecondary}>
            Vacancies
          </Text>
          <Text variant="h3" style={{ marginTop: 4 }}>
            {property.roomTypes.reduce((n, r) => n + r.availableBeds, 0)} beds free
          </Text>
        </View>
        <View style={{ marginTop: spacing.xl, gap: spacing.sm }}>
          <Button title="Update vacancy" fullWidth onPress={() => router.push('/(merchant)/vacancy')} />
          <Button title="Preview as seeker" variant="outline" fullWidth onPress={() => router.push(`/(user)/property/${property.id}`)} />
          <Button title="Pause listing" variant="ghost" fullWidth onPress={() => undefined} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  back: {
    position: 'absolute',
    left: spacing.lg,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.glass,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius['2xl'],
    padding: spacing.xl,
  },
});
