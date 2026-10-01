import { describe, expect, it } from 'vitest';
import { getHiddenEpisodeCounts } from './getHiddenEpisodeCounts.ts';

describe('util: getHiddenEpisodeCounts', () => {
  it('should claim nothing hidden without a measured range', () => {
    expect(getHiddenEpisodeCounts({ total: 10 })).toEqual({
      before: 0,
      after: 0,
    });
  });

  it('should count episodes either side of the range', () => {
    const range = { first: 3, last: 6 };

    expect(getHiddenEpisodeCounts({ total: 10, range })).toEqual({
      before: 3,
      after: 3,
    });
  });

  it('should report none hidden when the whole season is visible', () => {
    const range = { first: 0, last: 9 };

    expect(getHiddenEpisodeCounts({ total: 10, range })).toEqual({
      before: 0,
      after: 0,
    });
  });

  it('should never go negative when the range overshoots', () => {
    const range = { first: 0, last: 12 };

    expect(getHiddenEpisodeCounts({ total: 10, range }).after).toBe(0);
  });
});
