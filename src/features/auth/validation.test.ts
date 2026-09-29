import { describe, expect, it } from 'vitest';
import { isValidIndianPhone, isValidOptionalEmail, isValidOtp, isValidSignupName } from './validation';

describe('user authentication validation', () => {
  it('requires exactly six OTP digits', () => {
    expect(isValidOtp('654321')).toBe(true);
    expect(isValidOtp('123456')).toBe(true);
    expect(isValidOtp('1999')).toBe(false);
    expect(isValidOtp('1234567')).toBe(false);
  });

  it('validates signup fields without accepting a role', () => {
    expect(isValidIndianPhone('9876543210')).toBe(true);
    expect(isValidSignupName('New User')).toBe(true);
    expect(isValidSignupName(' ')).toBe(false);
    expect(isValidOptionalEmail('')).toBe(true);
    expect(isValidOptionalEmail('new@example.com')).toBe(true);
    expect(isValidOptionalEmail('invalid')).toBe(false);
  });
});
