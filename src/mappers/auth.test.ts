import { describe, expect, it } from 'vitest';
import { toUserPrincipal } from './auth';

describe('toUserPrincipal', () => {
  it('accepts a backend USER principal', () => {
    const principal = { accountId: 'account', userId: 'user', sessionId: 'session', role: 'USER' as const };
    expect(toUserPrincipal(principal)).toBe(principal);
  });

  it('rejects non-user and incomplete principals', () => {
    expect(() => toUserPrincipal({ accountId: 'a', sessionId: 's', role: 'MERCHANT' })).toThrow();
    expect(() => toUserPrincipal({ accountId: 'a', sessionId: 's', role: 'USER' })).toThrow();
  });
});
