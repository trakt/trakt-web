import { describe, expect, it } from 'vitest';
import { prependHttps } from '$lib/utils/prependHttps.ts';

describe('prependHttps', () => {
  it('will add https protocol to a given host url', () => {
    const input = 'example.com';

    expect(prependHttps(input)).toBe('https://example.com');
  });

  it('will NOT add https protocol to a given host url if it already has it', () => {
    const input = 'https://example.com';

    expect(prependHttps(input)).toBe('https://example.com');
  });

  it('will backfall to provided placeholder if no host is given', () => {
    const input = '';
    const fallback = 'https://fallback.com';

    expect(prependHttps(input, fallback)).toBe(fallback);
  });
});
