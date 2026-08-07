import React from 'react';
import { View, StyleSheet, FlatList, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { Text, colors, spacing } from '@/design-system';
import { properties } from '@/data/mock';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function GalleryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const property = properties.find((p) => p.id === id);
  const categories = ['All', 'Room', 'Common', 'Kitchen', 'Exterior'];

  if (!property) return null;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.back} accessibilityLabel="Back">
          <ArrowLeft size={22} color={colors.textPrimary} strokeWidth={2} />
        </Pressable>
        <Text variant="h4">Gallery</Text>
        <View style={{ width: 44 }} />
      </View>
      <FlatList
        data={property.images}
        keyExtractor={(uri) => uri}
        numColumns={2}
        contentContainerStyle={{ padding: spacing.md, paddingBottom: spacing['4xl'] }}
        ListHeaderComponent={
          <Text variant="caption" color={colors.textSecondary} style={{ marginBottom: spacing.md, marginLeft: spacing.sm }}>
            {property.images.length} photos · Natural daylight interiors
          </Text>
        }
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.img} contentFit="cover" />
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
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  back: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  img: {
    width: (width - spacing.md * 3) / 2,
    height: 160,
    borderRadius: 16,
    margin: spacing.sm / 2,
  },
});
