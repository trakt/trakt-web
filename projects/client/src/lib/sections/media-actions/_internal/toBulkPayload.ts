import type { ExtendedMediaStoreProps } from '$lib/models/MediaStoreProps.ts';

type TraktId = { ids: { trakt: number } };
type BulkPayloadType = ExtendedMediaStoreProps['type'];

type MediaTypeMap<T> = {
  movie: { movies: T[] };
  show: { shows: T[] };
  episode: { episodes: T[] };
  season: { seasons: T[] };
};

export function toBulkPayload<K extends BulkPayloadType>(
  type: K,
  ids: number[],
): MediaTypeMap<TraktId>[K] {
  return {
    [`${type}s`]: ids.map((id) => ({
      ids: { trakt: id },
    })),
  } as MediaTypeMap<TraktId>[K];
}
