import React from 'react';
import { View, StyleSheet, Pressable, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { Heart, Star, MapPin, BadgeCheck } from 'lucide-react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { colors, radius, spacing, elevation, motion } from '../tokens';
import { Text, PriceText } from './Text';
import { Button } from './Button';

export interface PropertyCardModel {
  id: string;
  name: string;
  area: string;
  city: string;
  coverImage: string | null;
  startingRent: number | null;
  amenities: string[];
  roomTypeLabels?: string[];
  sharingTypes?: string[];
  availableBeds?: number;
  verified?: boolean;
  rating?: number;
  matchScore?: number;
  distanceKm?: number;
}

interface PropertyCardProps {
  property: PropertyCardModel;
  saved?: boolean;
  onPress?: () => void;
  onToggleSave?: () => void;
  onBookVisit?: () => void;
  compact?: boolean;
}

export function PropertyCard({
  property,
  saved,
  onPress,
  onToggleSave,
  onBookVisit,
  compact,
}: PropertyCardProps) {
  const scale = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.card, elevation.card, anim, compact && styles.compact]}>
      <Pressable
        onPress={onPress}
        onPressIn={() => {
          scale.value = withSpring(0.985, motion.spring.gentle);
        }}
        onPressOut={() => {
          scale.value = withSpring(1, motion.spring.soft);
        }}
        accessibilityRole="button"
        accessibilityLabel={`${property.name} in ${property.area}, starting ${property.startingRent} per month`}
      >
      <View style={styles.imageWrap}>
        <Image
          source={property.coverImage ? { uri: property.coverImage } : undefined}
          style={styles.image}
          contentFit="cover"
          transition={320}
        />
        <View style={styles.imageOverlay}>
          {property.verified ? (
            <View style={styles.verified}>
              <BadgeCheck size={14} color={colors.success} strokeWidth={2} />
              <Text variant="smallMedium" color={colors.success} style={{ marginLeft: 4 }}>
                Verified
              </Text>
            </View>
          ) : null}
        </View>
        {property.matchScore ? (
          <View style={styles.match}>
            <Text variant="smallMedium" color={colors.primaryDark}>
              {property.matchScore}% match
            </Text>
          </View>
        ) : null}
      </View>

      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text variant="h4" numberOfLines={1} style={{ flex: 1 }}>
            {property.name}
          </Text>
          {property.rating != null ? <View style={styles.rating}>
            <Star size={14} color={colors.rating} fill={colors.rating} strokeWidth={0} />
            <Text variant="captionMedium" style={{ marginLeft: 4 }}>
              {property.rating.toFixed(1)}
            </Text>
          </View> : null}
        </View>

        <View style={styles.locRow}>
          <MapPin size={14} color={colors.textSecondary} strokeWidth={2} />
          <Text variant="caption" color={colors.textSecondary} style={{ marginLeft: 4 }} numberOfLines={1}>
            {property.area}, {property.city}
            {property.distanceKm != null ? ` · ${property.distanceKm} km` : ''}
          </Text>
        </View>

        <View style={styles.chips}>
          {(property.roomTypeLabels ?? property.sharingTypes ?? []).slice(0, 3).map((s) => (
            <View key={s} style={styles.chip}>
              <Text variant="small" color={colors.textSecondary}>
                {s}
              </Text>
            </View>
          ))}
          {property.amenities.slice(0, 2).map((a) => (
            <View key={a} style={styles.chip}>
              <Text variant="small" color={colors.textSecondary}>
                {a}
              </Text>
            </View>
          ))}
        </View>

      </View>
      </Pressable>
      {onToggleSave ? (
        <Pressable
          onPress={onToggleSave}
          style={styles.favBtnAbs}
          hitSlop={8}
          accessibilityLabel={saved ? 'Remove from saved' : 'Save property'}
          accessibilityRole="button"
        >
          <Heart
            size={20}
            color={saved ? colors.favorite : colors.textInverse}
            fill={saved ? colors.favorite : 'transparent'}
            strokeWidth={2}
          />
        </Pressable>
      ) : null}
        <View style={[styles.body, { paddingTop: 0 }]}>
        <View style={styles.footer}>
          <View>
            <Text variant="small" color={colors.textTertiary}>
              From
            </Text>
            <PriceText amount={property.startingRent ?? 0} />
          </View>
          {!compact ? (
            <View style={styles.actions}>
              <Button
                title="Details"
                variant="outline"
                size="sm"
                onPress={onPress}
                style={{ minHeight: 40, paddingHorizontal: 14 }}
              />
              {onBookVisit ? (
                <Button
                  title="Book Visit"
                  variant="primary"
                  size="sm"
                  onPress={onBookVisit}
                  style={{ minHeight: 40, paddingHorizontal: 14 }}
                />
              ) : null}
            </View>
          ) : null}
        </View>
        </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  } as ViewStyle,
  compact: { marginBottom: spacing.md },
  imageWrap: {
    height: 200,
    backgroundColor: colors.surfaceMuted,
  },
  image: { width: '100%', height: '100%' },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: spacing.lg,
  },
  verified: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.glass,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.chip,
  },
  favBtnAbs: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.lg,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(47,58,53,0.28)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  match: {
    position: 'absolute',
    bottom: spacing.md,
    left: spacing.lg,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.chip,
  },
  body: { padding: spacing.lg, gap: spacing.sm },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  rating: { flexDirection: 'row', alignItems: 'center' },
  locRow: { flexDirection: 'row', alignItems: 'center' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  chip: {
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.chip,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  actions: { flexDirection: 'row', gap: spacing.sm },
});
