import type { RatingsRequest } from '@trakt/api';
import { api, type ApiParams } from '../_internal/api.ts';

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
