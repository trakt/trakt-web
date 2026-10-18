import { OPEN_VOTES_CEILING } from '$lib/sections/lists/smart/openVotesCeiling.ts';
import type { SmartListFilters } from '$lib/requests/models/SmartListFilters.ts';

const RANGE_CEILINGS: Partial<Record<keyof SmartListFilters, number>> = {
  ratings: 100,
  rt_meters: 100,
  rt_user_meters: 100,
  metascores: 100,
  imdb_ratings: 10,
  tmdb_ratings: 10,
  mal_ratings: 10,
  letterboxd_ratings: 5,
  runtimes: 500,
  votes: OPEN_VOTES_CEILING,
  imdb_votes: OPEN_VOTES_CEILING,
};

export function closeOpenSmartListRanges(
  filters: SmartListFilters,
): SmartListFilters {
  return Object.fromEntries(
    Object.entries(filters).map(([key, value]) => {
      const ceiling = RANGE_CEILINGS[key as keyof SmartListFilters];
      const isOpenRange =
        ceiling !== undefined &&
        Array.isArray(value) &&
        value.length === 1 &&
        typeof value[0] === 'number';

      return [key, isOpenRange ? [...value, ceiling] : value];
    }),
  );
}
