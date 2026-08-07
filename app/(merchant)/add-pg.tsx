import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { Text, Button, Input, Chip, colors, spacing } from '@/design-system';

const steps = ['Basics', 'Location', 'Rooms', 'Amenities', 'Rules', 'Photos', 'Preview'];

export default function AddPgScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [pgType, setPgType] = useState('women');
  const [area, setArea] = useState('');
  const [description, setDescription] = useState('');

  const next = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else {
      Alert.alert('Submitted', 'Your listing has been sent for admin approval.');
      router.replace('/(merchant)/(tabs)/listings');
    }
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top + spacing.md }]}>
      <View style={styles.header}>
        <Pressable onPress={() => (step === 0 ? router.back() : setStep(step - 1))} style={styles.back}>
          <ArrowLeft size={22} color={colors.textPrimary} strokeWidth={2} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text variant="captionMedium" color={colors.primaryDark}>
            STEP {step + 1} OF {steps.length}
          </Text>
          <Text variant="h3">{steps[step]}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing['2xl'], paddingBottom: 140 }}>
        {step === 0 && (
          <>
            <Input label="PG name" value={name} onChangeText={setName} placeholder="e.g. Nordic Haven PG" />
            <Text variant="captionMedium" color={colors.textSecondary} style={{ marginTop: spacing.xl, marginBottom: spacing.sm }}>
              PG type
            </Text>
            <View style={styles.wrap}>
              {['women', 'men', 'coliving', 'hostel', 'family'].map((t) => (
                <Chip key={t} label={t} selected={pgType === t} onPress={() => setPgType(t)} />
              ))}
            </View>
            <View style={{ marginTop: spacing.lg }}>
              <Input
                label="Description"
                value={description}
                onChangeText={setDescription}
                placeholder="What makes this feel like home?"
                multiline
                style={{ minHeight: 100, textAlignVertical: 'top' }}
              />
            </View>
          </>
        )}
        {step === 1 && (
          <>
            <Input label="Area / locality" value={area} onChangeText={setArea} placeholder="Koregaon Park" />
            <View style={{ marginTop: spacing.lg }}>
              <Input label="Full address" placeholder="Building, street, landmark" />
            </View>
            <View style={{ marginTop: spacing.lg }}>
              <Input label="City" placeholder="Pune" />
            </View>
            <Text variant="caption" color={colors.textTertiary} style={{ marginTop: spacing.lg }}>
              Map pin placement will use exact coordinates in production.
            </Text>
          </>
        )}
        {step === 2 && (
          <>
            <Text variant="body" color={colors.textSecondary}>
              Add room types with rent, deposit and available beds.
            </Text>
            {['Private', '2-sharing', '3-sharing'].map((r) => (
              <View key={r} style={styles.roomBox}>
                <Text variant="bodySemiBold">{r}</Text>
                <View style={{ flexDirection: 'row', gap: spacing.md, marginTop: spacing.md }}>
                  <View style={{ flex: 1 }}>
                    <Input label="Rent" placeholder="12000" keyboardType="number-pad" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Input label="Beds free" placeholder="3" keyboardType="number-pad" />
                  </View>
                </View>
              </View>
            ))}
          </>
        )}
        {step === 3 && (
          <View style={styles.wrap}>
            {['Wi-Fi', 'AC', 'Laundry', 'CCTV', 'Parking', 'Lift', 'Housekeeping', 'Biometric'].map((a) => (
              <Chip key={a} label={a} selected />
            ))}
          </View>
        )}
        {step === 4 && (
          <>
            <Input label="Entry time" placeholder="10:00 PM" />
            <View style={{ marginTop: spacing.lg }}>
              <Input label="Visitor policy" placeholder="Allowed till 8 PM with ID" />
            </View>
            <View style={{ marginTop: spacing.lg }}>
              <Input label="Minimum stay" placeholder="3 months" />
            </View>
          </>
        )}
        {step === 5 && (
          <View style={styles.photoBox}>
            <Text variant="h4">Upload photos</Text>
            <Text variant="body" color={colors.textSecondary} style={{ marginTop: spacing.sm }}>
              Natural daylight, wood furniture, white walls. Categorize as exterior, room, bathroom, kitchen, common.
            </Text>
            <Button title="Choose cover photo" variant="soft" style={{ marginTop: spacing.xl }} onPress={() => undefined} />
          </View>
        )}
        {step === 6 && (
          <View style={styles.photoBox}>
            <Text variant="h4">Preview & submit</Text>
            <Text variant="body" color={colors.textSecondary} style={{ marginTop: spacing.sm }}>
              {name || 'Untitled PG'} · {pgType} · {area || 'Location pending'}
            </Text>
            <Text variant="caption" color={colors.textTertiary} style={{ marginTop: spacing.md }}>
              Submitting sends this listing to the Super Admin approval queue.
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
        <Button title="Save draft" variant="outline" style={{ flex: 1 }} onPress={() => router.back()} />
        <Button
          title={step === steps.length - 1 ? 'Submit for approval' : 'Continue'}
          style={{ flex: 1.4 }}
          onPress={next}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  back: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  wrap: { flexDirection: 'row', flexWrap: 'wrap' },
  roomBox: {
    marginTop: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  photoBox: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  footer: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing['2xl'],
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
