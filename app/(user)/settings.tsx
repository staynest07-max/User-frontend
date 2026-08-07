import React from 'react';
import { View, StyleSheet, ScrollView, Pressable, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { Text, colors, spacing, radius, elevation } from '@/design-system';

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [push, setPush] = React.useState(true);
  const [sms, setSms] = React.useState(false);

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={{
        paddingTop: insets.top + spacing.md,
        paddingHorizontal: spacing['2xl'],
        paddingBottom: spacing['5xl'],
      }}
    >
      <Pressable onPress={() => router.back()} style={styles.back}>
        <ArrowLeft size={22} color={colors.textPrimary} strokeWidth={2} />
      </Pressable>
      <Text variant="h2">Settings</Text>

      <View style={[styles.card, elevation.soft, { marginTop: spacing.xl }]}>
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text variant="bodyMedium">Push notifications</Text>
            <Text variant="caption" color={colors.textSecondary}>
              Visits, enquiries and booking updates
            </Text>
          </View>
          <Switch
            value={push}
            onValueChange={setPush}
            trackColor={{ true: colors.primary, false: colors.borderStrong }}
            thumbColor={colors.surface}
          />
        </View>
        <View style={[styles.row, styles.border]}>
          <View style={{ flex: 1 }}>
            <Text variant="bodyMedium">SMS alerts</Text>
            <Text variant="caption" color={colors.textSecondary}>
              Critical visit and payment messages
            </Text>
          </View>
          <Switch
            value={sms}
            onValueChange={setSms}
            trackColor={{ true: colors.primary, false: colors.borderStrong }}
            thumbColor={colors.surface}
          />
        </View>
      </View>

      <Text variant="caption" color={colors.textTertiary} style={{ marginTop: spacing.xl }}>
        StayNest is designed light-first. Dark mode tokens are ready in the design system for a future release.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  back: { width: 44, height: 44, justifyContent: 'center', marginBottom: spacing.sm },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius['2xl'],
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    minHeight: 64,
    gap: spacing.md,
  },
  border: { borderTopWidth: 1, borderTopColor: colors.divider },
});
