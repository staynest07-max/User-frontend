import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { Text, Button, Input, colors, spacing, radius, elevation } from '@/design-system';

export default function VacancyUpdateScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [beds, setBeds] = useState({ private: '1', twin: '3', triple: '2' });

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
      <Text variant="h2">Update vacancies</Text>
      <Text variant="body" color={colors.textSecondary} style={{ marginTop: spacing.sm }}>
        Nordic Haven PG · Keep availability fresh so seekers trust your listing.
      </Text>

      <View style={[styles.card, elevation.soft, { marginTop: spacing.xl }]}>
        <Input
          label="Private Studio beds free"
          value={beds.private}
          onChangeText={(v) => setBeds((b) => ({ ...b, private: v }))}
          keyboardType="number-pad"
        />
        <View style={{ height: spacing.lg }} />
        <Input
          label="Twin Share beds free"
          value={beds.twin}
          onChangeText={(v) => setBeds((b) => ({ ...b, twin: v }))}
          keyboardType="number-pad"
        />
        <View style={{ height: spacing.lg }} />
        <Input
          label="Triple Share beds free"
          value={beds.triple}
          onChangeText={(v) => setBeds((b) => ({ ...b, triple: v }))}
          keyboardType="number-pad"
        />
      </View>

      <Button
        title="Save availability"
        fullWidth
        size="lg"
        style={{ marginTop: spacing.xl }}
        onPress={() => router.back()}
      />
      <Button title="Mark fully occupied" variant="outline" fullWidth style={{ marginTop: spacing.sm }} onPress={() => router.back()} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  back: { width: 44, height: 44, justifyContent: 'center', marginBottom: spacing.sm },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius['2xl'],
    padding: spacing.xl,
  },
});
