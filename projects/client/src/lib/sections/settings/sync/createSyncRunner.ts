import { processChunks } from './processChunks.ts';

type SyncRunnerCallbacks = {
  onProgress: (processed: number) => void;
  onError: (message: string) => void;
};

export function createSyncRunner({ onProgress, onError }: SyncRunnerCallbacks) {
  let processedCount = 0;
  let errorCount = 0;

  const run = async <TItem, TPayload, TResponse>(
    chunks: ReadonlyArray<ReadonlyArray<TItem>>,
    buildPayload: (chunk: ReadonlyArray<TItem>) => TPayload,
    sendRequest: (payload: TPayload) => Promise<TResponse>,
  ) => {
    const result = await processChunks(
      chunks,
      buildPayload,
      sendRequest,
      {
        onProgress: (n) => {
          processedCount = n;
          onProgress(n);
        },
        onError,
      },
      processedCount,
    );
    processedCount = result.processed;
    errorCount += result.errors;
  };

  return {
    run,
    getErrorCount: () => errorCount,
  };
}
