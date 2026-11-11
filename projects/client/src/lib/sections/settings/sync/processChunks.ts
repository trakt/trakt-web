import { retryWithRateLimit } from './retryWithRateLimit.ts';

export type ChunkCallbacks<TItem = unknown, TResponse = unknown> = {
  onProgress: (processed: number) => void;
  onError: (message: string) => void;
  onResponse?: (response: TResponse, batch: ReadonlyArray<TItem>) => void;
  signal?: AbortSignal;
};

export async function processChunks<TItem, TPayload, TResponse>(
  chunks: ReadonlyArray<ReadonlyArray<TItem>>,
  buildPayload: (chunk: ReadonlyArray<TItem>) => TPayload,
  sendRequest: (payload: TPayload) => Promise<TResponse>,
  { onProgress, onError, onResponse, signal }: ChunkCallbacks<TItem, TResponse>,
  initialProcessed = 0,
): Promise<{ processed: number; errors: number }> {
  let processed = initialProcessed;
  let errors = 0;

  for (const batch of chunks) {
    if (signal?.aborted) break;

    try {
      const payload = buildPayload(batch);
      const response = await retryWithRateLimit(
        () => sendRequest(payload),
        signal,
      );
      onResponse?.(response, batch);
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
