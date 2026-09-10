import { api, type ApiParams } from '$lib/requests/api.ts';
import type { SmartListWriteRequest } from '@trakt/api';

const SUCCESS_STATUSES: ReadonlyArray<number> = [200, 204];

type UpdateSmartListRequestParams =
  & {
    slug: string;
    body: Partial<SmartListWriteRequest>;
  }
  & ApiParams;

export function updateSmartListRequest(
  { slug, body, fetch }: UpdateSmartListRequestParams,
): Promise<boolean> {
  return api({ fetch })
    .users
    .smartLists
    .smartList
    .update({
      params: {
        id: 'me',
        list_id: slug,
      },
      body,
    })
    .then((response) => SUCCESS_STATUSES.includes(response.status));
}
