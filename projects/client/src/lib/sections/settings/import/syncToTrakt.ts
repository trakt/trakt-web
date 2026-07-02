import { api } from '$lib/requests/api.ts';
import { SYNC_CHUNK_SIZE } from '$lib/sections/settings/sync/constants/index.ts';
import { createSyncRunner } from '$lib/sections/settings/sync/createSyncRunner.ts';
import { chunk } from '$lib/utils/array/chunk.ts';
import type { SyncEngineCallbacks } from '../sync/models/SyncEngineCallbacks.ts';
import { buildHistoryPayload } from './engine/buildHistoryPayload.ts';
import { buildRatingsPayload } from './engine/buildRatingsPayload.ts';
import { buildWatchlistPayload } from './engine/buildWatchlistPayload.ts';
import { matchMovies } from './engine/matchMovies.ts';
import { MOVIE_IDS, pickIds } from './engine/pickIds.ts';
import { resolveMovieIds } from './engine/resolveMovieIds.ts';
import type { ImportSyncResult, UniversalImportItem } from './ImportTypes.ts';

type SyncToTraktCallbacks = SyncEngineCallbacks & {
  onMatchProgress?: (processed: number, total: number) => void;
};

export async function syncToTrakt(
  items: ReadonlyArray<UniversalImportItem>,
  {
    onProgress,
    onError,
    onStart,
    onComplete,
    onMatchProgress,
    signal,
  }: SyncToTraktCallbacks,
): Promise<ImportSyncResult> {
  onStart?.();

  try {
    const { items: resolvedItems, ambiguous } = await resolveMovieIds({
      items,
      match: matchMovies,
      onProgress: onMatchProgress,
      signal,
    });

    const ambiguousItems = new Set(ambiguous.map((entry) => entry.item));
    const unresolved = resolvedItems.filter(
      (item) =>
        item.type === 'movie' &&
        !pickIds(item.ids, MOVIE_IDS) &&
        !ambiguousItems.has(item),
    );

    const historyItems = resolvedItems.filter((i) => i.action === 'history');
    const watchlistItems = resolvedItems.filter((i) =>
      i.action === 'watchlist'
    );
    const ratingItems = resolvedItems.filter((i) => i.action === 'ratings');

    const client = api();
    const { run, getErrorCount } = createSyncRunner({
      onProgress,
      onError,
      signal,
    });

    if (historyItems.length > 0) {
      await run(
        chunk(historyItems, SYNC_CHUNK_SIZE),
        (batch) => buildHistoryPayload([...batch]),
        (payload) => client.sync.history.add({ body: payload }),
      );
    }

    if (watchlistItems.length > 0) {
      await run(
        chunk(watchlistItems, SYNC_CHUNK_SIZE),
        (batch) => buildWatchlistPayload([...batch]),
        (payload) => client.sync.watchlist.add({ body: payload }),
      );
    }

    if (ratingItems.length > 0) {
      await run(
        chunk(ratingItems, SYNC_CHUNK_SIZE),
        (batch) => buildRatingsPayload([...batch]),
        (payload) => client.sync.ratings.add({ body: payload }),
      );
    }

    onComplete?.(!signal?.aborted);
    return { errorCount: getErrorCount(), unresolved, ambiguous };
  } catch (err) {
    onComplete?.(false);
    throw err;
  }
}
