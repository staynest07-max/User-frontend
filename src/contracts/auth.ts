export const PLATFORM_ROLES = ['USER', 'MERCHANT', 'ADMIN', 'SUPER_ADMIN'] as const;
export type PlatformRole = (typeof PLATFORM_ROLES)[number];

export interface AuthAccount {
  id: string;
  role: PlatformRole;
}

export interface AuthTokens {
  account: AuthAccount;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  refreshExpiresAt: string;
}

export interface AuthPrincipal {
  accountId: string;
  role: PlatformRole;
  sessionId: string;
  userId?: string;
  merchantId?: string;
}

export interface RequestOtpInput { phone: string }
export interface RequestOtpResult { expiresInSeconds: number }
export interface VerifyOtpInput { phone: string; otp: string }
export interface RefreshSessionInput { refreshToken: string }
export interface AuthMeResult { principal: AuthPrincipal }
