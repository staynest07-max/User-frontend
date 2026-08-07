import React, { useState, useRef } from 'react';
import { View, StyleSheet, TextInput, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, Button, colors, spacing, radius, typography } from '@/design-system';
import { useAppStore } from '@/stores/appStore';

export default function OtpScreen() {
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputs = useRef<(TextInput | null)[]>([]);
  const setAuth = useAppStore((s) => s.setAuth);
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);
  const role = useAppStore((s) => s.role);

  const code = otp.join('');
  const valid = code.length === 4;

  const onChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    if (digit && index < 3) inputs.current[index + 1]?.focus();
  };

  const verify = () => {
    setAuth(String(phone), role === 'merchant' ? 'Ananya Desai' : 'Priya Sharma');
    completeOnboarding();
    if (role === 'merchant') {
      router.replace('/(merchant)/(tabs)');
    } else if (role === 'admin') {
      router.replace('/(admin)/(tabs)');
    } else {
      router.replace('/(user)/(tabs)');
    }
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top + spacing['3xl'], paddingBottom: insets.bottom + spacing.xl }]}>
      <Text variant="h1">Enter the code</Text>
      <Text variant="body" color={colors.textSecondary} style={{ marginTop: spacing.md }}>
        We sent a 4-digit code to +91 {phone}. Demo: use any 4 digits.
      </Text>

      <View style={styles.otpRow}>
        {otp.map((d, i) => (
          <TextInput
            key={i}
            ref={(r) => {
              inputs.current[i] = r;
            }}
            value={d}
            onChangeText={(v) => onChange(i, v)}
            keyboardType="number-pad"
            maxLength={1}
            style={styles.otpBox}
            accessibilityLabel={`Digit ${i + 1}`}
          />
        ))}
      </View>

      <Pressable style={{ marginTop: spacing.lg }}>
        <Text variant="captionMedium" color={colors.primaryDark}>
          Resend code
        </Text>
      </Pressable>

      <View style={{ flex: 1 }} />
      <Button title="Verify & continue" fullWidth size="lg" disabled={!valid} onPress={verify} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing['2xl'],
  },
  otpRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing['3xl'],
  },
  otpBox: {
    flex: 1,
    height: 64,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    textAlign: 'center',
    ...typography.h2,
    color: colors.textPrimary,
  },
});
