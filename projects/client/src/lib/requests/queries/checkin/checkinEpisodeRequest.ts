import { api, type ApiParams } from '$lib/requests/api.ts';
import type { ShowCheckinRequest } from '@trakt/api';
type CheckinEpisodeParams = {
  body: ShowCheckinRequest;
} & ApiParams;

export function checkinEpisodeRequest(
  { body, fetch }: CheckinEpisodeParams,
): Promise<boolean> {
  return api({ fetch })
    .checkin
    .show({
      body,
    })
    .then(({ status }) => status === 201);
}
