import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '@/api/errors';

const mocks = vi.hoisted(() => ({
  refreshSession: vi.fn(),
  clearLocalCredentials: vi.fn(),
}));

vi.mock('./api/authService', () => ({ authService: mocks }));

import { initializeAuthSession } from './session';
import { useAuthSessionStore } from '@/stores/authSessionStore';

describe('session initialization', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.clearLocalCredentials.mockResolvedValue(undefined);
  });

  it('clears secure credentials when refresh reports an invalid session', async () => {
    mocks.refreshSession.mockRejectedValue(new ApiError('Invalid session', 'INVALID_SESSION', 401));
    await initializeAuthSession();
    expect(mocks.clearLocalCredentials).toHaveBeenCalledOnce();
    expect(useAuthSessionStore.getState()).toMatchObject({
      status: 'unauthenticated',
      principal: null,
    });
  });
});
