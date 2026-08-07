import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Share,
  Linking,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Heart,
  Share2,
  Star,
  MapPin,
  BadgeCheck,
  Phone,
  MessageCircle,
} from 'lucide-react-native';
import {
  Text,
  Button,
  PriceText,
  Badge,
  Chip,
  colors,
  spacing,
  radius,
  elevation,
} from '@/design-system';
import { properties } from '@/data/mock';
import { useAppStore } from '@/stores/appStore';
import { formatCurrency, formatMoveInTotal, formatDate, pgTypeLabel } from '@/utils/format';

const { width } = Dimensions.get('window');

export default function PropertyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const property = properties.find((p) => p.id === id);
  const savedIds = useAppStore((s) => s.savedIds);
  const toggleSave = useAppStore((s) => s.toggleSave);
  const addRecentlyViewed = useAppStore((s) => s.addRecentlyViewed);
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const [imgIndex, setImgIndex] = useState(0);

  useEffect(() => {
    if (id) addRecentlyViewed(id);
  }, [id, addRecentlyViewed]);

  if (!property) {
    return (
      <View style={[styles.root, { paddingTop: insets.top + spacing['3xl'], paddingHorizontal: spacing['2xl'] }]}>
        <Text variant="h2">Home not found</Text>
        <Button title="Go back" onPress={() => router.back()} style={{ marginTop: spacing.xl }} />
      </View>
    );
  }

  const saved = savedIds.includes(property.id);
  const moveIn = formatMoveInTotal(property.pricing);
  const freshnessDays = Math.floor(
    (Date.now() - new Date(property.availabilityConfirmedAt).getTime()) / (1000 * 60 * 60 * 24)
  );

  const requireAuth = (action: () => void) => {
    if (!isAuthenticated) {
      router.push('/(auth)/login');
      return;
    }
    action();
  };

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 140 }}>
        <View style={styles.hero}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              setImgIndex(Math.round(e.nativeEvent.contentOffset.x / width));
            }}
          >
            {property.images.map((uri) => (
              <Pressable key={uri} onPress={() => router.push(`/(user)/gallery/${property.id}`)}>
                <Image source={{ uri }} style={{ width, height: 360 }} contentFit="cover" />
              </Pressable>
            ))}
          </ScrollView>
          <View style={[styles.topBar, { top: insets.top + spacing.sm }]}>
            <Pressable style={styles.roundBtn} onPress={() => router.back()} accessibilityLabel="Back">
              <ArrowLeft size={20} color={colors.textPrimary} strokeWidth={2} />
            </Pressable>
            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              <Pressable
                style={styles.roundBtn}
                onPress={() =>
                  Share.share({ message: `Check out ${property.name} on StayNest — ${property.area}, ${property.city}` })
                }
              >
                <Share2 size={18} color={colors.textPrimary} strokeWidth={2} />
              </Pressable>
              <Pressable style={styles.roundBtn} onPress={() => toggleSave(property.id)}>
                <Heart
                  size={18}
                  color={saved ? colors.favorite : colors.textPrimary}
                  fill={saved ? colors.favorite : 'transparent'}
                  strokeWidth={2}
                />
              </Pressable>
            </View>
          </View>
          <View style={styles.dots}>
            {property.images.map((_, i) => (
              <View key={i} style={[styles.dot, i === imgIndex && styles.dotActive]} />
            ))}
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flexWrap: 'wrap' }}>
                {property.verified ? (
                  <View style={styles.verified}>
                    <BadgeCheck size={14} color={colors.success} strokeWidth={2} />
                    <Text variant="smallMedium" color={colors.success} style={{ marginLeft: 4 }}>
                      Verified
                    </Text>
                  </View>
                ) : (
                  <Badge label="Verification pending" tone="warning" />
                )}
                <Badge label={pgTypeLabel(property.pgType)} tone="primary" />
              </View>
              <Text variant="h2" style={{ marginTop: spacing.sm }}>
                {property.name}
              </Text>
              <View style={styles.loc}>
                <MapPin size={14} color={colors.textSecondary} strokeWidth={2} />
                <Text variant="caption" color={colors.textSecondary} style={{ marginLeft: 4 }}>
                  {property.area}, {property.city}
                  {property.distanceKm != null ? ` · ${property.distanceKm} km` : ''}
                </Text>
              </View>
            </View>
            <View style={styles.ratingBox}>
              <Star size={16} color={colors.rating} fill={colors.rating} strokeWidth={0} />
              <Text variant="bodySemiBold" style={{ marginLeft: 4 }}>
                {property.rating.toFixed(1)}
              </Text>
              <Text variant="small" color={colors.textTertiary}>
                {property.reviewCount} reviews
              </Text>
            </View>
          </View>

          <Text variant="body" color={colors.textSecondary} style={{ marginTop: spacing.lg }}>
            {property.description}
          </Text>

          <Text variant="small" color={colors.textTertiary} style={{ marginTop: spacing.md }}>
            Availability confirmed {freshnessDays <= 3 ? 'recently' : `${freshnessDays} days ago`} · Available from{' '}
            {formatDate(property.availableFrom)}
          </Text>

          <Pressable style={styles.linkRow} onPress={() => router.push(`/(user)/rooms/${property.id}`)}>
            <Text variant="h4">Room types</Text>
            <Text variant="captionMedium" color={colors.primaryDark}>
              See all
            </Text>
          </Pressable>
          {property.roomTypes.map((r) => (
            <View key={r.id} style={[styles.roomCard, elevation.soft]}>
              <View style={{ flex: 1 }}>
                <Text variant="bodySemiBold">{r.name}</Text>
                <Text variant="caption" color={colors.textSecondary}>
                  {r.sharing} · {r.availableBeds} beds free · {r.features.slice(0, 2).join(' · ')}
                </Text>
              </View>
              <PriceText amount={r.rent} size="small" />
            </View>
          ))}

          <Pressable style={styles.linkRow} onPress={() => router.push(`/(user)/amenities/${property.id}`)}>
            <Text variant="h4">Amenities</Text>
            <Text variant="captionMedium" color={colors.primaryDark}>
              See all
            </Text>
          </Pressable>
          <View style={styles.chipWrap}>
            {property.amenities.map((a) => (
              <Chip key={a} label={a} />
            ))}
          </View>

          <Text variant="h4" style={{ marginTop: spacing['2xl'] }}>
            Complete pricing
          </Text>
          <View style={[styles.priceCard, elevation.soft]}>
            {[
              ['Monthly rent (from)', property.pricing.rent],
              ['Security deposit', property.pricing.deposit],
              ['Maintenance', property.pricing.maintenance],
              ['Food', property.pricing.food],
              ['Electricity', property.pricing.electricity],
              ['Parking', property.pricing.parking],
            ]
              .filter(([, v]) => Number(v) > 0)
              .map(([label, value]) => (
                <View key={String(label)} style={styles.priceRow}>
                  <Text variant="caption" color={colors.textSecondary}>
                    {label}
                  </Text>
                  <Text variant="captionMedium">{formatCurrency(Number(value))}</Text>
                </View>
              ))}
            <View style={[styles.priceRow, styles.totalRow]}>
              <Text variant="bodySemiBold">Est. move-in total</Text>
              <Text variant="numberPrice">{formatCurrency(moveIn)}</Text>
            </View>
          </View>

          <Text variant="h4" style={{ marginTop: spacing['2xl'] }}>
            Safety
          </Text>
          <View style={styles.chipWrap}>
            {property.safety.cctv && <Chip label="CCTV" selected />}
            {property.safety.guard && <Chip label="Security guard" selected />}
            {property.safety.biometric && <Chip label="Biometric" selected />}
            {property.safety.fireSafety && <Chip label="Fire safety" selected />}
            {property.safety.womenFriendly && <Chip label="Women-friendly" selected />}
          </View>

          <Text variant="h4" style={{ marginTop: spacing['2xl'] }}>
            House rules
          </Text>
          <View style={[styles.priceCard, elevation.soft]}>
            <Text variant="caption" color={colors.textSecondary}>
              Entry by {property.rules.entryTime} · Visitors: {property.rules.visitors}
            </Text>
            <Text variant="caption" color={colors.textSecondary} style={{ marginTop: spacing.sm }}>
              Smoking {property.rules.smoking ? 'allowed' : 'not allowed'} · Alcohol{' '}
              {property.rules.alcohol ? 'allowed' : 'not allowed'} · Pets {property.rules.pets ? 'allowed' : 'not allowed'}
            </Text>
            <Text variant="caption" color={colors.textSecondary} style={{ marginTop: spacing.sm }}>
              Min stay {property.rules.minimumStay} · Notice {property.rules.noticePeriod}
            </Text>
          </View>

          {property.food.included ? (
            <>
              <Text variant="h4" style={{ marginTop: spacing['2xl'] }}>
                Food
              </Text>
              <Text variant="body" color={colors.textSecondary}>
                {property.food.meals.join(', ')} · {property.food.dietTypes.join(', ')}
              </Text>
              <Text variant="caption" color={colors.textTertiary} style={{ marginTop: spacing.xs }}>
                {property.food.timings}
              </Text>
            </>
          ) : null}

          <Pressable style={styles.linkRow} onPress={() => router.push(`/(user)/reviews/${property.id}`)}>
            <Text variant="h4">Reviews</Text>
            <Text variant="captionMedium" color={colors.primaryDark}>
              {property.reviewCount} reviews
            </Text>
          </Pressable>

          <View style={styles.contactRow}>
            <Pressable
              style={styles.contactBtn}
              onPress={() => requireAuth(() => Linking.openURL(`tel:${property.merchantPhone}`))}
            >
              <Phone size={18} color={colors.primaryDark} strokeWidth={2} />
              <Text variant="captionMedium" color={colors.primaryDark} style={{ marginLeft: 6 }}>
                Call
              </Text>
            </Pressable>
            <Pressable
              style={styles.contactBtn}
              onPress={() =>
                requireAuth(() =>
                  Linking.openURL(
                    `https://wa.me/${property.merchantPhone.replace('+', '')}?text=${encodeURIComponent(
                      `Hi, I'm interested in ${property.name} on StayNest.`
                    )}`
                  )
                )
              }
            >
              <MessageCircle size={18} color={colors.primaryDark} strokeWidth={2} />
              <Text variant="captionMedium" color={colors.primaryDark} style={{ marginLeft: 6 }}>
                WhatsApp
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.cta, { paddingBottom: insets.bottom + spacing.md }, elevation.float]}>
        <View>
          <Text variant="small" color={colors.textTertiary}>
            From
          </Text>
          <PriceText amount={property.startingRent} />
        </View>
        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          <Button
            title="Enquire"
            variant="outline"
            size="sm"
            onPress={() => requireAuth(() => router.push(`/(user)/enquire/${property.id}`))}
          />
          <Button
            title="Book visit"
            size="sm"
            onPress={() => requireAuth(() => router.push(`/(user)/book-visit/${property.id}`))}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  hero: { height: 360, backgroundColor: colors.surfaceMuted },
  topBar: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  roundBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.glass,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dots: {
    position: 'absolute',
    bottom: spacing.lg,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.5)' },
  dotActive: { width: 18, backgroundColor: colors.surface },
  body: { padding: spacing['2xl'] },
  titleRow: { flexDirection: 'row', gap: spacing.md },
  verified: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.chip,
  },
  loc: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm },
  ratingBox: { alignItems: 'center' },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing['2xl'],
    marginBottom: spacing.md,
  },
  roomCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.sm,
  },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap' },
  priceCard: {
    backgroundColor: colors.surface,
    borderRadius: radius['2xl'],
    padding: spacing.lg,
    marginTop: spacing.sm,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    marginTop: spacing.sm,
    paddingTop: spacing.md,
  },
  contactRow: { flexDirection: 'row', gap: spacing.md, marginTop: spacing['2xl'] },
  contactBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryLight,
    borderRadius: radius.control,
    minHeight: 48,
  },
  cta: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing['2xl'],
    paddingTop: spacing.lg,
    borderTopLeftRadius: radius['2xl'],
    borderTopRightRadius: radius['2xl'],
  },
});
