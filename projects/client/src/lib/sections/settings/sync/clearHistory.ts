import type { UserHistory } from '$lib/features/auth/stores/useCurrentUserHistory.ts';
import { api } from '$lib/requests/api.ts';
import { SYNC_CHUNK_SIZE } from '$lib/sections/settings/sync/constants/index.ts';
import { chunk } from '$lib/utils/array/chunk.ts';
import { createSyncRunner } from './createSyncRunner.ts';
import type { SyncEngineCallbacks } from './models/SyncEngineCallbacks.ts';

export async function clearHistory(
  history: UserHistory,
  { onProgress, onError, onStart, onComplete, signal }: SyncEngineCallbacks,
): Promise<void> {
  onStart?.();

  try {
    const movies = Array.from(history.movies.keys()).map((id) => ({
      ids: { trakt: id },
    }));
    const shows = Array.from(history.shows.keys()).map((id) => ({
      ids: { trakt: id },
    }));

    const client = api();
    const { run } = createSyncRunner({ onProgress, onError, signal });

    if (movies.length > 0) {
      await run(
        chunk(movies, SYNC_CHUNK_SIZE),
        (batch) => batch,
        (batch) => client.sync.history.remove({ body: { movies: [...batch] } }),
      );
    }

    if (shows.length > 0) {
      await run(
        chunk(shows, SYNC_CHUNK_SIZE),
        (batch) => batch,
        (batch) => client.sync.history.remove({ body: { shows: [...batch] } }),
      );
    }

    onComplete?.(!signal?.aborted);
  } catch (err) {
    onComplete?.(false);
    throw err;
  }
}
