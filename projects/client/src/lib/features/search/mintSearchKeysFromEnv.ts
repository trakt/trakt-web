import { env } from '$env/dynamic/private';
import { mintSearchKeys } from './mintSearchKeys.ts';

// Boundary wrapper: reads the server-only secrets and delegates to the pure
// mint. Keeps the secret names in one place across the handle hook and the
// re-mint endpoint.
export function mintSearchKeysFromEnv(): TypesenseConfig {
  return mintSearchKeys({
    key: env.TYPESENSE_CLIENT_KEY ?? '',
    server: env.TYPESENSE_SERVER ?? '',
  });
}
