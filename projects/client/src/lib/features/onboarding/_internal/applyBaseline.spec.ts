import { describe, expect, it } from 'vitest';
import { applyBaseline } from './applyBaseline.ts';

const COUNTS = { watchlist: 12, plays: 340, ratings: 80, following: 9 };

describe('util: applyBaseline', () => {
  it('should pass counts through without a baseline', () => {
    expect(applyBaseline({ counts: COUNTS, baseline: null })).toEqual(COUNTS);
  });

  it('should only count activity since the baseline', () => {
    expect(
      applyBaseline({
        counts: { ...COUNTS, watchlist: 13 },
        baseline: COUNTS,
      }),
    ).toEqual({ watchlist: 1, plays: 0, ratings: 0, following: 0 });
  });

  it('should never go below zero when items were removed', () => {
    expect(
      applyBaseline({ counts: { watchlist: 2 }, baseline: { watchlist: 5 } }),
    ).toEqual({ watchlist: 0 });
  });

  it('should keep a signal the baseline does not know', () => {
    expect(
      applyBaseline({ counts: { plays: 3 }, baseline: { watchlist: 5 } }),
    ).toEqual({ plays: 3 });
  });
});
