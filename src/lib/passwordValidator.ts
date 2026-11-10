/**
 * Password complexity and verification utilities for Ananta Sparsha SmartNFC
 */

export interface PasswordValidationResult {
  isValid: boolean;
  hasMinLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
  matchesConfirm: boolean;
  score: number; // 0 to 4
  strengthLabel: 'Too Weak' | 'Weak' | 'Medium' | 'Strong';
}

export function validatePassword(password: string, confirmPassword: string = ''): PasswordValidationResult {
  const hasMinLength = (password || '').length >= 12;
  const hasUpperCase = /[A-Z]/.test(password || '');
  const hasLowerCase = /[a-z]/.test(password || '');
  const hasNumber = /[0-9]/.test(password || '');
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password || '');
  const matchesConfirm = Boolean(confirmPassword && password === confirmPassword);

  const criteria = [hasMinLength, hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar];
  const metCount = criteria.filter(Boolean).length;

  let score = 0;
  if (metCount >= 2) score = 1;
  if (metCount >= 3 && (password || '').length >= 8) score = 2;
  if (metCount >= 4 && (password || '').length >= 10) score = 3;
  if (metCount === 5) score = 4;

  const strengthLabels: Record<number, 'Too Weak' | 'Weak' | 'Medium' | 'Strong'> = {
    0: 'Too Weak',
    1: 'Weak',
    2: 'Medium',
    3: 'Medium',
    4: 'Strong',
  };

  const isValid = metCount === 5 && (confirmPassword ? matchesConfirm : true);

  return {
    isValid,
    hasMinLength,
    hasUpperCase,
    hasLowerCase,
    hasNumber,
    hasSpecialChar,
    matchesConfirm,
    score,
    strengthLabel: strengthLabels[score],
  };
}

export function normalizePhoneNumber(phone: string): string {
  const cleaned = (phone || '').replace(/[^\d+]/g, '');
  if (!cleaned.startsWith('+')) {
    if (cleaned.length === 10) {
      return `+91${cleaned}`;
    }
    return `+${cleaned}`;
  }
  return cleaned;
}

export function maskPhoneNumber(phone: string): string {
  const norm = normalizePhoneNumber(phone);
  if (norm.length >= 8) {
    const countryAndStart = norm.slice(0, norm.length - 5);
    return `${countryAndStart}•••••`;
  }
  return norm.slice(0, 3) + '••••••';
}

