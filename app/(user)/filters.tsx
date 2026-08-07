import React from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { Text, Button, Chip, colors, spacing } from '@/design-system';
import { useAppStore } from '@/stores/appStore';
import { amenityOptions } from '@/data/mock';

export default function FiltersScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const filters = useAppStore((s) => s.filters);
  const setFilters = useAppStore((s) => s.setFilters);
  const resetFilters = useAppStore((s) => s.resetFilters);

  const toggleArr = (key: 'pgType' | 'sharing' | 'amenities', value: string) => {
    const arr = filters[key];
    setFilters({
      [key]: arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value],
    });
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top + spacing.md }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.back}>
          <ArrowLeft size={22} color={colors.textPrimary} strokeWidth={2} />
        </Pressable>
        <Text variant="h3">Filters</Text>
        <Pressable onPress={resetFilters}>
          <Text variant="captionMedium" color={colors.primaryDark}>
            Reset
          </Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing['2xl'], paddingBottom: 120 }}>
        <Text variant="h4">Monthly rent</Text>
        <View style={styles.wrap}>
          {[
            { label: 'Any', min: 0, max: 50000 },
            { label: 'Under 8k', min: 0, max: 8000 },
            { label: '8–12k', min: 8000, max: 12000 },
            { label: '12–18k', min: 12000, max: 18000 },
            { label: '18k+', min: 18000, max: 50000 },
          ].map((b) => (
            <Chip
              key={b.label}
              label={b.label}
              selected={filters.rentMin === b.min && filters.rentMax === b.max}
              onPress={() => setFilters({ rentMin: b.min, rentMax: b.max })}
            />
          ))}
        </View>

        <Text variant="h4" style={styles.section}>
          PG type
        </Text>
        <View style={styles.wrap}>
          {['women', 'men', 'coliving', 'hostel', 'family'].map((t) => (
            <Chip
              key={t}
              label={t}
              selected={filters.pgType.includes(t)}
              onPress={() => toggleArr('pgType', t)}
            />
          ))}
        </View>

        <Text variant="h4" style={styles.section}>
          Sharing
        </Text>
        <View style={styles.wrap}>
          {['private', '2-sharing', '3-sharing', '4-sharing', 'dormitory'].map((t) => (
            <Chip
              key={t}
              label={t}
              selected={filters.sharing.includes(t)}
              onPress={() => toggleArr('sharing', t)}
            />
          ))}
        </View>

        <Text variant="h4" style={styles.section}>
          Amenities
        </Text>
        <View style={styles.wrap}>
          {amenityOptions.map((a) => (
            <Chip
              key={a}
              label={a}
              selected={filters.amenities.includes(a)}
              onPress={() => toggleArr('amenities', a)}
            />
          ))}
        </View>

        <Text variant="h4" style={styles.section}>
          More
        </Text>
        <View style={styles.wrap}>
          <Chip
            label="Food included"
            selected={filters.foodIncluded}
            onPress={() => setFilters({ foodIncluded: !filters.foodIncluded })}
          />
          <Chip
            label="Verified only"
            selected={filters.verifiedOnly}
            onPress={() => setFilters({ verifiedOnly: !filters.verifiedOnly })}
          />
        </View>

        <Text variant="h4" style={styles.section}>
          Sort by
        </Text>
        <View style={styles.wrap}>
          {(
            [
              ['relevance', 'Relevance'],
              ['rent', 'Rent'],
              ['distance', 'Distance'],
              ['rating', 'Rating'],
              ['newest', 'Newest'],
            ] as const
          ).map(([value, label]) => (
            <Chip
              key={value}
              label={label}
              selected={filters.sortBy === value}
              onPress={() => setFilters({ sortBy: value })}
            />
          ))}
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
        <Button
          title="Show homes"
          fullWidth
          size="lg"
          onPress={() => router.push('/(user)/search-results')}
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
  wrap: { flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.md },
  section: { marginTop: spacing['2xl'] },
  footer: {
    paddingHorizontal: spacing['2xl'],
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
