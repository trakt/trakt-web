import { describe, expect, it } from 'vitest';
import { toModeFilter } from './toModeFilter.ts';

describe('util: toModeFilter', () => {
  it('should add the mode when one applies', () => {
    expect(toModeFilter('smart')).toEqual({ mode: 'smart' });
  });

  it('should add nothing when no mode applies', () => {
    expect(toModeFilter(undefined)).toEqual({});
  });
});
