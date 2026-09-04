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
import { useAuthSessionStore } from '@/stores/authSessionStore';
import { useCurrentUser, useLogout } from '@/features/auth/hooks/useAuth';

const rows = [
  { icon: SlidersHorizontal, label: 'Preferences', href: '/(user)/preferences-edit' },
  { icon: MessageCircle, label: 'My enquiries', href: '/(user)/enquiries' },
  { icon: Bell, label: 'Notifications', href: '/(user)/notifications' },
  { icon: Settings, label: 'Settings', href: '/(user)/settings' },
  { icon: HelpCircle, label: 'Help & support', href: '/(user)/help' },
  { icon: Shield, label: 'Safety & report', href: '/(user)/help' },
];

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const principal = useAuthSessionStore((state) => state.principal);
  useCurrentUser();
  const logout = useLogout();

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
            U
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text variant="h4">StayNest user</Text>
          <Text variant="caption" color={colors.textSecondary}>
            {principal ? 'Signed in securely' : 'Session unavailable'}
          </Text>
        </View>
      </View>

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
          title="Sign out"
          variant="ghost"
          fullWidth
          loading={logout.isPending}
          leftIcon={<LogOut size={18} color={colors.error} strokeWidth={2} />}
          onPress={() => logout.mutate(undefined, {
            onSettled: () => router.replace('/(onboarding)/welcome'),
          })}
          style={{ marginTop: spacing.sm }}
        />
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
