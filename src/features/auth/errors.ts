import { ApiError } from '@/api/errors';

export function authErrorMessage(error: unknown): string {
  if (!(error instanceof ApiError)) return 'Something went wrong. Please try again.';

  switch (error.code) {
    case 'INVALID_OTP':
      return 'That code is invalid or has expired. Please try again.';
    case 'VALIDATION_ERROR':
      return error.message;
    case 'AUTH_REQUIRED':
    case 'UNAUTHORIZED':
    case 'INVALID_TOKEN':
    case 'INVALID_SESSION':
    case 'SESSION_EXPIRED':
    case 'SESSION_REVOKED':
      return 'Your session has expired. Please sign in again.';
    case 'ACCOUNT_DISABLED':
    case 'ROLE_FORBIDDEN':
      return 'This account cannot sign in to the StayNest User app.';
    case 'NETWORK_ERROR':
      return 'Unable to reach StayNest. Check your connection and try again.';
    case 'REQUEST_ABORTED':
      return 'The request took too long. Please try again.';
    default:
      return error.status >= 500
        ? 'StayNest is temporarily unavailable. Please try again shortly.'
        : error.message;
  }
}

export function isInvalidSessionError(error: unknown): boolean {
  return error instanceof ApiError && (
    error.status === 401
    || ['INVALID_TOKEN', 'INVALID_SESSION', 'SESSION_EXPIRED', 'SESSION_REVOKED'].includes(error.code)
  );
}
