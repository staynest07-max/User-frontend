import * as SecureStore from 'expo-secure-store';

const REFRESH_TOKEN_KEY = 'staynest.refresh-token';

export async function saveRefreshToken(refreshToken: string): Promise<void> {
  if (!refreshToken) throw new Error('A non-empty refresh token is required');
  await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken, {
    keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
}

export function getRefreshToken(): Promise<string | null> {
  return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
}

export function clearRefreshToken(): Promise<void> {
  return SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
}
