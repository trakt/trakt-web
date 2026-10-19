import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import { parseJellyfinAuth } from './_internal/parseJellyfinAuth.ts';
import { readMediaSyncError } from './_internal/readMediaSyncError.ts';
import type { JellyfinAuth } from './models/JellyfinAuth.ts';
import type { MediaSyncResult } from './models/MediaSyncResult.ts';

export async function jellyfinQuickConnectRequest({
  fetch,
  attemptId,
}: { attemptId: string } & ApiParams): Promise<MediaSyncResult<JellyfinAuth>> {
  const response = await rawApiFetch({
    fetch,
    path: `/v3/users/me/sync/jellyfin/quick-connect/${encodeURIComponent(
      attemptId,
    )}`,
  });
  if (!response.ok) {
    return { ok: false, error: await readMediaSyncError(response) };
  }
  return { ok: true, value: parseJellyfinAuth(await response.json()) };
}
