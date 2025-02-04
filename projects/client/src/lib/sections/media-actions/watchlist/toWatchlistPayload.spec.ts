import { describe, expect, it } from 'vitest';
import { toWatchlistPayload } from './toWatchlistPayload.ts';

describe('toWatchlistPayload', () => {
  it('should create movie watchlist payload', () => {
    const result = toWatchlistPayload('movie', [1, 2, 3]);

    expect(result).toEqual({
      movies: [
        { ids: { trakt: 1 } },
        { ids: { trakt: 2 } },
        { ids: { trakt: 3 } },
      ],
    });
  });

  it('should create show watchlist payload', () => {
    const result = toWatchlistPayload('show', [4, 5]);

    expect(result).toEqual({
      shows: [
        { ids: { trakt: 4 } },
        { ids: { trakt: 5 } },
      ],
    });
  });

  it('should create episode watchlist payload', () => {
    const result = toWatchlistPayload('episode', [6]);

    expect(result).toEqual({
      episodes: [
        { ids: { trakt: 6 } },
      ],
    });
  });
});
