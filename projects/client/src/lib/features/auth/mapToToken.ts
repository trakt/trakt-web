import { time } from '$lib/utils/timing/time.ts';
import type { User } from 'oidc-client-ts';
import type { Token } from './token/index.ts';

export function mapToToken(user: User | Nil): Token {
  const expiresAt = user?.expires_at ? time.seconds(user.expires_at) : null;

  return {
    value: user?.access_token ?? null,
    expiresAt,
  };
}
