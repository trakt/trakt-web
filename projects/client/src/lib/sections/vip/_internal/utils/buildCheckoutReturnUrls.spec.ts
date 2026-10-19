import { describe, expect, it } from 'vitest';
import { buildCheckoutReturnUrls } from './buildCheckoutReturnUrls.ts';
import { parseVipParams } from './parseVipParams.ts';

const ORIGIN = 'https://app.trakt.tv';

describe('util: buildCheckoutReturnUrls', () => {
  const { successUrl, cancelUrl } = buildCheckoutReturnUrls({
    origin: ORIGIN,
    plan: 'two_years',
    source: 'soundtrack-drawer',
    flow: 'renew',
  });

  it('should send both urls back to the vip page', () => {
    expect(new URL(successUrl).pathname).toBe('/vip');
    expect(new URL(cancelUrl).pathname).toBe('/vip');
  });

  it('should keep source, plan and flow on the success url', () => {
    expect(parseVipParams(new URL(successUrl))).toEqual({
      source: 'soundtrack-drawer',
      plan: 'two_years',
      flow: 'renew',
      checkout: null,
    });
  });

  it('should mark the cancel url as canceled and keep the rest', () => {
    expect(parseVipParams(new URL(cancelUrl))).toEqual({
      source: 'soundtrack-drawer',
      plan: 'two_years',
      flow: 'renew',
      checkout: 'canceled',
    });
  });

  it('should add a cache buster to both urls', () => {
    expect(new URL(successUrl).searchParams.has('_cb')).toBe(true);
    expect(new URL(cancelUrl).searchParams.has('_cb')).toBe(true);
  });

  it('should leave the success url without a canceled marker', () => {
    expect(new URL(successUrl).searchParams.has('checkout')).toBe(false);
  });

  it('should omit the source param for a direct visit', () => {
    const urls = buildCheckoutReturnUrls({
      origin: ORIGIN,
      plan: 'monthly',
      source: 'direct',
      flow: 'new',
    });

    expect(new URL(urls.successUrl).searchParams.has('source')).toBe(false);
    expect(parseVipParams(new URL(urls.successUrl)).source).toBe('direct');
  });
});
