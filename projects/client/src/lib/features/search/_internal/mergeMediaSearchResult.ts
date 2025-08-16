import type { MediaType } from '$lib/requests/models/MediaType.ts';
import type { MediaSearchResult } from '$lib/requests/queries/search/searchMediaQuery.ts';

export function mergeMediaSearchResult(
  result: MediaSearchResult,
  type?: MediaType,
) {
  const types = !type ? ['movie', 'show'] : [type];

  const movies = types?.includes('movie') ? result.items.movies : [];
  const shows = types?.includes('show') ? result.items.shows : [];

  return [
    ...movies,
    ...shows,
  ].sort((a, b) => b.score - a.score);
}
