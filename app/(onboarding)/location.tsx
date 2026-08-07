import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MapPin } from 'lucide-react-native';
import { Text, Button, colors, spacing, radius } from '@/design-system';
import { useAppStore } from '@/stores/appStore';

export default function LocationPermissionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const setLocationGranted = useAppStore((s) => s.setLocationGranted);
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);

  const finish = (granted: boolean) => {
    setLocationGranted(granted);
    completeOnboarding();
    router.replace('/(user)/(tabs)');
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top + spacing['4xl'], paddingBottom: insets.bottom + spacing.xl }]}>
      <View style={styles.iconWrap}>
        <MapPin size={36} color={colors.primaryDark} strokeWidth={2} />
      </View>
      <Text variant="h1" style={{ marginTop: spacing['2xl'] }}>
        Show homes near you
      </Text>
      <Text variant="bodyLarge" color={colors.textSecondary} style={{ marginTop: spacing.lg }}>
        StayNest uses your location only to surface nearby verified PGs. You can search by city or landmark instead.
      </Text>

      <View style={styles.card}>
        <Text variant="captionMedium" color={colors.textSecondary}>
          WHY WE ASK
        </Text>
        <Text variant="body" style={{ marginTop: spacing.sm }}>
          Distance, commute time, and “near me” results stay accurate without endless scrolling.
        </Text>
      </View>

      <View style={{ flex: 1 }} />

      <Button title="Allow location" fullWidth size="lg" onPress={() => finish(true)} />
      <Button title="Not now" variant="ghost" fullWidth onPress={() => finish(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing['2xl'],
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    marginTop: spacing['3xl'],
    backgroundColor: colors.surface,
    borderRadius: radius['2xl'],
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
