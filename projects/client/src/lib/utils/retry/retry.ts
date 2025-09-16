import { retry as tsRetry } from 'ts-retry';
import { retryDelay } from './retryDelay.ts';

const MAX_RETRIES = 5;

export function retry<T>(promise: () => Promise<T>) {
  tsRetry(
    promise,
    {
      maxTry: MAX_RETRIES,
      delay: ({ currentTry }) => retryDelay(currentTry - 1),
    },
  );
}
