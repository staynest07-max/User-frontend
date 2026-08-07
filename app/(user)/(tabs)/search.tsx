import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Map as MapIcon, SlidersHorizontal } from 'lucide-react-native';
import { Text, Input, Chip, PropertyCard, colors, spacing, radius } from '@/design-system';
import { useAppStore } from '@/stores/appStore';
import { landmarks, cities } from '@/data/mock';

export default function SearchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const searchQuery = useAppStore((s) => s.searchQuery);
  const setSearchQuery = useAppStore((s) => s.setSearchQuery);
  const results = useAppStore((s) => s.getFilteredProperties());
  const savedIds = useAppStore((s) => s.savedIds);
  const toggleSave = useAppStore((s) => s.toggleSave);
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.root, { paddingTop: insets.top + spacing.md }]}>
      <View style={styles.top}>
        <Text variant="h2">Search</Text>
        <View style={styles.topActions}>
          <Pressable style={styles.iconBtn} onPress={() => router.push('/(user)/filters')}>
            <SlidersHorizontal size={20} color={colors.textPrimary} strokeWidth={2} />
          </Pressable>
          <Pressable style={styles.iconBtn} onPress={() => router.push('/(user)/map')}>
            <MapIcon size={20} color={colors.textPrimary} strokeWidth={2} />
          </Pressable>
        </View>
      </View>

      <View style={{ paddingHorizontal: spacing['2xl'], marginTop: spacing.lg }}>
        <Input
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="City, college, office, or PG name"
          onFocus={() => setFocused(true)}
          returnKeyType="search"
          onSubmitEditing={() => router.push('/(user)/search-results')}
        />
      </View>

      {!searchQuery || focused ? (
        <ScrollView contentContainerStyle={{ padding: spacing['2xl'], paddingBottom: 120 }}>
          <Text variant="captionMedium" color={colors.textSecondary}>
            POPULAR CITIES
          </Text>
          <View style={styles.wrap}>
            {cities.map((c) => (
              <Chip
                key={c}
                label={c}
                onPress={() => {
                  useAppStore.getState().setPreferences({ city: c });
                  setSearchQuery(c);
                  router.push('/(user)/search-results');
                }}
              />
            ))}
          </View>
          <Text variant="captionMedium" color={colors.textSecondary} style={{ marginTop: spacing.xl }}>
            NEAR COLLEGE / OFFICE
          </Text>
          <View style={styles.wrap}>
            {landmarks.map((l) => (
              <Chip
                key={l}
                label={l}
                onPress={() => {
                  setSearchQuery(l);
                  router.push('/(user)/search-results');
                }}
              />
            ))}
          </View>
        </ScrollView>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: spacing['2xl'], paddingBottom: 120 }}
          ListHeaderComponent={
            <Text variant="caption" color={colors.textSecondary} style={{ marginBottom: spacing.md }}>
              {results.length} homes
            </Text>
          }
          renderItem={({ item }) => (
            <PropertyCard
              property={item}
              saved={savedIds.includes(item.id)}
              onToggleSave={() => toggleSave(item.id)}
              onPress={() => router.push(`/(user)/property/${item.id}`)}
              onBookVisit={() => router.push(`/(user)/book-visit/${item.id}`)}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing['2xl'],
  },
  topActions: { flexDirection: 'row', gap: spacing.sm },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.md },
});
