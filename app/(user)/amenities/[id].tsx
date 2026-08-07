import React from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { Text, Chip, colors, spacing } from '@/design-system';
import { properties } from '@/data/mock';

const categories = [
  { key: 'property', title: 'Property', items: ['Wi-Fi', 'Lift', 'Power backup', 'Parking', 'Housekeeping'] },
  { key: 'room', title: 'Room', items: ['AC', 'Wardrobe', 'Study table', 'Attached bath'] },
  { key: 'safety', title: 'Safety', items: ['CCTV', 'Security guard', 'Biometric', 'Fire safety'] },
  { key: 'food', title: 'Food & service', items: ['Meals included', 'Laundry', 'Hot water'] },
];

export default function AmenitiesScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const property = properties.find((p) => p.id === id);
  if (!property) return null;

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={{ paddingTop: insets.top + spacing.md, paddingBottom: spacing['5xl'], paddingHorizontal: spacing['2xl'] }}
    >
      <Pressable onPress={() => router.back()} style={styles.back}>
        <ArrowLeft size={22} color={colors.textPrimary} strokeWidth={2} />
      </Pressable>
      <Text variant="h2">Amenities</Text>
      <Text variant="body" color={colors.textSecondary} style={{ marginTop: spacing.sm }}>
        {property.name}
      </Text>
      {categories.map((cat) => (
        <View key={cat.key} style={{ marginTop: spacing['2xl'] }}>
          <Text variant="h4">{cat.title}</Text>
          <View style={styles.wrap}>
            {cat.items.map((item) => (
              <Chip
                key={item}
                label={item}
                selected={property.amenities.includes(item) || (cat.key === 'safety' && true)}
              />
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  back: { width: 44, height: 44, justifyContent: 'center', marginBottom: spacing.sm },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.md },
});
