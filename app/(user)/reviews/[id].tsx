import React from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Star } from 'lucide-react-native';
import { Text, EmptyState, colors, spacing, radius, elevation } from '@/design-system';
import { properties } from '@/data/mock';
import { formatDate } from '@/utils/format';

export default function ReviewsScreen() {
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
        flexGrow: 1,
      }}
    >
      <Pressable onPress={() => router.back()} style={styles.back}>
        <ArrowLeft size={22} color={colors.textPrimary} strokeWidth={2} />
      </Pressable>
      <Text variant="h2">Reviews</Text>
      <View style={styles.summary}>
        <Star size={28} color={colors.rating} fill={colors.rating} strokeWidth={0} />
        <Text variant="h1" style={{ marginLeft: spacing.sm }}>
          {property.rating.toFixed(1)}
        </Text>
        <Text variant="caption" color={colors.textSecondary} style={{ marginLeft: spacing.md }}>
          {property.reviewCount} verified stay reviews
        </Text>
      </View>

      {property.reviews.length === 0 ? (
        <EmptyState
          title="No reviews yet"
          description="Verified residents will share food, cleanliness, safety and Wi-Fi ratings here."
        />
      ) : (
        property.reviews.map((r) => (
          <View key={r.id} style={[styles.card, elevation.soft]}>
            <View style={styles.row}>
              <View style={styles.avatar}>
                <Text variant="bodySemiBold" color={colors.primaryDark}>
                  {r.userName.charAt(0)}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text variant="bodySemiBold">{r.userName}</Text>
                <Text variant="small" color={colors.textTertiary}>
                  {formatDate(r.date)}
                  {r.verifiedStay ? ' · Verified stay' : ''}
                </Text>
              </View>
              <Text variant="bodySemiBold">{r.rating.toFixed(1)}</Text>
            </View>
            <Text variant="body" color={colors.textSecondary} style={{ marginTop: spacing.md }}>
              {r.comment}
            </Text>
            <Text variant="small" color={colors.textTertiary} style={{ marginTop: spacing.sm }}>
              Food {r.food} · Clean {r.cleanliness} · Safety {r.safety} · Wi-Fi {r.wifi}
            </Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  back: { width: 44, height: 44, justifyContent: 'center', marginBottom: spacing.sm },
  summary: { flexDirection: 'row', alignItems: 'center', marginVertical: spacing.xl },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius['2xl'],
    padding: spacing.xl,
    marginBottom: spacing.md,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
