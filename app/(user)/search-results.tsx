import React, { useMemo } from 'react';
import { View, StyleSheet, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, SlidersHorizontal } from 'lucide-react-native';
import { Text, PropertyCard, EmptyState, ErrorState, Skeleton, colors, spacing, radius } from '@/design-system';
import { useAppStore } from '@/stores/appStore';
import { usePublicPgResults } from '@/features/publicPgs/hooks/usePublicPgs';
import { toPropertyCardModel } from '@/mappers/publicPg';

export default function SearchResultsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const searchQuery = useAppStore((state) => state.searchQuery);
  const filters = useAppStore((state) => state.filters);
  const resetFilters = useAppStore((state) => state.resetFilters);
  const apiFilters = useMemo(() => ({
    limit: 20,
    city: filters.city.trim() || undefined,
    locality: filters.locality.trim() || undefined,
    minRent: filters.rentMin || undefined,
    maxRent: filters.rentMax || undefined,
    roomType: filters.roomType || undefined,
    amenities: filters.amenities.length ? filters.amenities : undefined,
  }), [filters]);
  const results = usePublicPgResults(searchQuery, apiFilters);
  const items = (results.data?.pages.flatMap((page) => page.items) ?? []).filter((item) => {
    if (filters.pgType.length && item.category && !filters.pgType.includes(item.category)) return false;
    if (filters.sharing.length > 1 && !item.roomSummary.roomTypes.some((type) => filters.sharing.includes(type))) {
      return false;
    }
    return true;
  });
  const total = filters.pgType.length || filters.sharing.length > 1
    ? items.length
    : (results.data?.pages[0]?.total ?? items.length);

  return (
    <View style={[styles.root, { paddingTop: insets.top + spacing.md }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.back} accessibilityLabel="Back">
          <ArrowLeft size={22} color={colors.textPrimary} strokeWidth={2} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text variant="h4" numberOfLines={1}>{searchQuery || 'Available homes'}</Text>
          <Text variant="caption" color={colors.textSecondary}>{total} matches</Text>
        </View>
        <Pressable style={styles.filterBtn} onPress={() => router.push('/(user)/filters')} accessibilityLabel="Filters">
          <SlidersHorizontal size={18} color={colors.primaryDark} strokeWidth={2} />
        </Pressable>
      </View>

      {results.isPending ? (
        <View style={styles.loading}>
          <Skeleton height={200} radius={radius.card} />
          <Skeleton height={200} radius={radius.card} style={{ marginTop: spacing.lg }} />
        </View>
      ) : null}

      {results.isError ? (
        <ErrorState description="We couldn’t load matching homes." onRetry={() => void results.refetch()} />
      ) : null}

      {!results.isPending && !results.isError ? (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          onRefresh={() => void results.refetch()}
          refreshing={results.isRefetching && !results.isFetchingNextPage}
          onEndReached={() => {
            if (results.hasNextPage && !results.isFetchingNextPage) void results.fetchNextPage();
          }}
          onEndReachedThreshold={0.4}
          ListEmptyComponent={
            <EmptyState
              title="No exact matches"
              description="Try another area or remove a few filters."
              actionLabel="Reset filters"
              onAction={() => {
                resetFilters();
                useAppStore.getState().setSearchQuery('');
              }}
            />
          }
          ListFooterComponent={results.isFetchingNextPage ? (
            <ActivityIndicator color={colors.primary} style={{ marginVertical: spacing.xl }} />
          ) : null}
          renderItem={({ item }) => (
            <PropertyCard
              property={toPropertyCardModel(item)}
              onPress={() => router.push(`/(user)/property/${item.id}`)}
            />
          )}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, gap: spacing.sm },
  back: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  filterBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  loading: { padding: spacing['2xl'] },
  list: { padding: spacing['2xl'], paddingBottom: spacing['5xl'], flexGrow: 1 },
});
