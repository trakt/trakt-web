import { api } from '$lib/requests/api.ts';
import { chunk } from '$lib/utils/array/chunk.ts';
import { buildHistoryPayload } from './engine/buildHistoryPayload.ts';
import { buildRatingsPayload } from './engine/buildRatingsPayload.ts';
import { buildWatchlistPayload } from './engine/buildWatchlistPayload.ts';
import { retryWithRateLimit } from './engine/retryWithRateLimit.ts';
import type { UniversalImportItem } from './ImportTypes.ts';

const CHUNK_SIZE = 50;

export type SyncEngineCallbacks = {
  onProgress: (processed: number) => void;
  onError: (message: string) => void;
};

export async function syncToTrakt(
  items: ReadonlyArray<UniversalImportItem>,
  { onProgress, onError }: SyncEngineCallbacks,
): Promise<number> {
  const historyItems = items.filter((i) => i.action === 'history');
  const watchlistItems = items.filter((i) => i.action === 'watchlist');
  const ratingItems = items.filter((i) => i.action === 'ratings');

  let processedCount = 0;
  let errorCount = 0;

  const processChunks = async <TItem, TPayload, TResponse>(
    chunks: TItem[][],
    buildPayload: (chunk: TItem[]) => TPayload,
    sendRequest: (payload: TPayload) => Promise<TResponse>,
  ) => {
    for (const chunk of chunks) {
      try {
        const payload = buildPayload(chunk);
        await retryWithRateLimit(() => sendRequest(payload));
      } catch (err) {
        errorCount += chunk.length;
        onError(err instanceof Error ? err.message : String(err));
      } finally {
        processedCount += chunk.length;
        onProgress(processedCount);
      }
    }
  };

  const client = api();

  if (historyItems.length > 0) {
    await processChunks(
      chunk(historyItems, CHUNK_SIZE),
      buildHistoryPayload,
      (payload) => client.sync.history.add({ body: payload }),
    );
  }

  if (watchlistItems.length > 0) {
    await processChunks(
      chunk(watchlistItems, CHUNK_SIZE),
      buildWatchlistPayload,
      (payload) => client.sync.watchlist.add({ body: payload }),
    );
  }

  if (ratingItems.length > 0) {
    await processChunks(
      chunk(ratingItems, CHUNK_SIZE),
      buildRatingsPayload,
      (payload) => client.sync.ratings.add({ body: payload }),
    );
  }

  return errorCount;
}
