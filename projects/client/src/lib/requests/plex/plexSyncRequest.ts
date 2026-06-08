import { api, type ApiParams } from '$lib/requests/api.ts';

type PlexSyncParams = {
  serverId?: string;
  allData?: boolean;
} & ApiParams;

export function plexSyncRequest(
  { serverId, allData, fetch }: PlexSyncParams,
): Promise<boolean> {
  return api({ fetch }).users.plex.sync({
    body: {
      server_id: serverId,
      all_data: allData,
    },
  }).then(({ status }) => status === 201);
}
