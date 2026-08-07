import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Heart } from 'lucide-react-native';
import { Text, PropertyCard, EmptyState, colors, spacing } from '@/design-system';
import { useAppStore } from '@/stores/appStore';
import { properties } from '@/data/mock';

export default function SavedScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const savedIds = useAppStore((s) => s.savedIds);
  const toggleSave = useAppStore((s) => s.toggleSave);
  const saved = properties.filter((p) => savedIds.includes(p.id));

  return (
    <View style={[styles.root, { paddingTop: insets.top + spacing.lg }]}>
      <Text variant="h2" style={{ paddingHorizontal: spacing['2xl'] }}>
        Saved homes
      </Text>
      <FlatList
        data={saved}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: spacing['2xl'], paddingBottom: 120, flexGrow: 1 }}
        ListEmptyComponent={
          <EmptyState
            title="No saved homes yet"
            description="Tap the heart on a property to build your shortlist."
            actionLabel="Explore homes"
            onAction={() => router.push('/(user)/(tabs)/search')}
            icon={<Heart size={28} color={colors.primaryDark} strokeWidth={2} />}
          />
        }
        renderItem={({ item }) => (
          <PropertyCard
            property={item}
            saved
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
});
