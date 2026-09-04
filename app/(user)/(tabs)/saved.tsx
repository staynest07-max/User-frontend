import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Heart } from 'lucide-react-native';
import { useQueryClient } from '@tanstack/react-query';
import { Text, PropertyCard, EmptyState, ErrorState, Skeleton, colors, spacing } from '@/design-system';
import { useSavedPgs } from '@/features/engagement/hooks/useSavedPgs';
import { savedPgService } from '@/features/engagement/api/savedPgService';
import { queryKeys } from '@/query/keys';
import { savedPgToCard } from '@/mappers/engagement';

export default function SavedScreen() {
  const router = useRouter(); const insets = useSafeAreaInsets(); const query = useSavedPgs(); const client = useQueryClient();
  if (query.isPending) return <View style={[styles.root, styles.pad, { paddingTop: insets.top + spacing.lg }]}><Text variant="h2">Saved homes</Text>{[1,2,3].map((x) => <Skeleton key={x} height={250} style={{ marginTop: spacing.lg }} />)}</View>;
  if (query.isError) return <View style={[styles.root, styles.center]}><ErrorState description="Your saved homes could not be loaded." onRetry={() => void query.refetch()} /></View>;
  return <View style={[styles.root, { paddingTop: insets.top + spacing.lg }]}><Text variant="h2" style={styles.pad}>Saved homes</Text><FlatList data={query.data} keyExtractor={(x) => x.pg.id} refreshing={query.isRefetching} onRefresh={() => void query.refetch()} contentContainerStyle={styles.list} ListEmptyComponent={<EmptyState title="No saved homes yet" description="Save a home from its details to build your shortlist." actionLabel="Explore homes" onAction={() => router.push('/(user)/(tabs)/search')} icon={<Heart size={28} color={colors.primaryDark} />} />} renderItem={({ item }) => <PropertyCard property={savedPgToCard(item.pg)} saved onPress={() => router.push(`/(user)/property/${item.pg.id}`)} onToggleSave={() => { client.setQueryData(queryKeys.savedPgs.all, query.data?.filter((x) => x.pg.id !== item.pg.id)); void savedPgService.remove(item.pg.id).finally(() => client.invalidateQueries({ queryKey: queryKeys.savedPgs.all })); }} />}/></View>;
}
const styles = StyleSheet.create({ root: { flex: 1, backgroundColor: colors.background }, pad: { paddingHorizontal: spacing['2xl'] }, list: { padding: spacing['2xl'], paddingBottom: 120, flexGrow: 1 }, center: { justifyContent: 'center' } });
