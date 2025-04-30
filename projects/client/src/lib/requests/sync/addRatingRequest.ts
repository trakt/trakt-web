import { api, type ApiParams } from '$lib/requests/api.ts';
import type { RatingsSyncRequest } from '@trakt/api';

type AddRatingParams = {
  body: RatingsSyncRequest;
} & ApiParams;

export function addRatingRequest(
  { body, fetch }: AddRatingParams,
): Promise<boolean> {
  return api({ fetch })
    .sync
    .ratings
    .add({
      body,
    })
    .then(({ status }) => status === 201);
}
