import type { Token } from '$lib/features/auth/token/index.ts';
import { retry } from '$lib/utils/retry/retry.ts';

// `userLoaded` and the sign-in callback both post the same token, and the
// callback awaits its POST before navigating. Sharing the in-flight request
// keeps that await on the critical path from costing a second roundtrip.
let inflight: { value: string | Nil; promise: Promise<unknown> } | null = null;

export function postToken({ value, expiresAt }: Token) {
  if (inflight && inflight.value === value) {
    return inflight.promise;
  }

  const promise = retry(
    () =>
      fetch('/api/store-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: value,
          expiresAt,
        }),
      }),
  )
    .catch(() => null)
    .finally(() => {
      if (inflight?.promise === promise) {
        inflight = null;
      }
    });

  inflight = { value, promise };

  return promise;
}
