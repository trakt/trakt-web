import { describe, expect, it } from 'vitest';
import { toBrandingBackdrop } from './toBrandingBackdrop.ts';

describe('util: toBrandingBackdrop', () => {
  it('should accept every known backdrop', () => {
    expect(toBrandingBackdrop('light')).toBe('light');
    expect(toBrandingBackdrop('dark')).toBe('dark');
    expect(toBrandingBackdrop('brand')).toBe('brand');
    expect(toBrandingBackdrop('transparent')).toBe('transparent');
  });

  it('should fall back to light for missing or unknown values', () => {
    expect(toBrandingBackdrop(null)).toBe('light');
    expect(toBrandingBackdrop('neon')).toBe('light');
  });
});
