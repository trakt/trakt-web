import { api, type ApiParams } from '$lib/requests/api.ts';

type CreateSmartListRequestParams =
  & {
    name: string;
    url: string;
  }
  & ApiParams;

export function createSmartListRequest(
  { name, url, fetch }: CreateSmartListRequestParams,
): Promise<boolean> {
  return api({ fetch })
    .users
    .filters
    .add({
      body: [{
        name,
        url,
      }],
    })
    .then(({ status }) => status === 201);
}
