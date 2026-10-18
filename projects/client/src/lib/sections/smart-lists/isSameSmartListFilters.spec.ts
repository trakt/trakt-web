import { describe, expect, it } from 'vitest';
import { isSameSmartListFilters } from './isSameSmartListFilters.ts';

describe('util: isSameSmartListFilters', () => {
  it('should ignore key order', () => {
    expect(
      isSameSmartListFilters(
        { votes: [100, 999_999_999], keywords: ['time-travel'] },
        { keywords: ['time-travel'], votes: [100, 999_999_999] },
      ),
    ).toBe(true);
  });

  it('should detect a changed value', () => {
    expect(
      isSameSmartListFilters(
        { votes: [100, 999_999_999] },
        {
          votes: [1_000, 999_999_999],
        },
      ),
    ).toBe(false);
  });

  it('should detect a removed key', () => {
    expect(isSameSmartListFilters({ ignore_ended: true }, {})).toBe(false);
  });
});
