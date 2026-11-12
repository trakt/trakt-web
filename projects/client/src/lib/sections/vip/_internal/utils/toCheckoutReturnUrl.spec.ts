import { describe, expect, it } from 'vitest';
import { toCheckoutReturnUrl } from './toCheckoutReturnUrl.ts';

describe('util: toCheckoutReturnUrl', () => {
  it.each([
    'https://trakt.tv/thanks',
    'https://app.trakt.tv/vip?plan=two_years',
    'https://www.trakt.tv/',
  ])('should accept %s', (value) => {
    expect(toCheckoutReturnUrl(value)).toBe(new URL(value).href);
  });

  it.each([
    'http://trakt.tv/thanks',
    '/vip',
    'javascript:alert(1)',
    'https://evil.com/trakt.tv',
    'https://trakt.tv.evil.com/',
    'https://nottrakt.tv/',
    'https://user@evil.com@trakt.tv.evil.com/',
    'not a url',
    '',
  ])('should reject %s', (value) => {
    expect(toCheckoutReturnUrl(value)).toBeUndefined();
  });

  it('should reject a missing value', () => {
    expect(toCheckoutReturnUrl(null)).toBeUndefined();
    expect(toCheckoutReturnUrl(undefined)).toBeUndefined();
  });
});
