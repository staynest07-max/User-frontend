import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Input, Text, colors, spacing } from '@/design-system';
import { authErrorMessage } from '@/features/auth/errors';
import { useRequestOtp } from '@/features/auth/hooks/useAuth';
import { isValidIndianPhone, isValidOptionalEmail, isValidSignupName, normalizeIndianPhone } from '@/features/auth/validation';

export default function SignupScreen() {
  const params = useLocalSearchParams<{ phone?: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [phone, setPhone] = useState(() => normalizeIndianPhone(String(params.phone ?? '')));
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const requestOtp = useRequestOtp();
  const valid = isValidIndianPhone(phone) && isValidSignupName(fullName) && isValidOptionalEmail(email);

  const submit = () => {
    if (!valid || requestOtp.isPending) return;
    const normalizedPhone = normalizeIndianPhone(phone);
    requestOtp.mutate(normalizedPhone, {
      onSuccess: () => router.push({
        pathname: '/(auth)/otp',
        params: { phone: normalizedPhone, mode: 'signup', fullName: fullName.trim(), email: email.trim() },
      }),
    });
  };

  return <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
    <View style={[styles.screen, { paddingTop: insets.top + spacing['3xl'], paddingBottom: insets.bottom + spacing.xl }]}>
      <View style={styles.content}>
        <Text variant="h1">Create your account</Text>
        <Text variant="body" color={colors.textSecondary} style={styles.description}>Enter your details, then verify your mobile number with a six-digit OTP.</Text>
        <View style={styles.fields}>
          <Input label="Full name" value={fullName} maxLength={200} editable={!requestOtp.isPending} onChangeText={(value) => { setFullName(value); requestOtp.reset(); }} />
          <Input label="Mobile number" value={phone} keyboardType="phone-pad" maxLength={10} editable={!requestOtp.isPending} leftIcon={<Text variant="bodyMedium">+91</Text>} onChangeText={(value) => { setPhone(value.replace(/\D/g, '').slice(0, 10)); requestOtp.reset(); }} />
          <Input label="Email (optional)" value={email} keyboardType="email-address" autoCapitalize="none" maxLength={320} editable={!requestOtp.isPending} onChangeText={(value) => { setEmail(value); requestOtp.reset(); }} error={email && !isValidOptionalEmail(email) ? 'Enter a valid email address.' : undefined} />
          {requestOtp.error ? <Text variant="small" color={colors.error}>{authErrorMessage(requestOtp.error)}</Text> : null}
        </View>
      </View>
      <Button title="Send signup OTP" fullWidth size="lg" disabled={!valid || requestOtp.isPending} loading={requestOtp.isPending} onPress={submit} />
      <Button title="Back to sign in" variant="ghost" fullWidth onPress={() => router.replace('/(auth)/login')} style={styles.back} />
    </View>
  </KeyboardAvoidingView>;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  screen: { flex: 1, width: '100%', maxWidth: 420, alignSelf: 'center', paddingHorizontal: spacing['2xl'] },
  content: { flex: 1 },
  description: { marginTop: spacing.md },
  fields: { marginTop: spacing['2xl'], gap: spacing.lg },
  back: { marginTop: spacing.sm },
});
