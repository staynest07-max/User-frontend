import React, { useState } from 'react';
import { View, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { ArrowLeft, MapPin } from 'lucide-react-native';
import { Text, PriceText, colors, spacing, radius, elevation } from '@/design-system';
import { useAppStore } from '@/stores/appStore';

/** Map placeholder with list pins — ready to swap for react-native-maps */
export default function MapViewScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const results = useAppStore((s) => s.getFilteredProperties());
  const [selected, setSelected] = useState(results[0]?.id);

  const active = results.find((p) => p.id === selected) ?? results[0];

  return (
    <View style={styles.root}>
      <View style={[styles.map, { paddingTop: insets.top + spacing.sm }]}>
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200&q=80',
          }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
        />
        <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(250,248,244,0.35)' }]} />

        <Pressable style={[styles.back, { top: insets.top + spacing.sm }]} onPress={() => router.back()}>
          <ArrowLeft size={20} color={colors.textPrimary} strokeWidth={2} />
        </Pressable>

        {results.slice(0, 6).map((p, i) => (
          <Pressable
            key={p.id}
            onPress={() => setSelected(p.id)}
            style={[
              styles.pin,
              {
                top: `${28 + (i % 3) * 16}%` as unknown as number,
                left: `${18 + (i % 4) * 18}%` as unknown as number,
              },
              selected === p.id && styles.pinActive,
            ]}
          >
            <MapPin
              size={18}
              color={selected === p.id ? colors.textInverse : colors.primaryDark}
              strokeWidth={2}
            />
          </Pressable>
        ))}

        <Text variant="captionMedium" color={colors.textSecondary} style={styles.hint}>
          Map preview · {results.length} homes nearby
        </Text>
      </View>

      {active ? (
        <Pressable
          style={[styles.card, elevation.raised, { marginBottom: insets.bottom + spacing.lg }]}
          onPress={() => router.push(`/(user)/property/${active.id}`)}
        >
          <Image source={{ uri: active.coverImage }} style={styles.thumb} contentFit="cover" />
          <View style={{ flex: 1 }}>
            <Text variant="bodySemiBold" numberOfLines={1}>
              {active.name}
            </Text>
            <Text variant="caption" color={colors.textSecondary}>
              {active.area} · {active.distanceKm} km
            </Text>
            <PriceText amount={active.startingRent} size="small" style={{ marginTop: 4 }} />
          </View>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  map: { flex: 1, backgroundColor: colors.surfaceMuted },
  back: {
    position: 'absolute',
    left: spacing.lg,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.glass,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  pin: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...elevation.card,
  },
  pinActive: { backgroundColor: colors.primary, transform: [{ scale: 1.1 }] },
  hint: {
    position: 'absolute',
    bottom: spacing['4xl'],
    alignSelf: 'center',
    backgroundColor: colors.glass,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.chip,
  },
  card: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    bottom: 0,
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius['2xl'],
    padding: spacing.md,
  },
  thumb: { width: 84, height: 84, borderRadius: radius.lg },
});
