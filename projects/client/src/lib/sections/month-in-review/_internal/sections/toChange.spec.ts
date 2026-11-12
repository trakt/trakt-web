import { describe, expect, it } from 'vitest';
import { toChange } from './toChange.ts';

describe('util: toChange', () => {
  it('should describe an increase', () => {
    expect(toChange({ current: 15, previous: 10, locale: 'en' })).toEqual({
      label: '+50%',
      trend: 'up',
    });
  });

  it('should describe a decrease', () => {
    expect(toChange({ current: 5, previous: 10, locale: 'en' })?.trend).toBe(
      'down',
    );
  });

  it('should return null without a previous value', () => {
    expect(toChange({ current: 5, previous: 0, locale: 'en' })).toBeNull();
  });
});
