import { api, type ApiParams } from '$lib/requests/api.ts';
import type { FavoritesRequest } from '@trakt/api';

type AddToFavoritesParams = {
  body: FavoritesRequest;
} & ApiParams;

export function addToFavoritesRequest(
  { body, fetch }: AddToFavoritesParams,
): Promise<boolean> {
  return api({ fetch })
    .sync
    .favorites
    .add({
      body,
    })
    .then(({ status }) => status === 201);
}
