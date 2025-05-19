import { api, type ApiParams } from '$lib/requests/api.ts';
import type { FavoritesRequest } from '@trakt/api';

type RemoveFromFavoritesParams = {
  body: FavoritesRequest;
} & ApiParams;

export function removeFromFavoritesRequest(
  { body, fetch }: RemoveFromFavoritesParams,
): Promise<boolean> {
  return api({ fetch })
    .sync
    .favorites
    .remove({
      body,
    })
    .then(({ status }) => status === 201);
}
