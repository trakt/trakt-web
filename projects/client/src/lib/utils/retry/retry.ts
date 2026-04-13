import { retryAsync as tsRetry } from 'ts-retry';
import { retryDelay } from './retryDelay.ts';

const MAX_RETRIES = 3;

export function retry<T>(fn: () => Promise<T>): Promise<T> {
  return tsRetry<T>(
    fn,
    {
      maxTry: MAX_RETRIES,
      delay: ({ currentTry }) => retryDelay(currentTry - 1),
    },
  );
}
