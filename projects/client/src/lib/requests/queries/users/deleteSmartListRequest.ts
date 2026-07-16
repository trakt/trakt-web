import { api, type ApiParams } from '$lib/requests/api.ts';

type DeleteSmartListRequestParams =
  & {
    slug: string;
  }
  & ApiParams;

export function deleteSmartListRequest(
  { slug, fetch }: DeleteSmartListRequestParams,
): Promise<boolean> {
  return api({ fetch })
    .users
    .smartLists
    .smartList
    .delete({
      params: {
        id: 'me',
        list_id: slug,
      },
    })
    .then(({ status }) => status === 204);
}
