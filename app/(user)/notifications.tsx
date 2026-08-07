import React from 'react';
import { View, StyleSheet, FlatList, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Bell } from 'lucide-react-native';
import { Text, EmptyState, colors, spacing, radius, elevation } from '@/design-system';
import { notifications } from '@/data/mock';
import { relativeTime } from '@/utils/format';

export default function NotificationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { paddingTop: insets.top + spacing.md }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.back}>
          <ArrowLeft size={22} color={colors.textPrimary} strokeWidth={2} />
        </Pressable>
        <Text variant="h3">Notifications</Text>
        <View style={{ width: 44 }} />
      </View>
      <FlatList
        data={notifications}
        keyExtractor={(n) => n.id}
        contentContainerStyle={{ padding: spacing['2xl'], flexGrow: 1 }}
        ListEmptyComponent={
          <EmptyState
            title="You're all caught up"
            description="Visit confirmations, enquiry replies and booking updates will appear here."
            icon={<Bell size={28} color={colors.primaryDark} strokeWidth={2} />}
          />
        }
        renderItem={({ item }) => (
          <Pressable style={[styles.card, elevation.soft, !item.read && styles.unread]}>
            <View style={[styles.dot, { backgroundColor: item.read ? colors.border : colors.primary }]} />
            <View style={{ flex: 1 }}>
              <Text variant="bodySemiBold">{item.title}</Text>
              <Text variant="caption" color={colors.textSecondary} style={{ marginTop: 4 }}>
                {item.body}
              </Text>
              <Text variant="small" color={colors.textTertiary} style={{ marginTop: spacing.sm }}>
                {relativeTime(item.createdAt)}
              </Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
  },
  back: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  card: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius['2xl'],
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  unread: { borderWidth: 1, borderColor: colors.primaryLight },
  dot: { width: 8, height: 8, borderRadius: 4, marginTop: 8 },
});
