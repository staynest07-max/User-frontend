import React from 'react';
import { View, StyleSheet, FlatList, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { ArrowLeft, MessageCircle } from 'lucide-react-native';
import { Text, EmptyState, Badge, colors, spacing, radius, elevation } from '@/design-system';
import { chatThreads } from '@/data/mock';
import { relativeTime } from '@/utils/format';

export default function MessagesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { paddingTop: insets.top + spacing.md }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.back}>
          <ArrowLeft size={22} color={colors.textPrimary} strokeWidth={2} />
        </Pressable>
        <Text variant="h3">Messages</Text>
        <View style={{ width: 44 }} />
      </View>
      <FlatList
        data={chatThreads}
        keyExtractor={(t) => t.id}
        contentContainerStyle={{ padding: spacing['2xl'], flexGrow: 1 }}
        ListEmptyComponent={
          <EmptyState
            title="No conversations"
            description="In-app chat keeps your number private while you talk to owners."
            icon={<MessageCircle size={28} color={colors.primaryDark} strokeWidth={2} />}
          />
        }
        renderItem={({ item }) => (
          <Pressable
            style={[styles.card, elevation.soft]}
            onPress={() => router.push(`/(user)/messages/${item.id}`)}
          >
            <Image source={{ uri: item.propertyImage }} style={styles.avatar} contentFit="cover" />
            <View style={{ flex: 1 }}>
              <View style={styles.row}>
                <Text variant="bodySemiBold" numberOfLines={1} style={{ flex: 1 }}>
                  {item.otherPartyName}
                </Text>
                <Text variant="small" color={colors.textTertiary}>
                  {relativeTime(item.lastMessageAt)}
                </Text>
              </View>
              <Text variant="caption" color={colors.textSecondary} numberOfLines={1}>
                {item.propertyName}
              </Text>
              <Text variant="caption" color={colors.textSecondary} numberOfLines={1} style={{ marginTop: 2 }}>
                {item.lastMessage}
              </Text>
            </View>
            {item.unread ? <Badge label={String(item.unread)} tone="primary" /> : null}
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
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius['2xl'],
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  avatar: { width: 56, height: 56, borderRadius: radius.lg },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
});
