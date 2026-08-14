import { describe, expect, it } from 'vitest';
import { resolveCacheControl } from './resolveCacheControl.ts';

const NO_STORE = 'private, no-store, no-cache, must-revalidate';

const resolve = (
  overrides: Partial<Parameters<typeof resolveCacheControl>[0]>,
) =>
  resolveCacheControl({
    pathname: '/movies',
    isRedirect: false,
    hasWebviewParam: false,
    isLegitimateBot: false,
    isSocialBot: false,
    hasSession: false,
    ...overrides,
  });

describe('util: resolveCacheControl', () => {
  describe('for a session dependent path', () => {
    it('should never publicly cache / for a social bot', () => {
      expect(resolve({ pathname: '/', isSocialBot: true })).toBe(NO_STORE);
    });

    it('should never publicly cache / for a verified crawler', () => {
      expect(resolve({ pathname: '/', isLegitimateBot: true })).toBe(NO_STORE);
    });
  });

  describe('for a public path', () => {
    it('should keep the short public cache for social bots', () => {
      expect(resolve({ isSocialBot: true }))
        .toBe('public, max-age=120, s-maxage=120');
    });

    it('should keep the long public cache for verified crawlers', () => {
      expect(resolve({ isLegitimateBot: true }))
        .toBe('public, max-age=3600, s-maxage=3600');
    });

    it('should not publicly cache a social bot request with a session', () => {
      expect(resolve({ isSocialBot: true, hasSession: true })).toBe(NO_STORE);
    });
  });

  it('should never store a redirect', () => {
    expect(resolve({ isRedirect: true, isLegitimateBot: true })).toBe(NO_STORE);
  });

  it('should never store a webview response', () => {
    expect(resolve({ hasWebviewParam: true, isLegitimateBot: true }))
      .toBe(NO_STORE);
  });

  it('should not store a regular browser response', () => {
    expect(resolve({})).toBe(NO_STORE);
  });
});
