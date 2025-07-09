import { api, type ApiParams } from '$lib/requests/api.ts';

type DeleteCheckinParams = ApiParams;

export function deleteCheckinRequest(
  { fetch }: DeleteCheckinParams,
): Promise<boolean> {
  return api({ fetch })
    .checkin
    .delete()
    .then(({ status }) => status === 204);
}
