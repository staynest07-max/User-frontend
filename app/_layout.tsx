import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Text as NativeText } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import {
  Sora_500Medium,
  Sora_600SemiBold,
  Sora_700Bold,
} from '@expo-google-fonts/sora';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from '@expo-google-fonts/inter';
import {
  Manrope_400Regular,
  Manrope_600SemiBold,
  Manrope_700Bold,
} from '@expo-google-fonts/manrope';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { colors } from '@/design-system';
import { useAppStore } from '@/stores/appStore';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/query/client';
import { useAuthSessionStore } from '@/stores/authSessionStore';
import { useInitializeAuth } from '@/features/auth/hooks/useAuth';

SplashScreen.preventAutoHideAsync().catch(() => undefined);

function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const segments = useSegments();
  const hydrated = useAppStore((s) => s.hydrated);
  const authStatus = useAuthSessionStore((s) => s.status);

  useEffect(() => {
    if (!hydrated || authStatus === 'initializing') return;

    const root = segments[0];

    if (authStatus === 'unauthenticated') {
      const isWelcome = root === '(onboarding)' && segments[1] === 'welcome';
      if (!isWelcome && root !== '(auth)') router.replace('/(onboarding)/welcome');
      return;
    }

    // This client supports USER and guest navigation only. Authentication will
    // derive the authoritative role from the backend principal.
    if (root === '(merchant)' || root === '(admin)' || root === '(auth)' || root === '(onboarding)' || !root) {
      router.replace('/(user)/(tabs)');
    }
  }, [authStatus, hydrated, segments, router]);

  return <>{children}</>;
}

export default function RootLayout() {
  useInitializeAuth();
  const hydrated = useAppStore((s) => s.hydrated);
  const authStatus = useAuthSessionStore((s) => s.status);
  const [fontsLoaded, fontError] = useFonts({
    Sora_500Medium,
    Sora_600SemiBold,
    Sora_700Bold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Manrope_400Regular,
    Manrope_600SemiBold,
    Manrope_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(() => undefined);
    }
  }, [fontError, fontsLoaded]);

  if ((!fontsLoaded && !fontError) || !hydrated || authStatus === 'initializing') {
    return (
      <View style={styles.boot}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="dark" />
        {fontError ? (
          <View style={styles.fontWarning} accessibilityRole="alert">
            <NativeText style={styles.fontWarningText}>
              Custom fonts could not be loaded. Using system fonts.
            </NativeText>
          </View>
        ) : null}
        <AuthGate>
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(onboarding)" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(user)" />
            <Stack.Screen name="(merchant)" />
            <Stack.Screen name="(admin)" />
          </Stack>
        </AuthGate>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  boot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  fontWarning: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    padding: 8,
    backgroundColor: colors.warningLight,
  },
  fontWarningText: {
    color: colors.textPrimary,
    textAlign: 'center',
    fontSize: 12,
  },
});
