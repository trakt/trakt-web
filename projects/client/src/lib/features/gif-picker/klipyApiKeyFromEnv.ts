import { env } from '$env/dynamic/private';

// Boundary wrapper: the Klipy key is server-only, so the picker talks to
// `/api/klipy` and the key never reaches the bundle.
export function klipyApiKeyFromEnv(): string {
  return env.KLIPY_API_KEY ?? '';
}
