import { describe, expect, it } from 'vitest';
import { toWatchlistAddLabel } from './toWatchlistAddLabel.ts';

describe('util: toWatchlistAddLabel', () => {
  it('should say it for a single film', () => {
    expect(toWatchlistAddLabel(1)).toBe('Add it to watchlist');
  });

  it('should say both for two films', () => {
    expect(toWatchlistAddLabel(2)).toBe('Add both to watchlist');
  });

  it('should count three or more films', () => {
    expect(toWatchlistAddLabel(3)).toBe('Add all 3 to watchlist');
  });
});
