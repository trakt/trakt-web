import { describe, expect, it } from 'vitest';
import { toPercentage } from './toPercentage';

describe('toPercentage', () => {
  it('should format decimal to percentage', () => {
    expect(toPercentage(0.45)).toBe('45%');
    expect(toPercentage(0.99)).toBe('99%');
    expect(toPercentage(1)).toBe('100%');
  });

  it('should handle zero', () => {
    expect(toPercentage(0)).toBe('0%');
  });

  it('should round decimals', () => {
    expect(toPercentage(0.456)).toBe('46%');
    expect(toPercentage(0.444)).toBe('44%');
  });

  it('should format with different locales', () => {
    expect(toPercentage(0.45, 'de')).toBe('45 %');
    expect(toPercentage(0.45, 'fr')).toBe('45 %');
  });
});
