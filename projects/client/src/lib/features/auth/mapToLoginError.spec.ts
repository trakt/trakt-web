import { describe, expect, it } from 'vitest';
import { mapToLoginError } from './mapToLoginError.ts';
import { LoginErrorType } from './models/LoginErrorType.ts';

describe('mapToLoginError', () => {
  it('should report a rate limit when the status is readable', () => {
    expect(mapToLoginError(new Error('Rate limited (429)')))
      .toBe(LoginErrorType.RateLimited);
  });

  it('should not read a status out of an unrelated number', () => {
    expect(mapToLoginError(new Error('failed after 4291ms')))
      .toBe(LoginErrorType.Unreachable);
  });

  it('should fall back when CORS hides the status', () => {
    expect(mapToLoginError(new TypeError('Failed to fetch')))
      .toBe(LoginErrorType.Unreachable);
  });

  it('should fall back for a thrown non-error', () => {
    expect(mapToLoginError('429')).toBe(LoginErrorType.Unreachable);
  });
});
