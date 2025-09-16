import type { Token } from '$lib/features/auth/token/index.ts';
import { retry } from '$lib/utils/retry/retry.ts';

export function postToken({ value, expiresAt }: Token) {
  retry(
    () =>
      fetch('/api/store-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: value,
          expiresAt,
        }),
      }),
  );
}
