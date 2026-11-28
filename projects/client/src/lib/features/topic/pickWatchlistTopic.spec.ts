import { describe, expect, it } from 'vitest';
import { TOPIC_MOVIES } from './_internal/shared/TOPIC_MOVIES.ts';
import { pickWatchlistTopic } from './pickWatchlistTopic.ts';

const watchlist = (
  movies: ReadonlyArray<number>,
  shows: ReadonlyArray<number> = [],
) => ({
  movies: new Set(movies),
  shows: new Set(shows),
});

describe('util: pickWatchlistTopic', () => {
  it('should stay pending while the watchlist is loading', () => {
    expect(pickWatchlistTopic(undefined)).toBeUndefined();
  });

  it('should stay pending for an empty watchlist, which is also what a failed request returns', () => {
    expect(pickWatchlistTopic(watchlist([]))).toBeUndefined();
  });

  it('should pick the topic from the watchlisted movies', () => {
    expect(pickWatchlistTopic(watchlist([TOPIC_MOVIES.dunePartThree.id]))).toBe(
      'dune-3',
    );
  });

  it('should pick no topic for a watchlist without the topic movies', () => {
    expect(pickWatchlistTopic(watchlist([1], [2]))).toBeNull();
  });
});
