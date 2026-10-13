import { describe, expect, it } from 'vitest';
import { toExtraSmartListFilters } from './toExtraSmartListFilters.ts';

describe('toExtraSmartListFilters', () => {
  it('should keep only filters the filter panel does not edit', () => {
    expect(
      toExtraSmartListFilters({
        genres: ['horror'],
        years: [2000, 2010],
        keywords: ['slasher'],
        votes: [1000, 999_999_999],
        ignore_ended: true,
      }),
    ).toEqual({
      keywords: ['slasher'],
      votes: [1000, 999_999_999],
      ignore_ended: true,
    });
  });
});
