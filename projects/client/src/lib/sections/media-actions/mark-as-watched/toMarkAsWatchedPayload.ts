import type { MediaType } from '$lib/requests/models/MediaType.ts';

type WatchedPayload = {
  ids: { trakt: number };
  watched_at: string | undefined;
};

type MediaTypeMap = {
  movie: { movies: WatchedPayload[] };
  show: { shows: WatchedPayload[] };
  episode: { episodes: WatchedPayload[] };
};

export function toMarkAsWatchedPayload<T extends MediaType | 'episode'>(
  type: T,
  ids: number[],
  watchedAtDate: string,
): MediaTypeMap[T] {
  return {
    [`${type}s`]: ids.map((id) => ({
      ids: { trakt: id },
      watched_at: watchedAtDate,
    })),
  } as MediaTypeMap[T];
}
