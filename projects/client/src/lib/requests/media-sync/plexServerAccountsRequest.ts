import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import z from 'zod';
import {
  mapToMediaSyncAccount,
  MediaSyncAccountResponseSchema,
} from './mediaSyncAccountsQuery.ts';
import type { MediaSyncAccount } from './models/MediaSyncAccount.ts';

export async function plexServerAccountsRequest(
  { fetch, attemptId, serverId }:
    & { attemptId: string; serverId: string }
    & ApiParams,
): Promise<MediaSyncAccount[]> {
  const response = await rawApiFetch({
    fetch,
    path: `/v3/users/me/sync/plex/pin/${attemptId}/servers/${
      encodeURIComponent(serverId)
    }/accounts`,
  });
  if (!response.ok) {
    throw new Error(`Failed to load Plex profiles: ${response.status}`);
  }
  return z.array(MediaSyncAccountResponseSchema).parse(await response.json())
    .map(mapToMediaSyncAccount);
}
