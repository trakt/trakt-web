import { describe, expect, it } from 'vitest';
import { Theme } from '../models/Theme.ts';
import { coerceTheme } from './coerceTheme.ts';

describe('util: coerceTheme', () => {
  it('should return the default theme', () => {
    expect(coerceTheme(undefined)).toBe(Theme.Dark);
  });

  it('should return the system theme', () => {
    expect(coerceTheme('system')).toBe(Theme.System);
  });

  it('should return the light theme', () => {
    expect(coerceTheme('light')).toBe(Theme.Light);
  });

  it('should return the dark theme', () => {
    expect(coerceTheme('dark')).toBe(Theme.Dark);
  });
});
