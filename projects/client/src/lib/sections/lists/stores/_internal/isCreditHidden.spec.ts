import type { UserWatchlist } from '$lib/features/auth/queries/currentUserWatchlistQuery.ts';
import type { UserHistory } from '$lib/features/auth/stores/useCurrentUserHistory.ts';
import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { describe, expect, it } from 'vitest';
import { isCreditHidden } from './isCreditHidden.ts';

function media(type: MediaType, id: number): MediaEntry {
  return { id, type } as unknown as MediaEntry;
}

function history(
  { movies = [], shows = [] }: { movies?: number[]; shows?: number[] },
): UserHistory {
  return {
    movies: new Map(movies.map((id) => [id, {}])),
    shows: new Map(shows.map((id) => [id, {}])),
  } as unknown as UserHistory;
}

function watchlist(
  { movies = [], shows = [] }: { movies?: number[]; shows?: number[] },
): UserWatchlist {
  return { movies: new Set(movies), shows: new Set(shows) };
}

describe('util: isCreditHidden', () => {
  it('should not hide anything when both toggles are off', () => {
    const hidden = isCreditHidden({
      media: media('movie', 1),
      history: history({ movies: [1] }),
      watchlist: watchlist({ movies: [1] }),
      ignoreWatched: false,
      ignoreWatchlisted: false,
    });

    expect(hidden).toBe(false);
  });

  it('should hide a watched movie when Display Watched is off', () => {
    const hidden = isCreditHidden({
      media: media('movie', 1),
      history: history({ movies: [1] }),
      watchlist: watchlist({}),
      ignoreWatched: true,
      ignoreWatchlisted: false,
    });

    expect(hidden).toBe(true);
  });

  it('should keep an unwatched movie when Display Watched is off', () => {
    const hidden = isCreditHidden({
      media: media('movie', 2),
      history: history({ movies: [1] }),
      watchlist: watchlist({}),
      ignoreWatched: true,
      ignoreWatchlisted: false,
    });

    expect(hidden).toBe(false);
  });

  it('should hide a show the user has watch history for', () => {
    const hidden = isCreditHidden({
      media: media('show', 10),
      history: history({ shows: [10] }),
      watchlist: watchlist({}),
      ignoreWatched: true,
      ignoreWatchlisted: false,
    });

    expect(hidden).toBe(true);
  });

  it('should hide a watchlisted movie when Display Watchlisted is off', () => {
    const hidden = isCreditHidden({
      media: media('movie', 1),
      history: history({}),
      watchlist: watchlist({ movies: [1] }),
      ignoreWatched: false,
      ignoreWatchlisted: true,
    });

    expect(hidden).toBe(true);
  });

  it('should hide a watchlisted show when Display Watchlisted is off', () => {
    const hidden = isCreditHidden({
      media: media('show', 10),
      history: history({}),
      watchlist: watchlist({ shows: [10] }),
      ignoreWatched: false,
      ignoreWatchlisted: true,
    });

    expect(hidden).toBe(true);
  });

  it('should not hide while history is still loading', () => {
    const hidden = isCreditHidden({
      media: media('movie', 1),
      history: null,
      watchlist: watchlist({}),
      ignoreWatched: true,
      ignoreWatchlisted: false,
    });

    expect(hidden).toBe(false);
  });

  it('should not hide while the watchlist is still loading', () => {
    const hidden = isCreditHidden({
      media: media('movie', 1),
      history: history({}),
      watchlist: undefined,
      ignoreWatched: false,
      ignoreWatchlisted: true,
    });

    expect(hidden).toBe(false);
  });
});
