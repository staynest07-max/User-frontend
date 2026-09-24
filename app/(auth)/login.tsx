import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, Button, Input, colors, spacing } from '@/design-system';
import { useRequestOtp } from '@/features/auth/hooks/useAuth';
import { authErrorMessage } from '@/features/auth/errors';
import { isValidIndianPhone, normalizeIndianPhone } from '@/features/auth/validation';

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [phone, setPhone] = useState('');
  const requestOtp = useRequestOtp();

  const valid = isValidIndianPhone(phone);

  const submit = () => {
    if (!valid || requestOtp.isPending) return;
    const normalizedPhone = normalizeIndianPhone(phone);
    requestOtp.mutate(normalizedPhone, {
      onSuccess: () => router.push({ pathname: '/(auth)/otp', params: { phone: normalizedPhone } }),
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >
      <View
        style={[
          styles.screen,
          {
            paddingTop: insets.top + spacing['3xl'],
            paddingBottom: insets.bottom + spacing['2xl'],
          },
        ]}
      >
        <View style={styles.content}>
          <Text variant="captionMedium" color={colors.primaryDark}>
            STAYNEST
          </Text>
          <Text variant="h1" style={styles.heading}>
            Welcome back
          </Text>
          <Text variant="body" color={colors.textSecondary} style={styles.description}>
            Sign in with your mobile number. We’ll send a one-time code.
          </Text>

          <View style={styles.fieldBlock}>
            <Input
              label="Mobile number"
              placeholder="10-digit mobile number"
              keyboardType="phone-pad"
              maxLength={10}
              value={phone}
              onChangeText={(value) => {
                setPhone(value.replace(/\D/g, '').slice(0, 10));
                requestOtp.reset();
              }}
              error={requestOtp.error ? authErrorMessage(requestOtp.error) : undefined}
              editable={!requestOtp.isPending}
              leftIcon={<Text variant="bodyMedium">+91</Text>}
            />
          </View>
        </View>

        <Button
          title="Send OTP"
          fullWidth
          size="lg"
          disabled={!valid || requestOtp.isPending}
          loading={requestOtp.isPending}
          onPress={submit}
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
  screen: {
    flex: 1,
    paddingHorizontal: spacing['2xl'],
  },
  content: {
    flex: 1,
  },
  heading: {
    marginTop: spacing['3xl'],
  },
  description: {
    marginTop: spacing.md,
  },
  fieldBlock: {
    marginTop: spacing['3xl'],
  },
});
