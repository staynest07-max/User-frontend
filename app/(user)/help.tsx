import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { Text, Button, Input, Chip, colors, spacing, radius, elevation } from '@/design-system';

const topics = [
  'Account',
  'Listing issue',
  'Visit',
  'Booking',
  'Payment',
  'Safety report',
  'Wrong price',
  'Fake photos',
];

export default function HelpScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [topic, setTopic] = useState('Visit');
  const [details, setDetails] = useState('');
  const [sent, setSent] = useState(false);

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
      <Text variant="h2">Help & support</Text>
      <Text variant="body" color={colors.textSecondary} style={{ marginTop: spacing.sm }}>
        Raise a ticket for account, listing, visit, booking or safety issues.
      </Text>

      {sent ? (
        <View style={[styles.success, elevation.soft]}>
          <Text variant="h4">Ticket submitted</Text>
          <Text variant="body" color={colors.textSecondary} style={{ marginTop: spacing.sm }}>
            Our team will update you in Notifications. For urgent safety issues, listings can be hidden while we investigate.
          </Text>
          <Button title="Done" style={{ marginTop: spacing.lg }} onPress={() => router.back()} />
        </View>
      ) : (
        <>
          <Text variant="h4" style={{ marginTop: spacing['2xl'], marginBottom: spacing.md }}>
            Topic
          </Text>
          <View style={styles.wrap}>
            {topics.map((t) => (
              <Chip key={t} label={t} selected={topic === t} onPress={() => setTopic(t)} />
            ))}
          </View>
          <Text variant="h4" style={{ marginTop: spacing.xl, marginBottom: spacing.md }}>
            Details
          </Text>
          <Input
            placeholder="Describe what happened…"
            value={details}
            onChangeText={setDetails}
            multiline
            style={{ minHeight: 140, textAlignVertical: 'top' }}
          />
          <Button
            title="Submit ticket"
            fullWidth
            size="lg"
            style={{ marginTop: spacing.xl }}
            disabled={!details.trim()}
            onPress={() => setSent(true)}
          />
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  back: { width: 44, height: 44, justifyContent: 'center', marginBottom: spacing.sm },
  wrap: { flexDirection: 'row', flexWrap: 'wrap' },
  success: {
    marginTop: spacing['2xl'],
    backgroundColor: colors.surface,
    borderRadius: radius['2xl'],
    padding: spacing.xl,
  },
});
