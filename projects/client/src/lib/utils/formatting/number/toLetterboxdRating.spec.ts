import { describe, expect, it } from 'vitest';
import { toLetterboxdRating } from './toLetterboxdRating.ts';

describe('util: toLetterboxdRating', () => {
  it('should append the 0-5 scale to the score', () => {
    expect(toLetterboxdRating(4.1, 'en-US')).toBe('4.1/5');
  });

  it('should round to a single decimal place', () => {
    expect(toLetterboxdRating(3.86, 'en-US')).toBe('3.9/5');
    expect(toLetterboxdRating(3.84, 'en-US')).toBe('3.8/5');
  });

  it('should pad exact integers with a trailing zero', () => {
    expect(toLetterboxdRating(5, 'en-US')).toBe('5.0/5');
  });

  it('should respect locale-specific decimal separators', () => {
    expect(toLetterboxdRating(4.1, 'de-DE')).toBe('4,1/5');
  });

  it('should format both numbers in the locale numbering system', () => {
    expect(toLetterboxdRating(4.1, 'fa-IR')).toBe('۴٫۱/۵');
  });
});
