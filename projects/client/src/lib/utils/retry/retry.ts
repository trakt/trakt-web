import { retryAsync as tsRetry } from 'ts-retry';
import { retryDelay } from './retryDelay.ts';

const MAX_RETRIES = 3;

export function retry<T>(
  fn: () => Promise<T>,
  signal?: AbortSignal,
): Promise<T> {
  return tsRetry<T>(
    fn,
    {
      maxTry: MAX_RETRIES,
      delay: ({ currentTry }) =>
        signal?.aborted ? 0 : retryDelay(currentTry - 1),
    },
  );
}
