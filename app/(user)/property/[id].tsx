import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Share, Dimensions, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Share2, MapPin, Heart, Phone } from 'lucide-react-native';
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

  const roomRents = pg.rooms.map((room) => room.monthlyRent).filter((value) => value > 0);
  const startingRent = roomRents.length ? Math.min(...roomRents) : pg.pricing.monthlyRent;

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
              {[pg.location.locality, pg.location.city].filter(Boolean).join(', ')}
            </Text>
          </View>
          {pg.description ? (
            <Text variant="body" color={colors.textSecondary} style={{ marginTop: spacing.lg }}>
              {pg.description}
            </Text>
          ) : null}

          <Text variant="h4" style={styles.sectionTitle}>Pricing</Text>
          <View style={[styles.card, elevation.soft]}>
            {startingRent != null ? (
              <View style={styles.row}>
                <Text variant="caption" color={colors.textSecondary}>Monthly rent</Text>
                <Text variant="captionMedium">Starting from {formatCurrency(startingRent)}</Text>
              </View>
            ) : null}
            {pg.pricing.deposit > 0 ? (
              <View style={styles.row}>
                <Text variant="caption" color={colors.textSecondary}>Security deposit</Text>
                <Text variant="captionMedium">{formatCurrency(pg.pricing.deposit)}</Text>
              </View>
            ) : null}
          </View>

          <Text variant="h4" style={styles.sectionTitle}>Rooms & Availability</Text>
          {pg.rooms.length ? pg.rooms.map((room) => {
            const available = Math.max(0, room.totalBeds - (room.occupiedBeds ?? 0));
            return (
              <View key={room.id} style={[styles.roomCard, elevation.soft]}>
                <View style={{ flex: 1 }}>
                  <View style={styles.roomTitleRow}>
                    <Text variant="bodySemiBold" style={{ flex: 1 }}>{room.roomType}</Text>
                    <PriceText amount={room.monthlyRent} size="small" />
                  </View>
                  <Text variant="caption" color={colors.textSecondary} style={{ marginTop: spacing.xs }}>
                    {available > 0
                      ? `Room ${room.roomNumber} · ${available} of ${room.totalBeds} beds available`
                      : `Room ${room.roomNumber} · not available`}
                  </Text>
                  {room.amenities?.map((amenity) => (
                    <Text key={amenity} variant="small" color={colors.textTertiary} style={{ marginTop: spacing.xs }}>
                      {amenity}
                    </Text>
                  ))}
                </View>
              </View>
            );
          }) : pg.availability.length ? pg.availability.map((item) => (
            <View key={item.id} style={[styles.roomCard, elevation.soft]}>
              <View style={{ flex: 1 }}>
                <View style={styles.roomTitleRow}>
                  <Text variant="bodySemiBold" style={{ flex: 1 }}>{item.roomType}</Text>
                  <PriceText amount={item.monthlyRent} size="small" />
                </View>
                <Text variant="caption" color={colors.textSecondary} style={{ marginTop: spacing.xs }}>
                  {item.availableBeds > 0
                    ? `${item.availableBeds} of ${item.totalBeds} beds available`
                    : 'not available'}
                </Text>
              </View>
            </View>
          )) : (
            <Text variant="caption" color={colors.textSecondary}>Room information is not available yet.</Text>
          )}

          <Text variant="h4" style={styles.sectionTitle}>Amenities</Text>
          {pg.amenities.length ? (
            <View style={styles.chipWrap}>{pg.amenities.map((amenity) => <Chip key={amenity} label={amenity} />)}</View>
          ) : (
            <Text variant="caption" color={colors.textSecondary}>No amenities have been listed.</Text>
          )}

          {pg.rules.length ? (
            <>
              <Text variant="h4" style={styles.sectionTitle}>Rules and regulations</Text>
              <View style={[styles.card, elevation.soft]}>
                {pg.rules.map((rule) => (
                  <Text key={rule} variant="body" color={colors.textSecondary} style={styles.ruleLine}>
                    {rule}
                  </Text>
                ))}
              </View>
            </>
          ) : null}

          <Text variant="h4" style={styles.sectionTitle}>Contact Details</Text>
          <View style={[styles.card, elevation.soft, styles.contactRow]}>
            <Text variant="caption" color={colors.textSecondary} style={{ flex: 1 }}>
              +91 XXXXX XXXXX
            </Text>
            <Phone size={18} color={colors.textSecondary} strokeWidth={2} />
          </View>

          <Text variant="h4" style={styles.sectionTitle}>Location</Text>
          <View style={styles.fullAddress}>
            <MapPin size={15} color={colors.textSecondary} strokeWidth={2} />
            <Text variant="caption" color={colors.textSecondary} style={{ marginLeft: spacing.xs, flex: 1 }}>
              {pg.location.address || [pg.location.locality, pg.location.city].filter(Boolean).join(', ')}
            </Text>
          </View>
          {pg.location.address || (pg.location.latitude != null && pg.location.longitude != null) ? (
            <Pressable
              onPress={() => {
                const query = pg.location.latitude != null && pg.location.longitude != null
                  ? `${pg.location.latitude},${pg.location.longitude}`
                  : encodeURIComponent(pg.location.address);
                void Linking.openURL(`https://maps.google.com/?q=${query}`);
              }}
              hitSlop={8}
              style={{ marginTop: spacing.sm }}
            >
              <Text variant="captionMedium" color={colors.primaryDark}>View on Map →</Text>
            </Pressable>
          ) : null}

          {saved.isError ? <Text variant="small" color={colors.error}>Could not update saved homes.</Text> : null}
          <View style={styles.actions}>
            <View style={styles.actionBtn}>
              <Button
                title="Send enquiry"
                variant="outline"
                fullWidth
                style={styles.actionButton}
                onPress={() => router.push(`/(user)/enquire/${pg.id}`)}
              />
            </View>
            <View style={styles.actionBtn}>
              <Button
                title="Schedule visit"
                fullWidth
                style={styles.actionButton}
                onPress={() => router.push(`/(user)/book-visit/${pg.id}`)}
              />
            </View>
          </View>
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
  fullAddress: { flexDirection: 'row', alignItems: 'flex-start', marginTop: spacing.sm },
  sectionTitle: { marginTop: spacing['2xl'], marginBottom: spacing.md },
  card: { backgroundColor: colors.surface, borderRadius: radius.xl, padding: spacing.lg },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm },
  roomCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl, padding: spacing.lg, marginBottom: spacing.sm,
  },
  roomTitleRow: { flexDirection: 'row', alignItems: 'center' },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap' },
  ruleLine: { paddingVertical: spacing.sm },
  contactRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  actions: {
    flexDirection: 'row',
    alignItems: 'stretch',
    width: '100%',
    gap: spacing.sm,
    marginTop: spacing['2xl'],
  },
  actionBtn: { flex: 1, minWidth: 0 },
  actionButton: { paddingHorizontal: spacing.sm },
});
