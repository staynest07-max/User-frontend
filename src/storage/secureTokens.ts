import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const REFRESH_TOKEN_KEY = 'staynest.refresh-token';

export async function saveRefreshToken(refreshToken: string): Promise<void> {
  if (!refreshToken) {
    throw new Error('A non-empty refresh token is required');
  }

  if (Platform.OS === 'web') {
    await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    return;
  }

  await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken, {
    keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
}

export async function getRefreshToken(): Promise<string | null> {
  if (Platform.OS === 'web') {
    return AsyncStorage.getItem(REFRESH_TOKEN_KEY);
  }

  return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
}

export async function clearRefreshToken(): Promise<void> {
  if (Platform.OS === 'web') {
    await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
    return;
  }

  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
}
