export function normalizeIndianPhone(value: string): string {
  const digits = value.replace(/\D/g, '');
  return digits.length === 12 && digits.startsWith('91') ? digits.slice(2) : digits;
}

export function isValidIndianPhone(value: string): boolean {
  return /^[6-9]\d{9}$/.test(normalizeIndianPhone(value));
}

export function isValidOtp(value: string): boolean {
  return /^\d{6}$/.test(value);
}

export function isValidSignupName(value: string): boolean {
  const length = value.trim().length;
  return length >= 2 && length <= 200;
}

export function isValidOptionalEmail(value: string): boolean {
  const email = value.trim();
  return !email || (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 320);
}
