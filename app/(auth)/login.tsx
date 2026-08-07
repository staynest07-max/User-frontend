import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, Button, Input, colors, spacing } from '@/design-system';
import { useAppStore } from '@/stores/appStore';

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [phone, setPhone] = useState('');
  const role = useAppStore((s) => s.role);

  const valid = phone.replace(/\D/g, '').length === 10;

  return (
    <KeyboardAvoidingView
      style={[styles.root, { paddingTop: insets.top + spacing['3xl'] }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text variant="captionMedium" color={colors.primaryDark}>
        STAYNEST
      </Text>
      <Text variant="h1" style={{ marginTop: spacing.sm }}>
        {role === 'merchant' ? 'Owner sign in' : 'Welcome back'}
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
          onChangeText={setPhone}
          leftIcon={<Text variant="bodyMedium">+91</Text>}
        />
      </View>

      <View style={{ flex: 1 }} />

      <Button
        title="Send OTP"
        fullWidth
        size="lg"
        disabled={!valid}
        onPress={() => router.push({ pathname: '/(auth)/otp', params: { phone } })}
        style={{ marginBottom: spacing.sm }}
      />
      <Button
        title="Continue as guest"
        variant="ghost"
        fullWidth
        onPress={() => {
          useAppStore.getState().continueAsGuest();
          useAppStore.getState().completeOnboarding();
          router.replace('/(user)/(tabs)');
        }}
      />
      <Pressable
        onPress={() => {
          useAppStore.getState().setRole(role === 'merchant' ? 'user' : 'merchant');
        }}
        style={{ alignItems: 'center', padding: spacing.md, marginBottom: insets.bottom }}
      >
        <Text variant="caption" color={colors.textSecondary}>
          {role === 'merchant' ? 'Looking for a PG? Switch to seeker' : 'Own a PG? Switch to owner login'}
        </Text>
      </Pressable>
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
