import React from 'react';
import { View, StyleSheet, FlatList, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Map as MapIcon } from 'lucide-react-native';
import { Text, PropertyCard, EmptyState, Button, colors, spacing } from '@/design-system';
import { useAppStore } from '@/stores/appStore';

export default function SearchResultsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const results = useAppStore((s) => s.getFilteredProperties());
  const savedIds = useAppStore((s) => s.savedIds);
  const toggleSave = useAppStore((s) => s.toggleSave);
  const resetFilters = useAppStore((s) => s.resetFilters);
  const searchQuery = useAppStore((s) => s.searchQuery);

  return (
    <View style={[styles.root, { paddingTop: insets.top + spacing.md }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.back}>
          <ArrowLeft size={22} color={colors.textPrimary} strokeWidth={2} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text variant="h4" numberOfLines={1}>
            {searchQuery || 'Homes for you'}
          </Text>
          <Text variant="caption" color={colors.textSecondary}>
            {results.length} matches
          </Text>
        </View>
        <Pressable style={styles.mapBtn} onPress={() => router.push('/(user)/map')}>
          <MapIcon size={18} color={colors.primaryDark} strokeWidth={2} />
        </Pressable>
      </View>

      <FlatList
        data={results}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: spacing['2xl'], paddingBottom: spacing['5xl'], flexGrow: 1 }}
        ListEmptyComponent={
          <EmptyState
            title="No exact matches"
            description="Try nearby areas or remove a few filters. We’ll help you find something close."
            actionLabel="Relax filters"
            onAction={() => {
              resetFilters();
            }}
          />
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
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  back: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  mapBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
