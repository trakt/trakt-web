import { describe, expect, it } from 'vitest';
import { Theme } from '../models/Theme';
import { coerceTheme } from './coerceTheme';

describe('util: coerceTheme', () => {
  it('should return the default theme', () => {
    expect(coerceTheme(undefined)).toBe(Theme.Dark);
  });

  it('should return the light theme', () => {
    expect(coerceTheme('light')).toBe(Theme.Light);
  });

  it('should return the dark theme', () => {
    expect(coerceTheme('dark')).toBe(Theme.Dark);
  });
});
