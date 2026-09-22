import type { UserCollection } from '$lib/features/auth/stores/useCurrentUserCollection.ts';
import { rawApiFetch } from '$lib/requests/api.ts';
import { SYNC_CHUNK_SIZE } from '$lib/sections/settings/sync/constants/index.ts';
import { chunk } from '$lib/utils/array/chunk.ts';
import { z } from 'zod';
import { createSyncRunner } from './createSyncRunner.ts';
import type { SyncEngineCallbacks } from './models/SyncEngineCallbacks.ts';

const collectionRemovalResponseSchema = z.object({
  deleted: z.object({ movies: z.number(), episodes: z.number() }),
});

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
  }).then(async (response) => {
    if (!response.ok) {
      throw response;
    }

    const { deleted } = collectionRemovalResponseSchema.parse(
      await response.json(),
    );
    const expected = 'movies' in body
      ? body.movies.length
      : body.episodes.length;
    const removed = 'movies' in body ? deleted.movies : deleted.episodes;
    if (removed !== expected) {
      throw new Error('Not all custom library items were removed.');
    }

    return deleted;
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

    const { run, getErrorCount } = createSyncRunner({
      onProgress,
      onError,
      signal,
    });

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

    await onComplete?.(
      !signal?.aborted && getErrorCount() === 0,
      getErrorCount(),
    );
  } catch (err) {
    await onComplete?.(false);
    throw err;
  }
}
