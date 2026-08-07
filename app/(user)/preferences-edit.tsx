import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { Text, Button, Chip, colors, spacing } from '@/design-system';
import { useAppStore } from '@/stores/appStore';
import { cities } from '@/data/mock';
import type { PgType, SharingType } from '@/types';

export default function PreferencesEditScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const prefs = useAppStore((s) => s.preferences);
  const setPreferences = useAppStore((s) => s.setPreferences);
  const [city, setCity] = useState(prefs.city);
  const [pgType, setPgType] = useState(prefs.pgType);
  const [sharing, setSharing] = useState(prefs.sharing);

  return (
    <View style={[styles.root, { paddingTop: insets.top + spacing.md }]}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: spacing['2xl'], paddingBottom: 120 }}>
        <Pressable onPress={() => router.back()} style={styles.back}>
          <ArrowLeft size={22} color={colors.textPrimary} strokeWidth={2} />
        </Pressable>
        <Text variant="h2">Preferences</Text>
        <Text variant="body" color={colors.textSecondary} style={{ marginTop: spacing.sm }}>
          Update city, budget feel and room preferences. Recommendations refresh instantly.
        </Text>

        <Text variant="h4" style={styles.section}>
          City
        </Text>
        <View style={styles.wrap}>
          {cities.map((c) => (
            <Chip key={c} label={c} selected={city === c} onPress={() => setCity(c)} />
          ))}
        </View>

        <Text variant="h4" style={styles.section}>
          PG type
        </Text>
        <View style={styles.wrap}>
          {(['any', 'women', 'men', 'coliving', 'family'] as const).map((t) => (
            <Chip key={t} label={t} selected={pgType === t} onPress={() => setPgType(t as PgType | 'any')} />
          ))}
        </View>

        <Text variant="h4" style={styles.section}>
          Sharing
        </Text>
        <View style={styles.wrap}>
          {(['any', 'private', '2-sharing', '3-sharing', '4-sharing'] as const).map((t) => (
            <Chip
              key={t}
              label={t}
              selected={sharing === t}
              onPress={() => setSharing(t as SharingType | 'any')}
            />
          ))}
        </View>
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
        <Button
          title="Save preferences"
          fullWidth
          size="lg"
          onPress={() => {
            setPreferences({ city, pgType, sharing });
            router.back();
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  back: { width: 44, height: 44, justifyContent: 'center', marginBottom: spacing.sm },
  section: { marginTop: spacing['2xl'], marginBottom: spacing.md },
  wrap: { flexDirection: 'row', flexWrap: 'wrap' },
  footer: {
    paddingHorizontal: spacing['2xl'],
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
