import React from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { Text, Button, Chip, Input, colors, spacing } from '@/design-system';
import { useAppStore } from '@/stores/appStore';
import { publicAmenityOptions, publicRoomTypeOptions } from '@/features/publicPgs/filterOptions';

export default function FiltersScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const filters = useAppStore((state) => state.filters);
  const setFilters = useAppStore((state) => state.setFilters);
  const resetFilters = useAppStore((state) => state.resetFilters);

  const toggleAmenity = (value: string) => {
    setFilters({
      amenities: filters.amenities.includes(value)
        ? filters.amenities.filter((item) => item !== value)
        : [...filters.amenities, value],
    });
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top + spacing.md }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.back} accessibilityLabel="Back">
          <ArrowLeft size={22} color={colors.textPrimary} strokeWidth={2} />
        </Pressable>
        <Text variant="h3">Filters</Text>
        <Pressable onPress={resetFilters}>
          <Text variant="captionMedium" color={colors.primaryDark}>Reset</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing['2xl'], paddingBottom: 120 }}>
        <Input
          label="City"
          placeholder="For example, Hyderabad"
          value={filters.city}
          onChangeText={(city) => setFilters({ city })}
          autoCapitalize="words"
        />
        <Input
          label="Locality"
          placeholder="For example, Madhapur"
          value={filters.locality}
          onChangeText={(locality) => setFilters({ locality })}
          autoCapitalize="words"
          style={styles.fieldGap}
        />

        <Text variant="h4" style={styles.section}>Monthly rent</Text>
        <View style={styles.wrap}>
          {[
            { label: 'Any', min: 0, max: 0 },
            { label: 'Under ₹8k', min: 0, max: 8000 },
            { label: '₹8–12k', min: 8000, max: 12000 },
            { label: '₹12–18k', min: 12000, max: 18000 },
            { label: '₹18k+', min: 18000, max: 0 },
          ].map((range) => (
            <Chip
              key={range.label}
              label={range.label}
              selected={filters.rentMin === range.min && filters.rentMax === range.max}
              onPress={() => setFilters({ rentMin: range.min, rentMax: range.max })}
            />
          ))}
        </View>

        <Text variant="h4" style={styles.section}>Room type</Text>
        <View style={styles.wrap}>
          {publicRoomTypeOptions.map((roomType) => (
            <Chip
              key={roomType}
              label={roomType}
              selected={filters.roomType === roomType}
              onPress={() => setFilters({ roomType: filters.roomType === roomType ? '' : roomType })}
            />
          ))}
        </View>

        <Text variant="h4" style={styles.section}>Amenities</Text>
        <View style={styles.wrap}>
          {publicAmenityOptions.map((amenity) => (
            <Chip
              key={amenity}
              label={amenity}
              selected={filters.amenities.includes(amenity)}
              onPress={() => toggleAmenity(amenity)}
            />
          ))}
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
        <Button
          title="Show homes"
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
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
  },
  back: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  fieldGap: { marginTop: spacing.md },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.md },
  section: { marginTop: spacing['2xl'] },
  footer: { paddingHorizontal: spacing['2xl'], paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.border },
});
