import { describe, expect, it } from 'vitest';
import { toHumanTime } from './toHumanTime.ts';

describe('toHumanTime', () => {
  const date = new Date('2025-01-06T09:00:00Z');

  it('formats time in 24h for nl-nl', () => {
    const result = toHumanTime({ date, locale: 'nl-nl' });

    expect(result).toBe('09:00');
  });

  it('formats time with AM/PM for en', () => {
    const result = toHumanTime({ date, locale: 'en' });

    expect(result).toBe('9:00 AM');
  });

  it('formats time with AM/PM for en-au', () => {
    const result = toHumanTime({ date, locale: 'en-au' });

    expect(result).toBe('9:00 AM');
  });

  it('zero-pads hours for 24h locales', () => {
    const midnight = new Date('2025-01-06T00:00:00Z');
    const result = toHumanTime({ date: midnight, locale: 'de-de' });

    expect(result).toBe('00:00');
  });
});
