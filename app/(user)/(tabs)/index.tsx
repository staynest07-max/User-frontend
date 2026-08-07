import React from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bell, MapPin, SlidersHorizontal } from 'lucide-react-native';
import {
  Text,
  SearchBar,
  PropertyCard,
  SectionHeader,
  Chip,
  colors,
  spacing,
} from '@/design-system';
import { useAppStore } from '@/stores/appStore';
import { properties } from '@/data/mock';
import { notifications } from '@/data/mock';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const name = useAppStore((s) => s.name);
  const prefs = useAppStore((s) => s.preferences);
  const savedIds = useAppStore((s) => s.savedIds);
  const toggleSave = useAppStore((s) => s.toggleSave);
  const unread = notifications.filter((n) => !n.read).length;

  const recommended = properties.filter((p) => p.matchScore && p.matchScore >= 85);
  const nearby = [...properties].sort((a, b) => (a.distanceKm ?? 99) - (b.distanceKm ?? 99));
  const budgetFriendly = properties.filter(
    (p) => p.startingRent >= prefs.budgetMin && p.startingRent <= prefs.budgetMax
  );

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text variant="caption" color={colors.textSecondary}>
              Good day{name ? `, ${name.split(' ')[0]}` : ''}
            </Text>
            <Text variant="h2" style={{ marginTop: 4 }}>
              Find your next home
            </Text>
            <Pressable
              style={styles.cityRow}
              onPress={() => router.push('/(user)/preferences-edit')}
            >
              <MapPin size={14} color={colors.primaryDark} strokeWidth={2} />
              <Text variant="captionMedium" color={colors.primaryDark} style={{ marginLeft: 4 }}>
                {prefs.city}
              </Text>
            </Pressable>
          </View>
          <Pressable
            style={styles.bell}
            onPress={() => router.push('/(user)/notifications')}
            accessibilityLabel={`Notifications${unread ? `, ${unread} unread` : ''}`}
          >
            <Bell size={22} color={colors.textPrimary} strokeWidth={2} />
            {unread > 0 ? <View style={styles.dot} /> : null}
          </Pressable>
        </View>

        <View style={{ paddingHorizontal: spacing['2xl'], marginTop: spacing.lg }}>
          <SearchBar
            placeholder="Search city, college, or area…"
            onPress={() => router.push('/(user)/(tabs)/search')}
            showFilter
            onFilterPress={() => router.push('/(user)/filters')}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quick}
          style={{ marginTop: spacing.xl }}
        >
          {['Women-only', 'Near college', 'Under ₹12k', 'Verified', 'Food included'].map((q) => (
            <Chip
              key={q}
              label={q}
              onPress={() => {
                if (q === 'Women-only') useAppStore.getState().setFilters({ pgType: ['women'] });
                if (q === 'Under ₹12k') useAppStore.getState().setFilters({ rentMax: 12000 });
                if (q === 'Verified') useAppStore.getState().setFilters({ verifiedOnly: true });
                if (q === 'Food included') useAppStore.getState().setFilters({ foodIncluded: true });
                router.push('/(user)/search-results');
              }}
            />
          ))}
        </ScrollView>

        <View style={styles.section}>
          <SectionHeader
            title="Recommended for you"
            actionLabel="See all"
            onAction={() => router.push('/(user)/search-results')}
          />
          {recommended.map((p) => (
            <PropertyCard
              key={p.id}
              property={p}
              saved={savedIds.includes(p.id)}
              onToggleSave={() => toggleSave(p.id)}
              onPress={() => router.push(`/(user)/property/${p.id}`)}
              onBookVisit={() => router.push(`/(user)/book-visit/${p.id}`)}
            />
          ))}
        </View>

        <View style={styles.section}>
          <SectionHeader title="Nearby" actionLabel="Map" onAction={() => router.push('/(user)/map')} />
          {nearby.slice(0, 2).map((p) => (
            <PropertyCard
              key={p.id}
              property={p}
              saved={savedIds.includes(p.id)}
              onToggleSave={() => toggleSave(p.id)}
              onPress={() => router.push(`/(user)/property/${p.id}`)}
              onBookVisit={() => router.push(`/(user)/book-visit/${p.id}`)}
            />
          ))}
        </View>

        <View style={styles.section}>
          <SectionHeader title="Within your budget" />
          {budgetFriendly.slice(0, 2).map((p) => (
            <PropertyCard
              key={p.id}
              property={p}
              saved={savedIds.includes(p.id)}
              onToggleSave={() => toggleSave(p.id)}
              onPress={() => router.push(`/(user)/property/${p.id}`)}
              onBookVisit={() => router.push(`/(user)/book-visit/${p.id}`)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    paddingHorizontal: spacing['2xl'],
    paddingTop: spacing.lg,
    alignItems: 'flex-start',
  },
  cityRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm },
  bell: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  dot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
  },
  quick: { paddingHorizontal: spacing['2xl'] },
  section: { paddingHorizontal: spacing['2xl'], marginTop: spacing['2xl'] },
});
