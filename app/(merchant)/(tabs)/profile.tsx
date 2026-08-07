import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, Button, Badge, colors, spacing, radius, elevation } from '@/design-system';
import { useAppStore } from '@/stores/appStore';

export default function MerchantProfile() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { name, phone, setRole, logout } = useAppStore();

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={{
        paddingTop: insets.top + spacing.lg,
        paddingHorizontal: spacing['2xl'],
        paddingBottom: 120,
      }}
    >
      <Text variant="h2">Owner profile</Text>
      <View style={[styles.card, elevation.soft, { marginTop: spacing.xl }]}>
        <Text variant="h4">{name || 'Ananya Desai'}</Text>
        <Text variant="caption" color={colors.textSecondary}>
          +91 {phone || '9876543210'}
        </Text>
        <View style={{ marginTop: spacing.md }}>
          <Badge label="Identity verified" tone="success" />
        </View>
      </View>

      <View style={[styles.card, elevation.soft, { marginTop: spacing.lg }]}>
        <Text variant="bodySemiBold">Verification</Text>
        <Text variant="caption" color={colors.textSecondary} style={{ marginTop: 4 }}>
          Property proof uploaded · Field verification complete for Nordic Haven
        </Text>
      </View>

      <View style={{ marginTop: spacing.xl, gap: spacing.sm }}>
        <Button
          title="Switch to seeker app"
          variant="outline"
          fullWidth
          onPress={() => {
            setRole('user');
            router.replace('/(user)/(tabs)');
          }}
        />
        <Button
          title="Sign out"
          variant="ghost"
          fullWidth
          onPress={() => {
            logout();
            router.replace('/(onboarding)/welcome');
          }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius['2xl'],
    padding: spacing.xl,
  },
});
