import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { Text, Input, Button, colors, spacing, radius } from '@/design-system';
import { chatMessages, chatThreads } from '@/data/mock';

export default function ChatThreadScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const thread = chatThreads.find((t) => t.id === id);
  const [messages, setMessages] = useState(chatMessages.filter((m) => m.threadId === id));
  const [text, setText] = useState('');

  return (
    <KeyboardAvoidingView
      style={[styles.root, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={8}
    >
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.back}>
          <ArrowLeft size={22} color={colors.textPrimary} strokeWidth={2} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text variant="bodySemiBold">{thread?.otherPartyName}</Text>
          <Text variant="small" color={colors.textSecondary}>
            {thread?.propertyName}
          </Text>
        </View>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(m) => m.id}
        contentContainerStyle={{ padding: spacing['2xl'], gap: spacing.sm }}
        renderItem={({ item }) => (
          <View style={[styles.bubble, item.sender === 'me' ? styles.me : styles.them]}>
            <Text
              variant="body"
              color={item.sender === 'me' ? colors.textInverse : colors.textPrimary}
            >
              {item.text}
            </Text>
          </View>
        )}
      />

      <View style={[styles.composer, { paddingBottom: insets.bottom + spacing.md }]}>
        <View style={{ flex: 1 }}>
          <Input
            value={text}
            onChangeText={setText}
            placeholder="Write a message…"
          />
        </View>
        <Button
          title="Send"
          size="sm"
          disabled={!text.trim()}
          onPress={() => {
            setMessages((prev) => [
              ...prev,
              {
                id: `local-${Date.now()}`,
                threadId: String(id),
                text: text.trim(),
                sender: 'me',
                createdAt: new Date().toISOString(),
              },
            ]);
            setText('');
          }}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  back: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  bubble: {
    maxWidth: '78%',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.xl,
  },
  me: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
    borderBottomRightRadius: 6,
  },
  them: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surface,
    borderBottomLeftRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
