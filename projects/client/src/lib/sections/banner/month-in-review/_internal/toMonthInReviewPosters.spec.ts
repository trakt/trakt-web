import type { WatchedMovie } from '$lib/features/auth/queries/currentUserWatchedMoviesQuery.ts';
import type { WatchedShow } from '$lib/features/auth/queries/currentUserWatchedShowsQuery.ts';
import type { UserHistory } from '$lib/features/auth/stores/useCurrentUserHistory.ts';
import { toMediaImageUrl } from '$lib/utils/url/toMediaImageUrl.ts';
import { describe, expect, it } from 'vitest';
import { toMonthInReviewPosters } from './toMonthInReviewPosters.ts';

const october = new Date(2026, 9, 1);

function movie(id: number, watchedDates: Date[]): [number, WatchedMovie] {
  return [
    id,
    {
      id,
      plays: watchedDates.length,
      watchedAt: watchedDates.at(-1) ?? new Date(0),
      watchedDates,
    },
  ];
}

function show(id: number, watchedDates: Date[]): [number, WatchedShow] {
  return [
    id,
    {
      id,
      watchedAt: watchedDates.at(-1) ?? new Date(0),
      episodes: [],
      playsPerSeason: new Map(),
      watchedDates,
    },
  ];
}

function toHistory(
  movies: ReturnType<typeof movie>[],
  shows: ReturnType<typeof show>[] = [],
): UserHistory {
  return { movies: new Map(movies), shows: new Map(shows) };
}

const keysOf = (history: UserHistory) =>
  toMonthInReviewPosters({ history, month: october }).map(({ key }) => key);

describe('util: toMonthInReviewPosters', () => {
  it('should return an empty list when nothing was watched that month', () => {
    const history = toHistory([movie(1, [new Date(2026, 8, 20)])]);

    expect(toMonthInReviewPosters({ history, month: october })).toEqual([]);
  });

  it('should rank titles by plays within the month', () => {
    const history = toHistory(
      [
        movie(1, [new Date(2026, 9, 2)]),
        movie(2, [
          new Date(2026, 8, 1),
          new Date(2026, 8, 2),
          new Date(2026, 9, 3),
        ]),
      ],
      [show(3, [new Date(2026, 9, 4), new Date(2026, 9, 5)])],
    );

    expect(keysOf(history)).toEqual(['show-3', 'movie-2', 'movie-1']);
  });

  it('should break ties by the most recent watch', () => {
    const history = toHistory([
      movie(1, [new Date(2026, 9, 2)]),
      movie(2, [new Date(2026, 9, 9)]),
    ]);

    expect(keysOf(history)).toEqual(['movie-2', 'movie-1']);
  });

  it('should cap the fan at three posters', () => {
    const history = toHistory(
      [1, 2, 3, 4].map((id) => movie(id, [new Date(2026, 9, id)])),
    );

    expect(keysOf(history)).toHaveLength(3);
  });

  it('should build the poster url from the type and id', () => {
    const history = toHistory([], [show(3, [new Date(2026, 9, 4)])]);

    expect(toMonthInReviewPosters({ history, month: october })).toEqual([
      {
        key: 'show-3',
        src: toMediaImageUrl({
          type: 'shows',
          id: 3,
          slot: 'poster',
          size: 'medium',
        }),
      },
    ]);
  });
});
