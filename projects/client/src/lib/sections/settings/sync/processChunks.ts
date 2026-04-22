import { retryWithRateLimit } from './retryWithRateLimit.ts';

export type ChunkCallbacks = {
  onProgress: (processed: number) => void;
  onError: (message: string) => void;
};

export async function processChunks<TItem, TPayload, TResponse>(
  chunks: ReadonlyArray<ReadonlyArray<TItem>>,
  buildPayload: (chunk: ReadonlyArray<TItem>) => TPayload,
  sendRequest: (payload: TPayload) => Promise<TResponse>,
  { onProgress, onError }: ChunkCallbacks,
  initialProcessed = 0,
): Promise<{ processed: number; errors: number }> {
  let processed = initialProcessed;
  let errors = 0;

  for (const batch of chunks) {
    try {
      const payload = buildPayload(batch);
      await retryWithRateLimit(() => sendRequest(payload));
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
