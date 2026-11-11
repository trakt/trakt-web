import { retry } from '$lib/utils/retry/retry.ts';
import { assertSuccessfulResponse } from './assertSuccessfulResponse.ts';
import { HttpStatusError } from './HttpStatusError.ts';

function isRateLimited(err: unknown): err is Response | HttpStatusError {
  return (
    (err instanceof Response || err instanceof HttpStatusError) &&
    err.status === 429
  );
}

function waitFor(delay: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, delay);
    signal?.addEventListener(
      'abort',
      () => {
        clearTimeout(timer);
        reject(signal.reason);
      },
      { once: true },
    );
  });
}

export function retryWithRateLimit<T>(
  fn: () => Promise<T>,
  signal?: AbortSignal,
): Promise<T> {
  return retry(async () => {
    signal?.throwIfAborted();

    try {
      return assertSuccessfulResponse(await fn());
    } catch (err) {
      if (isRateLimited(err)) {
        const value = err.headers?.get('Retry-After');
        const seconds = value ? parseFloat(value) : NaN;
        const delay = isNaN(seconds) ? 5000 : seconds * 1000;
        await waitFor(delay, signal);
      }
      throw err;
    }
  }, signal);
}
