import type { MediaType } from '$lib/requests/models/MediaType.ts';

type TraktId = { ids: { trakt: number } };

type MediaTypeMap<T> = {
  movie: { movies: T[] };
  show: { shows: T[] };
  episode: { episodes: T[] };
};

export function toBulkPayload<K extends MediaType | 'episode'>(
  type: K,
  ids: number[],
): MediaTypeMap<TraktId>[K] {
  return {
    [`${type}s`]: ids.map((id) => ({
      ids: { trakt: id },
    })),
  } as MediaTypeMap<TraktId>[K];
}
