import type { MarkAsWatchedAt } from '../../../models/MarkAsWatchedAt.ts';
import type { MediaStoreProps } from '../../../models/MediaStoreProps.ts';

type WatchedPayload = {
  ids: { trakt: number };
  watched_at: string | undefined;
};

type WatchedNumberedPayload = {
  number: number;
  watched_at?: string;
};

type WatchedSeasonsPayload = WatchedNumberedPayload & {
  episodes?: WatchedNumberedPayload[];
};

type WatchedShowPayload = WatchedPayload & {
  seasons?: WatchedSeasonsPayload[];
};

type MoviesPayload = { movies: WatchedPayload[] };
type ShowsPayload = { shows: WatchedShowPayload[] };
type EpisodesPayload = { episodes: WatchedPayload[] };

type MediaTypeMap = MoviesPayload | ShowsPayload | EpisodesPayload;

export function toMarkAsWatchedPayload(
  target: MediaStoreProps,
  watchedAt?: MarkAsWatchedAt,
): MediaTypeMap {
  const watchedAtDate = watchedAt instanceof Date
    ? watchedAt.toISOString()
    : watchedAt;

  if (target.type === 'show') {
    const shows = Array.isArray(target.media) ? target.media : [target.media];
    return {
      shows: shows.map(({ id, seasons }) => ({
        ids: { trakt: id },
        watched_at: !seasons ? watchedAtDate : undefined,
        seasons: seasons?.map((season) => ({
          number: season.number,
          episodes: season.episodes.map((episode) => ({
            number: episode.number,
            watched_at: watchedAtDate,
          })),
        })),
      })),
    };
  }

  const media = Array.isArray(target.media) ? target.media : [target.media];
  const payload = media.map(({ id }) => ({
    ids: { trakt: id },
    watched_at: watchedAtDate,
  }));

  return target.type === 'movie' ? { movies: payload } : { episodes: payload };
}
