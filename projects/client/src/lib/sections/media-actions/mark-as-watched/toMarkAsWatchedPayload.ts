import type { MediaType } from '$lib/models/MediaType.ts';

export function toMarkAsWatchedPayload(
  type: MediaType | 'episode',
  payload: {
    ids: number[];
    watchedAtDate?: string;
  },
) {
  const mappedId = payload.ids.map((id) => ({
    ids: { trakt: id },
    watched_at: payload.watchedAtDate,
  }));

  switch (type) {
    case 'movie':
      return {
        movies: mappedId,
      };
    case 'show':
      return {
        shows: mappedId,
      };
    case 'episode':
      return {
        episodes: mappedId,
      };
  }
}
