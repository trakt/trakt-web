import { api, type ApiParams } from '$lib/requests/api.ts';

type FollowUserRequest = {
  slug: string;
} & ApiParams;

export function followUserRequest(
  { slug, fetch }: FollowUserRequest,
): Promise<boolean> {
  return api({ fetch })
    .users
    .follow({
      params: {
        id: slug,
      },
    })
    .then(({ status }) => status === 201);
}
