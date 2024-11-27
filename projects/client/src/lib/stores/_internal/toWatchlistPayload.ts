import type { MediaType } from '$lib/models/MediaType.ts';

export function toWatchlistPayload(
  type: MediaType,
  ids: number[],
) {
  const mappedIds = ids.map((id) => ({ ids: { trakt: id } }));

  switch (type) {
    case 'movie':
      return {
        movies: mappedIds,
      };
    case 'show':
      return {
        shows: mappedIds,
      };
    case 'episode':
      return {
        episodes: mappedIds,
      };
  }
}
