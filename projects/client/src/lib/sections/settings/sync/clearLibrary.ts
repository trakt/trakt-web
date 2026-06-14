import type { UserCollection } from '$lib/features/auth/queries/currentUserCollectionQuery.ts';
import { rawApiFetch } from '$lib/requests/api.ts';
import { SYNC_CHUNK_SIZE } from '$lib/sections/settings/sync/constants/index.ts';
import { chunk } from '$lib/utils/array/chunk.ts';
import { createSyncRunner } from './createSyncRunner.ts';
import type { SyncEngineCallbacks } from './models/SyncEngineCallbacks.ts';

type CollectionId = { ids: { trakt: number } };

function removeFromCollection(
  body: { movies: CollectionId[] } | { episodes: CollectionId[] },
  signal?: AbortSignal,
) {
  return rawApiFetch({
    path: '/sync/collection/remove',
    init: {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal,
    },
  }).then((response) => {
    if (!response.ok) {
      throw response;
    }

    return response;
  });
}

export async function clearLibrary(
  collection: UserCollection,
  { onProgress, onError, onStart, onComplete, signal }: SyncEngineCallbacks,
): Promise<void> {
  onStart?.();

  try {
    const movies = Array.from(collection.movies).map((id) => ({
      ids: { trakt: id },
    }));
    const episodes = Array.from(collection.episodes).map((id) => ({
      ids: { trakt: id },
    }));

    const { run } = createSyncRunner({ onProgress, onError, signal });

    if (movies.length > 0) {
      await run(
        chunk(movies, SYNC_CHUNK_SIZE),
        (batch) => batch,
        (batch) => removeFromCollection({ movies: [...batch] }, signal),
      );
    }

    if (episodes.length > 0) {
      await run(
        chunk(episodes, SYNC_CHUNK_SIZE),
        (batch) => batch,
        (batch) => removeFromCollection({ episodes: [...batch] }, signal),
      );
    }

    onComplete?.(!signal?.aborted);
  } catch (err) {
    onComplete?.(false);
    throw err;
  }
}
