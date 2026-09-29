import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '@/api/errors';

const mocks = vi.hoisted(() => ({
  post: vi.fn(),
  get: vi.fn(),
  setAccessToken: vi.fn(),
  clearAccessToken: vi.fn(),
  saveRefreshToken: vi.fn(),
  getRefreshToken: vi.fn(),
  clearRefreshToken: vi.fn(),
}));

vi.mock('@/api/client', () => ({
  apiClient: { post: mocks.post, get: mocks.get },
  setAccessToken: mocks.setAccessToken,
  clearAccessToken: mocks.clearAccessToken,
}));

vi.mock('@/storage/secureTokens', () => ({
  saveRefreshToken: mocks.saveRefreshToken,
  getRefreshToken: mocks.getRefreshToken,
  clearRefreshToken: mocks.clearRefreshToken,
}));

import { authService } from './authService';

const userTokens = {
  account: { id: 'account-id', role: 'USER' as const },
  accessToken: 'access-token',
  refreshToken: 'refresh-token',
  expiresIn: 900,
  refreshExpiresAt: '2026-10-01T00:00:00.000Z',
};

const principal = {
  accountId: 'account-id', role: 'USER' as const, sessionId: 'session-id', userId: 'user-id',
};

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.saveRefreshToken.mockResolvedValue(undefined);
    mocks.clearRefreshToken.mockResolvedValue(undefined);
  });

  it('requests an OTP successfully', async () => {
    mocks.post.mockResolvedValue({ success: true, data: { expiresInSeconds: 300 } });
    await expect(authService.requestOtp('9000000001')).resolves.toEqual({ expiresInSeconds: 300 });
    expect(mocks.post).toHaveBeenCalledWith(
      '/auth/request-otp', { phone: '9000000001' }, { authenticated: false }
    );
  });

  it('surfaces request OTP failures', async () => {
    const error = new ApiError('Unable to send', 'NETWORK_ERROR', 0);
    mocks.post.mockRejectedValue(error);
    await expect(authService.requestOtp('9000000001')).rejects.toBe(error);
  });

  it('verifies OTP, stores the refresh token, and validates /auth/me', async () => {
    mocks.post.mockResolvedValueOnce({ success: true, data: userTokens });
    mocks.get.mockResolvedValueOnce({ success: true, data: { principal } });
    await expect(authService.verifyOtp('9000000001', '123456')).resolves.toEqual({ kind: 'authenticated', principal });
    expect(mocks.saveRefreshToken).toHaveBeenCalledWith('refresh-token');
    expect(mocks.setAccessToken).toHaveBeenCalledWith('access-token');
    expect(mocks.get).toHaveBeenCalledWith('/auth/me', { skipAuthRefresh: true });
  });

  it('accepts the USER principal contract when /auth/me omits optional userId', async () => {
    const userPrincipal = {
      accountId: 'account-id', role: 'USER' as const, sessionId: 'session-id',
    };
    mocks.post.mockResolvedValueOnce({ success: true, data: userTokens });
    mocks.get.mockResolvedValueOnce({ success: true, data: { principal: userPrincipal } });

    await expect(authService.verifyOtp('9000000001', '123456')).resolves.toEqual({
      kind: 'authenticated',
      principal: userPrincipal,
    });
    expect(mocks.saveRefreshToken).toHaveBeenCalledWith('refresh-token');
    expect(mocks.setAccessToken).toHaveBeenCalledWith('access-token');
  });

  it('returns signup-required without creating a local session', async () => {
    mocks.post.mockResolvedValueOnce({ success: true, data: { signupRequired: true } });
    await expect(authService.verifyOtp('9999999999', '654321')).resolves.toEqual({ kind: 'signup_required' });
    expect(mocks.saveRefreshToken).not.toHaveBeenCalled();
    expect(mocks.setAccessToken).not.toHaveBeenCalled();
    expect(mocks.get).not.toHaveBeenCalled();
  });

  it('creates a USER account, stores the normal session, and validates /auth/me', async () => {
    mocks.post.mockResolvedValueOnce({ success: true, data: userTokens });
    mocks.get.mockResolvedValueOnce({ success: true, data: { principal } });
    const input = { phone: '9999999999', otp: '654321', fullName: 'New User', email: 'new@example.com' };
    await expect(authService.signupUser(input)).resolves.toEqual(principal);
    expect(mocks.post).toHaveBeenCalledWith('/auth/user-signup', input, { authenticated: false });
    expect(mocks.saveRefreshToken).toHaveBeenCalledWith('refresh-token');
    expect(mocks.setAccessToken).toHaveBeenCalledWith('access-token');
  });

  it('surfaces signup errors and clears partial credentials', async () => {
    const error = new ApiError('An account already exists for this phone', 'ACCOUNT_EXISTS', 409);
    mocks.post.mockRejectedValue(error);
    await expect(authService.signupUser({ phone: '9000000001', otp: '654321', fullName: 'Existing User' })).rejects.toBe(error);
    expect(mocks.clearAccessToken).toHaveBeenCalled();
    expect(mocks.clearRefreshToken).toHaveBeenCalled();
  });

  it('surfaces invalid OTP and clears any partial credentials', async () => {
    const error = new ApiError('Invalid or expired OTP', 'INVALID_OTP', 401);
    mocks.post.mockRejectedValue(error);
    await expect(authService.verifyOtp('9000000001', '000000')).rejects.toBe(error);
    expect(mocks.clearAccessToken).toHaveBeenCalled();
    expect(mocks.clearRefreshToken).toHaveBeenCalled();
  });

  it('refreshes a stored session and validates the USER principal', async () => {
    mocks.getRefreshToken.mockResolvedValue('stored-refresh-token');
    mocks.post.mockResolvedValueOnce({ success: true, data: userTokens });
    mocks.get.mockResolvedValueOnce({ success: true, data: { principal } });
    await expect(authService.refreshSession()).resolves.toEqual(principal);
    expect(mocks.saveRefreshToken).toHaveBeenCalledWith('refresh-token');
  });

  it('surfaces refresh failure without replacing the stored token', async () => {
    mocks.getRefreshToken.mockResolvedValue('stored-refresh-token');
    const error = new ApiError('Session expired', 'SESSION_EXPIRED', 401);
    mocks.post.mockRejectedValue(error);
    await expect(authService.refreshSession()).rejects.toBe(error);
    expect(mocks.saveRefreshToken).not.toHaveBeenCalled();
  });

  it('returns unauthenticated when no refresh token exists', async () => {
    mocks.getRefreshToken.mockResolvedValue(null);
    await expect(authService.refreshSession()).resolves.toBeNull();
    expect(mocks.post).not.toHaveBeenCalled();
  });

  it('logs out through the backend and always clears local credentials', async () => {
    mocks.post.mockResolvedValue({ success: true, data: null });
    await authService.logout();
    expect(mocks.post).toHaveBeenCalledWith('/auth/logout', undefined, { skipAuthRefresh: true });
    expect(mocks.clearAccessToken).toHaveBeenCalled();
    expect(mocks.clearRefreshToken).toHaveBeenCalled();
  });

  it('clears local credentials even when backend logout fails', async () => {
    mocks.post.mockRejectedValue(new ApiError('Invalid session', 'INVALID_SESSION', 401));
    await expect(authService.logout()).rejects.toThrow('Invalid session');
    expect(mocks.clearAccessToken).toHaveBeenCalled();
    expect(mocks.clearRefreshToken).toHaveBeenCalled();
  });

  it('rejects a non-USER token response without persisting it', async () => {
    mocks.post.mockResolvedValue({
      success: true,
      data: { ...userTokens, account: { id: 'merchant-id', role: 'MERCHANT' } },
    });
    await expect(authService.verifyOtp('9000000002', '123456')).rejects.toThrow(
      'User Mobile only supports USER accounts'
    );
    expect(mocks.saveRefreshToken).not.toHaveBeenCalled();
    expect(mocks.clearRefreshToken).toHaveBeenCalled();
  });
});
