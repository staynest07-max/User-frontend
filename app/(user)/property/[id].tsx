import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Share, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Share2, MapPin, Heart } from 'lucide-react-native';
import {
  Text, Button, PriceText, Badge, Chip, EmptyState, ErrorState, Skeleton,
  colors, spacing, radius, elevation,
} from '@/design-system';
import { usePublicPgDetail } from '@/features/publicPgs/hooks/usePublicPgs';
import { useAppStore } from '@/stores/appStore';
import { formatCurrency } from '@/utils/format';
import { useSavedPgs, useSavedPgToggle } from '@/features/engagement/hooks/useSavedPgs';

const { width } = Dimensions.get('window');

export default function PropertyDetailScreen() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const detail = usePublicPgDetail(id);
  useSavedPgs();
  const saved = useSavedPgToggle(id ?? '');
  const addRecentlyViewed = useAppStore((state) => state.addRecentlyViewed);
  const [imageIndex, setImageIndex] = useState(0);
  const images = useMemo(
    () => detail.data?.media.filter((item) => item.type === 'image').map((item) => item.url) ?? [],
    [detail.data]
  );

  useEffect(() => {
    if (detail.data?.id) addRecentlyViewed(detail.data.id);
  }, [addRecentlyViewed, detail.data?.id]);

  if (detail.isPending) {
    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <Skeleton height={360} radius={0} />
        <View style={styles.body}>
          <Skeleton height={32} width="70%" />
          <Skeleton height={90} style={{ marginTop: spacing.xl }} />
          <Skeleton height={120} style={{ marginTop: spacing.xl }} />
        </View>
      </View>
    );
  }

  if (detail.isError) {
    return (
      <View style={[styles.center, { paddingTop: insets.top }]}>
        <ErrorState description="This home couldn’t be loaded." onRetry={() => void detail.refetch()} />
        <Button title="Go back" variant="ghost" onPress={() => router.back()} />
      </View>
    );
  }

  const pg = detail.data;
  if (!pg) {
    return (
      <View style={[styles.center, { paddingTop: insets.top }]}>
        <EmptyState title="Home not found" description="This listing may no longer be available." />
        <Button title="Go back" onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing['5xl'] }}>
        <View style={styles.hero}>
          {images.length ? (
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(event) => setImageIndex(Math.round(event.nativeEvent.contentOffset.x / width))}
            >
              {images.map((uri) => (
                <Image key={uri} source={{ uri }} style={{ width, height: 360 }} contentFit="cover" />
              ))}
            </ScrollView>
          ) : (
            <View style={styles.imageEmpty}>
              <Text variant="caption" color={colors.textTertiary}>No images available</Text>
            </View>
          )}

          <View style={[styles.topBar, { top: insets.top + spacing.sm }]}>
            <Pressable style={styles.roundBtn} onPress={() => router.back()} accessibilityLabel="Back">
              <ArrowLeft size={20} color={colors.textPrimary} strokeWidth={2} />
            </Pressable>
            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              <Pressable style={styles.roundBtn} accessibilityLabel={saved.saved ? 'Unsave home' : 'Save home'} onPress={saved.toggle}><Heart size={18} color={saved.saved ? colors.error : colors.textPrimary} fill={saved.saved ? colors.error : 'transparent'} /></Pressable>
              <Pressable style={styles.roundBtn} accessibilityLabel="Share home" onPress={() => Share.share({ message: `${pg.name} — ${pg.location.locality}, ${pg.location.city}` })}><Share2 size={18} color={colors.textPrimary} /></Pressable>
            </View>
          </View>

          {images.length > 1 ? (
            <View style={styles.dots}>
              {images.map((uri, index) => <View key={uri} style={[styles.dot, index === imageIndex && styles.dotActive]} />)}
            </View>
          ) : null}
        </View>

        <View style={styles.body}>
          <Badge label={pg.category} tone="primary" />
          <Text variant="h2" style={{ marginTop: spacing.sm }}>{pg.name}</Text>
          <View style={styles.location}>
            <MapPin size={15} color={colors.textSecondary} strokeWidth={2} />
            <Text variant="caption" color={colors.textSecondary} style={{ marginLeft: spacing.xs, flex: 1 }}>
              {[pg.location.address, pg.location.locality, pg.location.city].filter(Boolean).join(', ')}
            </Text>
          </View>
          {pg.description ? (
            <Text variant="body" color={colors.textSecondary} style={{ marginTop: spacing.lg }}>{pg.description}</Text>
          ) : null}

          <Text variant="h4" style={styles.sectionTitle}>Pricing</Text>
          <View style={[styles.card, elevation.soft]}>
            {[
              ['Monthly rent', pg.pricing.monthlyRent],
              ['Security deposit', pg.pricing.deposit],
              ['Maintenance', pg.pricing.maintenanceCharge],
              ['Food', pg.pricing.foodCharge],
            ].filter(([, value]) => value != null && Number(value) > 0).map(([label, value]) => (
              <View key={String(label)} style={styles.row}>
                <Text variant="caption" color={colors.textSecondary}>{label}</Text>
                <Text variant="captionMedium">{formatCurrency(Number(value))}</Text>
              </View>
            ))}
          </View>

          <Text variant="h4" style={styles.sectionTitle}>Rooms</Text>
          {pg.rooms.length ? pg.rooms.map((room) => {
            const available = Math.max(0, room.totalBeds - (room.occupiedBeds ?? 0));
            return (
              <View key={room.id} style={[styles.roomCard, elevation.soft]}>
                <View style={{ flex: 1 }}>
                  <Text variant="bodySemiBold">{room.roomType}</Text>
                  <Text variant="caption" color={colors.textSecondary}>
                    Room {room.roomNumber} · {available} of {room.totalBeds} beds available
                  </Text>
                  {room.amenities?.length ? (
                    <Text variant="small" color={colors.textTertiary}>{room.amenities.join(' · ')}</Text>
                  ) : null}
                </View>
                <PriceText amount={room.monthlyRent} size="small" />
              </View>
            );
          }) : (
            <Text variant="caption" color={colors.textSecondary}>Room information is not available yet.</Text>
          )}

          <Text variant="h4" style={styles.sectionTitle}>Availability</Text>
          {pg.availability.length ? pg.availability.map((item) => (
            <View key={item.id} style={[styles.card, styles.availabilityCard]}>
              <View>
                <Text variant="bodySemiBold">{item.roomType}</Text>
                <Text variant="caption" color={colors.textSecondary}>
                  {item.availableBeds} of {item.totalBeds} beds available
                </Text>
              </View>
              <PriceText amount={item.monthlyRent} size="small" />
            </View>
          )) : (
            <Text variant="caption" color={colors.textSecondary}>Contact availability will be added soon.</Text>
          )}

          <Text variant="h4" style={styles.sectionTitle}>Amenities</Text>
          {pg.amenities.length ? (
            <View style={styles.chipWrap}>{pg.amenities.map((amenity) => <Chip key={amenity} label={amenity} />)}</View>
          ) : (
            <Text variant="caption" color={colors.textSecondary}>No amenities have been listed.</Text>
          )}
          {saved.isError ? <Text variant="small" color={colors.error}>Could not update saved homes.</Text> : null}
          <View style={styles.actions}><Button title="Send enquiry" variant="outline" onPress={() => router.push(`/(user)/enquire/${pg.id}`)} style={{ flex: 1 }} /><Button title="Schedule visit" onPress={() => router.push(`/(user)/book-visit/${pg.id}`)} style={{ flex: 1 }} /></View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' },
  hero: { height: 360, backgroundColor: colors.surfaceMuted },
  imageEmpty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  topBar: {
    position: 'absolute', left: spacing.lg, right: spacing.lg,
    flexDirection: 'row', justifyContent: 'space-between',
  },
  roundBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: colors.glass,
    alignItems: 'center', justifyContent: 'center',
  },
  dots: { position: 'absolute', bottom: spacing.lg, alignSelf: 'center', flexDirection: 'row', gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.5)' },
  dotActive: { width: 18, backgroundColor: colors.surface },
  body: { padding: spacing['2xl'] },
  location: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm },
  sectionTitle: { marginTop: spacing['2xl'], marginBottom: spacing.md },
  card: { backgroundColor: colors.surface, borderRadius: radius.xl, padding: spacing.lg },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm },
  roomCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface,
    borderRadius: radius.xl, padding: spacing.lg, marginBottom: spacing.sm,
  },
  availabilityCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm,
  },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap' },
  actions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing['2xl'] },
});
