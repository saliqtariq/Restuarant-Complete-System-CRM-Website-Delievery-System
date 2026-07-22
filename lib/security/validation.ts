export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function normalizeText(value: string, maxLength: number): string {
  return value.trim().replace(/\s+/g, " ").slice(0, maxLength);
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function isValidOtp(value: string): boolean {
  return /^\d{6}$/.test(value);
}

export function isValidPhone(value: string): boolean {
  return /^[+()0-9 -]{7,20}$/.test(value);
}
