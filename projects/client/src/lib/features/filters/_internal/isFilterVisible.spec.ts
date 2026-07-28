import { describe, expect, it } from 'vitest';
import { isFilterVisible } from './isFilterVisible.ts';

describe('util: isFilterVisible', () => {
  it('should show an unrestricted filter anywhere', () => {
    expect(isFilterVisible({ filter: {}, surface: undefined, mode: 'movie' }))
      .toBe(true);
    expect(isFilterVisible({ filter: {}, surface: 'calendar', mode: 'show' }))
      .toBe(true);
  });

  it('should show a restricted filter on a matching surface and mode', () => {
    expect(isFilterVisible({
      filter: { surfaces: ['calendar'], modes: ['show', 'media'] },
      surface: 'calendar',
      mode: 'show',
    })).toBe(true);
  });

  it('should hide a surface restricted filter off its surface', () => {
    expect(isFilterVisible({
      filter: { surfaces: ['calendar'] },
      surface: undefined,
      mode: 'show',
    })).toBe(false);
  });

  it('should hide a mode restricted filter in another mode', () => {
    expect(isFilterVisible({
      filter: { surfaces: ['calendar'], modes: ['show', 'media'] },
      surface: 'calendar',
      mode: 'movie',
    })).toBe(false);
  });
});
