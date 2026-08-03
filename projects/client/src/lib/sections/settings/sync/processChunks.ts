import { retryWithRateLimit } from './retryWithRateLimit.ts';

export type ChunkCallbacks = {
  onProgress: (processed: number) => void;
  onError: (message: string) => void;
  signal?: AbortSignal;
};

type ChunkResult<TItem, TResponse> = {
  items: ReadonlyArray<TItem>;
  response: TResponse;
};

export async function processChunks<TItem, TPayload, TResponse>(
  chunks: ReadonlyArray<ReadonlyArray<TItem>>,
  buildPayload: (chunk: ReadonlyArray<TItem>) => TPayload,
  sendRequest: (payload: TPayload) => Promise<TResponse>,
  { onProgress, onError, signal }: ChunkCallbacks,
  initialProcessed = 0,
): Promise<{
  processed: number;
  errors: number;
  completed: ReadonlyArray<ChunkResult<TItem, TResponse>>;
}> {
  let processed = initialProcessed;
  let errors = 0;
  const completed: ChunkResult<TItem, TResponse>[] = [];

  for (const batch of chunks) {
    if (signal?.aborted) break;

    try {
      const payload = buildPayload(batch);
      const response = await retryWithRateLimit(
        () => sendRequest(payload),
        signal,
      );
      completed.push({ items: batch, response });
    } catch (err) {
      errors += batch.length;
      onError(err instanceof Error ? err.message : String(err));
    } finally {
      processed += batch.length;
      onProgress(processed);
    }
  }

  return { processed, errors, completed };
}
