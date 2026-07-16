import { describe, expect, it } from 'vitest';
import { toLocaleNumber } from './toLocaleNumber.ts';

describe('toLocaleNumber', () => {
  it('should format small numbers unchanged', () => {
    expect(toLocaleNumber(385)).toBe('385');
  });

  it('should format with thousands separators', () => {
    expect(toLocaleNumber(1234567)).toBe('1,234,567');
  });

  it('should not abbreviate large numbers', () => {
    expect(toLocaleNumber(12500)).toBe('12,500');
  });

  it('should respect the locale', () => {
    expect(toLocaleNumber(1234567, 'de')).toBe('1.234.567');
  });
});
