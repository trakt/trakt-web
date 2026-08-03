import type { OidcAuthToken } from './models/OidcAuthToken.ts';

export function isAuthorizedToken(
  auth: Nil | OidcAuthToken,
  now: number = Date.now(),
): auth is OidcAuthToken & { token: string } {
  if (!auth?.token) {
    return false;
  }

  return (auth.expiresAt ?? 0) > now;
}
