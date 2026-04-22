import { retry } from '$lib/utils/retry/retry.ts';

export function retryWithRateLimit<T>(fn: () => Promise<T>): Promise<T> {
  return retry(async () => {
    try {
      return await fn();
    } catch (err) {
      if (err instanceof Response && err.status === 429) {
        const value = err.headers.get('Retry-After');
        const seconds = value ? parseFloat(value) : NaN;
        const delay = isNaN(seconds) ? 5000 : seconds * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
      throw err;
    }
  });
}
