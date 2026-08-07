import React from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Bell,
  MessageCircle,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  SlidersHorizontal,
  Shield,
} from 'lucide-react-native';
import { Text, Button, colors, spacing, radius, elevation } from '@/design-system';
import { useAppStore } from '@/stores/appStore';

const rows = [
  { icon: SlidersHorizontal, label: 'Preferences', href: '/(user)/preferences-edit' },
  { icon: MessageCircle, label: 'Messages', href: '/(user)/messages' },
  { icon: Bell, label: 'Notifications', href: '/(user)/notifications' },
  { icon: Settings, label: 'Settings', href: '/(user)/settings' },
  { icon: HelpCircle, label: 'Help & support', href: '/(user)/help' },
  { icon: Shield, label: 'Safety & report', href: '/(user)/help' },
];

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { name, phone, isAuthenticated, logout, setRole } = useAppStore();

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={{
        paddingTop: insets.top + spacing.lg,
        paddingBottom: 120,
        paddingHorizontal: spacing['2xl'],
      }}
    >
      <Text variant="h2">Profile</Text>

      <View style={[styles.card, elevation.soft, { marginTop: spacing.xl }]}>
        <View style={styles.avatar}>
          <Text variant="h3" color={colors.primaryDark}>
            {(name || 'G').charAt(0)}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text variant="h4">{isAuthenticated ? name : 'Guest'}</Text>
          <Text variant="caption" color={colors.textSecondary}>
            {isAuthenticated ? `+91 ${phone}` : 'Browsing without an account'}
          </Text>
        </View>
      </View>

      {!isAuthenticated ? (
        <Button
          title="Sign in with OTP"
          fullWidth
          style={{ marginTop: spacing.lg }}
          onPress={() => router.push('/(auth)/login')}
        />
      ) : null}

      <View style={[styles.menu, elevation.soft, { marginTop: spacing.xl }]}>
        {rows.map((r, i) => (
          <Pressable
            key={r.label}
            style={[styles.row, i < rows.length - 1 && styles.rowBorder]}
            onPress={() => router.push(r.href as any)}
          >
            <r.icon size={20} color={colors.textPrimary} strokeWidth={2} />
            <Text variant="bodyMedium" style={{ flex: 1, marginLeft: spacing.md }}>
              {r.label}
            </Text>
            <ChevronRight size={18} color={colors.textTertiary} strokeWidth={2} />
          </Pressable>
        ))}
      </View>

      <View style={{ marginTop: spacing.xl, gap: spacing.sm }}>
        <Button
          title="Switch to owner dashboard"
          variant="outline"
          fullWidth
          onPress={() => {
            setRole('merchant');
            router.replace('/(merchant)/(tabs)');
          }}
        />
        <Button
          title="Switch to admin"
          variant="ghost"
          fullWidth
          onPress={() => {
            setRole('admin');
            router.replace('/(admin)/(tabs)');
          }}
        />
        {isAuthenticated ? (
          <Button
            title="Sign out"
            variant="ghost"
            fullWidth
            leftIcon={<LogOut size={18} color={colors.error} strokeWidth={2} />}
            onPress={() => {
              logout();
              router.replace('/(onboarding)/welcome');
            }}
            style={{ marginTop: spacing.sm }}
          />
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius['2xl'],
    padding: spacing.xl,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menu: {
    backgroundColor: colors.surface,
    borderRadius: radius['2xl'],
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    minHeight: 56,
  },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.divider },
});
