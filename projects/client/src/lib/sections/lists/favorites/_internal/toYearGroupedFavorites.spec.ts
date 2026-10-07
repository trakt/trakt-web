import type { FavoritedEntry } from '$lib/requests/models/FavoritedEntry.ts';
import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { describe, expect, it } from 'vitest';
import { toYearGroupedFavorites } from './toYearGroupedFavorites.ts';

function favorite(key: string, favoritedAt: string): FavoritedEntry {
  return {
    key,
    rank: 1,
    favoritedAt: new Date(favoritedAt),
    item: MovieHereticMappedMock,
  };
}

describe('util: toYearGroupedFavorites', () => {
  it('should label the first favorite of each year', () => {
    const current = favorite('current', '2026-05-01T00:00:00.000Z');
    const firstOlder = favorite('first-older', '2025-06-01T00:00:00.000Z');
    const secondOlder = favorite('second-older', '2025-03-01T00:00:00.000Z');
    const oldest = favorite('oldest', '2023-03-01T00:00:00.000Z');

    expect(
      toYearGroupedFavorites([current, firstOlder, secondOlder, oldest]),
    ).toEqual([
      { ...current, yearHeader: 2026 },
      { ...firstOlder, yearHeader: 2025 },
      secondOlder,
      { ...oldest, yearHeader: 2023 },
    ]);
  });

  it('should label a single year only once', () => {
    const first = favorite('first', '2026-05-01T00:00:00.000Z');
    const second = favorite('second', '2026-02-01T00:00:00.000Z');

    expect(toYearGroupedFavorites([first, second])).toEqual([
      { ...first, yearHeader: 2026 },
      second,
    ]);
  });

  it('should return an empty list when there are no favorites', () => {
    expect(toYearGroupedFavorites([])).toEqual([]);
  });
});
