import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { Text, Button, Chip, Input, colors, spacing } from '@/design-system';
import { properties } from '@/data/mock';

const durations = ['1–3 months', '3–6 months', '6–12 months', '12+ months'];

export default function EnquireScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const property = properties.find((p) => p.id === id);
  const [roomId, setRoomId] = useState(property?.roomTypes[0]?.id);
  const [duration, setDuration] = useState(durations[1]);
  const [message, setMessage] = useState('Hi, I’m interested in this PG. Please share availability.');

  if (!property) return null;

  return (
    <View style={[styles.root, { paddingTop: insets.top + spacing.md }]}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: spacing['2xl'], paddingBottom: 120 }}>
        <Pressable onPress={() => router.back()} style={styles.back}>
          <ArrowLeft size={22} color={colors.textPrimary} strokeWidth={2} />
        </Pressable>
        <Text variant="h2">Send enquiry</Text>
        <Text variant="body" color={colors.textSecondary} style={{ marginTop: spacing.sm }}>
          {property.name}
        </Text>

        <Text variant="h4" style={styles.section}>
          Room type
        </Text>
        <View style={styles.wrap}>
          {property.roomTypes.map((r) => (
            <Chip key={r.id} label={r.name} selected={roomId === r.id} onPress={() => setRoomId(r.id)} />
          ))}
        </View>

        <Text variant="h4" style={styles.section}>
          Duration
        </Text>
        <View style={styles.wrap}>
          {durations.map((d) => (
            <Chip key={d} label={d} selected={duration === d} onPress={() => setDuration(d)} />
          ))}
        </View>

        <Text variant="h4" style={styles.section}>
          Message
        </Text>
        <Input
          value={message}
          onChangeText={setMessage}
          multiline
          style={{ minHeight: 120, textAlignVertical: 'top' }}
        />
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
        <Button
          title="Send enquiry"
          fullWidth
          size="lg"
          onPress={() =>
            router.replace({
              pathname: '/(user)/booking-success',
              params: { type: 'enquiry', name: property.name },
            })
          }
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
