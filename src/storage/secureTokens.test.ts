import { beforeEach, describe, expect, it, vi } from 'vitest';

const secureStore = vi.hoisted(() => ({
  setItemAsync: vi.fn(),
  getItemAsync: vi.fn(),
  deleteItemAsync: vi.fn(),
  WHEN_UNLOCKED_THIS_DEVICE_ONLY: 1,
}));

vi.mock('expo-secure-store', () => secureStore);

import { clearRefreshToken, getRefreshToken, saveRefreshToken } from './secureTokens';

describe('secure refresh-token storage', () => {
  beforeEach(() => vi.clearAllMocks());

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
});
