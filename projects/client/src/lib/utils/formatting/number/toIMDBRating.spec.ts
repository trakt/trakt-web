import { describe, expect, it } from 'vitest';
import { toIMDBRating } from './toIMDBRating.ts';

describe('toIMDBRating', () => {
  it('rounds up to a single decimal place', () => {
    // Replicates the specific IMDb bug
    expect(toIMDBRating(9.0888, 'en-US')).toBe('9.1');
    expect(toIMDBRating(8.16, 'en-US')).toBe('8.2');
  });

  it('rounds down to a single decimal place', () => {
    expect(toIMDBRating(8.14, 'en-US')).toBe('8.1');
  });

  it('pads exact integers with a trailing zero', () => {
    expect(toIMDBRating(9, 'en-US')).toBe('9.0');
    expect(toIMDBRating(8.0, 'en-US')).toBe('8.0');
  });

  it('respects locale-specific decimal separators', () => {
    // Many European locales use a comma instead of a period for decimals
    expect(toIMDBRating(9.0888, 'de-DE')).toBe('9,1');
    expect(toIMDBRating(9, 'de-DE')).toBe('9,0');
    expect(toIMDBRating(8.14, 'fr-FR')).toBe('8,1');
  });
});
