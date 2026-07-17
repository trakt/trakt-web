import type { UserWatchlist } from '$lib/features/auth/queries/currentUserWatchlistQuery.ts';
import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';
import type { UpcomingEpisodeEntry } from '$lib/requests/queries/calendars/upcomingEpisodesQuery.ts';
import { firstValueFrom, of } from 'rxjs';
import { describe, expect, it } from 'vitest';
import { filterWatchlistedCalendarItems } from './filterWatchlistedCalendarItems.ts';

function episode(id: number, showId: number): UpcomingEpisodeEntry {
  return { id, show: { id: showId } } as unknown as UpcomingEpisodeEntry;
}

function movie(id: number): MediaEntry {
  return { id, type: 'movie' } as unknown as MediaEntry;
}

function watchlist(
  { shows = [], movies = [] }: { shows?: number[]; movies?: number[] },
): UserWatchlist {
  return { shows: new Set(shows), movies: new Set(movies) };
}

// The URL/filterMap carries the toggle as a string, so exercise the real value.
const IGNORE_WATCHLISTED = {
  ignore_watchlisted: 'true',
} as unknown as FilterParams['filter'];

describe('util: filterWatchlistedCalendarItems', () => {
  it('should pass items through unchanged when the toggle is absent', async () => {
    const items = [episode(1, 10)];

    const result = await firstValueFrom(
      filterWatchlistedCalendarItems({
        items: of(items),
        watchlist: of(watchlist({ shows: [10] })),
        filter: {},
      }),
    );

    expect(result).toBe(items);
  });

  it('should pass items through when the toggle is explicitly off', async () => {
    const items = [episode(1, 10)];
    const off = {
      ignore_watchlisted: 'false',
    } as unknown as FilterParams['filter'];

    const result = await firstValueFrom(
      filterWatchlistedCalendarItems({
        items: of(items),
        watchlist: of(watchlist({ shows: [10] })),
        filter: off,
      }),
    );

    expect(result).toBe(items);
  });

  it('should not filter while the watchlist is undefined', async () => {
    const items = [episode(1, 10)];

    const result = await firstValueFrom(
      filterWatchlistedCalendarItems({
        items: of(items),
        watchlist: of(undefined),
        filter: IGNORE_WATCHLISTED,
      }),
    );

    expect(result).toEqual(items);
  });

  it('should hide an episode when its show is watchlisted', async () => {
    const listed = episode(1, 10);
    const notListed = episode(2, 20);

    const result = await firstValueFrom(
      filterWatchlistedCalendarItems({
        items: of([listed, notListed]),
        watchlist: of(watchlist({ shows: [10] })),
        filter: IGNORE_WATCHLISTED,
      }),
    );

    expect(result).toEqual([notListed]);
  });

  it('should hide a watchlisted movie and keep one that is not', async () => {
    const listed = movie(1);
    const notListed = movie(2);

    const result = await firstValueFrom(
      filterWatchlistedCalendarItems({
        items: of([listed, notListed]),
        watchlist: of(watchlist({ movies: [1] })),
        filter: IGNORE_WATCHLISTED,
      }),
    );

    expect(result).toEqual([notListed]);
  });
});
