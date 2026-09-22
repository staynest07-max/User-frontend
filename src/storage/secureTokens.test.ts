import { beforeEach, describe, expect, it, vi } from 'vitest';

const secureStore = vi.hoisted(() => ({
  setItemAsync: vi.fn(),
  getItemAsync: vi.fn(),
  deleteItemAsync: vi.fn(),
  WHEN_UNLOCKED_THIS_DEVICE_ONLY: 1,
}));
const platform = vi.hoisted(() => ({ OS: 'ios' }));

vi.mock('expo-secure-store', () => secureStore);
vi.mock('react-native', () => ({ Platform: platform }));

import { clearRefreshToken, getRefreshToken, saveRefreshToken } from './secureTokens';

describe('secure refresh-token storage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    platform.OS = 'ios';
  });

  it('stores, reads, and clears through SecureStore only', async () => {
    secureStore.getItemAsync.mockResolvedValue('refresh-token');
    await saveRefreshToken('refresh-token');
    await expect(getRefreshToken()).resolves.toBe('refresh-token');
    await clearRefreshToken();
    expect(secureStore.setItemAsync).toHaveBeenCalledWith(
      'staynest.refresh-token',
      'refresh-token',
      { keychainAccessible: secureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY }
    );
    expect(secureStore.deleteItemAsync).toHaveBeenCalledWith('staynest.refresh-token');
  });

  it('rejects an empty token', async () => {
    await expect(saveRefreshToken('')).rejects.toThrow('non-empty refresh token');
  });

  it('uses sessionStorage on web without calling SecureStore', async () => {
    platform.OS = 'web';
    const values = new Map<string, string>();
    const sessionStorage = {
      setItem: vi.fn((key: string, value: string) => values.set(key, value)),
      getItem: vi.fn((key: string) => values.get(key) ?? null),
      removeItem: vi.fn((key: string) => values.delete(key)),
    };
    vi.stubGlobal('window', { sessionStorage });

    await saveRefreshToken('web-refresh-token');
    await expect(getRefreshToken()).resolves.toBe('web-refresh-token');
    await clearRefreshToken();
    await expect(getRefreshToken()).resolves.toBeNull();
    expect(secureStore.setItemAsync).not.toHaveBeenCalled();
    expect(secureStore.getItemAsync).not.toHaveBeenCalled();
    expect(secureStore.deleteItemAsync).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });

  it('does not crash when browser storage is unavailable', async () => {
    platform.OS = 'web';
    vi.stubGlobal('window', {
      get sessionStorage() { throw new Error('blocked'); },
    });
    await expect(saveRefreshToken('web-refresh-token')).resolves.toBeUndefined();
    await expect(getRefreshToken()).resolves.toBeNull();
    await expect(clearRefreshToken()).resolves.toBeUndefined();
    expect(secureStore.deleteItemAsync).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });
});
