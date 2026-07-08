import { describe, expect, it } from 'vitest';
import { formatDecimal } from './formatDecimal';

describe('formatDecimal', () => {
  it('formats a number to a single decimal place', () => {
    expect(formatDecimal(1.25)).toBe('1.3');
  });

  it('keeps a trailing zero', () => {
    expect(formatDecimal(2)).toBe('2.0');
  });

  it('treats null as zero', () => {
    expect(formatDecimal(null)).toBe('0.0');
  });

  it('treats undefined as zero', () => {
    expect(formatDecimal(undefined)).toBe('0.0');
  });
});
