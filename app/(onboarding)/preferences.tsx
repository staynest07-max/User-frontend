import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, Button, Chip, colors, spacing } from '@/design-system';
import { useAppStore } from '@/stores/appStore';
import { cities } from '@/data/mock';
import type { PgType, SharingType } from '@/types';

const budgets = [
  { label: 'Under ₹8k', min: 0, max: 8000 },
  { label: '₹8–12k', min: 8000, max: 12000 },
  { label: '₹12–18k', min: 12000, max: 18000 },
  { label: '₹18k+', min: 18000, max: 50000 },
];

const pgTypes: { label: string; value: PgType | 'any' }[] = [
  { label: 'Any', value: 'any' },
  { label: 'Women', value: 'women' },
  { label: 'Men', value: 'men' },
  { label: 'Co-living', value: 'coliving' },
  { label: 'Family', value: 'family' },
];

const sharing: { label: string; value: SharingType | 'any' }[] = [
  { label: 'Any', value: 'any' },
  { label: 'Private', value: 'private' },
  { label: '2 sharing', value: '2-sharing' },
  { label: '3 sharing', value: '3-sharing' },
  { label: '4 sharing', value: '4-sharing' },
];

export default function PreferencesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const setPreferences = useAppStore((s) => s.setPreferences);
  const prefs = useAppStore((s) => s.preferences);

  const [city, setCity] = useState(prefs.city || 'Pune');
  const [budget, setBudget] = useState(1);
  const [pgType, setPgType] = useState<PgType | 'any'>('any');
  const [share, setShare] = useState<SharingType | 'any'>('any');

  return (
    <View style={[styles.root, { paddingTop: insets.top + spacing.xl }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text variant="captionMedium" color={colors.primaryDark}>
          STEP 1 OF 2
        </Text>
        <Text variant="h1" style={{ marginTop: spacing.sm }}>
          What feels like home?
        </Text>
        <Text variant="body" color={colors.textSecondary} style={{ marginTop: spacing.md }}>
          A few calm preferences. You can change these anytime.
        </Text>

        <Text variant="h4" style={styles.section}>
          City
        </Text>
        <View style={styles.row}>
          {cities.map((c) => (
            <Chip key={c} label={c} selected={city === c} onPress={() => setCity(c)} />
          ))}
        </View>

        <Text variant="h4" style={styles.section}>
          Monthly budget
        </Text>
        <View style={styles.row}>
          {budgets.map((b, i) => (
            <Chip key={b.label} label={b.label} selected={budget === i} onPress={() => setBudget(i)} />
          ))}
        </View>

        <Text variant="h4" style={styles.section}>
          PG type
        </Text>
        <View style={styles.row}>
          {pgTypes.map((t) => (
            <Chip
              key={t.value}
              label={t.label}
              selected={pgType === t.value}
              onPress={() => setPgType(t.value)}
            />
          ))}
        </View>

        <Text variant="h4" style={styles.section}>
          Room sharing
        </Text>
        <View style={styles.row}>
          {sharing.map((t) => (
            <Chip
              key={t.value}
              label={t.label}
              selected={share === t.value}
              onPress={() => setShare(t.value)}
            />
          ))}
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
        <Button
          title="Continue"
          fullWidth
          size="lg"
          onPress={() => {
            setPreferences({
              city,
              budgetMin: budgets[budget].min,
              budgetMax: budgets[budget].max,
              pgType,
              sharing: share,
            });
            useAppStore.getState().setFilters({
              rentMin: budgets[budget].min,
              rentMax: budgets[budget].max,
              pgType: pgType === 'any' ? [] : [pgType],
              sharing: share === 'any' ? [] : [share],
            });
            router.push('/(onboarding)/location');
          }}
        />
        <Pressable onPress={() => router.push('/(onboarding)/location')} style={{ alignItems: 'center', padding: spacing.md }}>
          <Text variant="captionMedium" color={colors.textSecondary}>
            Skip for now
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing['2xl'], paddingBottom: spacing['4xl'] },
  section: { marginTop: spacing['3xl'], marginBottom: spacing.md },
  row: { flexDirection: 'row', flexWrap: 'wrap' },
  footer: {
    paddingHorizontal: spacing['2xl'],
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
});
