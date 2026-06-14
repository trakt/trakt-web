import { retryWithRateLimit } from './retryWithRateLimit.ts';

export type ChunkCallbacks = {
  onProgress: (processed: number) => void;
  onError: (message: string) => void;
  signal?: AbortSignal;
};

export async function processChunks<TItem, TPayload, TResponse>(
  chunks: ReadonlyArray<ReadonlyArray<TItem>>,
  buildPayload: (chunk: ReadonlyArray<TItem>) => TPayload,
  sendRequest: (payload: TPayload) => Promise<TResponse>,
  { onProgress, onError, signal }: ChunkCallbacks,
  initialProcessed = 0,
): Promise<{ processed: number; errors: number }> {
  let processed = initialProcessed;
  let errors = 0;

  for (const batch of chunks) {
    if (signal?.aborted) break;

    try {
      const payload = buildPayload(batch);
      await retryWithRateLimit(() => sendRequest(payload), signal);
    } catch (err) {
      errors += batch.length;
      onError(err instanceof Error ? err.message : String(err));
    } finally {
      processed += batch.length;
      onProgress(processed);
    }
  }

  return { processed, errors };
}
