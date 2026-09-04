import React from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SlidersHorizontal } from 'lucide-react-native';
import { Text, Input, Chip, ErrorState, Skeleton, colors, spacing } from '@/design-system';
import { useAppStore } from '@/stores/appStore';
import { usePublicHome } from '@/features/publicPgs/hooks/usePublicPgs';

export default function SearchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const searchQuery = useAppStore((state) => state.searchQuery);
  const setSearchQuery = useAppStore((state) => state.setSearchQuery);
  const setFilters = useAppStore((state) => state.setFilters);
  const home = usePublicHome();

  const submit = () => {
    if (searchQuery.trim()) router.push('/(user)/search-results');
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top + spacing.md }]}>
      <View style={styles.top}>
        <Text variant="h2">Search</Text>
        <Pressable
          style={styles.iconBtn}
          onPress={() => router.push('/(user)/filters')}
          accessibilityLabel="Open filters"
        >
          <SlidersHorizontal size={20} color={colors.textPrimary} strokeWidth={2} />
        </Pressable>
      </View>

      <View style={styles.searchBox}>
        <Input
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="City, locality, or PG name"
          returnKeyType="search"
          onSubmitEditing={submit}
          autoFocus
        />
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text variant="captionMedium" color={colors.textSecondary}>POPULAR AREAS</Text>
        {home.isPending ? <Skeleton height={80} style={{ marginTop: spacing.md }} /> : null}
        {home.isError ? (
          <ErrorState description="Popular areas couldn’t be loaded." onRetry={() => void home.refetch()} />
        ) : null}
        <View style={styles.wrap}>
          {home.data?.popularAreas.map((area) => (
            <Chip
              key={`${area.city}-${area.locality}`}
              label={`${area.locality}, ${area.city}`}
              onPress={() => {
                setFilters({ city: area.city, locality: area.locality });
                setSearchQuery('');
                router.push('/(user)/search-results');
              }}
            />
          ))}
        </View>
        <Text variant="caption" color={colors.textTertiary} style={{ marginTop: spacing.xl }}>
          Enter a keyword and press search, or use Filters for rent, room type, and amenities.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  top: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing['2xl'],
  },
  iconBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: colors.surface,
    borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center',
  },
  searchBox: { paddingHorizontal: spacing['2xl'], marginTop: spacing.lg },
  content: { padding: spacing['2xl'], paddingBottom: 120 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.md },
});
