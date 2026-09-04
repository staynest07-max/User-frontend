import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, TextInput, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, Button, colors, spacing, radius, typography } from '@/design-system';
import { useRequestOtp, useVerifyOtp } from '@/features/auth/hooks/useAuth';
import { authErrorMessage } from '@/features/auth/errors';
import { isValidIndianPhone, isValidOtp, normalizeIndianPhone } from '@/features/auth/validation';

const OTP_LENGTH = 6;

export default function OtpScreen() {
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const normalizedPhone = normalizeIndianPhone(String(phone ?? ''));
  const [otp, setOtp] = useState(() => Array.from({ length: OTP_LENGTH }, () => ''));
  const [resendSeconds, setResendSeconds] = useState(30);
  const inputs = useRef<(TextInput | null)[]>([]);
  const verifyOtp = useVerifyOtp();
  const resendOtp = useRequestOtp();

  const code = otp.join('');
  const valid = isValidIndianPhone(normalizedPhone) && isValidOtp(code);

  useEffect(() => {
    if (resendSeconds <= 0) return;
    const timer = setTimeout(() => setResendSeconds((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendSeconds]);

  useEffect(() => {
    if (!isValidIndianPhone(normalizedPhone)) router.replace('/(auth)/login');
  }, [normalizedPhone, router]);

  const onChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    verifyOtp.reset();
    if (digit && index < OTP_LENGTH - 1) inputs.current[index + 1]?.focus();
  };

  const verify = () => {
    if (!valid || verifyOtp.isPending) return;
    verifyOtp.mutate({ phone: normalizedPhone, otp: code }, {
      onSuccess: () => {
        setOtp(Array.from({ length: OTP_LENGTH }, () => ''));
        router.replace('/(user)/(tabs)');
      },
    });
  };

  const resend = () => {
    if (resendSeconds > 0 || resendOtp.isPending) return;
    resendOtp.mutate(normalizedPhone, {
      onSuccess: (result) => {
        setOtp(Array.from({ length: OTP_LENGTH }, () => ''));
        setResendSeconds(Math.min(result.expiresInSeconds, 30));
        inputs.current[0]?.focus();
      },
    });
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top + spacing['3xl'], paddingBottom: insets.bottom + spacing.xl }]}>
      <Text variant="h1">Enter the code</Text>
      <Text variant="body" color={colors.textSecondary} style={{ marginTop: spacing.md }}>
        We sent a one-time code to +91 {normalizedPhone}.
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
            editable={!verifyOtp.isPending}
            style={styles.otpBox}
            accessibilityLabel={`Digit ${i + 1}`}
          />
        ))}
      </View>

      {verifyOtp.error || resendOtp.error ? (
        <Text variant="small" color={colors.error} style={{ marginTop: spacing.md }} accessibilityRole="alert">
          {authErrorMessage(verifyOtp.error ?? resendOtp.error)}
        </Text>
      ) : null}

      <Pressable
        style={{ marginTop: spacing.lg }}
        disabled={resendSeconds > 0 || resendOtp.isPending}
        onPress={resend}
      >
        <Text
          variant="captionMedium"
          color={resendSeconds > 0 ? colors.textTertiary : colors.primaryDark}
        >
          {resendOtp.isPending ? 'Sending…' : resendSeconds > 0 ? `Resend code in ${resendSeconds}s` : 'Resend code'}
        </Text>
      </Pressable>

      <View style={{ flex: 1 }} />
      <Button
        title="Verify & continue"
        fullWidth
        size="lg"
        disabled={!valid || verifyOtp.isPending}
        loading={verifyOtp.isPending}
        onPress={verify}
      />
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
