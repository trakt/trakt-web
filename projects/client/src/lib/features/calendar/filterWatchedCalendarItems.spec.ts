import type { UserHistory } from '$lib/features/auth/stores/useCurrentUserHistory.ts';
import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';
import type { UpcomingEpisodeEntry } from '$lib/requests/queries/calendars/upcomingEpisodesQuery.ts';
import { firstValueFrom, of } from 'rxjs';
import { describe, expect, it } from 'vitest';
import { filterWatchedCalendarItems } from './filterWatchedCalendarItems.ts';

function episode(
  id: number,
  showId: number,
  episodeIds?: number[],
): UpcomingEpisodeEntry {
  return {
    id,
    show: { id: showId },
    ...(episodeIds ? { episodes: episodeIds.map((eid) => ({ id: eid })) } : {}),
  } as unknown as UpcomingEpisodeEntry;
}

function movie(id: number): MediaEntry {
  return { id, type: 'movie' } as unknown as MediaEntry;
}

function history(
  { shows = {}, movies = [] }: {
    shows?: Record<number, number[]>;
    movies?: number[];
  },
): UserHistory {
  return {
    shows: new Map(
      Object.entries(shows).map(([showId, episodeIds]) => [
        Number(showId),
        { episodes: episodeIds.map((episodeId) => ({ episodeId })) },
      ]),
    ),
    movies: new Map(movies.map((id) => [id, {}])),
  } as unknown as UserHistory;
}

// The URL/filterMap carries the toggle as a string, so exercise the real value.
const IGNORE_WATCHED = {
  ignore_watched: 'true',
} as unknown as FilterParams['filter'];

describe('util: filterWatchedCalendarItems', () => {
  it('should pass items through unchanged when the toggle is absent', async () => {
    const items = [episode(1, 10), movie(2)];

    const result = await firstValueFrom(
      filterWatchedCalendarItems({
        items: of(items),
        history: of(history({ shows: { 10: [1] }, movies: [2] })),
        filter: {},
      }),
    );

    expect(result).toBe(items);
  });

  it('should pass items through when the toggle is explicitly off', async () => {
    const items = [episode(1, 10)];
    const off = {
      ignore_watched: 'false',
    } as unknown as FilterParams['filter'];

    const result = await firstValueFrom(
      filterWatchedCalendarItems({
        items: of(items),
        history: of(history({ shows: { 10: [1] } })),
        filter: off,
      }),
    );

    expect(result).toBe(items);
  });

  it('should not filter while history is still loading', async () => {
    const items = [episode(1, 10)];

    const result = await firstValueFrom(
      filterWatchedCalendarItems({
        items: of(items),
        history: of(null),
        filter: IGNORE_WATCHED,
      }),
    );

    expect(result).toEqual(items);
  });

  it('should hide a watched episode and keep an unwatched one', async () => {
    const watched = episode(1, 10);
    const unwatched = episode(2, 10);

    const result = await firstValueFrom(
      filterWatchedCalendarItems({
        items: of([watched, unwatched]),
        history: of(history({ shows: { 10: [1] } })),
        filter: IGNORE_WATCHED,
      }),
    );

    expect(result).toEqual([unwatched]);
  });

  it('should hide a grouped card only when every collapsed episode is watched', async () => {
    const fullyWatched = episode(1, 10, [101, 102]);
    const partiallyWatched = episode(2, 10, [201, 202]);

    const result = await firstValueFrom(
      filterWatchedCalendarItems({
        items: of([fullyWatched, partiallyWatched]),
        history: of(history({ shows: { 10: [101, 102, 201] } })),
        filter: IGNORE_WATCHED,
      }),
    );

    expect(result).toEqual([partiallyWatched]);
  });

  it('should hide a watched movie and keep an unwatched one', async () => {
    const watched = movie(1);
    const unwatched = movie(2);

    const result = await firstValueFrom(
      filterWatchedCalendarItems({
        items: of([watched, unwatched]),
        history: of(history({ movies: [1] })),
        filter: IGNORE_WATCHED,
      }),
    );

    expect(result).toEqual([unwatched]);
  });
});
