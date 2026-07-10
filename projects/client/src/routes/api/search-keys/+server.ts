import { mintSearchKeysFromEnv } from '$lib/features/search/mintSearchKeysFromEnv.ts';
import { json, type RequestHandler } from '@sveltejs/kit';

// Re-mints scoped search keys so long-lived tabs can refresh before the
// short-lived token expires. Mirrors the mint in the root handle hook.
export const GET: RequestHandler = () => {
  return json(mintSearchKeysFromEnv());
};
