import { api, type ApiParams } from '$lib/requests/api.ts';
import type { SmartListWriteRequest } from '@trakt/api';

type ConvertToSmartListRequestParams =
  & {
    listId: string;
    body: SmartListWriteRequest;
  }
  & ApiParams;

export function convertToSmartListRequest(
  { listId, body, fetch }: ConvertToSmartListRequestParams,
): Promise<string | Nil> {
  return api({ fetch })
    .users
    .lists
    .list
    .convertToSmartList({
      params: {
        id: 'me',
        list_id: listId,
      },
      body,
    })
    .then((response) => {
      if (response.status !== 200 && response.status !== 201) {
        return null;
      }

      return response.body.ids.slug;
    });
}
