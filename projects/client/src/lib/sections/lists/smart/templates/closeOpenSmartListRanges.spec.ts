import { describe, expect, it } from 'vitest';
import { closeOpenSmartListRanges } from './closeOpenSmartListRanges.ts';

describe('util: closeOpenSmartListRanges', () => {
  it('should add the ceiling to a range with only a minimum', () => {
    expect(
      closeOpenSmartListRanges({ ratings: [78], imdb_ratings: [7] }),
    ).toEqual({ ratings: [78, 100], imdb_ratings: [7, 10] });
  });

  it('should keep a bounded range', () => {
    expect(closeOpenSmartListRanges({ runtimes: [0, 95] })).toEqual({
      runtimes: [0, 95],
    });
  });

  it('should leave lists and flags alone', () => {
    const filters = { genres: ['drama'], ignore_watched: true };

    expect(closeOpenSmartListRanges(filters)).toEqual(filters);
  });

  it('should leave a range without a known ceiling alone', () => {
    expect(closeOpenSmartListRanges({ years: [2010] })).toEqual({
      years: [2010],
    });
  });
});
