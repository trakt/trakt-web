import { describe, expect, it } from 'vitest';
import { toCanonicalOrigin } from './toCanonicalOrigin.ts';

describe('util: toCanonicalOrigin', () => {
  it('should leave already canonical origins untouched', () => {
    expect(toCanonicalOrigin('https://example.com')).toBe(
      'https://example.com',
    );
    expect(toCanonicalOrigin('https://example.com:8080')).toBe(
      'https://example.com:8080',
    );
  });

  it('should lower-case the scheme and host', () => {
    expect(toCanonicalOrigin('HTTPS://Example.com')).toBe(
      'https://example.com',
    );
  });

  it('should drop a default port and a trailing slash', () => {
    expect(toCanonicalOrigin('https://example.com:443')).toBe(
      'https://example.com',
    );
    expect(toCanonicalOrigin('http://example.com:80')).toBe(
      'http://example.com',
    );
    expect(toCanonicalOrigin('https://example.com/')).toBe(
      'https://example.com',
    );
  });

  it('should pass unparseable values through untouched', () => {
    expect(toCanonicalOrigin('example.com')).toBe('example.com');
  });
});
