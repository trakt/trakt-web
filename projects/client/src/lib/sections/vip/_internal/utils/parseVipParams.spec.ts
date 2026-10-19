import { describe, expect, it } from 'vitest';
import { parseVipParams } from './parseVipParams.ts';

const parse = (path: string) =>
  parseVipParams(new URL(path, 'https://app.trakt.tv'));

describe('util: parseVipParams', () => {
  it('should read source, plan and flow from a checkout return', () => {
    expect(parse('/vip?source=navbar&plan=yearly&flow=new')).toEqual({
      source: 'navbar',
      plan: 'yearly',
      flow: 'new',
      checkout: null,
    });
  });

  it('should treat a plain visit as a direct new flow', () => {
    expect(parse('/vip')).toEqual({
      source: 'direct',
      plan: null,
      flow: 'new',
      checkout: null,
    });
  });

  it('should fall back to direct for an unknown source', () => {
    expect(parse('/vip?source=<script>alert(1)</script>').source).toBe(
      'direct',
    );
  });

  it('should keep a promotion source', () => {
    expect(parse('/vip?source=promotion-black-friday').source).toBe(
      'promotion-black-friday',
    );
  });

  it('should use the renew flow on the renew page', () => {
    expect(parse('/vip/renew').flow).toBe('renew');
  });

  it('should use the switch flow for the PayPal switch on the cancel page', () => {
    expect(parse('/vip/cancel').flow).toBe('switch');
  });

  it('should use the switch flow for the PayPal switch on the renew page', () => {
    expect(parse('/vip/renew?flow=switch').flow).toBe('switch');
  });

  it('should keep the renew flow when returning from checkout', () => {
    expect(parse('/vip?flow=renew&plan=monthly').flow).toBe('renew');
  });

  it('should ignore an unknown flow or plan', () => {
    const params = parse('/vip?flow=other&plan=weekly');

    expect(params.flow).toBe('new');
    expect(params.plan).toBeNull();
  });

  it('should detect a canceled checkout', () => {
    expect(parse('/vip?checkout=canceled').checkout).toBe('canceled');
  });

  it('should ignore any other checkout value', () => {
    expect(parse('/vip?checkout=done').checkout).toBeNull();
  });
});
