import { api, type ApiParams } from '$lib/requests/api.ts';
import type { RatingsRequest } from '@trakt/api';

type AddRatingParams = {
  body: RatingsRequest;
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
