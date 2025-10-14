import type { ExtendedMediaType } from '$lib/requests/models/ExtendedMediaType.ts';

type TraktId = { ids: { trakt: number } };

type MediaTypeMap<T> = {
  movie: { movies: T[] };
  show: { shows: T[] };
  episode: { episodes: T[] };
};

export function toBulkPayload<K extends ExtendedMediaType>(
  type: K,
  ids: number[],
): MediaTypeMap<TraktId>[K] {
  return {
    [`${type}s`]: ids.map((id) => ({
      ids: { trakt: id },
    })),
  } as MediaTypeMap<TraktId>[K];
}
