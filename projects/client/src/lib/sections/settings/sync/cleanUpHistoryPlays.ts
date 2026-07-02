import { api } from '$lib/requests/api.ts';
import { SYNC_CHUNK_SIZE } from '$lib/sections/settings/sync/constants/index.ts';
import { chunk } from '$lib/utils/array/chunk.ts';
import { createSyncRunner } from './createSyncRunner.ts';
import type { SyncEngineCallbacks } from './models/SyncEngineCallbacks.ts';

export async function cleanUpHistoryPlays(
  playIds: ReadonlyArray<number>,
  { onProgress, onError, onStart, onComplete, signal }: SyncEngineCallbacks,
): Promise<void> {
  onStart?.();

  try {
    const client = api();
    const { run, getErrorCount } = createSyncRunner({
      onProgress,
      onError,
      signal,
    });

    if (playIds.length > 0) {
      await run(
        chunk(playIds, SYNC_CHUNK_SIZE),
        (batch) => batch,
        (batch) => client.sync.history.remove({ body: { ids: [...batch] } }),
      );
    }

    onComplete?.(!signal?.aborted, getErrorCount());
  } catch (err) {
    onComplete?.(false);
    throw err;
  }
}
