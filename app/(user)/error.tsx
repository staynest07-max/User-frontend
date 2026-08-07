import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WifiOff } from 'lucide-react-native';
import { Text, Button, ErrorState, colors, spacing } from '@/design-system';

export default function ErrorScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.root, { paddingTop: insets.top + spacing['4xl'] }]}>
      <View style={styles.icon}>
        <WifiOff size={32} color={colors.primaryDark} strokeWidth={2} />
      </View>
      <ErrorState
        title="Couldn’t load homes"
        description="Check your connection and try again. Your preferences are saved."
        onRetry={() => router.replace('/(user)/(tabs)')}
      />
      <Button title="Go home" variant="ghost" onPress={() => router.replace('/(user)/(tabs)')} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing['2xl'],
    alignItems: 'center',
  },
  icon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
});
