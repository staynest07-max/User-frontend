import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, Button, colors, spacing, radius, typography } from '@/design-system';
import { useRequestOtp, useVerifyOtp } from '@/features/auth/hooks/useAuth';
import { authErrorMessage } from '@/features/auth/errors';
import { isValidIndianPhone, isValidOtp, normalizeIndianPhone } from '@/features/auth/validation';

const OTP_LENGTH = 6;
const OTP_GAP = 8;
const OTP_BOX_MAX = 46;
const OTP_BOX_MIN = 40;
const OTP_BOX_HEIGHT = 52;
const CONTENT_MAX = 360;
const PAGE_GUTTER = 20;

export default function OtpScreen() {
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();
  const normalizedPhone = normalizeIndianPhone(String(phone ?? ''));
  const [otp, setOtp] = useState(() => Array.from({ length: OTP_LENGTH }, () => ''));
  const [resendSeconds, setResendSeconds] = useState(30);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const inputs = useRef<(TextInput | null)[]>([]);
  const verifyOtp = useVerifyOtp();
  const resendOtp = useRequestOtp();

  const code = otp.join('');
  const valid = isValidIndianPhone(normalizedPhone) && isValidOtp(code);
  const columnWidth = Math.min(windowWidth, CONTENT_MAX);
  const innerWidth = columnWidth - PAGE_GUTTER * 2;
  const boxWidth = Math.min(
    OTP_BOX_MAX,
    Math.max(OTP_BOX_MIN, Math.floor((innerWidth - OTP_GAP * (OTP_LENGTH - 1)) / OTP_LENGTH))
  );

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
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View
        style={[
          styles.column,
          {
            paddingTop: insets.top + spacing['3xl'],
            paddingBottom: insets.bottom + spacing.xl,
          },
        ]}
      >
        <View style={styles.content}>
          <Text variant="h1">Enter the code</Text>
          <Text variant="body" color={colors.textSecondary} style={styles.description}>
            We sent a one-time code to +91 {normalizedPhone}.
          </Text>

          <View style={styles.otpRow}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  inputs.current[index] = ref;
                }}
                value={digit}
                onChangeText={(value) => onChange(index, value)}
                onFocus={() => setFocusedIndex(index)}
                onBlur={() => setFocusedIndex((current) => (current === index ? null : current))}
                keyboardType="number-pad"
                maxLength={1}
                editable={!verifyOtp.isPending}
                style={[
                  styles.otpBox,
                  { width: boxWidth },
                  focusedIndex === index ? styles.otpBoxFocused : null,
                ]}
                accessibilityLabel={`Digit ${index + 1}`}
              />
            ))}
          </View>

          {verifyOtp.error || resendOtp.error ? (
            <Text variant="small" color={colors.error} style={styles.error} accessibilityRole="alert">
              {authErrorMessage(verifyOtp.error ?? resendOtp.error)}
            </Text>
          ) : null}

          <Pressable
            style={styles.resend}
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
        </View>

        <Button
          title="Verify & continue"
          fullWidth
          size="lg"
          disabled={!valid || verifyOtp.isPending}
          loading={verifyOtp.isPending}
          onPress={verify}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  column: {
    flex: 1,
    width: '100%',
    maxWidth: CONTENT_MAX,
    alignSelf: 'center',
    paddingHorizontal: PAGE_GUTTER,
  },
  content: {
    flex: 1,
  },
  description: {
    marginTop: spacing.sm,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: OTP_GAP,
    marginTop: spacing['3xl'],
  },
  otpBox: {
    height: OTP_BOX_HEIGHT,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    textAlign: 'center',
    textAlignVertical: 'center',
    paddingVertical: 0,
    includeFontPadding: false,
    ...typography.h2,
    lineHeight: 32,
    color: colors.textPrimary,
  },
  otpBoxFocused: {
    borderColor: colors.primary,
  },
  error: {
    marginTop: spacing.md,
  },
  resend: {
    marginTop: spacing.lg,
    alignSelf: 'flex-start',
  },
});
