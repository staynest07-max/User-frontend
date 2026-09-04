import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
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
      style={[styles.root, { paddingTop: insets.top + spacing['3xl'] }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text variant="captionMedium" color={colors.primaryDark}>
        STAYNEST
      </Text>
      <Text variant="h1" style={{ marginTop: spacing.sm }}>
        Welcome back
      </Text>
      <Text variant="body" color={colors.textSecondary} style={{ marginTop: spacing.md }}>
        Sign in with your mobile number. We’ll send a one-time code.
      </Text>

      <View style={{ marginTop: spacing['3xl'] }}>
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

      <View style={{ flex: 1 }} />

      <Button
        title="Send OTP"
        fullWidth
        size="lg"
        disabled={!valid || requestOtp.isPending}
        loading={requestOtp.isPending}
        onPress={submit}
        style={{ marginBottom: spacing.sm }}
      />
      <View style={{ height: insets.bottom + spacing.lg }} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing['2xl'],
  },
});
