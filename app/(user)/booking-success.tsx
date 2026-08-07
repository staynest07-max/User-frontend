import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Check } from 'lucide-react-native';
import { Text, Button, colors, spacing, radius } from '@/design-system';

export default function BookingSuccessScreen() {
  const { type, name, date, time } = useLocalSearchParams<{
    type?: string;
    name?: string;
    date?: string;
    time?: string;
  }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const isVisit = type === 'visit';

  return (
    <View style={[styles.root, { paddingTop: insets.top + spacing['5xl'], paddingBottom: insets.bottom + spacing.xl }]}>
      <View style={styles.icon}>
        <Check size={36} color={colors.success} strokeWidth={2.5} />
      </View>
      <Text variant="h1" style={{ marginTop: spacing['2xl'] }}>
        {isVisit ? 'Visit requested' : 'Enquiry sent'}
      </Text>
      <Text variant="bodyLarge" color={colors.textSecondary} style={{ marginTop: spacing.lg }}>
        {isVisit
          ? `We’ve asked the owner of ${name} about ${date} at ${time}. You’ll get a confirmation soon.`
          : `Your interest in ${name} is with the owner. They usually reply within a few hours.`}
      </Text>
      <View style={{ flex: 1 }} />
      <Button title="View visits & bookings" fullWidth size="lg" onPress={() => router.replace('/(user)/(tabs)/bookings')} />
      <Button title="Back to home" variant="ghost" fullWidth onPress={() => router.replace('/(user)/(tabs)')} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing['2xl'],
  },
  icon: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.successLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
