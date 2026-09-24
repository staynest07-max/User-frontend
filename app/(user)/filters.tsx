import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, GestureResponderEvent } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { Text, Button, Chip, colors, spacing } from '@/design-system';
import { useAppStore } from '@/stores/appStore';

const PRICE_MIN = 5000;
const PRICE_MAX = 20000;
const PRICE_STEP = 1000;

const PG_TYPES = [
  { label: "Men's", value: 'Boys Only' },
  { label: "Women's", value: 'Girls Only' },
  { label: 'Co-living', value: 'Unisex / Co-living' },
] as const;

const SHARING_OPTIONS = ['Single', '2 Sharing', '3 Sharing', '4 Sharing'] as const;

const AMENITY_OPTIONS = [
  { label: 'WiFi', value: 'WiFi' },
  { label: 'AC', value: 'AC' },
  { label: 'Washing', value: 'Washing Machine' },
  { label: 'Attached Bath', value: 'Attached Bathroom' },
] as const;

function formatK(amount: number) {
  return `₹${Math.round(amount / 1000)}k`;
}

function PriceRangeSlider({
  value,
  onChange,
}: {
  value: number;
  onChange: (next: number) => void;
}) {
  const [trackWidth, setTrackWidth] = useState(0);
  const ratio = Math.min(1, Math.max(0, (value - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)));

  const setFromX = (x: number) => {
    if (trackWidth <= 0) return;
    const t = Math.min(1, Math.max(0, x / trackWidth));
    const raw = PRICE_MIN + t * (PRICE_MAX - PRICE_MIN);
    onChange(Math.round(raw / PRICE_STEP) * PRICE_STEP);
  };

  const onGrant = (event: GestureResponderEvent) => {
    setFromX(event.nativeEvent.locationX);
  };

  return (
    <View>
      <View style={styles.priceLabels}>
        <Text variant="captionMedium">{formatK(PRICE_MIN)}</Text>
        <Text variant="captionMedium">{formatK(PRICE_MAX)}</Text>
      </View>
      <View
        style={styles.sliderHit}
        onLayout={(event) => setTrackWidth(event.nativeEvent.layout.width)}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderGrant={onGrant}
        onResponderMove={onGrant}
      >
        <View style={styles.sliderTrack} />
        <View style={[styles.sliderFill, { width: `${ratio * 100}%` }]} />
        <View style={[styles.sliderThumb, { left: `${ratio * 100}%` }]} />
      </View>
    </View>
  );
}

export default function FiltersScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const filters = useAppStore((state) => state.filters);
  const setFilters = useAppStore((state) => state.setFilters);
  const resetFilters = useAppStore((state) => state.resetFilters);

  const sliderValue = filters.rentMax > 0 ? filters.rentMax : PRICE_MAX;

  const toggleValue = (list: string[], value: string) => (
    list.includes(value) ? list.filter((item) => item !== value) : [...list, value]
  );

  const toggleSharing = (value: string) => {
    const sharing = toggleValue(filters.sharing, value);
    setFilters({
      sharing,
      roomType: sharing.length === 1 ? sharing[0] : '',
    });
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top + spacing.md }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.back} accessibilityLabel="Back">
          <ArrowLeft size={22} color={colors.textPrimary} strokeWidth={2} />
        </Pressable>
        <Text variant="h3">Filters</Text>
        <Pressable onPress={resetFilters} hitSlop={8}>
          <Text variant="captionMedium" color={colors.primaryDark}>Reset</Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        <Text variant="h4" style={styles.section}>Price range</Text>
        <View style={styles.sectionBody}>
          <PriceRangeSlider
            value={sliderValue}
            onChange={(rentMax) => setFilters({ rentMin: PRICE_MIN, rentMax })}
          />
        </View>

        <Text variant="h4" style={styles.section}>PG Type</Text>
        <View style={styles.wrap}>
          {PG_TYPES.map((item) => (
            <Chip
              key={item.value}
              label={item.label}
              selected={filters.pgType.includes(item.value)}
              onPress={() => setFilters({ pgType: toggleValue(filters.pgType, item.value) })}
            />
          ))}
        </View>

        <Text variant="h4" style={styles.section}>Sharing</Text>
        <View style={styles.wrap}>
          {SHARING_OPTIONS.map((item) => (
            <Chip
              key={item}
              label={item}
              selected={filters.sharing.includes(item) || filters.roomType === item}
              onPress={() => toggleSharing(item)}
            />
          ))}
        </View>

        <Text variant="h4" style={styles.section}>Amenities</Text>
        <View style={styles.amenityGrid}>
          {AMENITY_OPTIONS.map((item) => {
            const selected = filters.amenities.includes(item.value);
            return (
              <Pressable
                key={item.value}
                style={styles.amenityRow}
                onPress={() => setFilters({ amenities: toggleValue(filters.amenities, item.value) })}
              >
                <View style={[styles.checkbox, selected && styles.checkboxOn]} />
                <Text variant="caption" color={colors.textSecondary}>{item.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
        <Button
          title="Show PGs"
          fullWidth
          size="lg"
          onPress={() => {
            useAppStore.getState().setSearchQuery('');
            router.replace('/(user)/search-results');
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
  },
  back: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  body: { paddingHorizontal: spacing['2xl'], paddingBottom: 120 },
  section: { marginTop: spacing['2xl'] },
  sectionBody: { marginTop: spacing.lg },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.md },
  priceLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  sliderHit: {
    height: 28,
    justifyContent: 'center',
  },
  sliderTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.borderStrong,
  },
  sliderFill: {
    position: 'absolute',
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
  sliderThumb: {
    position: 'absolute',
    width: 18,
    height: 18,
    marginLeft: -9,
    borderRadius: 9,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  amenityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.md,
  },
  amenityRow: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface,
    marginRight: spacing.sm,
  },
  checkboxOn: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  footer: {
    paddingHorizontal: spacing['2xl'],
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
