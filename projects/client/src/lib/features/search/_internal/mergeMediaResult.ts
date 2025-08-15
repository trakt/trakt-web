import type { MediaType } from '$lib/requests/models/MediaType.ts';
import type { MediaSearchResult } from '$lib/requests/queries/search/searchMediaQuery.ts';

export function mergeMediaResult(
  result: MediaSearchResult,
  types?: MediaType[],
) {
  const movies = types?.includes('movie') ? result.items.movies : [];
  const shows = types?.includes('show') ? result.items.shows : [];

  return [
    ...movies,
    ...shows,
  ].sort((a, b) => b.score - a.score);
}
