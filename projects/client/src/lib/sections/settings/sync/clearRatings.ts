import type { UserRatings } from '$lib/features/auth/queries/currentUserRatingsQuery.ts';
import { api } from '$lib/requests/api.ts';
import { SYNC_CHUNK_SIZE } from '$lib/sections/settings/sync/constants/index.ts';
import { chunk } from '$lib/utils/array/chunk.ts';
import { createSyncRunner } from './createSyncRunner.ts';
import type { SyncEngineCallbacks } from './models/SyncEngineCallbacks.ts';

export async function clearRatings(
  ratings: UserRatings,
  { onProgress, onError, onStart, onComplete, signal }: SyncEngineCallbacks,
): Promise<void> {
  onStart?.();

  try {
    const movies = Array.from(ratings.movies.keys()).map((id) => ({
      ids: { trakt: id },
    }));
    const shows = Array.from(ratings.shows.keys()).map((id) => ({
      ids: { trakt: id },
    }));
    const seasons = Array.from(ratings.seasons.keys()).map((id) => ({
      ids: { trakt: id },
    }));
    const episodes = Array.from(ratings.episodes.keys()).map((id) => ({
      ids: { trakt: id },
    }));

    const client = api();
    const { run } = createSyncRunner({ onProgress, onError, signal });

    if (movies.length > 0) {
      await run(
        chunk(movies, SYNC_CHUNK_SIZE),
        (batch) => batch,
        (batch) => client.sync.ratings.remove({ body: { movies: [...batch] } }),
      );
    }

    if (shows.length > 0) {
      await run(
        chunk(shows, SYNC_CHUNK_SIZE),
        (batch) => batch,
        (batch) => client.sync.ratings.remove({ body: { shows: [...batch] } }),
      );
    }

    if (seasons.length > 0) {
      await run(
        chunk(seasons, SYNC_CHUNK_SIZE),
        (batch) => batch,
        (batch) =>
          client.sync.ratings.remove({ body: { seasons: [...batch] } }),
      );
    }

    if (episodes.length > 0) {
      await run(
        chunk(episodes, SYNC_CHUNK_SIZE),
        (batch) => batch,
        (batch) =>
          client.sync.ratings.remove({ body: { episodes: [...batch] } }),
      );
    }

    onComplete?.(!signal?.aborted);
  } catch (err) {
    onComplete?.(false);
    throw err;
  }
}
