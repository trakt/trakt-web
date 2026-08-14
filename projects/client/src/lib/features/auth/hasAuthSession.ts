import type { OidcAuthToken } from './models/OidcAuthToken.ts';

export function hasAuthSession(
  auth: Nil | OidcAuthToken,
): auth is OidcAuthToken & { token: string } {
  return Boolean(auth?.token);
}
