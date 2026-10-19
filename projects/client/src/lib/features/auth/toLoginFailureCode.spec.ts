import { describe, expect, it } from 'vitest';
import { toLoginFailureCode } from './toLoginFailureCode.ts';

describe('toLoginFailureCode', () => {
  it('should use the code the provider reported', () => {
    expect(toLoginFailureCode({ error: 'access_denied' })).toBe(
      'access_denied',
    );
  });

  it('should bucket an unrecognised provider code as unknown', () => {
    expect(toLoginFailureCode({ error: 'Access Denied!' })).toBe('unknown');
  });

  it('should never forward free-form provider text', () => {
    expect(toLoginFailureCode({ error: 'jane@example.com' })).toBe('unknown');
  });

  it('should report a rate limit as http_429', () => {
    expect(toLoginFailureCode(new Error('Rate limited (429)'))).toBe(
      'http_429',
    );
  });

  it('should never leak an error message', () => {
    expect(toLoginFailureCode(new Error('jane@example.com is locked'))).toBe(
      'unknown',
    );
  });

  it('should fall back for an empty provider code', () => {
    expect(toLoginFailureCode({ error: '' })).toBe('unknown');
  });

  it('should fall back for a thrown non-error', () => {
    expect(toLoginFailureCode(undefined)).toBe('unknown');
  });
});
