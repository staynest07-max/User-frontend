import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const REFRESH_TOKEN_KEY = 'staynest.refresh-token';

function webSessionStorage(): Storage | null {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return null;
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

export async function saveRefreshToken(refreshToken: string): Promise<void> {
  if (!refreshToken) throw new Error('A non-empty refresh token is required');
  try {
    if (Platform.OS === 'web') {
      webSessionStorage()?.setItem(REFRESH_TOKEN_KEY, refreshToken);
      return;
    }
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken, {
      keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });
  } catch {
    // Storage availability must not crash authentication or application boot.
  }
}

export async function getRefreshToken(): Promise<string | null> {
  try {
    if (Platform.OS === 'web') return webSessionStorage()?.getItem(REFRESH_TOKEN_KEY) ?? null;
    return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  } catch {
    return null;
  }
}

export async function clearRefreshToken(): Promise<void> {
  try {
    if (Platform.OS === 'web') {
      webSessionStorage()?.removeItem(REFRESH_TOKEN_KEY);
      return;
    }
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  } catch {
    // Cleanup remains best-effort when platform storage is unavailable.
  }
}
