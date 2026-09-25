import { combineLatest, map } from 'rxjs';
import type { TrendingEntry } from '../lists/trending/useTrendingList.ts';
import { useTrendingItems } from './useTrendingItems.ts';

const SPOTLIGHT_COUNT = 6;

function interleave(
  shows: ReadonlyArray<TrendingEntry>,
  movies: ReadonlyArray<TrendingEntry>,
): TrendingEntry[] {
  return Array.from(
    { length: Math.max(shows.length, movies.length) },
    (_, index) => [shows.at(index), movies.at(index)],
  )
    .flat()
    .filter((entry): entry is TrendingEntry => entry != null);
}

export function useSpotlightItems() {
  const { list: shows } = useTrendingItems('show');
  const { list: movies } = useTrendingItems('movie');

  return {
    items: combineLatest([shows, movies]).pipe(
      map(([$shows, $movies]) =>
        interleave($shows, $movies).slice(0, SPOTLIGHT_COUNT)
      ),
    ),
  };
}
