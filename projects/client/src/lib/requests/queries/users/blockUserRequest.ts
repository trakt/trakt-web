import { api, type ApiParams } from '$lib/requests/api.ts';

type BlockUserRequest = {
  slug: string;
} & ApiParams;

export function blockUserRequest(
  { slug, fetch }: BlockUserRequest,
): Promise<boolean> {
  return api({ fetch })
    .users
    .block({
      params: {
        id: slug,
      },
    })
    .then(({ status }) => status === 201);
}
