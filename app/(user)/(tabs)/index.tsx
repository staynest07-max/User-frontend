import React from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bell, MapPin } from 'lucide-react-native';
import {
  Text, SearchBar, PropertyCard, SectionHeader, Chip, EmptyState, ErrorState, Skeleton,
  colors, spacing, radius,
} from '@/design-system';
import { useAppStore } from '@/stores/appStore';
import { usePublicHome } from '@/features/publicPgs/hooks/usePublicPgs';
import { toPropertyCardModel } from '@/mappers/publicPg';
import { useUnreadCount } from '@/features/engagement/hooks/useNotifications';

function HomeLoading() {
  return (
    <View style={styles.loading}>
      <Skeleton height={26} width="55%" />
      <Skeleton height={200} radius={radius.card} style={{ marginTop: spacing.xl }} />
      <Skeleton height={200} radius={radius.card} style={{ marginTop: spacing.lg }} />
    </View>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const prefs = useAppStore((state) => state.preferences);
  const setFilters = useAppStore((state) => state.setFilters);
  const setSearchQuery = useAppStore((state) => state.setSearchQuery);
  const home = usePublicHome();
  const unread = useUnreadCount();

  const openResults = (next: Parameters<typeof setFilters>[0] = {}) => {
    setFilters(next);
    setSearchQuery('');
    router.push('/(user)/search-results');
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text variant="caption" color={colors.textSecondary}>Good day</Text>
            <Text variant="h2" numberOfLines={1} style={styles.title}>
              Find your next home
            </Text>
            <View style={styles.cityRow}>
              <MapPin size={14} color={colors.primaryDark} strokeWidth={2} />
              <Text variant="captionMedium" color={colors.primaryDark} style={{ marginLeft: 4 }}>
                {prefs.city || 'Choose a city'}
              </Text>
            </View>
          </View>
          <Pressable
            style={styles.bell}
            onPress={() => router.push('/(user)/notifications')}
            accessibilityLabel="Notifications"
          >
            <Bell size={22} color={colors.textPrimary} strokeWidth={2} />
            {(unread.data ?? 0) > 0 ? (
              <View style={styles.notificationBadge}>
                <Text variant="small" color={colors.textInverse}>{Math.min(unread.data ?? 0, 99)}</Text>
              </View>
            ) : null}
          </Pressable>
        </View>

        <View style={styles.search}>
          <SearchBar
            placeholder="Search city, locality, or PG name…"
            onPress={() => router.push('/(user)/(tabs)/search')}
            showFilter
            onFilterPress={() => router.push('/(user)/filters')}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quick}>
          <Chip label="Under ₹12k" onPress={() => openResults({ rentMin: 0, rentMax: 12000 })} />
          <Chip label="WiFi" onPress={() => openResults({ amenities: ['WiFi'] })} />
          <Chip label="2 Sharing" onPress={() => openResults({ roomType: '2 Sharing' })} />
        </ScrollView>

        {home.isPending ? <HomeLoading /> : null}
        {home.isError ? (
          <ErrorState description="We couldn’t load homes right now." onRetry={() => void home.refetch()} />
        ) : null}

        {home.data ? (
          <>
            {home.data.featured.length ? (
              <View style={styles.section}>
                <SectionHeader title="Featured homes" actionLabel="See all" onAction={() => openResults()} />
                {home.data.featured.map((pg) => (
                  <PropertyCard
                    key={pg.id}
                    property={toPropertyCardModel(pg)}
                    onPress={() => router.push(`/(user)/property/${pg.id}`)}
                  />
                ))}
              </View>
            ) : null}

            {home.data.recentlyAdded.length ? (
              <View style={styles.section}>
                <SectionHeader title="Recently added" />
                {home.data.recentlyAdded.map((pg) => (
                  <PropertyCard
                    key={pg.id}
                    property={toPropertyCardModel(pg)}
                    onPress={() => router.push(`/(user)/property/${pg.id}`)}
                  />
                ))}
              </View>
            ) : null}

            {home.data.popularAreas.length ? (
              <View style={styles.section}>
                <SectionHeader title="Popular areas" />
                <View style={styles.areaWrap}>
                  {home.data.popularAreas.map((area) => (
                    <Chip
                      key={`${area.city}-${area.locality}`}
                      label={`${area.locality}, ${area.city} (${area.listingCount})`}
                      onPress={() => openResults({ city: area.city, locality: area.locality })}
                    />
                  ))}
                </View>
              </View>
            ) : null}

            {!home.data.featured.length && !home.data.recentlyAdded.length ? (
              <EmptyState
                title="No homes available yet"
                description="New verified homes will appear here as soon as they go live."
                actionLabel="Refresh"
                onAction={() => void home.refetch()}
              />
            ) : null}
          </>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', paddingHorizontal: spacing['2xl'], paddingTop: spacing.lg,
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  title: { marginTop: 4, fontSize: 22, lineHeight: 28 },
  cityRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm },
  bell: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: colors.surface,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border,
  },
  notificationBadge: {
    position: 'absolute', top: -3, right: -3, minWidth: 20, height: 20,
    borderRadius: 10, paddingHorizontal: 4, alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.error,
  },
  search: { paddingHorizontal: spacing['2xl'], marginTop: spacing.lg },
  quick: { paddingHorizontal: spacing['2xl'], marginTop: spacing.xl },
  loading: { paddingHorizontal: spacing['2xl'], marginTop: spacing['2xl'] },
  section: { paddingHorizontal: spacing['2xl'], marginTop: spacing['2xl'] },
  areaWrap: { flexDirection: 'row', flexWrap: 'wrap' },
});
