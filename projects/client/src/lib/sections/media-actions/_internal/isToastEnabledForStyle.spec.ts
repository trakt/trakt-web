import { describe, expect, it } from 'vitest';
import { isToastEnabledForStyle } from './isToastEnabledForStyle.ts';

describe('util: isToastEnabledForStyle', () => {
  it('should enable the toast for a dropdown item', () => {
    expect(isToastEnabledForStyle('dropdown-item')).toBe(true);
  });

  it('should NOT enable the toast for an inline action button', () => {
    expect(isToastEnabledForStyle('action')).toBe(false);
  });

  it('should NOT enable the toast for a normal button', () => {
    expect(isToastEnabledForStyle('normal')).toBe(false);
  });
});
