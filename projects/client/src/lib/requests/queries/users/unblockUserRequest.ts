import { api, type ApiParams } from '$lib/requests/api.ts';

type UnblockUserRequest = {
  slug: string;
} & ApiParams;

export function unblockUserRequest(
  { slug, fetch }: UnblockUserRequest,
): Promise<boolean> {
  return api({ fetch })
    .users
    .unblock({
      params: {
        id: slug,
      },
    })
    .then(({ status }) => status === 204);
}
