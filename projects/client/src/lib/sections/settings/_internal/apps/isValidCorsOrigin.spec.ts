import { describe, expect, it } from 'vitest';
import { isValidCorsOrigin } from './isValidCorsOrigin.ts';

describe('util: isValidCorsOrigin', () => {
  it('should accept bare http(s) origins', () => {
    expect(isValidCorsOrigin('https://example.com')).toBe(true);
    expect(isValidCorsOrigin('http://localhost:5173')).toBe(true);
    expect(isValidCorsOrigin('https://example.com/')).toBe(true);
    expect(isValidCorsOrigin('https://example.com:8080')).toBe(true);
  });

  it('should accept origins that canonicalizing will normalize', () => {
    expect(isValidCorsOrigin('HTTPS://Example.com')).toBe(true);
    expect(isValidCorsOrigin('https://example.com:443')).toBe(true);
    expect(isValidCorsOrigin('http://example.com:80')).toBe(true);
  });

  it('should reject origins with a path, query, or hash', () => {
    expect(isValidCorsOrigin('https://example.com/callback')).toBe(false);
    expect(isValidCorsOrigin('https://example.com?query=1')).toBe(false);
    expect(isValidCorsOrigin('https://example.com#hash')).toBe(false);
    expect(isValidCorsOrigin('https://example.com//')).toBe(false);
  });

  it('should reject origins carrying credentials', () => {
    expect(isValidCorsOrigin('https://user:pass@example.com')).toBe(false);
    expect(isValidCorsOrigin('https://user@example.com')).toBe(false);
  });

  it('should reject wildcards, non-http schemes, and malformed values', () => {
    expect(isValidCorsOrigin('https://*.example.com')).toBe(false);
    expect(isValidCorsOrigin('ftp://example.com')).toBe(false);
    expect(isValidCorsOrigin('example.com')).toBe(false);
  });
});
