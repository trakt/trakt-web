import type { FavoritesRequest } from '@trakt/api';
import { api, type ApiParams } from '../_internal/api.ts';

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
