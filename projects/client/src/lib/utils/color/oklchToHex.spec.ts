import { describe, expect, it } from 'vitest';
import { oklchToHex } from './oklchToHex.ts';

describe('util: oklchToHex', () => {
  it('should convert the brand violet', () => {
    expect(oklchToHex('oklch(49.0% 0.217 289)')).toBe('#6438D0');
  });

  it('should map full lightness to white', () => {
    expect(oklchToHex('oklch(100% 0 0)')).toBe('#FFFFFF');
  });

  it('should map zero lightness to black', () => {
    expect(oklchToHex('oklch(0% 0 0)')).toBe('#000000');
  });

  it('should accept lightness as a unitless fraction', () => {
    expect(oklchToHex('oklch(0.49 0.217 289)')).toBe('#6438D0');
  });

  it('should clamp colours outside the sRGB gamut', () => {
    expect(oklchToHex('oklch(70% 0.4 150)')).toMatch(/^#[\dA-F]{6}$/);
  });

  it('should return undefined for values it cannot parse', () => {
    expect(oklchToHex('#6438d0')).toBeUndefined();
  });
});
