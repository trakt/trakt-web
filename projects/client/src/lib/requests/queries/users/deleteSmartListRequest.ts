import { api, type ApiParams } from '$lib/requests/api.ts';

type DeleteSmartListRequestParams =
  & {
    id: number;
  }
  & ApiParams;

export function deleteSmartListRequest(
  { id, fetch }: DeleteSmartListRequestParams,
): Promise<boolean> {
  return api({ fetch })
    .users
    .filters
    .delete({
      params: {
        id,
      },
    })
    .then(({ status }) => status === 204);
}
