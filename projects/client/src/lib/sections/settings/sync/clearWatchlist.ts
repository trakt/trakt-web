import type { UserWatchlist } from '$lib/features/auth/queries/currentUserWatchlistQuery.ts';
import { api } from '$lib/requests/api.ts';
import { SYNC_CHUNK_SIZE } from '$lib/sections/settings/sync/constants/index.ts';
import { chunk } from '$lib/utils/array/chunk.ts';
import { createSyncRunner } from './createSyncRunner.ts';
import type { SyncEngineCallbacks } from './models/SyncEngineCallbacks.ts';

export async function clearWatchlist(
  watchlist: UserWatchlist,
  { onProgress, onError, onStart, onComplete }: SyncEngineCallbacks,
): Promise<void> {
  onStart?.();

  try {
    const movies = Array.from(watchlist.movies).map((id) => ({
      ids: { trakt: id },
    }));
    const shows = Array.from(watchlist.shows).map((id) => ({
      ids: { trakt: id },
    }));

    const client = api();
    const { run } = createSyncRunner({ onProgress, onError });

    if (movies.length > 0) {
      await run(
        chunk(movies, SYNC_CHUNK_SIZE),
        (batch) => batch,
        (batch) =>
          client.sync.watchlist.remove({ body: { movies: [...batch] } }),
      );
    }

    if (shows.length > 0) {
      await run(
        chunk(shows, SYNC_CHUNK_SIZE),
        (batch) => batch,
        (batch) =>
          client.sync.watchlist.remove({ body: { shows: [...batch] } }),
      );
    }

    onComplete?.(true);
  } catch (err) {
    onComplete?.(false);
    throw err;
  }
}
