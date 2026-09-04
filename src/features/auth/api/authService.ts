import { apiClient, clearAccessToken, setAccessToken } from '@/api/client';
import type {
  AuthMeResult,
  AuthPrincipal,
  AuthTokens,
  RefreshSessionInput,
  RequestOtpInput,
  RequestOtpResult,
  VerifyOtpInput,
} from '@/contracts/auth';
import { toUserPrincipal } from '@/mappers/auth';
import { clearRefreshToken, getRefreshToken, saveRefreshToken } from '@/storage/secureTokens';

function requireUserTokens(tokens: AuthTokens): AuthTokens {
  if (tokens.account.role !== 'USER') throw new Error('User Mobile only supports USER accounts');
  return tokens;
}

async function persistTokens(tokens: AuthTokens): Promise<AuthTokens> {
  const userTokens = requireUserTokens(tokens);
  await saveRefreshToken(userTokens.refreshToken);
  setAccessToken(userTokens.accessToken);
  return userTokens;
}

async function clearLocalCredentials(): Promise<void> {
  clearAccessToken();
  await clearRefreshToken();
}

export const authService = {
  async requestOtp(phone: string): Promise<RequestOtpResult> {
    const input: RequestOtpInput = { phone };
    return (await apiClient.post<RequestOtpResult, RequestOtpInput>(
      '/auth/request-otp', input, { authenticated: false }
    )).data;
  },

  async verifyOtp(phone: string, otp: string): Promise<AuthPrincipal> {
    const input: VerifyOtpInput = { phone, otp };
    try {
      const response = await apiClient.post<AuthTokens, VerifyOtpInput>(
        '/auth/verify-otp', input, { authenticated: false }
      );
      await persistTokens(response.data);
      return await this.getCurrentUser(true);
    } catch (error) {
      await clearLocalCredentials();
      throw error;
    }
  },

  async refreshAccessToken(): Promise<AuthTokens> {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) throw new Error('No refresh token is available');
    const input: RefreshSessionInput = { refreshToken };
    const response = await apiClient.post<AuthTokens, RefreshSessionInput>(
      '/auth/refresh', input, { authenticated: false, skipAuthRefresh: true }
    );
    return persistTokens(response.data);
  },

  async refreshSession(): Promise<AuthPrincipal | null> {
    if (!(await getRefreshToken())) return null;
    await this.refreshAccessToken();
    return this.getCurrentUser(true);
  },

  async getCurrentUser(skipAuthRefresh = false): Promise<AuthPrincipal> {
    const response = await apiClient.get<AuthMeResult>('/auth/me', { skipAuthRefresh });
    return toUserPrincipal(response.data.principal);
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post<null>('/auth/logout', undefined, { skipAuthRefresh: true });
    } finally {
      await clearLocalCredentials();
    }
  },

  clearLocalCredentials,
};
