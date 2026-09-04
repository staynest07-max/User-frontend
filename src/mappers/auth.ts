import type { AuthPrincipal } from '@/contracts/auth';

export function toUserPrincipal(principal: AuthPrincipal): AuthPrincipal {
  if (principal.role !== 'USER' || !principal.userId) {
    throw new Error('User Mobile requires a backend USER principal');
  }
  return principal;
}
