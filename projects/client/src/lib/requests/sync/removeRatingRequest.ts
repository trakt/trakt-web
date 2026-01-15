import { api, type ApiParams } from '$lib/requests/api.ts';
import type { RemoveRatingsParams } from '@trakt/api';

type RemoveRatingParams = {
  body: RemoveRatingsParams;
} & ApiParams;

export function removeRatingRequest(
  { body, fetch }: RemoveRatingParams,
): Promise<boolean> {
  return api({ fetch })
    .sync
    .ratings
    .remove({
      body,
    })
    .then(({ status }) => status === 200);
}
